const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/donation');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order for donation
 * @param {Object} donationData - Donation data including amount, campaignId, donor info
 * @returns {Object} Razorpay order with order ID
 */
const createDonationPaymentIntent = async (donationData) => {
    try {
        const { amount, campaignId, donorEmail, donorName, isAnonymous } = donationData;

        // Validate required fields
        if (!amount || amount <= 0) {
            throw new Error('Valid donation amount is required');
        }

        if (!campaignId) {
            throw new Error('Campaign ID is required');
        }

        // Verify campaign exists
        const campaign = await Donation.findById(campaignId);
        if (!campaign) {
            throw new Error('Donation campaign not found');
        }

        // Create order with Razorpay
        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100), // Convert to paise (smallest currency unit)
            currency: 'INR',
            receipt: `donation_${campaignId}_${Date.now()}`,
            notes: {
                campaignId: campaignId,
                campaignName: campaign.campaignName,
                donorEmail: donorEmail || 'anonymous',
                donorName: isAnonymous ? 'Anonymous' : (donorName || 'Anonymous'),
                isAnonymous: isAnonymous.toString()
            }
        });

        return {
            orderId: order.id,
            amount: amount,
            currency: 'INR',
            key: process.env.RAZORPAY_KEY_ID
        };

    } catch (error) {
        throw new Error(`Failed to create payment intent: ${error.message}`);
    }
};

/**
 * Verify and confirm Razorpay payment
 * @param {Object} paymentData - Payment verification data
 * @returns {Object} Updated campaign and payment details
 */
const confirmDonationPayment = async (paymentData) => {
    try {
        const { orderId, paymentId, signature, campaignId } = paymentData;

        // Verify payment signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        if (expectedSignature !== signature) {
            throw new Error('Payment signature verification failed');
        }

        // Fetch order details from Razorpay
        const order = await razorpay.orders.fetch(orderId);
        
        if (order.status !== 'paid') {
            throw new Error('Payment not successful');
        }

        const { donorEmail, donorName, isAnonymous } = order.notes;
        const amount = order.amount / 100; // Convert back from paise

        // Update donation campaign
        const updatedCampaign = await Donation.findByIdAndUpdate(
            campaignId,
            {
                $push: {
                    donors: {
                        amount: amount,
                        isAnonymous: isAnonymous === 'true',
                        donorEmail: donorEmail !== 'anonymous' ? donorEmail : null,
                        donorName: donorName,
                        paymentId: paymentId,
                        orderId: orderId,
                        timestamp: new Date()
                    }
                },
                $inc: { currentAmount: amount }
            },
            { new: true, runValidators: true }
        );

        if (!updatedCampaign) {
            throw new Error('Campaign not found');
        }

        return {
            success: true,
            donation: {
                amount: amount,
                campaignName: updatedCampaign.campaignName,
                paymentId: paymentId,
                orderId: orderId,
                donorName: donorName,
                isAnonymous: isAnonymous === 'true'
            },
            campaign: {
                currentAmount: updatedCampaign.currentAmount,
                goalAmount: updatedCampaign.goalAmount,
                progressPercentage: Math.round((updatedCampaign.currentAmount / updatedCampaign.goalAmount) * 100)
            }
        };

    } catch (error) {
        throw new Error(`Failed to confirm payment: ${error.message}`);
    }
};

/**
 * Handle Razorpay webhook events for donations
 * @param {Object} event - Razorpay webhook event
 * @returns {Object} Processing result
 */
const handleDonationWebhook = async (event) => {
    try {
        switch (event.event) {
            case 'payment.captured':
                const paymentData = {
                    orderId: event.payload.payment.entity.order_id,
                    paymentId: event.payload.payment.entity.id,
                    signature: event.payload.payment.entity.signature
                };
                return await confirmDonationPayment(paymentData);
                
            case 'payment.failed':
                console.log('Payment failed:', event.payload.payment.entity.id);
                return { success: false, message: 'Payment failed' };
                
            default:
                console.log(`Unhandled event type: ${event.event}`);
                return { success: true, message: 'Event received but not processed' };
        }
    } catch (error) {
        throw new Error(`Webhook processing failed: ${error.message}`);
    }
};

/**
 * Get donation payment history for a campaign
 * @param {String} campaignId - Campaign ID
 * @returns {Object} Payment history
 */
const getDonationPaymentHistory = async (campaignId) => {
    try {
        const campaign = await Donation.findById(campaignId);
        if (!campaign) {
            throw new Error('Campaign not found');
        }

        const donations = campaign.donors.map(donor => ({
            amount: donor.amount,
            donorName: donor.isAnonymous ? 'Anonymous' : donor.donorName,
            timestamp: donor.timestamp,
            isAnonymous: donor.isAnonymous
        })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return {
            campaignName: campaign.campaignName,
            totalDonations: donations.length,
            totalAmount: campaign.currentAmount,
            goalAmount: campaign.goalAmount,
            donations: donations
        };

    } catch (error) {
        throw new Error(`Failed to get payment history: ${error.message}`);
    }
};

/**
 * Refund a donation using Razorpay
 * @param {String} paymentId - Razorpay payment ID
 * @param {String} reason - Refund reason
 * @returns {Object} Refund details
 */
const refundDonation = async (paymentId, reason = 'requested_by_customer') => {
    try {
        // Get payment details first
        const payment = await razorpay.payments.fetch(paymentId);
        
        // Create refund in Razorpay
        const refund = await razorpay.payments.refund(paymentId, {
            amount: payment.amount, // Full refund
            notes: {
                reason: reason,
                refund_date: new Date().toISOString()
            }
        });

        // Get order details to find campaign
        const order = await razorpay.orders.fetch(payment.order_id);
        const campaignId = order.notes.campaignId;
        const refundAmount = refund.amount / 100;

        // Update campaign by removing the donation amount
        const updatedCampaign = await Donation.findByIdAndUpdate(
            campaignId,
            {
                $inc: { currentAmount: -refundAmount },
                $pull: { donors: { paymentId: paymentId } }
            },
            { new: true }
        );

        return {
            success: true,
            refundId: refund.id,
            amount: refundAmount,
            status: refund.status,
            campaign: updatedCampaign
        };

    } catch (error) {
        throw new Error(`Failed to process refund: ${error.message}`);
    }
};

module.exports = {
    createDonationPaymentIntent,
    confirmDonationPayment,
    handleDonationWebhook,
    getDonationPaymentHistory,
    refundDonation
};

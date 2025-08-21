const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {
    createDonationPaymentIntent,
    confirmDonationPayment,
    handleDonationWebhook,
    getDonationPaymentHistory,
    refundDonation
} = require('../services/paymentServices');

/**
 * POST /api/payments/donations/create-intent
 * Create a payment intent for donation
 */
router.post('/donations/create-intent', async (req, res) => {
    try {
        const { amount, campaignId, donorEmail, donorName, isAnonymous } = req.body;

        // Validation
        if (!amount || !campaignId) {
            return res.status(400).json({
                success: false,
                message: 'Amount and campaign ID are required'
            });
        }

        const paymentIntent = await createDonationPaymentIntent({
            amount,
            campaignId,
            donorEmail,
            donorName,
            isAnonymous: isAnonymous || false
        });

        res.status(200).json({
            success: true,
            data: paymentIntent
        });

    } catch (error) {
        console.error('Payment intent creation error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * POST /api/payments/donations/confirm
 * Confirm a donation payment
 */
router.post('/donations/confirm', async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: 'Payment intent ID is required'
            });
        }

        const result = await confirmDonationPayment(paymentIntentId);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/payments/donations/history/:campaignId
 * Get donation payment history for a campaign
 */
router.get('/donations/history/:campaignId', async (req, res) => {
    try {
        const { campaignId } = req.params;

        const history = await getDonationPaymentHistory(campaignId);

        res.status(200).json({
            success: true,
            data: history
        });

    } catch (error) {
        console.error('Payment history error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * POST /api/payments/donations/refund
 * Refund a donation
 */
router.post('/donations/refund', async (req, res) => {
    try {
        const { paymentIntentId, reason } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: 'Payment intent ID is required'
            });
        }

        const refundResult = await refundDonation(paymentIntentId, reason);

        res.status(200).json({
            success: true,
            data: refundResult
        });

    } catch (error) {
        console.error('Refund error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * POST /api/payments/webhook
 * Handle Stripe webhook events
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        const result = await handleDonationWebhook(event);
        res.status(200).json(result);
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/payments/donations/test-connection
 * Test Stripe connection
 */
router.get('/donations/test-connection', async (req, res) => {
    try {
        const account = await stripe.accounts.retrieve();
        res.status(200).json({
            success: true,
            message: 'Stripe connection successful',
            account: {
                id: account.id,
                country: account.country,
                currency: account.default_currency
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Stripe connection failed',
            error: error.message
        });
    }
});

module.exports = router;

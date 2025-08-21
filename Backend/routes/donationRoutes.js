const express = require('express');
const router = express.Router();
const {
    createDonationCampaign,
    getAllDonationCampaigns,
    getDonationCampaignById,
    updateDonationCampaign,
    addDonationToCampaign, 
    deleteDonationCampaign
} = require('../services/donationServices'); // Adjust the import path as necessary

// Import payment services for donation payments
const {
    createDonationPaymentIntent,
    confirmDonationPayment
} = require('../services/paymentServices');

router.post('/', async (req, res) => {
    try {
        const campaign = await createDonationCampaign(req.body);
        res.status(201).json(campaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const campaigns = await getAllDonationCampaigns();
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const campaign = await getDonationCampaignById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Donation campaign not found' });
        }
        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedCampaign = await updateDonationCampaign(req.params.id, req.body);
        if (!updatedCampaign) {
            return res.status(404).json({ message: 'Donation campaign not found' });
        }
        res.status(200).json(updatedCampaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/:id/contribute', async (req, res) => {
    try {
        const updatedCampaign = await addDonationToCampaign(req.params.id, req.body);
        if (!updatedCampaign) {
            return res.status(404).json({ message: 'Donation campaign not found' });
        }
        res.status(200).json(updatedCampaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// New route for creating payment intent for donations
router.post('/:id/payment-intent', async (req, res) => {
    try {
        const { amount, donorEmail, donorName, isAnonymous } = req.body;
        
        const paymentIntent = await createDonationPaymentIntent({
            amount,
            campaignId: req.params.id,
            donorEmail,
            donorName,
            isAnonymous: isAnonymous || false
        });

        res.status(200).json({
            success: true,
            data: paymentIntent
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
});

// New route for confirming payment and updating donation
router.post('/:id/confirm-payment', async (req, res) => {
    try {
        const { orderId, paymentId, signature, campaignId } = req.body;
        
        const paymentData = {
            orderId,
            paymentId, 
            signature,
            campaignId: campaignId || req.params.id
        };
        
        const result = await confirmDonationPayment(paymentData);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedCampaign = await deleteDonationCampaign(req.params.id);
        if (!deletedCampaign) {
            return res.status(404).json({ message: 'Donation campaign not found' });
        }
        res.status(200).json({ message: 'Donation campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

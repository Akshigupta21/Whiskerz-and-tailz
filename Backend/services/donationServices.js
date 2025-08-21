const Donation = require('../models/donation');

// Create a new donation campaign
const createDonationCampaign = async (campaignData) => {
    try {
        return await Donation.create(campaignData);
    } catch (error) {
        throw new Error('Failed to create donation campaign: ' + error.message);
    }
};

// Get all donation campaigns
const getAllDonationCampaigns = async () => {
    try {
        return await Donation.find({});
    } catch (error) {
        throw new Error('Failed to retrieve donation campaigns: ' + error.message);
    }
};

// Get a donation campaign by ID
const getDonationCampaignById = async (campaignId) => {
    try {
        return await Donation.findById(campaignId);
    } catch (error) {
        throw new Error('Failed to retrieve donation campaign: ' + error.message);
    }
};

// Update a donation campaign
const updateDonationCampaign = async (campaignId, updateData) => {
    try {
        return await Donation.findByIdAndUpdate(
            campaignId,
            { $set: updateData },
            { new: true, runValidators: true }
        );
    } catch (error) {
        throw new Error('Failed to update donation campaign: ' + error.message);
    }
};

// Add a donation to a campaign
const addDonationToCampaign = async (campaignId, donorData) => {
    try {
        if (!donorData.timestamp) donorData.timestamp = new Date();
        return await Donation.findByIdAndUpdate(
            campaignId,
            {
                $push: { donors: donorData },
                $inc: { currentAmount: donorData.amount }
            },
            { new: true, runValidators: true }
        );
    } catch (error) {
        throw new Error('Failed to add donation: ' + error.message);
    }
};

// Delete a donation campaign
const deleteDonationCampaign = async (campaignId) => {
    try {
        return await Donation.findByIdAndDelete(campaignId);
    } catch (error) {
        throw new Error('Failed to delete donation campaign: ' + error.message);
    }
};

module.exports = {
    createDonationCampaign,
    getAllDonationCampaigns,
    getDonationCampaignById,
    updateDonationCampaign,
    addDonationToCampaign,
    deleteDonationCampaign
};

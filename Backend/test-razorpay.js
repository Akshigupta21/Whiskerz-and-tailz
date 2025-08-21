// Test file for Razorpay integration
// Run this file to test if Razorpay is properly configured

const Razorpay = require('razorpay');
require('dotenv').config();

const testRazorpayIntegration = async () => {
    try {
        console.log('Testing Razorpay Integration...');
        
        // Check if environment variables are set
        if (!process.env.RAZORPAY_KEY_ID) {
            console.error('❌ RAZORPAY_KEY_ID not found in environment variables');
            return;
        }
        
        if (!process.env.RAZORPAY_KEY_SECRET) {
            console.error('❌ RAZORPAY_KEY_SECRET not found in environment variables');
            return;
        }
        
        // Initialize Razorpay
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        
        console.log('✅ Razorpay instance created successfully');
        console.log('✅ Environment variables loaded');
        console.log('🔑 Key ID:', process.env.RAZORPAY_KEY_ID);
        
        // Test creating a dummy order
        try {
            const order = await razorpay.orders.create({
                amount: 10000, // ₹100 in paise
                currency: 'INR',
                receipt: 'test_receipt_' + Date.now(),
                notes: {
                    test: true,
                    purpose: 'integration_test'
                }
            });
            
            console.log('✅ Test order created successfully');
            console.log('📄 Order ID:', order.id);
            console.log('💰 Amount:', order.amount / 100, 'INR');
            
        } catch (orderError) {
            console.error('❌ Failed to create test order:', orderError.message);
            if (orderError.statusCode === 401) {
                console.error('🔐 Check your Razorpay API credentials');
            }
        }
        
    } catch (error) {
        console.error('❌ Razorpay integration test failed:', error.message);
        console.error('🔍 Full error:', error);
    }
};

// Run the test
if (require.main === module) {
    testRazorpayIntegration();
}

module.exports = testRazorpayIntegration;

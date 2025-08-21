// Test script to verify donation API endpoints
const testDonationAPI = async () => {
    const baseURL = 'http://localhost:3001/api';
    
    console.log('🧪 Testing Donation API Endpoints...\n');
    
    // Test 1: Create a sample donation campaign
    try {
        console.log('1️⃣ Creating sample donation campaign...');
        const campaignResponse = await fetch(`${baseURL}/donations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                campaignName: 'Test Street Dogs Campaign',
                goalAmount: 100000,
                description: 'Test campaign for helping street dogs',
                status: 'Active'
            })
        });
        
        const campaignData = await campaignResponse.json();
        console.log('✅ Campaign created:', campaignData.campaignName);
        
        const campaignId = campaignData._id;
        
        // Test 2: Create payment intent
        console.log('\n2️⃣ Testing payment intent creation...');
        const paymentIntentResponse = await fetch(`${baseURL}/donations/${campaignId}/payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: 500,
                donorName: 'Test Donor',
                donorEmail: 'test@example.com',
                isAnonymous: false
            })
        });
        
        const paymentIntentData = await paymentIntentResponse.json();
        console.log('✅ Payment intent created:', paymentIntentData);
        
        // Test 3: Test Stripe connection
        console.log('\n3️⃣ Testing Stripe connection...');
        const stripeTestResponse = await fetch(`${baseURL}/payments/donations/test-connection`);
        const stripeTestData = await stripeTestResponse.json();
        console.log('✅ Stripe connection:', stripeTestData);
        
        console.log('\n🎉 All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
};

// Run the test
testDonationAPI();

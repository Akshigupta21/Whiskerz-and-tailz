const mongoose = require('mongoose');

async function connectDB() {
  try {
    const mongoURI = process.env.DATABASE_URI || 'mongodb://localhost:27017/wiskerzandtail';
    
    await mongoose.connect(mongoURI);
    
    console.log(`MongoDB Connected: ${mongoURI}`);
  } catch (err) {
    console.error('MongoDB Connection error:', err);
    console.log('⚠️  Note: Make sure MongoDB is running on localhost:27017');
    console.log('   The application will continue without database connectivity.');
    throw err; // Throw error so app.js can handle it
  }
}

module.exports = connectDB;

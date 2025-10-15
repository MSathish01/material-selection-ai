// Simple test to check if backend can start
const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'NOT FOUND');
console.log('Gemini API Key:', process.env.GEMINI_API_KEY ? 'Found' : 'NOT FOUND');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    mongoose.disconnect();
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  });
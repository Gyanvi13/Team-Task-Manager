const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const app = require('./app');
const connectDB = require('./config/db');
const seedData = require('./utils/seedData');

const PORT = process.env.PORT || 5000;

const assertRequiredEnv = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

const start = async () => {
  try {
    assertRequiredEnv();
    console.log('Environment validation passed');
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected');
    console.log('Seeding initial data if needed...');
    await seedData();
    console.log('Seed step completed');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

start();

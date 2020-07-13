const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({path: './config/.env'});

// Connect to database
// connectDB();

// Load router into server
// Change router name to match your custom route
const examplesRouter = require('./routes/examples.rtr');

// Initialize express app
const app = express();

// Body parser middleware to use on CRUD operations
app.use(express.json());

// Implement Morgan to show API requests on the server console
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Route middleware to be used
// Change router name to match your custom route
app.use('/api/v1/examples', examplesRouter);

// Environment variables
// Create a .env file in the config folder
// and add your environment variables to it 
const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

// Run the server
app.listen(PORT, console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`.yellow.underline.bold))
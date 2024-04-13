// First, require and configure dotenv
require('dotenv').config();

// Check if DATABASE_URL is loaded properly
console.log('Database URL:', process.env.DATABASE_URL);

const express = require("express");
const cors = require("cors");
const app = express();

// Require your route handlers
const locationRouter = require("./Routes/locationRoute");
const reviewRouter = require("./Routes/reviewRoute");
const userRouter = require("./Routes/userRoute");
const eventsRouter = require("./Routes/eventsRoute");


// Use middleware
app.use(express.json());
app.use(cors());

// Define routes
app.use("/locations", locationRouter);
app.use("/review", reviewRouter);
app.use("/user", userRouter);
app.use("/events", eventsRouter);

// Export the app for further use (e.g., in a server.js file or for testing)
module.exports = app;

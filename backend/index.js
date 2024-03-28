const express = require("express");
const cors = require("cors");
const app = express();
const locationRouter = require("./Routes/locationRoute");
const reviewRouter = require("./Routes/reviewRoute");
const userRouter = require("./Routes/userRoute");

app.use(express.json());
app.use(cors());

app.use("/locations", locationRouter);
app.use("/reviews", reviewRouter);
app.use("/users", userRouter);

module.exports = app;
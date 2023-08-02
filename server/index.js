// index.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/users");
require("dotenv").config();

const app = express();
const URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;
// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  //   .connect("mongodb://localhost:27017/node_react_app", {
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Routes
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

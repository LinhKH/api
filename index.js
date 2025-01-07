import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

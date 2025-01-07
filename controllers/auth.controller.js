import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const hashedPassword = await bcryptjs.hash(password, 10);
  const newUser = new User({ name, email, password:hashedPassword });
  try {
    await newUser.save();
    res.status(200).json({ message: "User created successfully!" });
    
  } catch (error) {
    next(error);
    // res.status(500).json(error.message);
  }

};

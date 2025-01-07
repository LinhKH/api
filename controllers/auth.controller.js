import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { handleError } from '../utils/error.js';

export const signup = async (req, res, next) => {
  const { username: name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(handleError(400, "Please provide all fields"));
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

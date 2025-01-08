import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { handleError } from "../utils/error.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username: name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(handleError(400, "Please provide all fields"));
  }
  const hashedPassword = await bcryptjs.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(200).json({ message: "User created successfully!" });
  } catch (error) {
    next(error);
    // res.status(500).json(error.message);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      handleError(StatusCodes.BAD_REQUEST, "Please provide all fields")
    );
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(handleError(404, "User not found"));
    }
    const isValidPassword = await bcryptjs.compare(
      password,
      validUser.password
    );
    if (!isValidPassword) {
      return next(handleError(StatusCodes.UNAUTHORIZED, "Invalid credentials"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const { password: _, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ message: "User signed in successfully!", rest });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, photo } = req.body;

  if (!name || !email) {
    return next(
      handleError(StatusCodes.BAD_REQUEST, "Please provide all fields")
    );
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);
      const newUser = new User({
        name,
        email,
        avatar: photo,
        password: hashedPassword,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      const { password: _, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({ message: "User signed in successfully!", rest });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const { password: _, ...rest } = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(StatusCodes.OK)
      .json({ message: "User signed in successfully!", rest });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};

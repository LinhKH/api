import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { handleError } from "../utils/error.js";
import { v2 as cloudinary } from "cloudinary";
import { StatusCodes } from "http-status-codes";

export const test = (req, res) => {
  res.status(200).json({ message: "User route works" });
};

export const update = async (req, res, next) => {
  const { name, email, password } = req.body;
  const image = req.file;

  try {
    if (req.userId !== req.params.id) {
      return next(handleError(StatusCodes.FORBIDDEN, "You are not authorized to perform this action"));
    };

    if (!name || !email || !password) {
      return next(handleError(StatusCodes.BAD_REQUEST, "Name, email, and password are required"));
    }

    let updatedData = {
      name,
      email,
      password
    };
    if (image) {
      const result = await cloudinary.uploader
        .upload(image.path, {
          use_filename: true,
          folder: "mern-estate",
        })
        .catch((error) => {
          return next(handleError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        });
        updatedData = { ...updatedData,
          avatar: result?.secure_url, // Save the image URL
        };
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(req.userId, updatedData, {
      new: true,
    });

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    next(error);
  }
};

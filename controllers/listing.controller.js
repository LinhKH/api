import Listing from "../models/listing.model.js";
import { StatusCodes } from "http-status-codes";

export const createListing = async (req, res, next) => {
  const newListing = new Listing({...req.body, userRef: req.userId});
  try {
    const savedListing = await newListing.save();
    res.status(StatusCodes.CREATED).json({ message: "Listing created successfully!", savedListing });
  } catch (error) {
    next(error);
  }
};

import Listing from "../models/listing.model.js";
import { StatusCodes } from "http-status-codes";
import removeImgCloundinary from "../utils/removeImgCloundinary.js";

export const createListing = async (req, res, next) => {
  const newListing = new Listing({ ...req.body, userRef: req.userId });
  try {
    const savedListing = await newListing.save();
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Listing created successfully!", savedListing });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(StatusCodes.NOT_FOUND, "Listing not found!"));
  }

  if (req.userId !== listing.userRef) {
    return next(
      errorHandler(
        StatusCodes.UNAUTHORIZED,
        "You can only delete your own listings!"
      )
    );
  }

  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    // delete image from cloudinary
    await removeImgCloundinary(listing.imageUrls);

    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(StatusCodes.NOT_FOUND, "Listing not found!"));
  }

  if (req.userId !== listing.userRef) {
    return next(
      errorHandler(
        StatusCodes.UNAUTHORIZED,
        "You can only update your own listings!"
      )
    );
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(StatusCodes.OK).json({ message: "Listing updated successfully!", updatedListing });
  } catch (error) {
    next(error);
  }
};



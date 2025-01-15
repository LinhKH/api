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

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(StatusCodes.NOT_FOUND, 'Listing not found!'));
    }
    res.status(StatusCodes.OK).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
import jwt from "jsonwebtoken";
import { handleError } from "./error.js";
import { StatusCodes } from "http-status-codes";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(handleError(StatusCodes.UNAUTHORIZED, "Unauthorized"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return next(handleError(StatusCodes.FORBIDDEN, "Forbidden"));
  }
};

import express from "express";

import { test, update, deleteUser, getUserListings, getUser } from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";

import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get("/test", test);

// multer middleware
router.post("/update/:id", verifyToken, upload.single("image") , update);
router.delete("/delete/:id" ,verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get('/:id', verifyToken, getUser)

export default router;

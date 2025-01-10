import express from "express";

import { test, update, deleteUser, signOut } from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";

import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get("/test", test);

// multer middleware
router.post("/update/:id",verifyToken, upload.single("image") , update);
router.delete("/delete/:id",verifyToken, deleteUser);
router.get("/signout", signOut);

export default router;

import express from "express";

import { test, update } from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";

import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get("/test", test);

// multer middleware
router.post("/update/:id",verifyToken, upload.single("image") , update);

export default router;

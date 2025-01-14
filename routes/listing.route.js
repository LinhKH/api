import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';

import { createListing, deleteListing, updateListing
  // getListing, getListings, 
} from '../controllers/listing.controller.js';


const router = express.Router();

router.post('/', verifyToken, createListing);
router.delete('/:id', verifyToken, deleteListing);
router.put('/:id', verifyToken, updateListing);
// router.get('/', getListings);
// router.get('/:id', getListing);

export default router;
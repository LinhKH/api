import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';

import { createListing, 
  // getListing, getListings, updateListing, deleteListing 
} from '../controllers/listing.controller.js';


const router = express.Router();

router.post('/', verifyToken, createListing);
// router.get('/', getListings);
// router.get('/:id', getListing);
// router.put('/:id',verifyToken, updateListing);
// router.delete('/:id',verifyToken, deleteListing);

export default router;
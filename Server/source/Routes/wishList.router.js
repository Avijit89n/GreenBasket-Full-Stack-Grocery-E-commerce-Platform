import {Router} from "express";
import { addWishList, getWishList } from "../Controllers/wishList.controller.js";
import upload from "../Middleware/Multer.middleware.js"

const router = Router();
router.route('/add-wishlist').post(upload.none(), addWishList)
router.route('/get-wishlist/:userID').get(getWishList)

export default router
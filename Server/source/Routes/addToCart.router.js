import { Router } from "express";
import upload from "../Middleware/Multer.middleware.js";
import { addToCart, getCartProducts } from "../Controllers/addToCart.controller.js";

const router = Router();

router.route('/add-cart-item').post(upload.none(), addToCart)
router.route('/get-cart-item/:userID').get(getCartProducts)

export default router
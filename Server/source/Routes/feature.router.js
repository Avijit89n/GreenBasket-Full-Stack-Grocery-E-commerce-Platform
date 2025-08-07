import {Router} from "express"
import upload from "../Middleware/Multer.middleware.js"
import { 
    fetchAllData, 
    addBannerData, 
    addCategory, 
    fetchAllProduct,
    addProduct, 
    addAds,
    homePageData,
    getfeaturedProductForHomePage 
} from "../Controllers/feature.controller.js";

const router = Router();

// Feature page
router.route('/get-data/all-features').get(fetchAllData)
router.route('/get-products-features').get(fetchAllProduct)
router.route('/add-banner/title/tagline').post(upload.array('banner', 5), addBannerData)
router.route('/add-selected-category').post(upload.none(), addCategory)
router.route('/add-selected-product').post(upload.none(), addProduct)
router.route('/add-advertisement').post(upload.array('ads', 2), addAds)

// Home page
router.route('/get-all-data/home').get(homePageData)
router.route('/get-featured-product/home').get(getfeaturedProductForHomePage)

export default router; 
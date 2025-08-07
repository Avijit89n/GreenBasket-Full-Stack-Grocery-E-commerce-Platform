import { Router } from "express";
import { 
    addcategory, 
    getDataForTableOfCategory, 
    changeStatusfeatureOfCategory, 
    deleteCategory ,
    editCategory,
    getAllCategoryForHome,
    getProductByCategory,
} from "../Controllers/category.controller.js";
import upload from "../Middleware/Multer.middleware.js";
import { 
    changeStatusofSubcategoryUsingCategory,
    changeStatusofProductUsingSubCategory
} from "../Middleware/changeStatus.middleware.js"
  
const router = Router();


// category page
router.route("/add-category").post(upload.single("image"),addcategory)
router.route("/get-table-data/category").get(getDataForTableOfCategory)
router.route("/change-status/:categoryID").get(changeStatusofSubcategoryUsingCategory, changeStatusofProductUsingSubCategory, changeStatusfeatureOfCategory)
router.route("/delete-category/:categoryID").get(deleteCategory)
router.route("/edit-category/:categoryID").post(upload.single("image"),editCategory)


// home page
router.route('/get-data/home').get(getAllCategoryForHome)


//product page (user)
router.route('/get-product/category/:categoryID').get(getProductByCategory)

export default router;
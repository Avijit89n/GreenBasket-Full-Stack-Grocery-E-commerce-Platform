import {Router} from 'express';
import { 
    addSubCategory, 
    getDataForTableOfSubCategory,
    changeStatusfeatureOfSubCategory,
    deleteSubCategory ,
    editSubCategory,
    productVarient
} from '../Controllers/subCategory.controller.js';
import upload from '../Middleware/Multer.middleware.js'
import {
    changeStatusofProductUsingSubCategory,
    checkSubCategoryStatusOnCreationOfSubCategory
} from "../Middleware/changeStatus.middleware.js"

const router = Router(); 

// sub-category page
router.route('/add-subcategory').post(upload.none(), checkSubCategoryStatusOnCreationOfSubCategory, addSubCategory)
router.route('/get-table-data/sub-category').get(getDataForTableOfSubCategory)
router.route('/change-status/:subcategoryID').get(changeStatusofProductUsingSubCategory, changeStatusfeatureOfSubCategory)
router.route('/delete-subcategory/:subcategoryID').get(deleteSubCategory)
router.route('/edit-subcategory/:subcategoryID').post(upload.none(), checkSubCategoryStatusOnCreationOfSubCategory, editSubCategory)
router.route('/get-variant/:subcategoryID').get(productVarient)

export default router;  
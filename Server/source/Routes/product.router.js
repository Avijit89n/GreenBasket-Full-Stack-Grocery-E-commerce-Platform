import { Router } from "express"
import { 
    addProduct, 
    getTableDataForProducts,
    changeStatusfeatureOfProduct,
    productPageData , 
    deleteProduct,
    editProduct,
    getProduct,
    getQuantity
} from "../Controllers/products.controller.js"
import upload from "../Middleware/Multer.middleware.js"
import { 
    checkSubCategoryStatusForChangeProductStatus,
    checkProductStatusOnCreationOfProduct
 } from "../Middleware/changeStatus.middleware.js"

const router = Router()

// product page
router.route('/add-product/:productID').post(upload.fields([
    {
        name: 'avatar',
        maxCount: 1
    },
    {
        name: 'otherImages',
        maxCount: 6
    }
]),checkProductStatusOnCreationOfProduct, addProduct)
router.route('/get-table-data/products').get(getTableDataForProducts)
router.route('/change-status/:productID').get(checkSubCategoryStatusForChangeProductStatus, changeStatusfeatureOfProduct)
router.route('/delete-product/:productID').get(deleteProduct)
router.route('/get-product/page/limit').get(productPageData)
router.route('/edit-product/:productID').get(editProduct)
router.route('/get-product/:productID').get(getProduct)
router.route('/get-quantity').post(upload.none(), getQuantity)


export default router; 
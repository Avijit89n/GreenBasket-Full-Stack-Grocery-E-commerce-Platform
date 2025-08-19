import {Router} from "express"
import { addOrders, getTabledata, getOrderDetails, changeStatus } from "../Controllers/orders.controller.js";
import upload from "../Middleware/Multer.middleware.js"

const router = Router();

router.route('/add-orders').post(addOrders)
router.route('/get-orders').get(getTabledata)
router.route('/get-order-details/:orderID').get(getOrderDetails)
router.route('/change-order-status/:orderID').post(upload.none(), changeStatus)

export default router;
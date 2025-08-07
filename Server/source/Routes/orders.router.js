import {Router} from "express"
import { addOrders, getTabledata } from "../Controllers/orders.controller.js";

const router = Router();

router.route('/add-orders').post(addOrders)
router.route('/get-orders').get(getTabledata)

export default router;
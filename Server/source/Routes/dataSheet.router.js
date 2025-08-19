import {Router} from 'express';
import { orderReveneue, reveneueAndProfit, last24HourOrder, categorySales } from '../Controllers/dataSheet.model.js';

const router = Router();
router.route('/data-sheet-revenue').get(orderReveneue)
router.route('/data-sheet-revenue-profit-graph').get(reveneueAndProfit)
router.route('/last-hour-order').get(last24HourOrder)
router.route('/category-sales').get(categorySales)

export default router;
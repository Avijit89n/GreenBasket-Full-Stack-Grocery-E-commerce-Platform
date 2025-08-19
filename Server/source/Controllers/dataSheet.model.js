import { Order } from "../Models/orders.model.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { User } from "../Models/user.model.js";
import asyncHandler from "../Utils/AsyncHandler.js";
import { Category } from "../Models/category.model.js"

const orderReveneue = asyncHandler(async (req, res) => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const currentMonthRevenue = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: currentMonthStart, $lt: nextMonthStart },
                status: { $ne: "Cancelled" },
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$orderValue" },
            },
        },
    ]);

    const lastMonthRevenue = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
                status: { $ne: "Cancelled" },
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$orderValue" },
            },
        },
    ]);

    const currTotalOrder = await Order.countDocuments({
        createdAt: { $gte: currentMonthStart, $lt: nextMonthStart },
        status: { $ne: "Cancelled" },
    })

    const lastTotalOrder = await Order.countDocuments({
        createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
        status: { $ne: "Cancelled" },
    })

    const lastUsers = await User.countDocuments({
        createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
        role: { $ne: "admin" },
    })
    const currUsers = await User.countDocuments({
        createdAt: { $gte: currentMonthStart, $lt: nextMonthStart },
        role: { $ne: "admin" },
    })

    res.status(200)
        .json(
            new ApiResponse(200, "Data Fetched Successfully",
                {
                    lastMonthRevenue: lastMonthRevenue.length > 0 ? lastMonthRevenue[0].totalRevenue : 0,
                    currentMonthRevenue: currentMonthRevenue.length > 0 ? currentMonthRevenue[0].totalRevenue : 0,
                    currentMonthOrder: currTotalOrder,
                    lastMonthOrder: lastTotalOrder,
                    currentMonthUsers: currUsers,
                    lastMonthUsers: lastUsers,
                    currentMonthCoversionRate: currUsers > 0 ? ((currTotalOrder / currUsers) * 100).toFixed(2) : 0.00,
                    lastMonthCoversionRate: lastUsers > 0 ? ((lastTotalOrder / lastUsers) * 100).toFixed(2) : 0.00,
                },
                true)
        )
})

const reveneueAndProfit = asyncHandler(async (req, res) => {
    const result = await Order.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                orders: { $sum: 1 },
                revenue: { $sum: "$orderValue" }
            }
        },
        {
            $project: {
                year: "$_id.year",
                month: {
                    $arrayElemAt: [
                        ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                        "$_id.month"

                    ]
                },
                orders: 1,
                revenue: 1,
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    return res.status(200)
        .json(
            new ApiResponse(200, "data fetched successfully", result, true)
        )

})

const last24HourOrder = asyncHandler(async (req, res) => {
    const last24HoursOrders = await Order.find({
        createdAt: {
            $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
    });

    return res.status(200)
        .json(
            new ApiResponse(200, "Last 24 hours orders fetched successfully", last24HoursOrders, true)
        )
})

const categorySales = asyncHandler(async (req, res) => {


    const sales = await Order.aggregate([
        { $unwind: "$products" },
        {
            $lookup: {
                from: "products",
                localField: "products.productId",
                foreignField: "_id",
                as: "productInfo"
            }
        },
        { $unwind: "$productInfo" },
        {
            $lookup: {
                from: "subcategories",
                localField: "productInfo.category",
                foreignField: "_id",
                as: "subcategoryInfo"
            }
        },
        { $unwind: "$subcategoryInfo" },
        {
            $group: {
                _id: "$subcategoryInfo.category",
                totalSales: { $sum: "$products.quantity" }
            }
        },
        { $sort: { totalSales: -1 } },
        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                as: "categoryInfo"
            }
        },
        { $unwind: "$categoryInfo" },
        {
            $project: {
                _id: 0,
                categoryId: "$_id",
                category: "$categoryInfo.name",
                sales: "$totalSales",
                fill: "#F59E0B"

            }
        }
    ]);

    return res.status(200)
        .json(
            new ApiResponse(200, "category sales fetched successfully", sales, true)
        )

})

export { orderReveneue, reveneueAndProfit, last24HourOrder, categorySales } 
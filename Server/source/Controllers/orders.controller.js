import mongoose from "mongoose";
import { Order } from "../Models/orders.model.js";
import { Product } from "../Models/product.model.js";
import { User } from "../Models/user.model.js";
import ApiResponse from "../Utils/ApiResponse.js";
import asyncHandler from "../Utils/AsyncHandler.js"
import ApiError from "../Utils/ApiError.js";

const addOrders = asyncHandler(async (req, res, next) => {
    const deliveryCharge = 49;
    const packagingCharge = 15;

    let { user, orderAddress, orderItems, orderPayment } = req.body;
    if (!user || !orderAddress || !orderItems || orderItems.length === 0 || !orderPayment) {
        return res.status(400)
            .json(
                new ApiResponse(400, "All fields are required", null, false)
            )
    }
    const findUser = await User.findById(user)
    if (!findUser) {
        return res.status(400)
            .json(
                new ApiResponse(400, "User not found", null, false)
            )
    }
    let fullAddress = "";
    findUser.address.map(item => {
        if (item?._id?.equals(new mongoose.Types.ObjectId(orderAddress?._id))) {
            fullAddress = {
                name: item?.name,
                address: `${item?.locality || ""},${item?.address || ""},${item?.landmark || ""},${item?.city || ""},${item?.state || ""},${item?.pincode || ""}`?.split(",")?.filter(item => item).join(","),
                contact: item?.phone?.filter(item => item)?.join(", ")
            };
        }
    })

    if (!fullAddress) {
        return res.status(400)
            .json(
                new ApiResponse(400, "Address not found", null, false)
            )
    }
    if (orderItems && !Array.isArray(orderItems)) orderItems = [orderItems]
    const session = await mongoose.startSession();
    session.startTransaction()

    let totalPrice = 0;

    try {
        for (let item of orderItems) {
            const updatedProduct = await Product.findOneAndUpdate(
                {
                    _id: item.productId,
                    quantity: { $gte: item.quantity }
                },
                {
                    $inc: { quantity: -item.quantity }
                },
                {
                    session,
                    returnDocument: 'before'
                }
            );
            if (!updatedProduct) {
                const currentProduct = await Product.findById(item.productId).session(session);
                await session.abortTransaction();
                session.endSession();

                if (!currentProduct) {
                    return res.status(404).json(
                        new ApiResponse(404, `Product with ID ${item.productId} not found`, null, false)
                    );
                } else {
                    return res.status(409).json(
                        new ApiResponse(409, `Product "${currentProduct.name}" has only ${currentProduct.quantity} in stock`, null, false)
                    );
                }
            }

            totalPrice += updatedProduct.finalPrice * item.quantity;
        }

        const orderValue = totalPrice > 200 ?
            totalPrice + packagingCharge :
            totalPrice + deliveryCharge + packagingCharge;

        const createOrder = await Order.create([{
            user,
            address: fullAddress,
            paymentMethod: orderPayment.toUpperCase(),
            products: orderItems,
            orderValue,
        }], { session });

        if (!createOrder || createOrder.length === 0) {
            throw new ApiError(400, "Failed to create the order");
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200)
            .json(
                new ApiResponse(200, "Order Placed Successfully", createOrder[0], true)
            )

    } catch (error) {
        console.log("Transaction failed:", error);
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
})

const getTabledata = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let end = false
    let data = []
    try {
        data = await Order.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: { fullName: 1 }
                        }
                    ],
                    as: "userData"
                }
            },
            {
                $unwind: "$userData"
            },
            { $skip: skip },
            { $limit: limit },
        ])
    } catch (error) {
        return res.status(400)
            .json(
                new ApiResponse(200, "failed to fetchData", {}, false)
            )
    }

    if (data.length < limit) {
        end = true;
    }

    return res.status(200)
        .json(
            new ApiResponse(200, "Data fetche successfully", {
                isEnd: end,
                data
            }, true)
        )
})

const getOrderDetails = asyncHandler(async (req, res) => {
    const orderID = req.params.orderID
    if (!orderID) {
        return res.status(400)
            .json(
                new ApiResponse(400, "Order ID is required", null, false)
            )
    }
    const orderDetails = await Order.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(orderID) }
        },
        {
            $lookup: {
                from: "products",
                let: { productIdArray: "$products" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $in: ["$_id", "$$productIdArray.productId"]
                            }
                        }
                    }
                ],
                as: "productDetails"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            avatar: 1,
                            userName: 1,
                            email: 1,
                            phoneNo: 1
                        }
                    }
                ],
                as: "userData"
            }
        },
        {
            $unwind: "$userData"
        },
        {
            $project: {
                _id: 1,
                user: "$userData",
                address: 1,
                paymentMethod: 1,
                products: 1,
                productDetails: 1,
                orderValue: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);
    if (!orderDetails) {
        return res.status(404)
            .json(
                new ApiResponse(404, "Order not found", null, false)
            )
    }
    return res.status(200)
        .json(
            new ApiResponse(200, "Order details fetched successfully", orderDetails?.at(0), true)
        )
})

const changeStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const orderID = req.params.orderID;


    if (!orderID || !status) {
        return res.status(400)
            .json(
                new ApiResponse(400, "Required fields are not reached")
            )
    }
    const findOrder = await Order.findByIdAndUpdate(orderID, { status });
    if (!findOrder) {
        return res.status(400)
            .json(
                new ApiResponse(400, "Dailed to find the order ID", {}, false)
            )
    }
    return res.status(200)
        .json(
            new ApiResponse(200, "Order status changed successfully", findOrder, true)
        )
})

const getUserMyOrder = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    let isEnd = false

    const userID = req.params.userID

    console.log(page, limit, skip, userID)
    const orderDEtails = await Order.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userID)
            }
        },
        {
            $lookup: {
                from: "products",
                let: { productIdArray: "$products" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $in: ["$_id", "$$productIdArray.productId"]
                            }
                        }
                    }, {
                        $project: {
                            avatar: 1,
                            name: 1
                        }
                    }
                ],
                as: "productDetails"
            }
        },
        {
            $project: {
                orderValue: 1,
                status: 1,
                productDetails: 1,
                createdAt: 1,
                products: { $size: "$products" },

            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $skip: skip
        },
        { 
            $limit: limit
        }
    ])

    if (orderDEtails.length < limit) isEnd = true

    return res.status(200)
        .json(
            new ApiResponse(200, "Order fetched successfully", {
                orderDetails: orderDEtails, 
                isEnd
            }, true)
        )
})

export { addOrders, getTabledata, getOrderDetails, changeStatus, getUserMyOrder }
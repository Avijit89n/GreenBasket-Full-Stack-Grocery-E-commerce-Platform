import asyncHandler from "../Utils/AsyncHandler.js"
import ApiError from "../Utils/ApiError.js"
import ApiResponse from "../Utils/ApiResponse.js"
import { CartItems } from "../Models/addToCart.model.js"
import mongoose from "mongoose"

const addToCart = asyncHandler(async (req, res) => {
    let { userID, products } = req.body;

    if (products && !Array.isArray(products)) products = [products]

    products = products?.map(element => JSON.parse(element));

    const isCartExist = await CartItems.findOneAndUpdate({ user: userID }, {
        products: products || []
    }, {new: true})

    if (!isCartExist) {
        const createCart = await CartItems.create({
            user: userID,
            products: products || []
        })

        if (!createCart) {
            throw new ApiError(500, "Failed  to add items in cart. Please try again")
        }

        return res.status(200)
            .json(
                new ApiResponse(200, "Successufully add the items to cart", createCart, true)
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, "Successfully updated the cart", isCartExist, true)
        )
})

const getCartProducts = asyncHandler(async (req, res) => {
    const { userID } = req.params

    if (!userID) {
        throw new ApiError(400, "User ID not found")
    }
    
    const findCart = await CartItems.aggregate([
        {
            $match: {user: new mongoose.Types.ObjectId(userID)}
        },
        {
            $unwind: "$products"
        },
        {
            $lookup: {
                from: "products",
                localField: "products.productID",
                foreignField: "_id",
                as: "ProductDetails"
            }
        },
        {
            $unwind: "$ProductDetails"
        },
        {
            $group: {
                _id: "$_id",
                user: { $first: "$user" },
                cartItems: {
                    $push: {
                        _id: "$products._id",
                        quantity: "$products.quantity",
                        productData: "$ProductDetails"
                    }
                }
            }
        }
    ])

    return res.status(200)
        .json(
            new ApiResponse(200, "Successfully fetch all cart details", findCart || {}, true)
        )

})

export { addToCart, getCartProducts }
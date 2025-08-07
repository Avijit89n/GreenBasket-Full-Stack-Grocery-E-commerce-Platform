import asyncHandler from "../Utils/AsyncHandler.js"
import { WishList } from "../Models/wishList.model.js"
import ApiError from "../Utils/ApiError.js"
import ApiResponse from "../Utils/ApiResponse.js"
import mongoose from "mongoose"


const addWishList = asyncHandler(async (req, res) => {
    let { userID, products } = req.body;

    if (!userID) {
        throw new ApiError(400, "UserId not found")
    }
    if (products && !Array.isArray(products)) products = [products]

    const isExist = await WishList.findOneAndUpdate({ user: userID }, {
        products: products || []
    }, { new: true })

    if (!isExist) {
        const createList = await WishList.create({
            user: userID,
            products: products || []
        })

        if (!createList) {
            throw new ApiError(500, "Failed to add items in wishList")
        }

        return res.status(200)
            .json(
                new ApiResponse(200, "Sucessfully add the items in wishList", createList, true)
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, "Successfully updated your wish List", isExist, true)
        )
})

const getWishList = asyncHandler(async (req, res) => {
    const { userID } = req.params

    if (!userID) {
        throw new ApiError(400, "User ID not found")
    }

    const findCart = await WishList.aggregate([
        {
            $match: { user: new mongoose.Types.ObjectId(userID) }
        },
        {
            $lookup: {
                from: "products",
                let: {productArray: "$products"},
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $in: ["$_id", "$$productArray"]
                            }
                        }
                    }
                ],
                as: "wishListItem"
            }
        },
        {
            $project: {
                user: 1,
                wishListItem: 1
            }
        }
    ])

    return res.status(200)
        .json(
            new ApiResponse(200, "Successfully fetch all cart details", findCart || {}, true)
        )
})

export { addWishList, getWishList }
import asyncHandler from "../Utils/AsyncHandler.js"
import ApiError from "../Utils/ApiError.js"
import ApiResponse from "../Utils/ApiResponse.js"
import { Category } from "../Models/category.model.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../Utils/Cloudinary.js";
import fs from "fs";
import mongoose from "mongoose";

const addcategory = asyncHandler(async (req, res) => {
    const count = await Category.countDocuments();
    if (count === 20) {
        return res.status(400)
            .json(
                new ApiResponse(400, "You can Add maximum 20 category", {}, false)
            )
    }
    const { name, description, status } = req.body;
    if (!name) {
        fs.unlinkSync(req.file?.path);
        return res.status(400)
            .json(
                new ApiResponse(400, "Name is required", null, false)
            )
    }
    if (!status) {
        fs.unlinkSync(req.file?.path);
        return res.status(400)
            .json(
                new ApiResponse(400, "Status is required", null, false)
            )
    }
    const searchCategory = await Category.findOne({ name: name.toLowerCase() })

    if (searchCategory) {
        fs.unlinkSync(req.file?.path);
        return res.status(400)
            .json(
                new ApiResponse(400, "Category already exists", null, false)
            )
    }

    const image = req.file;

    if (!image) {
        return res.status(400)
            .json(
                new ApiResponse(400, "Image is required", {}, false)
            )
    }

    const uploadedImage = await uploadOnCloudinary(image.path);
    if (!uploadedImage) {
        throw new ApiError(500, "Failed to upload to Cloudinary");
    }


    const category = await Category.create({
        name,
        description,
        status,
        image: uploadedImage.secure_url,
    })

    if(!category){
        await deleteFromCloudinary(uploadedImage.secure_url)
        return res.status(400)
            .json(
                new ApiResponse(400, "Failed to create category", {}, false)
            )
    }

    return res.status(201)
        .json(
            new ApiResponse(201, "Category added successfully", category, true)
        )
})

const getDataForTableOfCategory = asyncHandler(async (req, res) => {
    const tableData = await Category.aggregate([      
        {
            $lookup: {
                from: "subcategories",
                let: {categoryID: "$_id"},
                pipeline: [
                    {
                        $match: {
                            $expr: { $in: ["$$categoryID", "$category"]},
                        }
                    },
                    {
                        $lookup: {
                            from: "products",
                            let: { subCategoryID: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$$subCategoryID", "$category"] },
                                    }
                                },
                                {
                                    $project: {
                                        name: 1
                                    }
                                }
                            ],
                            as: "allproducts"
                        }
                    },
                    {
                        $project: { 
                            name: 1,
                            status: 1,
                            allproducts: {$size: "$allproducts"}
                         }
                    }
                ],
                as: "subcategories"
            }
        },
        {
            $project: {
                name: 1,
                image: 1,
                status: 1,
                subcategories: 1,
                products: {$sum: "$subcategories.allproducts"}
            }
        }
    ])

    res.status(200)
        .json(
            new ApiResponse(200, "Data fetched successfully", tableData, true)
        )

})

const changeStatusfeatureOfCategory = asyncHandler(async (req, res) => {
    const category = req.category
    if (category.status === 'active') category.status = 'inactive'
    else category.status = 'active'
    const update = await category.save()
    return res.status(200)
        .json(
            new ApiResponse(200, "Category status changed successfully", update, true)
        )

})

const deleteCategory = asyncHandler(async (req, res) => {
    const id = req.params?.categoryID;
    const deleteCategory = await Category.findByIdAndDelete(id)
    if (!deleteCategory) {
        return res.status(404)
            .json(
                new ApiResponse(404, "Category not found", null, false)
            )
    }
    try {
        const deleteImage = await deleteFromCloudinary(deleteCategory.image)
        if (!deleteImage) {
            throw new ApiError(500, "Failed to delete image from cloudinary")
        }
    } catch (err) {
        throw new ApiError(500, "Failed to delete image from cloudinary")
    }
    return res.status(200)
        .json(
            new ApiResponse(200, "Category deleted successfully", deleteCategory, true)
        )

})

const editCategory = asyncHandler(async (req, res) => {
    const id = req.params?.categoryID;
    const category = await Category.findById(id);
    if (!category) {
        fs.unlinkSync(req.file?.path);
        return res.status(404)
            .json(
                new ApiResponse(404, "Category not found", null, false)
            )
    }
    const { name, description } = req.body
    const imageFile = req.file;

    if (!imageFile && !name && !description) {
        return res.status(400)
            .json(
                new ApiResponse(400, "No data to update", null, false)
            )
    }
    let imageURL = null;
    if (imageFile) {
        try {
            const uploadedImage = await uploadOnCloudinary(imageFile.path);
            const deleteImage = await deleteFromCloudinary(category.image)
            if (!uploadedImage || !deleteImage) {
                fs.unlinkSync(imageFile.path);
                throw new ApiError(500, "Failed to upload or delete image to cloudinary")
            }
            imageURL = uploadedImage.secure_url;
        } catch (error) {
            fs.unlinkSync(imageFile.path);
            throw new ApiError(500, "Failed to upload or delete image to cloudinary")
        }
    } else if (name === category.name && description === category.description) {
        return res.status(400)
            .json(
                new ApiResponse(400, "No change detected for update", null, false)
            )
    }
    const update = await Category.findByIdAndUpdate(id, {
        name,
        description,
        image: imageURL || category.image
    }, { new: true })
    return res.status(200)
        .json(
            new ApiResponse(200, "Category updated successfully", update, true)
        )
})

const getAllCategoryForHome = asyncHandler(async (req, res) => {
    const data = await Category.aggregate([
        {
            $match: { status: "active" }
        },
        {
            $project: {
                name: 1,
                image: 1
            }
        }
    ])

    return res.status(200)
        .json(
            new ApiResponse(200, "Successfult fetched all category data", data)
        )
})

const getProductByCategory = asyncHandler(async (req, res) => {
    const categoryID = new mongoose.Types.ObjectId(req.params.categoryID)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    let end = false;


    const data = await Category.aggregate([
        {
            $match: {
                _id: categoryID,
                status: "active"
            }
        },
        {
            $lookup: {
                from: "subcategories",
                let: { categoryID: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $in: ["$$categoryID", "$category"] },
                            status: "active"
                        }
                    },
                    {
                        $lookup: {
                            from: "products",
                            let: { subCategoryID: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$$subCategoryID", "$category"] },
                                        status: "active"
                                    }
                                }
                            ],
                            as: "allProducts"
                        }
                    }
                ],
                as: "allSubCategories"
            }
        },
        {
            $addFields: {
                productArray: {
                    $map: {
                        input: "$allSubCategories",
                        as: "item",
                        in: "$$item.allProducts"
                    }
                }
            }
        },
        {
            $addFields: {
                products: {
                    $reduce: {
                        input: "$productArray",
                        initialValue: [],
                        in: {
                            $concatArrays: ["$$value", "$$this"]
                        }
                    }
                }
            }
        },
        {
            $project: {
                name: 1,
                image: 1,
                products: 1
            }
        },
        { $unwind: "$products" },
        { $skip: skip },
        { $limit: limit },
        { $replaceRoot: { newRoot: "$products" } }
    ])

    if (data.length < limit) end = true;
    else end = false;

    return res.status(200)
        .json(
            new ApiResponse(200, "Fetch product successfully", {
                productDetails: data,
                isEnd: end
            }, true)
        )
})


export {
    addcategory,
    getDataForTableOfCategory,
    changeStatusfeatureOfCategory,
    deleteCategory,
    editCategory,
    getAllCategoryForHome,
    getProductByCategory
}
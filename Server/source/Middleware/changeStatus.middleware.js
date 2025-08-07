import asyncHandler from "../Utils/AsyncHandler.js";
import { SubCategory } from "../Models/subCategory.model.js";
import { Category } from "../Models/category.model.js";
import ApiError from "../Utils/ApiError.js";
import { Product } from "../Models/product.model.js"
import ApiResponse from "../Utils/ApiResponse.js";
import mongoose from "mongoose";


const changeStatusofSubcategoryUsingCategory = asyncHandler(async (req, res, next) => {
    const categoryID = req.params?.categoryID;

    const category = await Category.findById(categoryID)
    if (!category) {
        throw new ApiError(400, "category id does not match")
    }

    const newStatus = category.status === "active" ? "inactive" : "active";

    try {
        await SubCategory.updateMany(
            { category: categoryID },
            { $set: { status: newStatus } }

        )
        const subcategories = await SubCategory.find(
            { category: categoryID },
            { _id: 1 }
        );
        const subCategoryIDs = subcategories.map(sub => sub._id);

        req.subCategoryIDs = subCategoryIDs
        req.newStatus = newStatus
        req.category = category
        next()
    } catch (error) {
        next(error)
    }
})


const changeStatusofProductUsingSubCategory = asyncHandler(async (req, res, next) => {
    const subcategoryID = req.params?.subcategoryID
    let subCategory = ""

    if (subcategoryID) {
        subCategory = await SubCategory.findById(subcategoryID)
        const searchCategory = await Category.findById(subCategory.category)
        if (searchCategory.status === "inactive") {
            return res.status(400)
                .json(
                    new ApiResponse(400, "Activation failed: The sub-category belongs to an inactive category.", {}, false)
                )
        }
        if (!subCategory) {
            throw new ApiError(400, "category id does not match")
        }
    }

    const subCategoryArrayIDs = req.subCategoryIDs

    const newStatus = subCategory ? subCategory.status === "active" ? "inactive" : "active" : req.newStatus

    try {
        await Product.updateMany(
            { category: subcategoryID || { $in: subCategoryArrayIDs } },
            { $set: { status: newStatus } }
        )
        next()
    } catch (error) {
        next(error)
    }

})


const checkSubCategoryStatusForChangeProductStatus = asyncHandler(async (req, res, next) => {
    const id = req.params?.productID;
    const product = await Product.findById(id)
    if (!product) {
        return res.status(404)
            .json(
                new ApiResponse(404, "Product not found", null, false)
            )
    }
    const checkSubcategory = await SubCategory.findById(product.category)
    if (checkSubcategory.status === "inactive") {
        return res.status(400)
            .json(
                new ApiResponse(400, "Activation failed: The product belongs to an inactive subcategory", {}, false)
            )
    }
    req.product = product
    next()
})


const checkProductStatusOnCreationOfProduct = asyncHandler(async (req, res, next) => {
    const { category, status } = req.body;
    const fields = req.files;

    console.log(req.body)
    const findSubcategory = await SubCategory.findById(category);

    if (!category || !status) {
        if (fs.existsSync(fields.avatar[0].path)) fs.unlinkSync(fields.avatar?.[0]?.path)
        if (fields.otherImages?.length > 0) {
            for (let i = 0; i < fields.otherImages?.length; i++) {
                if (fs.existsSync(fields.otherImages?.[i]?.path)) fs.unlinkSync(fields.otherImages[i].path)
            }
        }
        return res.status(400)
            .json(400, "All fields are required", {}, false)
    }

    if (!findSubcategory) {
        if (fs.existsSync(fields.avatar[0].path)) fs.unlinkSync(fields.avatar?.[0]?.path)
        if (fields.otherImages?.length > 0) {
            for (let i = 0; i < fields.otherImages?.length; i++) {
                if (fs.existsSync(fields.otherImages?.[i]?.path)) fs.unlinkSync(fields.otherImages[i].path)
            }
        }
        return res.status(400)
            .json(400, "category not found", {}, false)
    }

    findSubcategory.status === "inactive" ? req.body.status = "inactive" : ""
    next()
})

const checkSubCategoryStatusOnCreationOfSubCategory = asyncHandler(async (req, res, next) => {
    const id = req.params?.subcategoryID;
    let { category, status } = req.body;

    if (!status && !id) {
        return res.status(400).json(new ApiResponse(400, "status is required", null, false))
    }

    if (!category) {
        return res.status(400).json(new ApiResponse(400, "Minimun one category is required", null, false))
    }

    if (!Array.isArray(category)) category = [category];
    else {
        category = category.map(item => item = item.toLowerCase())
    }

    const data = await Category.aggregate([
        {
            $match: {
                _id: { $in: category.map(item => new mongoose.Types.ObjectId(item)) }
            }
        },
        {
            $project: { status: 1 }
        }
    ])

    if (!data) {
        return res.status(400)
            .json(400, "category not found", {}, false)
    }

    for (let valid of data) {
        if (valid.status === 'inactive') {
            req.body.status = 'inactive';
            break;
        }
    }
    next()
})

export {
    changeStatusofSubcategoryUsingCategory,
    changeStatusofProductUsingSubCategory,
    checkSubCategoryStatusForChangeProductStatus,
    checkProductStatusOnCreationOfProduct,
    checkSubCategoryStatusOnCreationOfSubCategory
}
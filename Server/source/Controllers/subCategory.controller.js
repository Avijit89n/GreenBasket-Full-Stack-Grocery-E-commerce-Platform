import mongoose from "mongoose";
import { SubCategory } from "../Models/subCategory.model.js";
import ApiResponse from "../Utils/ApiResponse.js";
import asyncHandler from "../Utils/AsyncHandler.js"

const addSubCategory = asyncHandler(async (req, res) => {
    let { name, description, status, category } = req.body;

    if (!category) {
        return res.status(400).json(new ApiResponse(400, "Minimun one category is required", null, false))
    }

    if (!Array.isArray(category)) category = [category];
    else {
        category = category.map(item => item = item.toLowerCase())
    }

    if (!name) {
        return res.status(400).json(new ApiResponse(400, "Name is required", null, false))
    }
    if (!status) {
        return res.status(400).json(new ApiResponse(400, "status is required", null, false))
    }

    const seatchSubCategory = await SubCategory.findOne({ name: name.toLowerCase() })

    if (seatchSubCategory) {
        return res.status(400).json(new ApiResponse(400, "SubCategory already exists", null, false))
    }

    const newSubCategory = await SubCategory.create({
        name,
        description,
        status,
        category
    })

    return res.status(201)
        .json(
            new ApiResponse(201, "Sub-Category successfully created", newSubCategory, true)
        )
})

const getDataForTableOfSubCategory = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const skip = (page-1)*limit

    let end = false;

    const tableData = await SubCategory.aggregate([
        {
            $lookup:{
                from: "categories",
                localField: "category",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: { name: 1 }
                    }
                ],
                as: "categoryData"
            }
        },
        {
            $lookup:{
                from: "products",
                let: { subcategoryID: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$$subcategoryID", "$category"] },
                        }
                    }
                ],
                as: "allproducts"
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
        {
            $project: {
                name: 1,
                status: 1,
                products: { $size: "$allproducts" },
                category: "$categoryData"
            }
        }
    ])

    if(tableData.length < limit) end = true

    return res.status(200)
        .json(
            new ApiResponse(200, "Data successfully fetched", {
                isEnd: end,
                details: tableData
            }, true)
        )
})

const productVarient = asyncHandler(async(req, res)=> {
    const id = req.params.subcategoryID
    let currentID = req.query.currentProductID
    if(currentID === 'new') currentID = null;
    const data = await SubCategory.aggregate([
        {
            $match: {
               _id: new mongoose.Types.ObjectId(id) ,
               status: "active"
            }
        },
        {
            $lookup: {
                from: "products",
                let: { subCategoryId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$$subCategoryId", "$category"] },
                            status: "active",
                            _id: {$ne: new mongoose.Types.ObjectId(currentID)}
                        }
                    },
                    {
                        $project: {
                            name: 1,
                        }
                    }
                ],
                as: "products"
            }
        }
    ])

    return res.status(200)
        .json(
            new ApiResponse(200, "Vatiant fetch successfully", data)
        )
})

const changeStatusfeatureOfSubCategory = asyncHandler(async (req, res) => {
    const id = req.params?.subcategoryID;
    const subCategory = await SubCategory.findById(id)
    if (!subCategory) {
        return res.status(404)
            .json(
                new ApiResponse(404, "Sub-Category not found", null, false)
            )
    }
    if (subCategory.status === 'active') subCategory.status = 'inactive'
    else subCategory.status = 'active'
    const update = await subCategory.save()
    return res.status(200)
        .json(
            new ApiResponse(200, "Sub-Category status changed successfully", update, true)
        )

})

const deleteSubCategory = asyncHandler(async (req, res) => {
    const id = req.params?.subcategoryID;
    const subC = await SubCategory.findById(id);
    if (!subC) {
        return res.status(404)
            .json(
                new ApiResponse(404, "Sub-Category not found", null, false)
            )
    }
    const del = await SubCategory.findByIdAndDelete(id);

    return res.status(200)
        .json(
            new ApiResponse(200, "Sub-Category successfully deleted", del, true)
        )
})

const editSubCategory = asyncHandler(async (req, res) => {
    const id = req.params?.subcategoryID;
    const searchSubCategory = await SubCategory.findById(id);
    if (!searchSubCategory) {
        return res.status(404)
            .json(
                new ApiResponse(404, "Sub Categoey not found", {}, false)
            )
    }
    let { name, category, description, status } = req.body;

    if (!name && !description && category.length === 0) {
        return res.status(404)
            .json(
                new ApiResponse(404, "No data found", {}, false)
            )
    }

    if (!Array.isArray(category)) category = [category.toLowerCase()];
    else {
        category = category.map(item => item = item.toLowerCase())
    }
    
    if (name === searchSubCategory.name && description === searchSubCategory.description && category.length === searchSubCategory.category.length) {
        if (category.every((item, idx) => item === searchSubCategory.category[idx])) {
            return res.status(400)
                .json(
                    new ApiResponse(400, "No Changes detected for update", {}, false)
                )
        }
    }

    const update = await SubCategory.findByIdAndUpdate(id, {
        name,
        description,
        category,
        status: status ? status : searchSubCategory.status
    }, { new: true })

    return res.status(200)
        .json(
            new ApiResponse(200, "Sub Category successfully updated", update, true)
        )

})

export {
    addSubCategory,
    getDataForTableOfSubCategory,
    changeStatusfeatureOfSubCategory,
    deleteSubCategory,
    editSubCategory,
    productVarient
}
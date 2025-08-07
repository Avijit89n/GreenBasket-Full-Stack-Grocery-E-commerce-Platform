import ApiResponse from '../Utils/ApiResponse.js';
import asyncHandler from '../Utils/AsyncHandler.js'
import { Product } from "../Models/product.model.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../Utils/Cloudinary.js"
import ApiError from '../Utils/ApiError.js';
import fs from "fs"
import mongoose from 'mongoose';

const addProduct = asyncHandler(async (req, res) => {

    const productID = req.params.productID

    let {
        name,
        category,
        status,
        description,
        price,
        brand,
        quantity,
        discount,
        size,
        weight,
        countryOfOrigin,
        details,
        ingredients,
        shelfLife,
        manufacturingDate,
        expiryDate,
        variant,
        avatar,
        otherImages
    } = req.body;
    const fields = req.files;

    if(otherImages && !Array.isArray(otherImages)) otherImages = [otherImages]

    if (!name || !category || !status || !price || !brand || !quantity || !countryOfOrigin || !manufacturingDate || !expiryDate) {
        if (fs.existsSync(fields.avatar[0].path)) fs.unlinkSync(fields.avatar?.[0]?.path)
        if (fields.otherImages?.length > 0) {
            for (let i = 0; i < fields.otherImages?.length; i++) {
                if (fs.existsSync(fields.otherImages?.[i]?.path)) fs.unlinkSync(fields.otherImages[i].path)
            }
        }
        return res.status(400)
            .json(
                new ApiResponse(400, "All fields are required", null, false)
            )
    }

    if ((!fields.avatar || fields.avatar.length === 0) && !avatar) {
        if (fields.otherImages?.length > 0) {
            for (let i = 0; i < fields.otherImages?.length; i++) {
                if (fs.existsSync(fields.otherImages?.[i]?.path)) fs.unlinkSync(fields.otherImages[i].path)
            }
        }
        return res.status(400)
            .json(
                new ApiResponse(400, "avatar is required", null, false)
            )
    }

    let uploadAvatar = ""

    if (fields.avatar && fields.avatar.length > 0) {
        try {
            uploadAvatar = await uploadOnCloudinary(fields?.avatar?.[0]?.path)
        } catch (error) {
            if (fs.existsSync(fields.avatar[0].path)) fs.unlinkSync(fields.avatar?.[0]?.path)
            if (fields.otherImages?.length > 0) {
                for (let i = 0; i < fields.otherImages?.length; i++) {
                    if (fs.existsSync(fields.otherImages[i].path)) fs.unlinkSync(fields.otherImages[i].path)
                }
            }
            throw new ApiError(500, "failed to upload avatar")
        }
    }

    const productImage = []

    try {
        for (let i = 0; i < fields.otherImages?.length; i++) {
            const result = await uploadOnCloudinary(fields.otherImages?.[i].path)
            productImage.push(result.secure_url)
        }
    } catch (error) {
        if (fields.otherImages?.length > 0) {
            for (let i = 0; i < fields.otherImages?.length; i++) {
                if (fs.existsSync(fields.otherImages[i].path)) {
                    fs.unlinkSync(fields.otherImages[i].path);
                }
            }
            for (let i = 0; i < productImage?.length; i++) {
                await deleteFromCloudinary(productImage[i])
            }
        }
        return res.status(500)
            .json(
                new ApiResponse(500, "failed to upload otherimages", {}, false)
            )
    }

    let product = ""

    if (productID !== 'new') {
        const findProduct = await Product.findById(productID)

        if (uploadAvatar) await deleteFromCloudinary(findProduct.avatar);
        for (let i = 0; i < findProduct?.otherImages?.length; i++) {
            if (!otherImages?.includes(findProduct.otherImages[i])) {
                await deleteFromCloudinary(findProduct.otherImages[i])
            }
        }
        product = await Product.findByIdAndUpdate(productID, {
            name,
            category,
            description,
            price,
            finalPrice: price - (price * (discount / 100)),
            brand,
            status,
            quantity,
            discount,
            size,
            weight,
            avatar: uploadAvatar ? uploadAvatar.secure_url : findProduct.avatar,
            otherImages: [
                ...(otherImages || []),
                ...productImage
            ],
            countryOfOrigin,
            details,
            ingredients,
            shelfLife,
            manufacturingDate,
            expiryDate,
            variant
        })
    } else {
        product = await Product.create({
            name,
            category,
            description,
            price,
            finalPrice: price - (price * (discount / 100)),
            brand,
            status,
            quantity,
            discount,
            size,
            weight,
            avatar: uploadAvatar.secure_url,
            otherImages: productImage,
            countryOfOrigin,
            details,
            ingredients,
            shelfLife,
            manufacturingDate,
            expiryDate,
            variant
        })
    }

    if (!product) {
        await deleteFromCloudinary(uploadAvatar.secure_url)
        for (let i = 0; i < productImage.length; i++) {
            await deleteFromCloudinary(productImage[i])
        }
        return res.status(400)
            .json(
                new ApiResponse(400, "Failed to add product/update product", {}, false)
            )
    }

    if (productID === 'new') return res.status(201)
        .json(
            new ApiResponse(201, "product added successfully", product, true)
        )

    return res.status(201)
        .json(
            new ApiResponse(201, "product Updated successfully", product, true)
        )
})

const getTableDataForProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    let isEnd = false

    const tableData = await Product.aggregate([
        {
            $project: {
                _id: 1,
                name: 1,
                avatar: 1,
                status: 1,
                finalPrice: 1,
                discount: 1,
                quantity: 1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ])

    if (tableData.length < limit) isEnd = true

    return res.status(200)
        .json(
            new ApiResponse(200, "table data fetched successfully", {
                isEnd,
                tableData
            }, true)
        )
})

const editProduct = asyncHandler(async (req, res) => {
    const id = req.params.productID;
    const findProduct = await Product.findById(id).populate('category').populate('variant')
    if (!findProduct) {
        return res.status(400)
            .json(
                new ApiResponse(400, "Product not found", {}, false)
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, "Successfully fetched Product", findProduct)
        )
})

const changeStatusfeatureOfProduct = asyncHandler(async (req, res) => {
    const product = req.product
    if (product.status === 'active') product.status = 'inactive'
    else product.status = 'active'
    const update = await product.save()
    return res.status(200)
        .json(
            new ApiResponse(200, "Product status changed successfully", update, true)
        )

})

const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params.productID

    const findProduct = await Product.findById(id);
    if (!findProduct) {
        return res.status(400)
            .json(
                new ApiResponse(400, "Product is not found", {}, false)
            )
    }

    try {
        await deleteFromCloudinary(findProduct.avatar)
        if (findProduct.otherImages || findProduct.otherImages.length > 0) {
            for (let i = 0; i < findProduct.otherImages.length; i++) {
                await deleteFromCloudinary(findProduct.otherImages[i])
            }
        }
    } catch (error) {
        throw new ApiError(500, "failed to delete from cloudinary")
    }

    const deleteProduct = await Product.deleteOne({ _id: id })

    return res.status(200)
        .json(
            new ApiResponse(200, "Product Successfully deleted", deleteProduct, true)
        )
})

const productPageData = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    let end = false;

    const data = await Product.aggregate([
        { $match: { status: "active" } },
        { $skip: skip },
        { $limit: limit }
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


const getProduct = asyncHandler(async(req, res) => {
    const productID = req.params.productID;
    const product = await Product.findById(productID);
    if(!product){
        return res.status(400)
            .json(
                new ApiResponse(400, "Product not found", {}, false)
            )       
    }

    return res.status(200)
        .json(
            new ApiResponse(200, "Successfully fetched Product", product)
        )
})

const getQuantity = asyncHandler(async(req, res) => {
    let {productID} = req.body
    if(!productID || productID.length === 0){
        return res.status(400)
            .json(
                new ApiResponse(400, "Your Cart is Empty", {}, false)
            )
    } 
    if(productID && !Array.isArray(productID)) productID = [productID]

    productID = productID?.map(element =>  new mongoose.Types.ObjectId(element));

    const findProducts = await Product.aggregate([
        {
            $match: {
                $expr: {
                    $in: ["$_id", productID]
                }
            }
        },
        {
            $project: {
                quantity: 1
            }
        }
    ])
    if(!findProducts || findProducts.length === 0) {
        return res.status(400)
            .json(
                new ApiResponse(400, "Products not found", {}, false)
            )
    }
    return res.status(200)
        .json(
            new ApiResponse(200, "Successfully fetched product", findProducts)
        )

})

export {
    addProduct,
    getTableDataForProducts,
    changeStatusfeatureOfProduct,
    productPageData,
    deleteProduct,
    editProduct,
    getProduct,
    getQuantity
}
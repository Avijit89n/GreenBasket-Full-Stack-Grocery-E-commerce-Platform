import asyncHandler from "../Utils/AsyncHandler.js"
import { Feature } from "../Models/feature.model.js"
import ApiResponse from "../Utils/ApiResponse.js"
import fs from "fs"
import { deleteFromCloudinary, uploadOnCloudinary } from "../Utils/Cloudinary.js"
import ApiError from "../Utils/ApiError.js"

const fetchAllData = asyncHandler(async (req, res) => {

    const fetchData = await Feature.aggregate([
        {
            $lookup: {
                from: "categories",
                let: { categoryArray: "$category" },
                pipeline: [
                    {
                        $match: {
                            status: "active",
                        }
                    },
                    {
                        $addFields: {
                            selected: {
                                $in: ["$_id", "$$categoryArray"]
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            image: 1,
                            selected: 1
                        }
                    }
                ],
                as: "allCategories"
            }
        }
    ])

    return res.status(200)
        .json(
            new ApiResponse(200, "successfully fetch all data from feature", fetchData)
        )
})

const fetchAllProduct = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 7
    const skip = (page - 1) * limit

    const data = await Feature.aggregate([

        {
            $lookup: {
                from: "products",
                let: { productArray: "$product" },
                pipeline: [
                    {
                        $match: { status: "active" }
                    },
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
                    },
                    {
                        $addFields: {
                            selected: {
                                $in: ["$_id", "$$productArray"]
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            avatar: 1,
                            selected: 1
                        }
                    }
                ],
                as: "Allproduct"
            }
        },
        {
            $project: {
                name: 1,
                product: 1,
                Allproduct: 1
            }
        }
    ])

    let isEnd = false;
    if (data[0].Allproduct.length < limit) isEnd = true

    return res.status(200)
        .json(
            new ApiResponse(200, "Successfully fetched product", {
                isEnd,
                productDetails: data
            })
        )
})

const addBannerData = asyncHandler(async (req, res) => {
    let { title, tagline, banner } = req.body;
    const bannerFile = req.files || [];

    if (!title && !tagline && !banner && bannerFile.length === 0) {
        return res.status(400).json(new ApiResponse(400, "No data found for update", {}, false));
    }

    if (title && !Array.isArray(title)) title = [title];
    if (tagline && !Array.isArray(tagline)) tagline = [tagline];
    if (banner && !Array.isArray(banner)) banner = [banner];

    const findID = await Feature.findOne({ name: "features" });

    if (!findID) {
        bannerFile.forEach(file => fs.unlinkSync(file.path));
        return res.status(400).json(new ApiResponse(400, "Feature ID not found", {}, false));
    }

    if (!title?.length) title = findID.title;
    if (!tagline?.length) tagline = findID.tagline;

    const imageURL = [];
    try {
        for (const file of bannerFile) {
            const result = await uploadOnCloudinary(file.path);
            imageURL.push(result.secure_url);
        }
    } catch (error) {
        for (const file of bannerFile) {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path)
            }
        }
        if (imageURL.length > 0) {
            for (const url of imageURL) {
                [
                    await deleteFromCloudinary(url)
                ]
            }
        }
        throw new ApiError(500, "Failed to upload on Cloudinary");

    }

    banner = banner?.filter(item => item !== "null") || [];

    if (banner.length < findID.banner.length) {
        for (const oldBanner of findID.banner) {
            if (!banner.includes(oldBanner)) {
                try {
                    await deleteFromCloudinary(oldBanner);
                } catch (error) {
                    throw new ApiError(500, "Failed to delete from Cloudinary");
                }
            }
        }
    }

    const updated = await Feature.findOneAndUpdate(
        { name: "features" },
        {
            title,
            tagline,
            banner: [
                ...(!banner || banner.length === 0 ? [] : banner),
                ...imageURL
            ],
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, "Successfully updated all banner details", updated, true));
});

const addAds = asyncHandler(async (req, res) => {
    let { ads } = req.body
    const adsFile = req.files

    if (ads && !Array.isArray(ads)) ads = [ads];
    const findID = await Feature.findOne({ name: "features" })
    if (!findID) {
        if (adsFile.length > 0) {
            for (let i = 0; i < adsFile.length; i++) {
                if (fs.existsSync(adsFile[i].path)) {
                    fs.unlinkSync(adsFile[i].path)
                }
            }
        }
        return res.status(400)
            .json(400, "Feature Id not found", {}, false)
    }

    const imageURL = []

    if (adsFile.length > 0) {
        try {
            for (let i = 0; i < adsFile.length; i++) {
                const result = await uploadOnCloudinary(adsFile[i].path)
                imageURL.push(result.secure_url)
            }
        } catch (error) {
            for (let i = 0; i < adsFile.length; i++) {
                if (fs.existsSync(adsFile[i].path)) {
                    fs.unlinkSync(adsFile[i].path)
                }
            }
            if (imageURL.length > 0) {
                for (let i = 0; i < imageURL.length; i++) {
                    await deleteFromCloudinary(imageURL[i])
                }
            }
            throw new ApiError(500, "Failed to upload")

        }
    }

    ads = ads?.filter(ele => ele != 'null')

    if (ads?.length < findID.advertisement.length) {
        for (const oldBanner of findID.advertisement) {
            if (!ads.includes(oldBanner)) {
                try {
                    await deleteFromCloudinary(oldBanner);
                } catch (error) {
                    throw new ApiError(500, "Failed to delete from Cloudinary");
                }
            }
        }
    }

    const update = await Feature.findOneAndUpdate({ name: "features" }, {
        advertisement: [
            ...(!ads || ads?.length === 0 ? [] : ads),
            ...imageURL
        ]
    }, { new: true })

    if (!update) {
        if (adsFile.length > 0) {
            for (let i = 0; i < adsFile.length; i++) {
                if (fs.existsSync(adsFile[i].path)) {
                    fs.unlinkSync(adsFile[i].path)
                }
            }
            if (imageURL.length > 0) {
                for (let i = 0; i < imageURL.length; i++) {
                    await deleteFromCloudinary(imageURL[i])
                }
            }
        }

        return res.status(500)
            .json(500, "Failed to update the advertisement", {}, false)
    }

    return res.status(200)
        .json(
            new ApiResponse(20, "Succefully added the advertiseents", update)
        )
})

const addCategory = asyncHandler(async (req, res) => {
    let { category } = req.body;
    if (category && !Array.isArray(category)) category = [category]

    console.log(category)

    if (!category || category.length === 0) {
        return res.status(400)
            .json(
                new ApiResponse(400, "No Category selected for update. Minimum 1 required", {}, false)
            )
    }

    const update = await Feature.findOneAndUpdate({ name: "features" }, {
        category: category
    }, { new: true })

    if (!update) {
        return res.status(400)
            .json(
                new ApiResponse(400, "No Feature Id found for update", {}, false)
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, "Category Successfully featured on Home page", update, true)
        )
})

const addProduct = asyncHandler(async (req, res) => {
    let { products } = req.body
    if (products && !Array.isArray(products)) products = [products]

    const update = await Feature.findOneAndUpdate({ name: "features" }, {
        product: products || []
    }, { new: true })

    if (!update) {
        return res.status(400)
            .json(
                new ApiResponse(400, "No Feature Id found for update", {}, false)
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, "products Successfully featured on Home page", update, true)
        )

})

const homePageData = asyncHandler(async (req, res) => {
    const data = await Feature.aggregate([
        {
            $match: { name: "features" }
        },
        {
            $lookup: { // find the category from the features catecory fields which are matched 
                from: "categories",
                let: { categoryArray: "$category" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $in: ["$_id", "$$categoryArray"] },
                            status: "active"
                        }
                    },// we cat the categoroty
                    {
                        $lookup: { // now we get the subcategory from previous category which we found in previous stage
                            from: "subcategories",
                            let: { categoryID: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $in: ["$$categoryID", "$category"] },
                                        status: "active"
                                    }
                                }, // we get the subcategory
                                {
                                    $lookup: { // now we found the products according to therir subcategory because a product have subcategory-name
                                        from: "products",
                                        let: { subcategoryID: "$_id" },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: { $eq: ["$$subcategoryID", "$category"] },
                                                    status: "active"
                                                }
                                            },
                                        ],
                                        as: "allproducts"
                                    }
                                },
                                {
                                    $project: { allproducts: 1, _id: 0 }
                                }
                            ],
                            as: "allsubcategories"
                        }
                    },
                    {
                        // Note:
                        // make a array from all the products like 
                        // allsubcategories: [
                        //     {
                        //         name: subcategory1 // name are not there we reference for better understanding as we project only allproducts in previous stage
                        //         allproducts: [
                        //             { p1 }, { p2 }, { p3 }
                        //         ]
                        //     },
                        //     {
                        //         name: subcategory2
                        //         allproducts: [
                        //             { p1 }, { p2 }, { p3 }
                        //         ]
                        //     }
                        // ]
                        $addFields: {
                            productArrayofArray: {
                                $map: {
                                    input: "$allsubcategories",
                                    as: "element",
                                    in: "$$element.allproducts"
                                }
                            }
                        }
                        // Note:
                        // we make that like that using map
                        // productArrayofArray: [
                        //     [{ p1 }, { p2 }, { p3 }], [{ p1 }, { p2 }, { p3 }]
                        // ]
                    },
                    {
                        $addFields: {
                            finalProductArray: {
                                $slice: [
                                    {
                                        $reduce: {
                                            input: "$productArrayofArray",
                                            initialValue: [],
                                            in: { $concatArrays: ["$$value", "$$this"] }
                                        }
                                    },
                                    15 // it ensure that finalProductArray length does not cross 10
                                ]
                            }
                        }
                        // Note:
                        // we make that like that using reduce
                        // productArrayofArray: [
                        //     { p1 }, { p2 }, { p3 }, { p1 }, { p2 }, { p3 }
                        // ]
                    },
                    {
                        $project: {
                            name: 1,
                            image: 1,
                            finalProductArray: 1 // we only project finalProductArray for less confussion
                        }
                    }
                ],
                as: 'allcategory'
            }
        },
        {
            $project: {
                name: 1,
                title: 1,
                tagline: 1,
                banner: 1,
                advertisement: 1,
                allcategory: 1
            }
        }
    ])

    return res.status(200)
        .json(
            new ApiResponse(200, "Successfully fetched all data for Home Page", data)
        )
})

const getfeaturedProductForHomePage = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;
    let end = false


    const data = await Feature.aggregate([
        {
            $lookup: {
                from: "products",
                let: { productArray: "$product" },
                pipeline: [
                    {
                        $match: {
                            status: "active",
                            $expr: {
                                $in: ["$_id", "$$productArray"]
                            }
                        }
                    },
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
                    }
                ],
                as: "featuredProducts"
            }
        },
        {
            $project: {
                featuredProducts: 1
            }
        }
    ])


    if(data?.[0]?.featuredProducts.length < limit) end = true;
    else end = false;

    return res.status(200)
        .json(
            new ApiResponse(200, "Featch Products successfully",
                {
                    isEnd: end,
                    productDetails: data?.[0].featuredProducts
                },
                true
            )
        )
})

export {
    fetchAllData,
    addBannerData,
    addCategory,
    fetchAllProduct,
    addProduct,
    addAds,
    homePageData,
    getfeaturedProductForHomePage
} 
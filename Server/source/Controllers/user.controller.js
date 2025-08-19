import mongoose from 'mongoose'
import { User } from '../Models/user.model.js'
import ApiError from '../Utils/ApiError.js'
import ApiResponse from '../Utils/ApiResponse.js'
import asyncHandler from '../Utils/AsyncHandler.js'
import generateAccessRefreshToken from '../Utils/generateAccessRefreshToken.js'
import jwt from 'jsonwebtoken'
import { deleteFromCloudinary, uploadOnCloudinary } from '../Utils/Cloudinary.js'
import fs from 'fs'

const cookieOption = {
    httpOnly: true,
    secure: true,
    sameSite: "none",  
}

const registerUser = asyncHandler(async (req, res) => {
    const { userName, fullName, email, password, phoneNo } = req.body

    if (![userName, fullName, email, password, phoneNo].every(Boolean)) {
        console.error("All fields are required")
        return res.status(400).json(
            new ApiResponse(400, 'All fields are required', {}, false)
        )
    }

    const existUser = await User.findOne({
        $or: [{ userName }, { email }, { phoneNo }]
    })

    if (existUser) {
        if (existUser.userName === userName) {
            return res.status(400).json(
                new ApiResponse(400, 'Username already exist', {}, false)
            )
        } else if (existUser.email === email) {
            console.error("Email already exist")
            return res.status(400).json(
                new ApiResponse(400, 'Email already exist', {}, false)
            )
        } else {
            console.error("Phone number already exist")
            return res.status(400).json(
                new ApiResponse(400, 'Phone number already exist', {}, false)
            )
        }
    }

    const user = await User.create({
        userName,
        fullName,
        email,
        password,
        phoneNo
    })
    if (!user) {
        return res.status(500).json(
            new ApiResponse(500, 'Something went wrong to register user', {}, false)
        )
    }
    user.password = undefined
    return res.status(201).json(
        new ApiResponse(201, 'User registered successfully', user)
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (![email, password].every(Boolean)) {
        console.error("All fields are required")
        return res.status(400).json(
            new ApiResponse(400, 'All fields are required', {}, false)
        )
    }

    const user = await User.findOne({ email })
    if (!user) {
        console.error("User not found")
        return res.status(404).json(
            new ApiResponse(404, 'User not found', {}, false)
        )
    }

    const checkPassword = await user.checkPasswordCorrect(password)

    if (!checkPassword) {
        console.error("password Invalid")
        return res.status(401).json(
            new ApiResponse(401, 'Invalid password', {}, false)
        )
    }

    const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id)

    if (!accessToken) throw new ApiError(500, 'Something went wrong to generate access tokens')
    if (!refreshToken) throw new ApiError(500, 'Something went wrong to generate refresh tokens')

    user.password = undefined
    return res.status(200)
        .cookie('refreshToken', refreshToken, cookieOption)
        .cookie('accessToken', accessToken, cookieOption)
        .json(
            new ApiResponse(200, `${user.role} logged in successfully`, {
                user,
                accessToken,
                refreshToken
            })
        )
})

const logoutuser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(404, 'Session expired. please login again');
    }
    await User.findByIdAndUpdate(user._id, {
        $unset: {
            refreshToken: ''
        }
    })
    return res.status(200)
        .clearCookie('refreshToken', cookieOption)
        .clearCookie('accessToken', cookieOption)
        .json(
            new ApiResponse(200, 'logout successfull')
        )

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const getAccessToken = req.cookies?.accessToken;
    const getRefreshToken = req.cookies?.refreshToken;

    if (!getAccessToken && !getRefreshToken) { return; }

    try {
        const decodeAccessToken = jwt.verify(getAccessToken, process.env.ACCESS_TOKEN_SECRET);
        const userbyAccessToken = await User.findById(decodeAccessToken._id).select("-password -refreshToken")
        if (!userbyAccessToken) {
            throw new ApiError(500, "Internal server error please try again")
        }
        return res.status(200).json(
            new ApiResponse(200, "Authorized user", userbyAccessToken)
        )
    } catch (error) {
        try {
            const decodeRefreshToken = jwt.verify(getRefreshToken, process.env.REFRESH_TOKEN_SECRET);
            const { accessToken, refreshToken } = await generateAccessRefreshToken(decodeRefreshToken._id)

            const userbyRefreshToken = await User.findById(decodeRefreshToken._id).select("-password")

            if (!userbyRefreshToken) {
                throw new ApiError(500, "Internal server error please try again")
            }

            if (getRefreshToken !== userbyRefreshToken.refreshToken) {
                throw new ApiError(404, 'Session expired. please login again');
            }

            return res.status(200)
                .cookie('accessToken', accessToken, cookieOption)
                .cookie('refreshToken', refreshToken, cookieOption)
                .json(
                    new ApiResponse(200, "successfully refresh tokens", userbyRefreshToken)
                )

        } catch (error) {
            res.status(401)
                .clearCookie('accessToken', cookieOption)
                .clearCookie('refreshToken', cookieOption)
                .json(
                    new ApiResponse(401, 'Session expired. please login again', {}, false)
                )
        }
    }
})

const addAddress = asyncHandler(async (req, res) => {
    const userID = req.params.userID
    const { address } = req.body;
    if (!address) {
        throw new ApiError(400, "No address found")
    }
    if (!userID) {
        throw new ApiError(400, "User ID not found");
    }
    const findID = await User.findById(userID).select("-password -refreshToken")
    if (!findID) {
        throw new ApiError(400, "User not Found. Please try again");
    }
    findID.address.push(address)
    await findID.save()
    return res.status(200)
        .json(
            new ApiResponse(200, "Address added successfully", findID, true)
        )
})

const deleteAddress = asyncHandler(async (req, res) => {
    const userID = req.params.userID;
    const { addressID } = req.query;

    if (!userID || !addressID) {
        return res.status(400)
            .json(
                new ApiResponse(400, "User ID/Product ID not found", {}, false)
            )
    }

    const findID = await User.findById(userID).select("-password -refreshToken")
    if (!findID) {
        throw new ApiError(400, "User ID not found in our database", {}, false)
    }
    findID.address = findID.address?.filter(ele => !ele._id.equals(new mongoose.Types.ObjectId(addressID)))
    await findID.save();

    return res.status(200)
        .json(
            new ApiResponse(200, "Address deleted successfully", findID, true)
        )
})

const updateAddress = asyncHandler(async (req, res) => {
    const userID = req.params.userID;
    const { addressID } = req.query;
    const { address } = req.body;
    if (!address) {
        throw new ApiError(400, "No address found")
    }

    if (!userID || !addressID) {
        return res.status(400)
            .json(
                new ApiResponse(400, "User ID/Product ID not found", {}, false)
            )
    }

    const findID = await User.findById(userID).select("-password -refreshToken")
    if (!findID) {
        throw new ApiError(400, "User ID not found in our database", {}, false)
    }

    findID.address = findID.address.map(ele => {
        if (ele.id === addressID) return address;
        else return ele;
    })

    await findID.save();

    return res.status(200)
        .json(
            new ApiResponse(200, "Address successfully updated", findID, true)
        )

})

const updatePassword = asyncHandler(async (req, res) => {
    const userID = req.params.userID
    const { currPass, newPass, confirmPass } = req.body;

    if (!currPass || !newPass || !confirmPass) {
        return res.status(400)
            .json(
                new ApiResponse(400, "All fields are required", {}, false)
            )
    }

    if (newPass !== confirmPass) {
        return res.status(400)
            .json(
                new ApiResponse(400, "New password and Confirm Password does not matched", {}, false)
            )
    }

    const findID = await User.findById(userID).select("-refreshToken");

    if (!findID) {
        return res.status(400)
            .json(
                new ApiResponse(400, "Invalid User ID", {}, false)
            )
    }

    const checkPass = await findID.checkPasswordCorrect(currPass)

    if (!checkPass) {
        return res.status(400)
            .json(
                new ApiResponse(400, "The password you entered doesn’t match your existing password.", {}, false)
            )
    }

    if (currPass === newPass) {
        return res.status(400)
            .json(
                new ApiResponse(400, "New password must be different from current password", {}, false)
            )
    }

    findID.password = newPass;
    await findID.save();

    findID.password = undefined;

    return res.status(200)
        .json(
            new ApiResponse(200, "Password Updated Successfully", findID, true)
        )
})

const updateProfile = asyncHandler(async (req, res) => {
    const userID = req.params.userID;
    const { fullName, userName, email, phoneNo } = req.body;
    let avatarFile = req.file;

    const existUser = await User.findOne({
        _id: { $ne: userID },
        $or: [{ userName }, { email }, { phoneNo }]
    })

    if (existUser) {
        if (existUser.userName === userName) {
            if (fs.existsSync(avatarFile?.path)) fs.unlinkSync(avatarFile?.path)
            return res.status(400).json(
                new ApiResponse(400, 'Username already exist', {}, false)
            )
        } else if (existUser.email === email) {
            if (fs.existsSync(avatarFile?.path)) fs.unlinkSync(avatarFile?.path)
            console.error("Email already exist")
            return res.status(400).json(
                new ApiResponse(400, 'Email already exist', {}, false)
            )
        } else {
            if (fs.existsSync(avatarFile?.path)) fs.unlinkSync(avatarFile?.path)
            console.error("Phone number already exist")
            return res.status(400).json(
                new ApiResponse(400, 'Phone number already exist', {}, false)
            )
        }
    }

    const findID = await User.findById(userID).select("-password -refreshToken");

    if (!findID) {
        if (fs.existsSync(avatarFile?.path)) fs.unlinkSync(avatarFile?.path)
        return res.status(400)
            .json(
                new ApiResponse(400, "Invalid User ID", {}, false)
            )
    }

    if (findID?.avatar && findID.avatar.includes('https://res.cloudinary.com') && avatarFile) {
        try {
            const deleteImage = await deleteFromCloudinary(findID.avatar)
            if (!deleteImage) {
                throw new ApiError(500, "Failed to delete image from cloudinary")
            }
        } catch (error) {
            if (fs.existsSync(avatarFile?.path)) fs.unlinkSync(avatarFile?.path)
            console.error("failed to delete from cloudinary", error)
            throw new ApiError(500, "Failed to delete image from cloudinary")
        }
    }

    if (avatarFile) {
        try {
            const cloudinary = await uploadOnCloudinary(avatarFile?.path);
            if (cloudinary) {
                avatarFile = cloudinary.secure_url;
            }
        } catch (error) {
            if (fs.existsSync(avatarFile?.path)) fs.unlinkSync(avatarFile?.path)
            return res.status(500)
                .json(
                    new ApiResponse(500, "Failed to upload to Cloudinary", {}, false)
                )
        }
    }

    const update = await User.findByIdAndUpdate(userID, {
        fullName,
        userName,
        email,
        phoneNo,
        avatar: avatarFile
    }, { new: true }).select("-password -refreshToken")

    return res.status(200)
        .json(
            new ApiResponse(200, "Profile updated successfully", update, true)
        )
})

export {
    registerUser,
    loginUser,
    logoutuser,
    refreshAccessToken,
    addAddress,
    deleteAddress,
    updateAddress,
    updatePassword,
    updateProfile
}
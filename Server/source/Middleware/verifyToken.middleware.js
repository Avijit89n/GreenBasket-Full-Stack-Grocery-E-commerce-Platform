import { User } from "../Models/user.model.js";
import ApiError from "../Utils/ApiError.js";
import asyncHandler from "../Utils/AsyncHandler.js";
import jwt from 'jsonwebtoken';


const verifyToken = asyncHandler(async (req, res, next) => {
    try {
        const getrefreshToken = req.cookies?.refreshToken;
        if(!getrefreshToken){
            throw new ApiError(400, "refresh token not found")
        }
        const decodedToken = jwt.verify(getrefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError(400, "Session Expired by refresh token")
        }
        req.user = user;
        next();         
    } catch (error) {
        next(error)
    }
})

export default verifyToken;
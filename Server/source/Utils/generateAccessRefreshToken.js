import { User } from "../Models/user.model.js";
import ApiError from "./ApiError.js";

const generateAccessRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(500, "Failed to find the user please try again");
        }
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "failed to generate access/refresh token", error)
    }
}

export default generateAccessRefreshToken;
import mongoose from "mongoose";
import ApiError from "../Utils/ApiError.js"

const dbconnect = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
        console.log("successfully connected with database")
    } catch (error) {
        throw new ApiError(505, "failed to connect with the database")
    }
}

export default dbconnect;
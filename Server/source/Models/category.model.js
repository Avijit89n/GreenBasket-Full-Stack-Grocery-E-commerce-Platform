import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    description:{
        type: String,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true,
        lowercase: true,
        trim: true
    }
}, {timestamps: true})

export const Category = mongoose.model("category", categorySchema)
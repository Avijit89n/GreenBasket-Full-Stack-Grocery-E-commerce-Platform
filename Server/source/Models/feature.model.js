import mongoose from "mongoose"

const featureSchema = new mongoose.Schema({
    name: String,
    title: [String],
    tagline: [String],
    banner: [String],
    advertisement: [String],
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }],
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
}, { timestamps: true })

export const Feature = mongoose.model("Feature", featureSchema)
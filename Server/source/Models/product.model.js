import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"SubCategory",
        required: true,
    },
    description: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        lowercase:true,
        trim: true,
        require: true
    },
    status:{
        type:String,
        required: true,
        enum: ['active', 'inactive'],
        lowercase: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
    },
    finalPrice: {
        type: Number,
        required: true
    },
    quantity:{
        type: Number,
        required: true,
        trim: true
    },
    discount:{
        type: Number,
        trim: true
    },
    size: {
        type: String,
        trim: true,
        lowercase: true
    },
    weight: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        required: true
    },
    otherImages: {
        type: [String]
    },
    countryOfOrigin: {
        type: String,
        required: true
    },
    details: {
        type: String,
        trim: true
    },
    ingredients: { 
        type: String,
        trim: true
    },
    shelfLife: { 
        type: String,
        trim: true,
        required: true
    },
    manufacturingDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    variant: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
},{timestamps: true})

export const Product = mongoose.model('Product', productSchema)
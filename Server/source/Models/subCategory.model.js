import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true,
        lowercase: true,
        trim: true
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    }]
}, { timestamps: true })

export const SubCategory = mongoose.model('SubCategory', subCategorySchema)
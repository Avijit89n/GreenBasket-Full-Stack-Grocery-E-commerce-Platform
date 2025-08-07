import mongoose from "mongoose"

const addToCartProductSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
})



const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    products: [addToCartProductSchema]
}, { timestamps: true })

export const CartItems = mongoose.model("CartItems", cartSchema)
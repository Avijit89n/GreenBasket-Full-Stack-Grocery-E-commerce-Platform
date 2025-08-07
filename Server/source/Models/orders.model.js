import mongoose from "mongoose"

const orderProductSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: { 
        type: Number, 
        required: true
    }  
})

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "ONLINE", "UPI", "NETBANKING"],
        required: true
    },
    orderValue: {
        type: Number,
        required: true
    },
    products: [orderProductSchema],
    status: {
        type: String,
        enum: ["Order Placed", "Order Received", "Shipped", "In Transit", "Out for Delivery", "Delivered"],
        default: "Order Placed"
    }

}, {timestamps: true})

export const Order = mongoose.model("Order", orderSchema)
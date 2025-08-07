import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import ApiError from '../Utils/ApiError.js'
import jwt from 'jsonwebtoken'

const UserAddress = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: [{
        type: Number
    }],
    address: {
        type: String,
        required: true
    },
    locality: {
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    landmark: {
        type: String
    },
    adrType: {
        type: String,
        enum: ["Home", "Work"],
        required: true
    }
})

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    avatar: {
        type: String
    },
    fullName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    phoneNo: {
        type: Number,
        unique: true,
        required: true
    },
    refreshToken: {
        type: String
    },
    address: {
        type: [UserAddress],
    },
    role: { 
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {timestamps: true})

userSchema.pre("save", async function (next) {
    try {
        if(!this.isModified("password")) return next()
        this.password = await bcrypt.hash(this.password, 10)
        console.log('successfull hash Your password')
    } catch (error) {
        next(new ApiError(500, "password Hashing failed"))
    } 
})

userSchema.methods.checkPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken =  function(){
     return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
            email: this.email,
            phoneNo: this.phoneNo 
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN

        }
    );
} 

userSchema.methods.generateRefreshToken =  function(){
    return jwt.sign(
        {
            _id: this._id 
        }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { 
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN

        }
    );
}



export const User = mongoose.model("User", userSchema)
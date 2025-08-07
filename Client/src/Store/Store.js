import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js"
import loaderReducer from "./loaderSlice.js";
import productCartReducer from "./productDetailsSlice.js"
import cartReducer from "./addToCartSlice.js"
import homeDataReducer from "./homeDataSlice.js"
import wishListReducer from "./wishListSlice.js"



const store = configureStore({
    reducer: {
        auth: authReducer,
        loaderCircle: loaderReducer,
        productCartSlice: productCartReducer,
        addToCart: cartReducer,
        homeData: homeDataReducer,
        wishList: wishListReducer     
    }
})

export default store
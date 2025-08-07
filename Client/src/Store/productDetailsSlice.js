import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dataArray: [],
    currentProduct:{}
}


const productCartSlice = createSlice({
    name: "productCartSlice",
    initialState,
    reducers: {
        getProductDetails: (state, action) => {
            const existProduct = state.dataArray.find(item => item?._id === action?.payload?._id)
            if(!existProduct) state.dataArray.push(action.payload)
        }
    }
})

export const {getProductDetails} = productCartSlice.actions;
export default productCartSlice.reducer
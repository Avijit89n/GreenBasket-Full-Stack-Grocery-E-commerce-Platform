import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import getHandler from "../Services/Get.service.js";

const initialState = {
    isLoading: false,
    data: {},
    category: [],
    featuredProductData: []
};

export const getAllData = createAsyncThunk('get/home-data', async (_, { rejectWithValue }) => {
    try {
        const [dataRes, featuredProductRes, categoryRes] = await Promise.all([
            getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/feature/get-all-data/home`),
            getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/feature/get-featured-product/home`),
            getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/category/get-data/home`)
        ]);

        return {
            dataRes,
            featuredProductRes,
            categoryRes
        };
    } catch (error) {
        return rejectWithValue(
            error?.response?.data?.message || "Failed to fetch home data"
        );
    }
}
);

const homeDataSlice = createSlice({
    name: "homeData",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getAllData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.dataRes?.data?.[0] || {};
                state.category = action.payload.categoryRes?.data || [];
                state.featuredProductData = action.payload.featuredProductRes?.data || [];
            })
            .addCase(getAllData.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload || "Something went wrong while loading home data");
            });
    }
});

export default homeDataSlice.reducer;

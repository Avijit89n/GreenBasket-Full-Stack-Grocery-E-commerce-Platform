import getHandler from "@/Services/Get.service";
import postHandler from "@/Services/Post.Service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
    wishListItem: [],
    isNew: false
}

export const addWishItems = createAsyncThunk('add/wish-Item', async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if(!state.auth.isAuthenticate) return null;
    const user = state.auth.user
    const wishList = state.wishList.wishListItem

    const formdata = new FormData();
    formdata.append("userID", user?._id)
    wishList?.map(ele => {
        formdata.append("products", ele?._id)
    })

    try {
        const response = await postHandler(`${import.meta.env.VITE_BACKEND_URL}/api/wishlist/add-wishlist`, formdata)
        return response
    } catch (error) {
        return rejectWithValue(error?.message || "Failed to update the cart items")
    }
})

export const getWishItems = createAsyncThunk('get/wish-Item', async (payload, { rejectWithValue }) => {
    try {
        const response = await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/wishlist/get-wishlist/${payload}`);
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

const wishListSlice = createSlice({
    name: "wishList",
    initialState,
    reducers: {
        wishListManage: (state, action) => {
            const isExist = state.wishListItem?.find(item => item?._id === action.payload._id)

            if (isExist) {
                state.wishListItem = state.wishListItem?.filter(ele => ele?._id !== action.payload?._id)
            } else {
                state.wishListItem.push(action.payload)
            }
            state.isNew = true
            toast.success("Wish List Updated")
        },
        clearWishList: (state, action) => {
            state.wishListItem = [];
            state.isNew = true
            toast.success("Cleared all Items from Wish List")
        },
        clearOnLogoutWishlist: (state, action) => {
            state.wishListItem = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addWishItems.rejected, (state, action) => {
                toast.error(action.payload || "Failed to update the items. Please Refresh")
                state.wishListItem = []
            })
            .addCase(addWishItems.fulfilled, (state, action) => {
                state.isNew = false
            })
            .addCase(getWishItems.fulfilled, (state, action) => {
                state.wishListItem = action.payload.data?.[0]?.wishListItem || []
                state.isNew = false
            })

    }
})

export const { wishListManage, clearWishList, clearOnLogoutWishlist } = wishListSlice.actions;
export default wishListSlice.reducer
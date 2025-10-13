import getHandler from "@/Services/Get.service";
import postHandler from "@/Services/Post.Service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
    cartItems: [],
    isNew: false
}

const sentCartItems = createAsyncThunk('send/cart-item', async (_, { getState, rejectWithValue }) => {
    const allState = getState()
    if(!allState.auth.isAuthenticate) return null;
    const cartItems = allState.addToCart.cartItems
    const user = allState.auth.user

    const formData = new FormData()
    formData.append("userID", user?._id)
    cartItems.map(ele => {
        formData.append("products", JSON.stringify({
            quantity: ele?.quantity,
            productID: ele.productData._id
        }))
    }) 

    try {
        const response = await postHandler(`${import.meta.env.VITE_BACKEND_URL}/api/cart/add-cart-item`, formData)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

const getCartItem = createAsyncThunk('get/cart-item', async (payload, { rejectWithValue }) => {
    try {
        const response = await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/cart/get-cart-item/${payload}`);
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

const addToCart = createSlice({
    name: "addToCart",
    initialState,
    reducers: {
        increment: (state, action) => {
            if(action.payload?.quantity - state?.cartItems?.find(item => item?.productData?._id === action.payload._id)?.quantity === 0){
                toast.error("We have the limited stock for this product")
                return
            } else if(action.payload?.quantity === 0){
                toast.error("Product is Currently Out of Stock")
                return
            } else if(action.payload?.quantity < state.cartItems?.find(item => item?.productData?._id === action.payload._id)?.quantity) {
                toast.error("Only limited stock available — please reduce the quantity.")
                return
            }
            const isExist = state.cartItems.find(item => item?.productData?._id === action.payload._id)
            if (isExist) {
                isExist.quantity += 1
            } else {
                state.cartItems.push(
                    {
                        quantity: 1,
                        productData: action.payload
                    }
                )
                toast.success("Item Add in Your Cart")
            }
            state.isNew = true
        },
        decrement: (state, action) => {
            const isExist = state.cartItems.find(item => item?.productData?._id === action.payload._id)
            if (isExist && isExist.quantity > 1) {
                isExist.quantity -= 1
            } else if (isExist.quantity === 1) {
                state.cartItems = state.cartItems.filter(item => item.productData?._id !== action.payload._id)
                toast.success("Item Remove from Your Cart")
            }
            state.isNew = true
        },
        clearCart: (state, action) => {
            state.cartItems = [];
            state.isNew = true
        },
        clearOnLogoutCart: (state, action) => {
            state.cartItems = [];
        },
        removeItemFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item?.productData?._id !== action.payload._id)
            state.isNew = true
        },
        itemQuantityUpdate: (state, action) => {
            let updatedQuantity = action.payload;
            if(updatedQuantity && !Array.isArray(updatedQuantity)) updatedQuantity = [updatedQuantity]

            updatedQuantity.map(ele => {
                const findItem = state.cartItems.find(item => item?.productData?._id === ele._id)
                findItem.productData.quantity = ele.quantity
            })

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sentCartItems.rejected, (state, action) => {
                toast.error("Failed to update cart. Last update failed. Please try again")
                state.cartItems = []
            })
            .addCase(sentCartItems.fulfilled, (state, action) => {
                state.isNew = false
            })
            .addCase(getCartItem.fulfilled, (state, action) => {
                state.cartItems = action.payload.data?.[0]?.cartItems || []
                state.isNew = false
            })
    }
})


export const { increment, decrement, clearCart, removeItemFromCart, itemQuantityUpdate, clearOnLogoutCart } = addToCart.actions
export { sentCartItems, getCartItem }
export default addToCart.reducer
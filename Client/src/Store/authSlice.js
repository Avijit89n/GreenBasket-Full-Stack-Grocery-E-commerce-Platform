import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticate: false,
    user: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticate = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isAuthenticate = false;
            state.user = null;
        }
    }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
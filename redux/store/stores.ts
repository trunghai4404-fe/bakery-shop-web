import { configureStore } from "@reduxjs/toolkit";
import { authModalSlice } from "./slices/auth/authModal.reducer";
import { authSlice } from "./slices/auth/authSlice.reducer";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        authModal: authModalSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

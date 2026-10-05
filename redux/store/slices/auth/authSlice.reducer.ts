import { LoginResponse, User } from "@/interface/auth";
import { setCookie, setTokenAuth } from "@/lib/helper";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    user: User | null;
    loading: boolean;
}

export const initialState: AuthState = {
    user: null,
    loading: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<LoginResponse>) => {
            state.user = action.payload.user;
            state.loading = false;
            setTokenAuth(action.payload.jwtResponse);
        },
        setAuthFail: (state) => {
            state.user = null;
            state.loading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        logOut: (state) => {
            state.user = null;
            state.loading = false;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.loading = false;
        }
    }
})

const { reducer, actions } = authSlice;

export const {
    setAuth,
    setAuthFail,
    setLoading,
    logOut,
    setUser,
} = actions;

export default reducer;
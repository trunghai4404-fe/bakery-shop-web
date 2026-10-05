import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthModalType = 'login' | 'register';

interface AuthModalState {
    isOpen: boolean;
    authType: AuthModalType | null;
}

const initialState: AuthModalState = {
    isOpen: false,
    authType: null,
}

export const authModalSlice = createSlice({
    name: 'authModal',
    initialState,
    reducers: {
        openLoginModal: (state) => {
            state.isOpen = true;
            state.authType = "login";
        },
        openRegisterModal: (state) => {
            state.isOpen = true;
            state.authType = "register";
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.authType = null;
        }
    }
})

const { reducer, actions } = authModalSlice;

export const {
    openLoginModal,
    openRegisterModal,
    closeModal,
} = actions;

export default reducer;

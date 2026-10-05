'use client'

import LoginModal from "@/components/auths/loginModal";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import RegisterModal from "@/components/auths/registerModal";
import { closeModal, openLoginModal, openRegisterModal } from "../store/slices/auth/authModal.reducer";
import { LOGIN, REGISTER } from "@/components/auths/type";
import { useEffect } from "react";
import { fetchProfile } from "../store/slices/auth/auth.action";
import { logOut } from "../store/slices/auth/authSlice.reducer";

const authManager = () => {
    const { isOpen, authType } = useAppSelector((state) => state.authModal);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchProfile());
    }, []);

    useEffect(() => {
        const handleForceLogout = () => dispatch(logOut());
        window.addEventListener("auth:logout", handleForceLogout);
        return () => window.removeEventListener("auth:logout", handleForceLogout);
    }, []);

    return (
        <>
            <LoginModal
                isOpen={isOpen && authType === LOGIN}
                onSwitchRegister={() => dispatch(openRegisterModal())}
                onClose={() => dispatch(closeModal())}
            />
            <RegisterModal
                isOpen={isOpen && authType === REGISTER}
                onSwitchLogin={() => dispatch(openLoginModal())}
                onClose={() => dispatch(closeModal())}
            />
        </>
    )
}

export default authManager
"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import LoginModal from "@/components/auths/loginModal";
import RegisterModal from "@/components/auths/registerModal";
import { LOGIN, REGISTER, VERIFY } from "./type";

export type AuthModalType = "login" | "register" | "verify" | null;

interface AuthModalContextValue {
    activeModal: AuthModalType;
    openModal: (modal: AuthModalType) => void;
    closeModal: () => void;
    openLogin: () => void;
    openRegister: () => void;
    openVerify: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal(): AuthModalContextValue {
    const ctx = useContext(AuthModalContext);
    if (!ctx) {
        throw new Error("useAuthModal must be used inside <AuthModalProvider>");
    }
    return ctx;
}

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
    const [activeModal, setActiveModal] = useState<AuthModalType>(null);

    const openModal = useCallback((modal: AuthModalType) => setActiveModal(modal), []);
    const closeModal = useCallback(() => setActiveModal(null), []);
    const openLogin = useCallback(() => setActiveModal(LOGIN), []);
    const openRegister = useCallback(() => setActiveModal(REGISTER), []);
    const openVerify = useCallback(() => setActiveModal(VERIFY), []);

    const value: AuthModalContextValue = {
        activeModal,
        openModal,
        closeModal,
        openLogin,
        openRegister,
        openVerify,
    };

    return (
        <AuthModalContext.Provider value={value}>
            {children}

            <LoginModal
                isOpen={activeModal === LOGIN}
                onClose={closeModal}
                onSwitchRegister={openRegister}
            />
            <RegisterModal
                isOpen={activeModal === REGISTER}
                onClose={closeModal}
                onSwitchLogin={openLogin}
            />
            {/*
              Add future modals here, e.g.:
              <VerifyModal
                isOpen={activeModal === "verify"}
                onClose={closeModal}
                onSwitchLogin={openLogin}
              />
            */}
        </AuthModalContext.Provider>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, X, Loader } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appImages } from "@/constants/appInfo";
import { toast } from "@/components/ui/toast";
import { LoginSchema } from "@/components/auths/schema";
import { Separator } from "../ui/separator";
import { showCustomToast } from "../toast/CustomToast";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { loginUser } from "../../../redux/store/slices/auth/auth.action";
import { getErrorMessage } from "@/lib/helper";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchRegister?: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchRegister }: LoginModalProps) {
    const t = useTranslations("Login");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const loginSchema = LoginSchema(t);
    type LoginFormValues = z.infer<typeof loginSchema>;
    const dispatch = useAppDispatch();
    const loading = useAppSelector((state) => state.auth.loading);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
            setShowPassword(false);
        }
    }, [isOpen, reset]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const onSubmit = async (values: LoginFormValues) => {
        setIsLoading(true);
        try {
            await dispatch(loginUser(values));
            showCustomToast({
                message: t("success"),
                type: "success"
            })
            onClose();
        }
        catch (e) {
            const errorMsg = getErrorMessage(e);
            showCustomToast({
                message: errorMsg,
                type: "error"
            });
        }
        finally {
            setIsLoading(false);
        }
    };

    if (typeof window === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-100"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />

                    <motion.div
                        className="fixed inset-0 z-110 flex items-center justify-center p-4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <div
                            className="relative bg-card rounded-2xl w-full max-w-md p-4 shadow-2xl border border-border/60"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="flex justify-center mb-4">
                                <Image
                                    src={appImages.LogoMain}
                                    alt="SportHub"
                                    width={130}
                                    height={44}
                                    className="object-contain"
                                />
                            </div>
                            <Separator className="my-3 h-1 bg-[#E5E5E5]" />
                            <div className="mb-4">
                                <h2 className="font-heading text-center text-2xl font-bold text-foreground mb-1.5">
                                    {t("title")}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground/90 block">
                                        {t("email")}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground/80">
                                            <Mail className="h-5 w-5" strokeWidth={1.5} />
                                        </span>
                                        <Input
                                            type="email"
                                            placeholder={t("emailPlaceholder")}
                                            autoFocus
                                            {...register("email")}
                                            className={`h-12 pl-11 pr-4 bg-background border-input focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all rounded-lg text-sm w-full ${errors.email
                                                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                                                : ""
                                                }`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs font-semibold text-destructive mt-1 animate-in fade-in duration-300">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-foreground/90 block">
                                            {t("password")}
                                        </label>
                                        <Link
                                            href="/forgot-password"
                                            onClick={onClose}
                                            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                                        >
                                            {t("forgotPassword")}
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground/80">
                                            <Lock className="h-5 w-5" strokeWidth={1.5} />
                                        </span>
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder={t("passwordPlaceholder")}
                                            {...register("password")}
                                            className={`h-12 pl-11 pr-12 bg-background border-input focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all rounded-lg text-sm w-full ${errors.password
                                                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                                                : ""
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                                            ) : (
                                                <Eye className="h-5 w-5" strokeWidth={1.5} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-xs font-semibold text-destructive mt-1 animate-in fade-in duration-300">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-primary cursor-pointer text-primary-foreground font-semibold text-sm rounded-lg hover:bg-primary/95 transition-all shadow-md active:translate-y-px"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader className="h-4 w-4 animate-spin" />
                                            {t("submit")}
                                        </span>
                                    ) : t("submit")}
                                </Button>
                            </form>

                            <div className="relative flex py-5 items-center">
                                <div className="grow border-t border-border/80" />
                                <span className="shrink mx-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    {t("orContinueWith")}
                                </span>
                                <div className="grow border-t border-border/80" />
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-12 cursor-pointer border-border/80 font-medium text-foreground/80 text-sm hover:bg-muted gap-2.5 rounded-lg flex items-center justify-center transition-all active:translate-y-px"
                                onClick={() => {
                                    showCustomToast({ message: "Google login is not implemented yet", type: "error" });
                                }}
                            >
                                <img src={appImages.Google.src} alt="Google" className="h-5 w-5" />
                                {t("google")}
                            </Button>

                            <p className="mt-6 text-center text-sm text-muted-foreground">
                                {t("dontHaveAccount")}{" "}
                                {onSwitchRegister ? (
                                    <button
                                        type="button"
                                        onClick={onSwitchRegister}
                                        className="font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                                    >
                                        {t("register")}
                                    </button>
                                ) : (
                                    <Link
                                        href="/register"
                                        onClick={onClose}
                                        className="font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                                    >
                                        {t("register")}
                                    </Link>
                                )}
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
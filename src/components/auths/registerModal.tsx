"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, X, User, Phone } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appImages } from "@/constants/appInfo";
import { useRegister } from "@/features/auths/hooks/useRegister";
import { Separator } from "../ui/separator";
import { RegisterSchema } from "@/components/auths/schema";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchLogin?: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchLogin }: RegisterModalProps) {
    const t = useTranslations("Register");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const registerSchema = RegisterSchema(t);
    type RegisterFormValues = z.infer<typeof registerSchema>;

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
        },
    });

    const registerMutation = useRegister(() => {
        onSwitchLogin?.();
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
            setShowPassword(false);
            setShowConfirmPassword(false);
        }
    }, [isOpen, reset]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const onSubmit = (values: RegisterFormValues) => {
        registerMutation.mutate({
            fullName: values.fullName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            password: values.password,
        });
    };

    const inputBase =
        "h-10 bg-background dark:bg-[#0F172A] border-input focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all rounded-lg text-sm w-full";
    const inputError =
        "border-destructive focus:border-destructive focus:ring-destructive/20";

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
                        className="fixed inset-0 z-110 flex items-center justify-center p-4 overflow-y-auto"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <div
                            className="relative bg-card dark:bg-[#1E293B] rounded-2xl w-full max-w-md p-4 shadow-2xl border border-border/60 my-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="flex justify-center mb-3">
                                <Image
                                    src={appImages.LogoMain}
                                    alt="SportHub"
                                    width={130}
                                    height={44}
                                    className="object-contain"
                                />
                            </div>

                            <Separator className="my-3 h-1 bg-[#E5E5E5]" />


                            <div className="mb-2">
                                <h2 className="font-heading text-center text-xl font-bold text-foreground mb-1.5">
                                    {t("title")}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-foreground/90 block">
                                        {t("fullName")}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground/80">
                                            <User className="h-5 w-5" strokeWidth={1.5} />
                                        </span>
                                        <Input
                                            type="text"
                                            placeholder={t("fullNamePlaceholder")}
                                            autoFocus
                                            {...register("fullName")}
                                            className={`pl-11 pr-4 ${inputBase} ${errors.fullName ? inputError : ""}`}
                                        />
                                    </div>
                                    {errors.fullName && (
                                        <p className="text-xs font-semibold text-destructive mt-1 animate-in fade-in duration-300">
                                            {errors.fullName.message}
                                        </p>
                                    )}
                                </div>

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
                                            {...register("email")}
                                            className={`pl-11 pr-4 ${inputBase} ${errors.email ? inputError : ""}`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs font-semibold text-destructive mt-1 animate-in fade-in duration-300">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground/90 block">
                                        {t("phoneNumber")}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground/80">
                                            <Phone className="h-5 w-5" strokeWidth={1.5} />
                                        </span>
                                        <Controller
                                            name="phoneNumber"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    type="tel"
                                                    placeholder={t("phonePlaceholder")}
                                                    maxLength={10}
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(e.target.value.replace(/\D/g, ""))
                                                    }
                                                    className={`pl-11 pr-4 ${inputBase} ${errors.phoneNumber ? inputError : ""}`}
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors.phoneNumber && (
                                        <p className="text-xs font-semibold text-destructive mt-1 animate-in fade-in duration-300">
                                            {errors.phoneNumber.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground/90 block">
                                        {t("password")}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground/80">
                                            <Lock className="h-5 w-5" strokeWidth={1.5} />
                                        </span>
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder={t("passwordPlaceholder")}
                                            {...register("password")}
                                            className={`pl-11 pr-12 ${inputBase} ${errors.password ? inputError : ""}`}
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

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground/90 block">
                                        {t("confirmPassword")}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground/80">
                                            <Lock className="h-5 w-5" strokeWidth={1.5} />
                                        </span>
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder={t("confirmPasswordPlaceholder")}
                                            {...register("confirmPassword")}
                                            className={`pl-11 pr-12 ${inputBase} ${errors.confirmPassword ? inputError : ""}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                                            ) : (
                                                <Eye className="h-5 w-5" strokeWidth={1.5} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-xs font-semibold text-destructive mt-1 animate-in fade-in duration-300">
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={registerMutation.isPending}
                                    className="w-full h-12 bg-primary cursor-pointer text-primary-foreground font-semibold text-sm rounded-lg hover:bg-primary/95 transition-all shadow-md active:translate-y-px"
                                >
                                    {registerMutation.isPending ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                            </svg>
                                            {t("submit")}
                                        </span>
                                    ) : t("submit")}
                                </Button>
                            </form>

                            <p className="mt-6 text-center text-sm text-muted-foreground">
                                {t("alreadyHaveAccount")}{" "}
                                {onSwitchLogin ? (
                                    <button
                                        type="button"
                                        onClick={onSwitchLogin}
                                        className="font-semibold text-primary cursor-pointer hover:text-primary/80 transition-colors"
                                    >
                                        {t("login")}
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={onClose}
                                        className="font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                                    >
                                        {t("login")}
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

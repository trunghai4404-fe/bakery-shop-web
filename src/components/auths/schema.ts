import { z } from "zod";

export const LoginSchema = (t: any) =>
  z.object({
    email: z
      .email({ error: t("emailInvalid") })
      .min(1, { error: t("emailRequired") }),
    password: z
      .string()
      .min(1, { error: t("passwordRequired") })
      .min(6, { error: t("passwordMin") }),
  });

export const RegisterSchema = (t: any) =>
  z
    .object({
      fullName: z
        .string()
        .min(1, { error: t("fullNameRequired") })
        .min(2, { error: t("fullNameMin") }),
      email: z
        .email({ error: t("emailInvalid") })
        .min(1, { error: t("emailRequired") }),
      phoneNumber: z
        .string()
        .min(1, { error: t("phoneRequired") })
        .regex(/^(03|05|07|08|09)\d{8}$/, { error: t("phoneInvalid") }),
      password: z
        .string()
        .min(1, { error: t("passwordRequired") })
        .min(6, { error: t("passwordMin") }),
      confirmPassword: z
        .string()
        .min(1, { error: t("confirmPasswordRequired") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      error: t("passwordsMustMatch"),
      path: ["confirmPassword"],
    });

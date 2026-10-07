import { BAKERY_ACCESS_TOKEN, BAKERY_REFRESH_TOKEN } from "@/constants/cookies";
import { ERROR_CODE } from "@/constants/errorCodes";
import { JwtResponse } from "@/interface/auth";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";

export const setCookie = (name: string, value: any, expiresDays: number = 7) => {
    if (typeof window === "undefined") return;

    const valueStr = typeof value === "object" ? JSON.stringify(value) : String(value);

    const expires = isNaN(expiresDays) || expiresDays <= 0 ? 7 : expiresDays;

    Cookies.set(name, valueStr, {
        expires,
        path: "/",
        sameSite: "Lax",
        secure: window.location.protocol === "https:",
    });
};

export const setTokenAuth = (token: JwtResponse) => {
    setCookie(BAKERY_ACCESS_TOKEN, token.accessToken, token.accessTokenExpireAt);
    setCookie(BAKERY_REFRESH_TOKEN, token.refreshToken, token.refreshTokenExpireAt);
}

export const getCookie = (name: string) => {
    return Cookies.get(name);
};

export const removeCookie = (name: string) => {
    Cookies.remove(name, { path: "/" });
};

export const removeTokenAuth = () => {
    removeCookie(BAKERY_ACCESS_TOKEN);
    removeCookie(BAKERY_REFRESH_TOKEN);
    Cookies.remove(BAKERY_ACCESS_TOKEN);
    Cookies.remove(BAKERY_REFRESH_TOKEN);
};

export const formatCurrency = (amount?: number): string => {
    if (amount === undefined || amount === null) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

export const getErrorMessage = (error: any, fallbackMessage?: string): string => {
    const errorCode =
        error?.errors?.[0]?.code ||
        error?.response?.data?.errors?.[0]?.code ||
        error?.errorCode ||
        error?.response?.data?.errorCode;

    if (!errorCode) {
        return fallbackMessage ?? "Đã có lỗi xảy ra. Vui lòng thử lại.";
    }

    switch (errorCode) {
        case ERROR_CODE.EMAIL_ALREADY_EXISTS:
            return "Email đã tồn tại.";
        case ERROR_CODE.INVALID_CREDENTIALS:
            return "Email hoặc mật khẩu không đúng.";
        case ERROR_CODE.USER_NOT_FOUND:
            return "Tài khoản không tồn tại.";
        case ERROR_CODE.ACCOUNT_INACTIVE:
            return "Tài khoản đã bị vô hiệu hóa.";
        case ERROR_CODE.EXPIRED_TOKEN:
            return "Phiên đăng nhập đã hết hạn.";
        case ERROR_CODE.INVALID_TOKEN:
            return "Phiên đăng nhập không hợp lệ.";
        case ERROR_CODE.INVALID_REFRESH_TOKEN:
            return "Phiên đăng nhập không hợp lệ.";
        default:
            return fallbackMessage ?? "Đã có lỗi xảy ra. Vui lòng thử lại.";
    }
};

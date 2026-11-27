import { BAKERY_ACCESS_TOKEN, BAKERY_REFRESH_TOKEN } from "@/constants/cookies";
import { ERROR_CODE } from "@/constants/errorCodes";
import { JwtResponse } from "@/interface/auth";
import Cookies from "js-cookie";

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

export const DATE_FORMAT = {
    DATE: 'dd/mm/yyyy',
    DATE_TIME: 'dd/mm/yyyy HH:mm:ss',
    DATE_HOUR_MINUTE: 'dd/mm/yyyy HH:mm',
    DATE_MINUTE_SECOND: 'dd/mm/yyyy mm:ss',
} as const;

export type DateFormatType = (typeof DATE_FORMAT)[keyof typeof DATE_FORMAT];

export const formatTime = (
    value?: Date | string | number | null,
    pattern: DateFormatType | string = DATE_FORMAT.DATE_TIME
): string => {
    if (value === undefined || value === null || value === '') return '';

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return typeof value === 'string' ? value : '';
    }

    const pad = (n: number) => String(n).padStart(2, '0');
    const dd = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const yyyy = String(date.getFullYear());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return pattern
        .replace(/dd\/mm\/yyyy/g, `${dd}/${month}/${yyyy}`)
        .replace(/dd\/mm/g, `${dd}/${month}`)
        .replace(/mm\/yyyy/g, `${month}/${yyyy}`)
        .replace(/HH/g, hours)
        .replace(/mm/g, minutes)
        .replace(/ss/g, seconds);
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

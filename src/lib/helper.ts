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

export const getCookie = (name: string) => {
    return Cookies.get(name);
};

export const removeCookie = (name: string) => {
    Cookies.remove(name, { path: "/" });
};

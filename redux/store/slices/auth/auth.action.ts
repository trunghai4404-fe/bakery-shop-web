import { JwtResponse, LoginRequest, LoginResponse, RegisterRequest, User } from "@/interface/auth";
import { AppDispatch } from "../../stores";
import { logOut, setAuth, setAuthFail, setLoading, setUser } from "./authSlice.reducer";
import { authenticationApi } from "@/actions/auth";
import { getErrorMessage, removeTokenAuth } from "@/lib/helper";
import { openLoginModal } from "./authModal.reducer";
import { showCustomToast } from "@/components/toast/CustomToast";
import { BAKERY_ACCESS_TOKEN } from "@/constants/cookies";
import Cookies from "js-cookie";

export const loginUser = (data: LoginRequest) => {
    return async (dispatch: AppDispatch) => {
        dispatch(setLoading(true));
        try {
            const payload = {
                email: data.email,
                password: data.password
            }
            const response = await authenticationApi.login(payload);
            const dataResponse: LoginResponse = response.data;

            dispatch(setAuth(dataResponse));
            return true;
        } catch (e) {
            dispatch(setAuthFail());
            const errMsg = getErrorMessage(e, "Đăng nhập thất bại.");
            return Promise.reject(errMsg);
        }
    }
}

export const registerUser = (data: RegisterRequest) => {
    return async (dispatch: AppDispatch) => {
        dispatch(setLoading(true))
        try {
            const response = await authenticationApi.register(data);
            if (response.success) {
                dispatch(openLoginModal());
                dispatch(setLoading(false));
                return true;
            }
        } catch (e) {
            dispatch(setAuthFail());
            const errMsg = getErrorMessage(e);
            return Promise.reject(errMsg);
        }
    }
}

export const logOutUser = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(setLoading(true));
        try {
            await authenticationApi.logoutApi();
        } catch (e) {
            console.error("Logout API error:", e);
        } finally {
            removeTokenAuth();
            dispatch(logOut());
            dispatch(setLoading(false));
            return true;
        }
    }
}

export const fetchProfile = () => {
    return async (dispatch: AppDispatch) => {
        const token = Cookies.get(BAKERY_ACCESS_TOKEN);
        if (!token) return;

        dispatch(setLoading(true));
        try {
            const response = await authenticationApi.getProfile();
            if (response.data) {
                dispatch(setUser(response.data as User));
            }
        } catch (e) {
            dispatch(logOut());
        } finally {
            dispatch(setLoading(false));
        }
    }
}
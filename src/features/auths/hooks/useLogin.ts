import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi, getProfile } from "../auth.service";
import { setCookie } from "@/lib/helper";
import { useRouter } from "@/i18n/routing";
import { toast } from "@/components/ui/toast";
import { useLoading } from "@/context/LoadingContext";
import { ROUTES } from "@/constants/routes-path";
import QUERY_KEYS from "@/constants/queryKeys";
import { SPORTHUB_ACCESS_TOKEN, SPORTHUB_REFRESH_TOKEN, USER_LOGIN } from "@/constants/cookies";
import { useTranslations } from "next-intl";
import { showCustomToast } from "@/components/toast/CustomToast";

export const useLogin = (onSuccess?: () => void) => {
    const t = useTranslations("Login");
    const router = useRouter();
    const { setLoading } = useLoading();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: QUERY_KEYS.AUTH.LOGIN,
        mutationFn: loginApi,
        onMutate: () => {
            setLoading(true);
        },
        onSettled: () => {
            setLoading(false);
        },
        onSuccess: async (response) => {
            if (response && response.data) {
                const { accessToken, refreshToken, expiresInSeconds } = response.data;
                const days = expiresInSeconds && !isNaN(Number(expiresInSeconds))
                    ? Number(expiresInSeconds) / 86400
                    : 7;

                setCookie(SPORTHUB_ACCESS_TOKEN, accessToken, days);
                setCookie(SPORTHUB_REFRESH_TOKEN, refreshToken, 7);

                try {
                    const profileResponse = await queryClient.fetchQuery({
                        queryKey: QUERY_KEYS.PROFILE.ME,
                        queryFn: getProfile,
                    });

                    if (profileResponse && profileResponse.data) {
                        setCookie(USER_LOGIN, profileResponse.data, 7);
                    }
                } catch (profileError) {
                    console.error("Failed to fetch profile after login:", profileError);
                }

                showCustomToast({
                    message: t("success"),
                    type: "success",
                });

                onSuccess?.();
                router.push(ROUTES.HOME);
                return;
            }

            throw new Error((response?.message as any) || t("error"));
        },
        onError: (error: any) => {
            console.error("Login failed:", error);
            const errorMsg = error?.message || t("error");
            showCustomToast({
                message: t("error"),
                type: "error",
            });
        },
    });
};

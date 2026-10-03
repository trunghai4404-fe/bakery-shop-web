import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "../auth.service";
import { removeCookie } from "@/lib/helper";
import { useRouter } from "@/i18n/routing";
import { toast } from "@/components/ui/toast";
import { useLoading } from "@/context/LoadingContext";
import { ROUTES } from "@/constants/routes-path";
import QUERY_KEYS from "@/constants/queryKeys";
import { SPORTHUB_ACCESS_TOKEN, SPORTHUB_REFRESH_TOKEN, USER_LOGIN } from "@/constants/cookies";
import { useTranslations } from "next-intl";
import { showCustomToast } from "@/components/toast/CustomToast";

export const useLogout = () => {
  const t = useTranslations("Header");
  const router = useRouter();
  const { setLoading } = useLoading();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: QUERY_KEYS.AUTH.LOGOUT,
    mutationFn: logoutApi,
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    },
    onSuccess: () => {
      removeCookie(SPORTHUB_ACCESS_TOKEN);
      removeCookie(SPORTHUB_REFRESH_TOKEN);
      removeCookie(USER_LOGIN);

      queryClient.setQueryData(QUERY_KEYS.PROFILE.ME, null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE.ME });

      showCustomToast({
        message: t("logout"),
        type: "success",
      });

      router.push(ROUTES.HOME);
    },
    onError: (error: any) => {
      console.error("Logout failed:", error);

      removeCookie(SPORTHUB_ACCESS_TOKEN);
      removeCookie(SPORTHUB_REFRESH_TOKEN);
      removeCookie(USER_LOGIN);

      queryClient.setQueryData(QUERY_KEYS.PROFILE.ME, null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE.ME });

      showCustomToast({
        message: t("logout"),
        type: "success",
      });

      router.push(ROUTES.HOME);
    },
  });
};

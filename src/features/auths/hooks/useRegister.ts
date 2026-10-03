import { useMutation } from "@tanstack/react-query";
import { register } from "../auth.service";
import { toast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";
import { showCustomToast } from "@/components/toast/CustomToast";

export const useRegister = (onSuccess?: () => void) => {
    const t = useTranslations("Register");

    return useMutation({
        mutationFn: register,
        onSuccess: async (response) => {
            if (response && response.data !== undefined) {
                showCustomToast({
                    message: t("success"),
                    type: "success",
                });
                onSuccess?.();
                return;
            }
            throw new Error((response?.message as any) || t("error"));
        },
        onError: (error: any) => {
            console.error("Register failed:", error);
            const errorMsg = error?.message || t("error");
            showCustomToast({
                message: errorMsg,
                type: "error",
            });
        },
    });
};

import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "@/constants/queryKeys";
import { getProfile } from "../auth.service";
import Cookies from "js-cookie";
import { SPORTHUB_ACCESS_TOKEN } from "@/constants/cookies";

export const useMe = () => {
    return useQuery({
        queryKey: QUERY_KEYS.PROFILE.ME,
        queryFn: getProfile,
        staleTime: 1000 * 60 * 5,
        enabled: typeof window !== "undefined" && !!Cookies.get(SPORTHUB_ACCESS_TOKEN),
        retry: false,
    });
};
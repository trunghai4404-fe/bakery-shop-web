import callApi from "@/apis/handleApi"
import { ApiRouters } from "@/constants/api-routes"

export const ContentApi = {
    getBanners: async () => {
        const url = `${ApiRouters.BANNERS}/active`
        return callApi(url)
    }
}
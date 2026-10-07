
const API_URL = process.env.NEXT_PUBLIC_API_URL
const API = '/api/v1'
const BASE_URL = `${API_URL + API}`

export const ApiRouters = {
    AUTH: `${BASE_URL}/auth`,
    ME: `${BASE_URL}/users/me`,
    UPDATE_PROFILE: `${BASE_URL}/users/me`,
    CATEGORIES: `${BASE_URL}/categories`,
    PRODUCTS: `${BASE_URL}/products`,
}

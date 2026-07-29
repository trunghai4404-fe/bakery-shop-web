
const API_URL = process.env.NEXT_PUBLIC_API_URL
const API = '/api/v1'
const BASE_URL = `${API_URL + API}`

export const ApiRouters = {
    SEND_OTP: `${BASE_URL}/auth/send-otp`,
    VERIFY_OTP: `${BASE_URL}/auth/verify-otp`,
    REGISTER: `${BASE_URL}/auth/register`,
}

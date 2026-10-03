
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresInSeconds: number;
}

export interface Profile {
    id: string;
    email: string;
    phoneNumber: string;
    fullName: string;
    avatar?: string;
    gender?: string;
    dateOfBirth?: string;
    status?: string;
    isVerified: boolean;
    createdAt?: string;
    updatedAt?: string;
    lastLoginAt?: string;
    roles: string[];
}

export interface Register {
    email: string;
    phoneNumber: string;
    password: string;
    fullName: string;
}

export interface UpdateProfile {
    fullName?: string;
    phoneNumber?: string;
    gender?: string;
    dateOfBirth?: string;
}
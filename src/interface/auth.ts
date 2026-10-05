
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    jwtResponse: JwtResponse;
    user: User;
}

export interface JwtResponse {
    accessToken: string;
    accessTokenExpireAt: number;
    refreshToken: string;
    refreshTokenExpireAt: number;
}
export interface User {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    isActive: boolean;
    sex: string;
    lastLoginAt: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    deletedAt: string;
    roles: string[];
    permissions: string[];
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

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
}

export interface UpdateProfile {
    fullName?: string;
    phoneNumber?: string;
    gender?: string;
    dateOfBirth?: string;
}
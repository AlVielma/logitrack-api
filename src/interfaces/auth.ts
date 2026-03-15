export interface LoginRequest {
    email: string;
    password: string;
}

export interface VerifyOtpRequest {
    email: string;
    code: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        phone?: string | null;
        photoUrl?: string | null;
    }
}

export interface LoginResponse {
    message: string;
}

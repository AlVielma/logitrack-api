import prisma from "../configs/database";
import { sendOTP } from "../utils/email";
import { LoginRequest, VerifyOtpRequest, AuthResponse, LoginResponse } from "../interfaces/auth";
import { Response } from "../interfaces/response";
import { comparePassword, hashPassword } from "../utils/password";
import { generateToken } from "../utils/jwt";

export class AuthService {
    static async login(data: LoginRequest): Promise<Response> {
        const { email, password } = data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { success: false, message: "User not found", statusCode: 404 };
        }
        if (!user.isActive) {
            return { success: false, message: "User account is inactive", statusCode: 403 };
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return { success: false, message: "Invalid credentials", statusCode: 401 };
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await hashPassword(otp);

        await prisma.user.update({
            where: { id: user.id },
            data: { verificationCode: hashedOtp },
        });
        await sendOTP(user.email, otp, user.firstName);

        return { success: true, message: "Login successful, check your email for the verification code", statusCode: 200 };
    }

    static async verifyOtp(data: VerifyOtpRequest): Promise<Response<AuthResponse>> {
        const { email, code } = data;
        const user = await prisma.user.findUnique({ 
            where: { email },
            include: { role: true },
        });
        
        if (!user) {
            return { success: false, message: "User not found", statusCode: 404 };
        }
        
        if (!user.verificationCode) {
            return { success: false, message: "No verification code requested", statusCode: 400 };
        }
        
        const isOtpMatch = await comparePassword(code, user.verificationCode);
        if (!isOtpMatch) {
            return { success: false, message: "Invalid verification code", statusCode: 400 };
        }
        
        await prisma.user.update({
            where: { id: user.id },
            data: { verificationCode: null },
        });
        
        const token = generateToken({ id: user.id, email: user.email });
        
        return {
            success: true,
            message: "OTP verified correctly",
            statusCode: 200,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role.name,
                    phone: user.phone,
                    photoUrl: user.photoUrl,
                },
            }
        };
    }

}
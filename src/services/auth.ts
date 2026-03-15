import prisma from "../configs/database";
import { sendOTP } from "../utils/email";
import { LoginRequest, VerifyOtpRequest, AuthResponse, LoginResponse } from "../interfaces/auth";
import { comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";

export class AuthService {
    static async login(data: LoginRequest): Promise<LoginResponse> {
        const { email, password } = data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.isActive) {
            throw new Error("User is not active");
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid Credentials");
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await prisma.user.update({
            where: { id: user.id },
            data: { verificationCode: otp },
        });
        await sendOTP(user.email, otp, user.firstName);

        return { message: "Login successful, check your email for the verification code" };
    }

    static async verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
        const { email, code } = data;
        const user = await prisma.user.findUnique({ 
            where: { email },
            include: { role: true },
        });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.verificationCode !== code) {
            throw new Error("Invalid verification code");
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { verificationCode: null },
        });
        const token = generateToken({ id: user.id, email: user.email });
        return {
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
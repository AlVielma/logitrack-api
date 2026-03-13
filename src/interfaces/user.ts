import { Role } from "./rol";
export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    roleId: number;
    phone?: string;
    photoUrl?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    verificationCode?: string;
    role?: Role;
}
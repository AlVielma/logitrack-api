import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}
import { genSalt, hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return compare(password, hashedPassword);
};

export const signJwt = (userId: string): string => {
  return sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
};

export const verifyJwt = (token: string): any => {
  return verify(token, process.env.JWT_SECRET!);
};

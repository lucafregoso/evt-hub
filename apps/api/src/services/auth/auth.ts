import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_ME_IN_PRODUCTION_MINIMUM_32_CHARACTERS_LONG';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'CHANGE_ME_REFRESH_MINIMUM_32_CHARACTERS_LONG';

export interface UserPayload {
  userId: string;
  role: 'ADMIN' | 'ORGANIZER' | 'SPEAKER' | 'REVIEWER' | 'ATTENDEE';
}

export const generateTokens = (payload: UserPayload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): UserPayload => {
  return jwt.verify(token, JWT_SECRET) as UserPayload;
};

export const verifyRefreshToken = (token: string): UserPayload => {
  return jwt.verify(token, REFRESH_SECRET) as UserPayload;
};

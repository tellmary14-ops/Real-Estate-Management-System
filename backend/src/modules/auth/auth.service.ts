import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/generateToken.js";
import { omitPassword } from "../../utils/helpers.js";
import { logger } from "../../utils/logger.js";
import { authRepository } from "./auth.repository.js";

function refreshExpiryDate(): Date {
  const days = 7;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export const authService = {
  async register(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    logger.info({ step: "auth:register", email: input.email });
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) throw ApiError.conflict("An account with this email already exists");

    const password = await bcrypt.hash(input.password, env.bcryptSaltRounds);
    const user = await authRepository.createUser({ ...input, password, role: Role.USER });
    return this.issueTokens(user);
  },

  async login(email: string, password: string) {
    logger.info({ step: "auth:login", email });
    const user = await authRepository.findUserByEmail(email);
    if (!user || !user.isActive) throw ApiError.unauthorized("Invalid email or password");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw ApiError.unauthorized("Invalid email or password");

    return this.issueTokens(user);
  },

  async refresh(refreshToken: string) {
    logger.info({ step: "auth:refresh" });
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized("Your session has expired. Please sign in again");
    }

    const stored = await authRepository.findRefreshToken(refreshToken);
    if (!stored || stored.expiresAt < new Date()) {
      throw ApiError.unauthorized("Your session has expired. Please sign in again");
    }

    const user = await authRepository.findUserById(payload.sub);
    if (!user) throw ApiError.unauthorized();

    await authRepository.deleteRefreshToken(refreshToken);
    return this.issueTokens(user);
  },

  async logout(refreshToken?: string, userId?: string) {
    logger.info({ step: "auth:logout", userId });
    if (refreshToken) await authRepository.deleteRefreshToken(refreshToken);
    if (userId) await authRepository.deleteUserRefreshTokens(userId);
  },

  async me(userId: string) {
    const user = await authRepository.findUserById(userId);
    if (!user) throw ApiError.notFound("Account not found");
    return omitPassword(user);
  },

  async issueTokens(user: { id: string; email: string; role: Role; firstName: string; lastName: string; password: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    await authRepository.saveRefreshToken(user.id, refreshToken, refreshExpiryDate());

    return {
      user: omitPassword(user),
      accessToken,
      refreshToken,
    };
  },
};

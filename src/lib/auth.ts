// src/lib/auth.ts
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { cookies } from "next/headers";

import prisma from "./prisma";

export const SESSION_COOKIE_NAME = "session_token";
export const SESSION_DURATION_MS = 1000 * 60 * 60; // 1 hour

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId: number) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function deleteSession(token: string) {
  await prisma.session
    .delete({
      where: { token },
    })
    .catch(() => {
      // ignore missing sessions
    });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await deleteSession(token);
    return null;
  }

  return session.user;
}
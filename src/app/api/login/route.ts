// src/app/api/login/route.ts
import { NextResponse } from "next/server";

import {
  createSession,
  SESSION_COOKIE_NAME,
  verifyPassword,
} from "@/lib/auth";
import prisma from "@/lib/prisma";

type LoginPayload = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginPayload;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 },
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 },
      );
    }

    const { token, expiresAt } = await createSession(user.id);

    const response = NextResponse.json(
      { success: true, role: user.role, email: user.email },
      { status: 200 },
    );

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Failed to log in", error);
    return NextResponse.json(
      { error: "Unable to log in. Please try again." },
      { status: 500 },
    );
  }
}


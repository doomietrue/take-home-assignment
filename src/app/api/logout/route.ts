// src/app/api/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deleteSession, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      await deleteSession(token);
    }

    cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to logout", error);
    return NextResponse.json({ error: "Unable to logout." }, { status: 500 });
  }
}


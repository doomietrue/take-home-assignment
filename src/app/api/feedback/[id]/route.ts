// src/app/api/feedback/[id]/route.ts
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_: Request, context: RouteParams) {
  const { id: idParam } = await context.params;
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid feedback id." }, { status: 400 });
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (currentUser.role !== "ADMIN") {
    return NextResponse.json(
      { error: "You do not have permission to delete feedback." },
      { status: 403 },
    );
  }

  try {
    await prisma.feedback.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete feedback ${id}`, error);
    return NextResponse.json(
      { error: "Unable to delete feedback." },
      { status: 500 },
    );
  }
}


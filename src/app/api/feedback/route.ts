// src/app/api/feedback/route.ts
import { NextResponse } from "next/server";
import Sentiment from "sentiment";

import prisma from "@/lib/prisma";

const MAX_FEEDBACK_LENGTH = 1000;
const sentimentAnalyzer = new Sentiment();
type SentimentLabel = "Good" | "Bad" | "Neutral";

type FeedbackPayload = {
  text?: unknown;
};

const toSentimentLabel = (score: number): SentimentLabel => {
  if (score > 0) return "Good";
  if (score < 0) return "Bad";
  return "Neutral";
};

export async function GET() {
  try {
    const feedback = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(feedback, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch feedback", error);
    return NextResponse.json(
      { error: "Unable to fetch feedback" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload: FeedbackPayload = await request.json();
    const text = typeof payload.text === "string" ? payload.text.trim() : "";

    if (!text) {
      return NextResponse.json(
        { error: "Feedback text is required." },
        { status: 400 },
      );
    }

    if (text.length > MAX_FEEDBACK_LENGTH) {
      return NextResponse.json(
        { error: `Feedback must be ${MAX_FEEDBACK_LENGTH} characters or less.` },
        { status: 400 },
      );
    }

    const { score } = sentimentAnalyzer.analyze(text);
    const sentiment = toSentimentLabel(score);

    const feedback = await prisma.feedback.create({
      data: { text, sentiment },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("Failed to submit feedback", error);
    return NextResponse.json(
      { error: "Unable to submit feedback" },
      { status: 500 },
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { replicate, MODEL_ID, DEFAULT_PARAMS } from "@/lib/replicate";
import { composePrompt } from "@/lib/prompt-composer";
import type { MemoryFormData } from "@/types/memory";

const REQUIRED_FIELDS: (keyof MemoryFormData)[] = ["who", "where", "what"];
const OPTIONAL_FIELDS: (keyof MemoryFormData)[] = ["atmosphere", "details", "feeling"];
const MAX_FIELD_LENGTH = 1000;
const MAX_FEEDBACK_LENGTH = 500;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<MemoryFormData> & { feedback?: string };

    // Validate required fields
    for (const field of REQUIRED_FIELDS) {
      const value = body[field];
      if (!value || typeof value !== "string" || !value.trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
      if (value.length > MAX_FIELD_LENGTH) {
        return NextResponse.json(
          { error: `Field ${field} exceeds maximum length of ${MAX_FIELD_LENGTH} characters` },
          { status: 400 }
        );
      }
    }

    // Validate optional fields if provided
    for (const field of OPTIONAL_FIELDS) {
      const value = body[field];
      if (value && typeof value === "string" && value.length > MAX_FIELD_LENGTH) {
        return NextResponse.json(
          { error: `Field ${field} exceeds maximum length of ${MAX_FIELD_LENGTH} characters` },
          { status: 400 }
        );
      }
    }

    // Validate feedback if provided
    const feedback = body.feedback;
    if (feedback !== undefined) {
      if (typeof feedback !== "string") {
        return NextResponse.json(
          { error: "Feedback must be a string" },
          { status: 400 }
        );
      }
      if (feedback.length > MAX_FEEDBACK_LENGTH) {
        return NextResponse.json(
          { error: `Feedback exceeds maximum length of ${MAX_FEEDBACK_LENGTH} characters` },
          { status: 400 }
        );
      }
    }

    const memory: MemoryFormData = {
      who: body.who!,
      where: body.where!,
      what: body.what!,
      atmosphere: body.atmosphere || "",
      details: body.details || "",
      feeling: body.feeling || "",
    };
    const prompt = composePrompt(memory, feedback);

    const output = await replicate.run(MODEL_ID, {
      input: {
        prompt,
        ...DEFAULT_PARAMS,
      },
    });

    // Replicate returns an array of FileOutput objects (which extend String)
    let imageUrl: string;

    if (Array.isArray(output) && output.length > 0) {
      imageUrl = String(output[0]);
    } else if (typeof output === "string") {
      imageUrl = output;
    } else {
      imageUrl = String(output);
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Unexpected response from image generation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl, prompt });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image. Please try again." },
      { status: 500 }
    );
  }
}

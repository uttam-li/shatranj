import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

export async function POST(req: Request, res: Response) {
  console.log(req);
  try {
    const { userId } = auth();
    const body = await req.json();
    const { message } = await body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!message) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse(
        "Free trial has expired. Please upgrade to pro.",
        { status: 403 }
      );
    }

    const FreeTrial = await checkApiLimit();

    if (!FreeTrial) {
      new NextResponse("Free Trial has expired", { status: 403 });
    }
    await incrementApiLimit();
    new NextResponse("Increment Success.")
;
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

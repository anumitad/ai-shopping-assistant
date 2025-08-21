import { NextRequest, NextResponse } from "next/server";
import { scrapeAndSummarize } from "./scraper";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    console.log("Received URL:", url); 

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Call your scraper function
    const { reviews, summary } = await scrapeAndSummarize(url);

    return NextResponse.json({ reviews, summary });
  } catch (error: unknown) {
    let message = "Unknown error";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

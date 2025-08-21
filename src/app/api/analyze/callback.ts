import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { reviews, summary } = await req.json();
  
    // TODO: Save to database or cache if needed
  
    console.log("Received result from n8n:");
    console.log("Reviews:", reviews);
    console.log("Summary:", summary);
  
    return new NextResponse("ok", { status: 200 });
  }
  
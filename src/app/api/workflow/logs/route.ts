import { NextResponse } from "next/server";
import { getLogs } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const runId = searchParams.get("runId");

  if (!runId) {
    return NextResponse.json({ success: false, error: "Missing runId" }, { status: 400 });
  }

  const logs = getLogs(runId);
  return NextResponse.json({ success: true, logs });
}

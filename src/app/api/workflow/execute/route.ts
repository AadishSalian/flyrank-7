import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST(request: Request) {
  try {
    const { nodes, edges, startNodeId } = await request.json();
    const runId = Date.now().toString() + Math.floor(Math.random() * 1000);

    const result = await inngest.send({
      name: "workflow/execute",
      data: {
        nodes,
        edges,
        startNodeId,
        runId
      },
    });

    return NextResponse.json({ success: true, eventId: result.ids[0], runId });
  } catch (error: any) {
    console.error("Execution error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { inngest } from "./client";
import OpenAI from "openai";
import { saveLog } from "../lib/db";

const openai = new OpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama",
});
export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", triggers: [{ event: "workflow/execute" }] },
  async ({ event, step }) => {
    const { nodes, edges, startNodeId, runId } = event.data;

    let currentNodeId = startNodeId;
    const executionLog = [];

    while (currentNodeId) {
      const node = nodes.find((n: any) => n.id === currentNodeId);
      if (!node) break;

      await step.run(`log-start-${currentNodeId}`, async () => {
        saveLog(runId, { nodeId: currentNodeId, status: "started" });
      });

      const prompt = node.data?.prompt;
      if (!prompt) {
        await step.run(`log-fail-${currentNodeId}`, async () => {
          saveLog(runId, { nodeId: currentNodeId, status: "failed", error: "No prompt defined" });
        });
        break;
      }

      // Execute AI decision
      const decision = await step.run(`run-prompt-${currentNodeId}`, async () => {
        const response = await openai.chat.completions.create({
          model: "llama3", // using local ollama model
          messages: [
            {
              role: "system",
              content: "You are a decision node in an AI workflow. You must evaluate the user's prompt and respond with exactly 'YES' or 'NO'. No other text is permitted."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0,
        });

        const output = response.choices[0]?.message?.content?.trim().toUpperCase();
        return output === "YES" ? "YES" : "NO";
      });

      await step.run(`log-complete-${currentNodeId}`, async () => {
        saveLog(runId, { nodeId: currentNodeId, status: "completed", result: decision });
      });

      // Find next node based on decision
      const connectingEdge = edges.find(
        (e: any) => e.source === currentNodeId && e.sourceHandle === decision
      );

      if (connectingEdge) {
        currentNodeId = connectingEdge.target;
      } else {
        // No further connections
        break;
      }
    }

    return { executionLog };
  }
);

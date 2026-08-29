# Visual AI Workflow Builder

A full-stack, node-based visual workflow system that allows you to design, build, and execute AI-driven decision trees. Built with **Next.js**, **React Flow**, **Inngest**, and **Ollama**.

## 🚀 Features

- **Visual Node Editor:** Drag-and-drop canvas built with React Flow to easily map out logic.
- **AI Decision Nodes:** Each node evaluates a custom prompt and forces a binary `YES` or `NO` decision using local LLMs (via Ollama).
- **Background Execution:** Reliable workflow traversal and execution powered by Inngest.
- **Live Execution Tracking:** Real-time visual state updates—nodes highlight and edges animate as the AI traverses the path.
- **Execution Logs:** A built-in sidebar streams the live reasoning and branching logic of the AI.
- **Local Persistence:** Save and load your workflow structures directly from the browser.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React Flow, Tailwind CSS, Shadcn UI
- **Backend:** Next.js API Routes, Inngest
- **AI Integration:** OpenAI SDK pointed to local **Ollama** instances (Llama 3 / Mistral)

## 🏃‍♂️ Getting Started

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start the local LLM:**
   Ensure you have [Ollama](https://ollama.com) installed and start the model:
   \`\`\`bash
   ollama run llama3
   \`\`\`

3. **Start the Inngest Dev Server:**
   In a new terminal window, run the Inngest execution engine:
   \`\`\`bash
   npx inngest-cli@latest dev
   \`\`\`

4. **Start the Next.js App:**
   In another terminal, start the frontend:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) and start building your AI workflow!

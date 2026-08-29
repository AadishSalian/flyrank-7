<div align="center">
  <h1>✨ Visual AI Workflow System</h1>
  <p>A powerful, node-based visual editor for designing and executing AI decision trees, powered by <b>Next.js</b>, <b>React Flow</b>, and <b>Inngest</b>.</p>
</div>

<br />

## 🌟 Overview

The **Visual AI Workflow System** lets you build branching AI logic through an intuitive drag-and-drop interface. By connecting "AI Decision Nodes", you can map out complex logical flows. When executed, the system evaluates each node's prompt using a local LLM (via **Ollama**) to make a strict binary `YES` or `NO` decision, automatically determining the next step in the workflow.

## ✨ Core Features

- 🎨 **Visual Node Editor:** Drag, drop, and connect nodes easily using React Flow.
- 🧠 **Local AI Integration:** Uses local LLMs (like Llama 3) via Ollama for fast, free, and private inference.
- ⚙️ **Background Execution Engine:** Powered by Inngest to ensure reliable, step-by-step workflow traversal without timeouts.
- 📡 **Real-Time Visual State:** Watch your workflow execute live! Nodes highlight to indicate their processing state, and the exact path the AI chooses animates in blue.
- 📝 **Live Execution Logs:** A built-in sidebar streams the AI's reasoning, decisions, and execution status dynamically.
- 💾 **Local Persistence:** Your complex workflows are automatically saved to `localStorage` so you never lose your work.

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **UI / Canvas** | React Flow, Tailwind CSS, Shadcn UI |
| **Workflow Engine** | Inngest |
| **AI Integration** | OpenAI SDK, Ollama |

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Prerequisites
- Node.js (v18+)
- [Ollama](https://ollama.com/) installed and running on your machine.

### 2. Setup

Clone the repository and install dependencies:
```bash
git clone https://github.com/AadishSalian/flyrank-7.git
cd flyrank-7
npm install
```

### 3. Start the Local LLM
Open a terminal and start Ollama with the Llama 3 model (or your model of choice):
```bash
ollama run llama3
```

### 4. Run the Dev Servers
You will need two terminals to run both the frontend and the execution engine.

**Terminal 1:** Start the Inngest Dev Server (handles background execution)
```bash
npx inngest-cli@latest dev
```

**Terminal 2:** Start the Next.js App
```bash
npm run dev
```

### 5. Build Your Workflow
Visit [http://localhost:3000](http://localhost:3000). 
Add some nodes, write your prompts, connect the `YES`/`NO` branches, and click **Run Workflow**!

---

<div align="center">
  <i>Built with Next.js & Inngest</i>
</div>

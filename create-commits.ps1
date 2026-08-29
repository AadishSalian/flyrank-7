Remove-Item -Recurse -Force .git
git init

git add package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs components.json README.md .gitignore public/ src/app/globals.css src/app/layout.tsx src/app/favicon.ico src/lib/utils.ts src/components/ui/
git commit -m "Phase 1: Initial Next.js setup with Shadcn and dependencies"

git add .env.local AGENTS.md CLAUDE.md
git commit -m "Phase 1: Environment and project configurations"

git add src/app/page.tsx
git commit -m "Phase 2: Add React Flow foundation and UI layout"

git add src/components/DecisionNode.tsx
git commit -m "Phase 2: Create custom AI Decision node"

git add src/inngest/client.ts src/app/api/inngest/
git commit -m "Phase 3: Set up Inngest client and execution logic"

git add src/inngest/functions.ts src/app/api/workflow/execute/
git commit -m "Phase 3: Integrate Ollama AI for YES/NO branching"

git add src/lib/store.ts src/lib/db.ts src/app/api/workflow/logs/
git commit -m "Phase 4: Add execution logs panel and save/load features"

git add .
git commit -m "Phase 4: Implement visual execution state and animated edges"

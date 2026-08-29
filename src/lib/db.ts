import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'workflow-db.json');

function readDb() {
  if (!fs.existsSync(dbPath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeDb(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function saveLog(runId: string, logEntry: any) {
  const db = readDb();
  if (!db[runId]) db[runId] = [];
  db[runId].push({ ...logEntry, timestamp: Date.now() });
  writeDb(db);
}

export function getLogs(runId: string) {
  const db = readDb();
  return db[runId] || [];
}

"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DecisionNode from '@/components/DecisionNode';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isExecuting, setIsExecuting] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [logs, setLogs] = useState<any[]>([]);

  // Load from local storage
  useEffect(() => {
    const savedNodes = localStorage.getItem('workflow-nodes');
    const savedEdges = localStorage.getItem('workflow-edges');
    if (savedNodes) setNodes(JSON.parse(savedNodes));
    if (savedEdges) setEdges(JSON.parse(savedEdges));
  }, []);

  const saveWorkflow = () => {
    localStorage.setItem('workflow-nodes', JSON.stringify(nodes));
    localStorage.setItem('workflow-edges', JSON.stringify(edges));
    alert('Workflow saved!');
  };

  const nodeTypes = useMemo(() => ({ decision: DecisionNode }), []);

  const addDecisionNode = useCallback(() => {
    const newNode: Node = {
      id: uuidv4(),
      type: 'decision',
      position: { x: 100, y: 100 + nodes.length * 50 },
      data: {
        prompt: '',
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const runWorkflow = async () => {
    if (nodes.length === 0) return;
    setIsExecuting(true);
    setLogs([]);
    
    // clear node styles
    setNodes((nds) => nds.map((n) => ({ ...n, style: { ...n.style, opacity: 1, border: 'none' } })));
    setEdges((eds) => eds.map((e) => ({ ...e, animated: false, style: { stroke: '#b1b1b7' } })));

    const rootNodes = nodes.filter(
      (node) => !edges.some((edge) => edge.target === node.id)
    );
    
    const startNodeId = rootNodes.length > 0 ? rootNodes[0].id : nodes[0].id;

    try {
      const response = await fetch('/api/workflow/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges, startNodeId }),
      });
      const result = await response.json();
      setRunId(result.runId);
    } catch (e) {
      console.error(e);
      alert('Failed to start workflow.');
      setIsExecuting(false);
    }
  };

  // Poll for logs
  useEffect(() => {
    if (!runId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/workflow/logs?runId=${runId}`);
        const data = await res.json();
        if (data.success && data.logs) {
          setLogs(data.logs);
          
          // Update visual state
          setNodes((nds) => nds.map((n) => {
            const nodeLogs = data.logs.filter((l: any) => l.nodeId === n.id);
            if (nodeLogs.length > 0) {
              const latest = nodeLogs[nodeLogs.length - 1];
              let borderColor = 'transparent';
              if (latest.status === 'started') borderColor = '#eab308'; // yellow
              else if (latest.status === 'completed') borderColor = '#22c55e'; // green
              else if (latest.status === 'failed') borderColor = '#ef4444'; // red
              return { ...n, style: { ...n.style, outline: `3px solid ${borderColor}` } };
            }
            return n;
          }));

          setEdges((eds) => eds.map((e) => {
            const sourceLog = data.logs.find((l: any) => l.nodeId === e.source && l.status === 'completed');
            if (sourceLog && sourceLog.result === e.sourceHandle) {
              return { ...e, animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } };
            }
            return e;
          }));

          // Check if workflow is finished (a node completed but has no connecting edge)
          const latestLog = data.logs[data.logs.length - 1];
          if (latestLog?.status === 'completed' || latestLog?.status === 'failed') {
            const hasNext = edges.some((e) => e.source === latestLog.nodeId && e.sourceHandle === latestLog.result);
            if (!hasNext || latestLog.status === 'failed') {
              setIsExecuting(false);
              clearInterval(interval);
            }
          }
        }
      } catch (err) {}
    }, 1000);
    return () => clearInterval(interval);
  }, [runId, edges, setNodes, setEdges]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="flex flex-shrink-0 items-center justify-between px-6 py-4 border-b bg-white z-10">
        <h1 className="text-xl font-bold">Visual AI Workflow</h1>
        <div className="flex gap-2">
          <Button onClick={saveWorkflow} variant="outline">Save</Button>
          <Button onClick={addDecisionNode} variant="outline">Add Node</Button>
          <Button onClick={runWorkflow} disabled={isExecuting || nodes.length === 0}>
            {isExecuting ? 'Running...' : 'Run Workflow'}
          </Button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
          </ReactFlow>
        </div>
        
        {/* Logs Panel */}
        <div className="w-80 border-l bg-white flex flex-col h-full absolute right-0 top-0 shadow-xl z-20">
          <div className="p-4 border-b font-semibold bg-slate-50 flex-shrink-0">
            Execution Logs
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {logs.length === 0 && <p className="text-sm text-slate-400">No logs yet.</p>}
            {logs.map((log, i) => (
              <div key={i} className="text-sm border rounded-md p-3">
                <div className="font-medium mb-1">Node: {log.nodeId.substring(0, 8)}...</div>
                <div className="text-xs text-slate-500">Status: <span className="font-semibold text-slate-700">{log.status}</span></div>
                {log.result && <div className="text-xs text-slate-500 mt-1">Decision: <span className="font-bold text-blue-600">{log.result}</span></div>}
                {log.error && <div className="text-xs text-red-500 mt-1">{log.error}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

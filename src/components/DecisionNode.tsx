import { memo } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";

const DecisionNode = ({ id, data, isConnectable }: any) => {
  const { updateNodeData } = useReactFlow();

  return (
    <div className="bg-white border-2 border-slate-200 rounded-md shadow-sm w-64">
      <div className="bg-slate-100 p-2 border-b border-slate-200 rounded-t-md font-semibold text-sm text-slate-700">
        AI Decision
      </div>
      <div className="p-4">
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Prompt
        </label>
        <textarea
          className="w-full text-sm border-slate-200 rounded-md p-2 border focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          rows={3}
          value={data.prompt || ""}
          onChange={(e) => updateNodeData(id, { ...data, prompt: e.target.value })}
          placeholder="e.g., Is this a support request?"
        />
      </div>
      
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-400"
      />

      {/* Output Handle YES */}
      <div className="relative h-6 flex justify-between px-2 text-xs font-medium text-slate-500 border-t border-slate-100 bg-slate-50 rounded-b-md">
        <div className="flex items-center">
          <Handle
            type="source"
            position={Position.Bottom}
            id="YES"
            style={{ left: '25%' }}
            isConnectable={isConnectable}
            className="w-3 h-3 bg-green-500"
          />
          <span className="absolute left-[25%] -translate-x-1/2 bottom-1 text-[10px] text-green-600">YES</span>
        </div>
        
        <div className="flex items-center">
          <Handle
            type="source"
            position={Position.Bottom}
            id="NO"
            style={{ left: '75%' }}
            isConnectable={isConnectable}
            className="w-3 h-3 bg-red-500"
          />
          <span className="absolute left-[75%] -translate-x-1/2 bottom-1 text-[10px] text-red-600">NO</span>
        </div>
      </div>
    </div>
  );
};

export default memo(DecisionNode);

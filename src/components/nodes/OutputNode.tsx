import React from 'react';
import { Handle, Position } from 'reactflow';
import * as LucideIcons from 'lucide-react';

export function OutputNode({ data }: { data: any }) {
  const Icon = (LucideIcons as any)[
    data.icon.split('-').map((word: string) => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')
  ];

  return (
    <div className="group relative">
      <div className="relative bg-gradient-to-br from-green-600 to-emerald-600 border-2 border-green-400 rounded-xl px-5 py-4 min-w-[180px] shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-105">
        <Handle 
          type="target" 
          position={Position.Left} 
          className="w-3 h-3 bg-green-300 border-2 border-white" 
        />
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-green-500 rounded-lg">
            {Icon && <Icon className="w-5 h-5 text-white" />}
          </div>
          <div>
            <div className="text-white mb-0.5">{data.label}</div>
            <div className="text-green-100 text-xs">Output</div>
          </div>
        </div>
      </div>
    </div>
  );
}
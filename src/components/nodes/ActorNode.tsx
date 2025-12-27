import React from 'react';
import { Handle, Position } from 'reactflow';
import * as LucideIcons from 'lucide-react';

export function ActorNode({ data }: { data: any }) {
  const Icon = (LucideIcons as any)[
    data.icon.split('-').map((word: string) => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')
  ];

  return (
    <div className="group relative">
      <div className="relative bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-500 rounded-xl px-4 py-3 min-w-[160px] shadow-xl hover:shadow-2xl transition-all hover:scale-105">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-600 rounded-lg">
            {Icon && <Icon className="w-4 h-4 text-slate-200" />}
          </div>
          <div className="text-white text-sm">{data.label}</div>
        </div>
        <Handle 
          type="source" 
          position={Position.Right} 
          className="w-3 h-3 bg-slate-400 border-2 border-white"
        />
      </div>
    </div>
  );
}
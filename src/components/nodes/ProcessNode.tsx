import React from 'react';
import { Handle, Position } from 'reactflow';
import * as LucideIcons from 'lucide-react';

const colorMap: Record<string, { gradient: string; blur: string; border: string; icon: string; glow: string }> = {
  slate: { 
    gradient: 'from-slate-600 to-slate-700', 
    blur: 'from-slate-400 to-slate-500',
    border: 'border-slate-400', 
    icon: 'bg-slate-500',
    glow: 'hover:shadow-slate-400/30'
  },
  blue: { 
    gradient: 'from-blue-500 to-blue-600', 
    blur: 'from-blue-300 to-blue-400',
    border: 'border-blue-300', 
    icon: 'bg-blue-400',
    glow: 'hover:shadow-blue-400/40'
  },
  green: { 
    gradient: 'from-green-500 to-green-600', 
    blur: 'from-green-300 to-green-400',
    border: 'border-green-300', 
    icon: 'bg-green-400',
    glow: 'hover:shadow-green-400/40'
  },
  orange: { 
    gradient: 'from-orange-500 to-orange-600', 
    blur: 'from-orange-300 to-orange-400',
    border: 'border-orange-300', 
    icon: 'bg-orange-400',
    glow: 'hover:shadow-orange-400/40'
  },
};

export function ProcessNode({ data }: { data: any }) {
  const Icon = (LucideIcons as any)[
    data.icon.split('-').map((word: string) => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')
  ];

  const colors = colorMap[data.color] || colorMap.slate;

  return (
    <div className="group relative">
      <div className={`relative bg-gradient-to-br ${colors.gradient} border-2 ${colors.border} rounded-xl px-4 py-3 min-w-[180px] shadow-xl ${colors.glow} transition-all hover:scale-105`}>
        <Handle 
          type="target" 
          position={Position.Left} 
          className="w-3 h-3 bg-white border-2 border-slate-300" 
        />
        <div className="flex items-center gap-2.5">
          <div className={`p-2 ${colors.icon} rounded-lg`}>
            {Icon && <Icon className="w-4 h-4 text-white" />}
          </div>
          <div className="text-white text-sm">{data.label}</div>
        </div>
        <Handle 
          type="source" 
          position={Position.Right} 
          className="w-3 h-3 bg-white border-2 border-slate-300" 
        />
      </div>
    </div>
  );
}
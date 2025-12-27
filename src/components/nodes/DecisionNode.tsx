import React from 'react';
import { Handle, Position } from 'reactflow';
import * as LucideIcons from 'lucide-react';

export function DecisionNode({ data }: { data: any }) {
  const Icon = (LucideIcons as any)[
    data.icon.split('-').map((word: string) => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')
  ];

  return (
    <div className="relative group" style={{ width: 160, height: 160 }}>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 bg-orange-300 border-2 border-white z-20" 
        style={{ top: '50%' }} 
      />
      
      {/* Diamond shape */}
      <div 
        className="absolute bg-gradient-to-br from-orange-500 to-amber-500 border-2 border-orange-300 shadow-2xl group-hover:shadow-orange-400/50 transition-all"
        style={{
          width: 110,
          height: 110,
          transform: 'rotate(45deg)',
          left: 25,
          top: 25,
        }}
      />
      
      {/* Content */}
      <div 
        className="absolute flex flex-col items-center justify-center gap-2"
        style={{
          width: 160,
          height: 160,
          zIndex: 10,
        }}
      >
        <div className="p-2 bg-orange-400 rounded-lg">
          {Icon && <Icon className="w-5 h-5 text-white" />}
        </div>
        <div className="text-white text-xs text-center px-2 leading-tight">{data.label}</div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right"
        className="w-3 h-3 bg-orange-300 border-2 border-white z-20" 
        style={{ top: '50%' }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="bottom"
        className="w-3 h-3 bg-orange-300 border-2 border-white z-20" 
        style={{ left: '50%' }} 
      />
    </div>
  );
}
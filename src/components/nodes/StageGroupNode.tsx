import React from 'react';

export function StageGroupNode({ data }: { data: any }) {
  return (
    <div 
      style={{ 
        width: data.width, 
        height: data.height,
        pointerEvents: 'none',
        background: 'transparent'
      }}
    >
      <div className="text-slate-400 text-xs uppercase tracking-wider p-3">
        {data.label}
      </div>
    </div>
  );
}
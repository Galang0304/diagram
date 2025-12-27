import React from 'react';
import { Users, Server, CheckSquare, GitBranch } from 'lucide-react';

export function Legend() {
  const items = [
    { icon: Users, label: 'Aktor', color: 'from-slate-500 to-slate-600' },
    { icon: Server, label: 'Blockchain', color: 'from-blue-500 to-cyan-500' },
    { icon: CheckSquare, label: 'Output', color: 'from-green-500 to-emerald-500' },
    { icon: GitBranch, label: 'Keputusan', color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="absolute bottom-6 left-6 z-10">
      <div className="bg-slate-800 border border-slate-600 rounded-2xl p-4 shadow-2xl">
        <div className="text-white text-xs mb-3 opacity-70">Legenda</div>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`p-2 bg-gradient-to-br ${item.color} rounded-lg shadow-lg`}>
                <item.icon className="w-3 h-3 text-white" />
              </div>
              <span className="text-white text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
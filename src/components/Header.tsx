import React from 'react';
import { Blocks, Info } from 'lucide-react';

export function Header() {
  return (
    <div className="absolute top-6 left-6 z-10 max-w-xl">
      <div className="bg-slate-800 border border-slate-600 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
            <Blocks className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-white text-2xl mb-2">
              Diagram Alur Kontrak Konstruksi
            </h1>
            <p className="text-blue-200 text-sm leading-relaxed">
              Visualisasi proses kontrak konstruksi berbasis blockchain dari tahap perencanaan hingga serah terima dengan audit trail yang transparan
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-xs text-blue-300 bg-blue-900 px-3 py-2 rounded-lg">
          <Info className="w-4 h-4" />
          <span>8 Tahapan • Smart Contract • Distributed Ledger • Immutable Records</span>
        </div>
      </div>
    </div>
  );
}
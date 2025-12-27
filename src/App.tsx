import React from 'react';
import { FlowDiagram } from './components/FlowDiagram';

export default function App() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <FlowDiagram />
    </div>
  );
}

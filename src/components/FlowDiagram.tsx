import React, { useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ActorNode } from './nodes/ActorNode';
import { BlockchainNode } from './nodes/BlockchainNode';
import { OutputNode } from './nodes/OutputNode';
import { ProcessNode } from './nodes/ProcessNode';
import { DecisionNode } from './nodes/DecisionNode';
import { StageGroupNode } from './nodes/StageGroupNode';
import { Legend } from './Legend';

const nodeTypes = {
  actor: ActorNode,
  blockchain: BlockchainNode,
  output: OutputNode,
  process: ProcessNode,
  decision: DecisionNode,
  stageGroup: StageGroupNode,
};

const initialNodes: Node[] = [
  // Stage Groups (Background)
  { id: 'group-1', type: 'stageGroup', position: { x: 250, y: 80 }, data: { label: 'Tahap 1: Perencanaan', width: 320, height: 100 }, draggable: false, selectable: false, zIndex: -1 },
  { id: 'group-2', type: 'stageGroup', position: { x: 250, y: 220 }, data: { label: 'Tahap 2: Pemilihan', width: 320, height: 100 }, draggable: false, selectable: false, zIndex: -1 },
  { id: 'group-3', type: 'stageGroup', position: { x: 250, y: 360 }, data: { label: 'Tahap 3: Kontrak', width: 320, height: 100 }, draggable: false, selectable: false, zIndex: -1 },
  { id: 'group-4', type: 'stageGroup', position: { x: 250, y: 500 }, data: { label: 'Tahap 4: Pelaksanaan', width: 320, height: 100 }, draggable: false, selectable: false, zIndex: -1 },
  { id: 'group-5', type: 'stageGroup', position: { x: 250, y: 640 }, data: { label: 'Tahap 5: Verifikasi', width: 320, height: 100 }, draggable: false, selectable: false, zIndex: -1 },
  { id: 'group-6', type: 'stageGroup', position: { x: 1050, y: 640 }, data: { label: 'Tahap 6: Pembayaran', width: 350, height: 100 }, draggable: false, selectable: false, zIndex: -1 },
  { id: 'group-7', type: 'stageGroup', position: { x: 800, y: 80 }, data: { label: 'Tahap 7: Addendum', width: 380, height: 220 }, draggable: false, selectable: false, zIndex: -1 },
  { id: 'group-8', type: 'stageGroup', position: { x: 1300, y: 780 }, data: { label: 'Tahap 8: Serah Terima', width: 180, height: 280 }, draggable: false, selectable: false, zIndex: -1 },

  // Layer 1: Actors (Left side)
  { id: 'perencana', type: 'actor', position: { x: 30, y: 110 }, data: { label: 'Perencana', icon: 'pen-tool' }, zIndex: 10 },
  { id: 'ulp-pokja', type: 'actor', position: { x: 30, y: 250 }, data: { label: 'ULP-Pokja', icon: 'clipboard-list' }, zIndex: 10 },
  { id: 'ppk', type: 'actor', position: { x: 30, y: 370 }, data: { label: 'PPK', icon: 'user-check' }, zIndex: 10 },
  { id: 'kontraktor', type: 'actor', position: { x: 30, y: 450 }, data: { label: 'Kontraktor', icon: 'hard-hat' }, zIndex: 10 },
  { id: 'pengawas', type: 'actor', position: { x: 30, y: 670 }, data: { label: 'Pengawas', icon: 'search' }, zIndex: 10 },

  // Tahap 1: Perencanaan
  { id: 'input-kak', type: 'process', position: { x: 270, y: 110 }, data: { label: 'Input KAK RAB DED', icon: 'folder-plus', color: 'slate' }, zIndex: 10 },
  { id: 'simpan-ledger-1', type: 'process', position: { x: 480, y: 110 }, data: { label: 'Simpan ke Ledger', icon: 'save', color: 'blue' }, zIndex: 10 },

  // Tahap 2: Pemilihan
  { id: 'seleksi', type: 'process', position: { x: 270, y: 250 }, data: { label: 'Seleksi Penyedia', icon: 'list', color: 'slate' }, zIndex: 10 },
  { id: 'simpan-ledger-2', type: 'process', position: { x: 480, y: 250 }, data: { label: 'Rekam Hasil', icon: 'award', color: 'blue' }, zIndex: 10 },

  // Tahap 3: Kontrak
  { id: 'tanda-tangan', type: 'process', position: { x: 270, y: 390 }, data: { label: 'Tanda Tangan', icon: 'edit-3', color: 'slate' }, zIndex: 10 },
  { id: 'deploy-contract', type: 'process', position: { x: 480, y: 390 }, data: { label: 'Deploy Contract', icon: 'upload-cloud', color: 'blue' }, zIndex: 10 },

  // Tahap 4: Pelaksanaan
  { id: 'input-progres', type: 'process', position: { x: 270, y: 530 }, data: { label: 'Input Progres', icon: 'trending-up', color: 'slate' }, zIndex: 10 },
  { id: 'catat-event', type: 'process', position: { x: 480, y: 530 }, data: { label: 'Catat Event', icon: 'bell', color: 'blue' }, zIndex: 10 },

  // Tahap 5: Verifikasi
  { id: 'verifikasi', type: 'process', position: { x: 270, y: 670 }, data: { label: 'Verifikasi', icon: 'check-circle', color: 'slate' }, zIndex: 10 },
  { id: 'validasi-ok', type: 'process', position: { x: 480, y: 670 }, data: { label: 'Validasi', icon: 'thumbs-up', color: 'blue' }, zIndex: 10 },

  // Layer 2: Blockchain (Center)
  { id: 'smart-contract', type: 'blockchain', position: { x: 750, y: 350 }, data: { label: 'Smart Contract', icon: 'file-code' }, zIndex: 10 },
  { id: 'ledger', type: 'blockchain', position: { x: 750, y: 480 }, data: { label: 'Distributed Ledger', icon: 'database' }, zIndex: 10 },
  { id: 'validator', type: 'blockchain', position: { x: 750, y: 610 }, data: { label: 'Validator Network', icon: 'shield-check' }, zIndex: 10 },

  // Tahap 6: Pembayaran
  { id: 'cek-progres', type: 'process', position: { x: 1070, y: 670 }, data: { label: 'Cek Progres', icon: 'cpu', color: 'blue' }, zIndex: 10 },
  { id: 'bayar-termin', type: 'process', position: { x: 1270, y: 670 }, data: { label: 'Bayar Termin', icon: 'zap', color: 'green' }, zIndex: 10 },

  // Tahap 7: Addendum
  { id: 'addendum', type: 'decision', position: { x: 820, y: 120 }, data: { label: 'Perlu Addendum?', icon: 'git-branch' }, zIndex: 10 },
  { id: 'update-kontrak', type: 'process', position: { x: 1010, y: 110 }, data: { label: 'Update Kontrak', icon: 'refresh-cw', color: 'orange' }, zIndex: 10 },
  { id: 'versi-baru', type: 'process', position: { x: 1010, y: 200 }, data: { label: 'Versi Baru', icon: 'git-commit', color: 'blue' }, zIndex: 10 },

  // Tahap 8: Serah Terima
  { id: 'pho-fho', type: 'process', position: { x: 1320, y: 810 }, data: { label: 'PHO-FHO', icon: 'package', color: 'slate' }, zIndex: 10 },
  { id: 'selesai', type: 'process', position: { x: 1320, y: 900 }, data: { label: 'Selesai', icon: 'flag', color: 'green' }, zIndex: 10 },
  { id: 'permanen', type: 'process', position: { x: 1320, y: 990 }, data: { label: 'Arsip Permanen', icon: 'lock', color: 'blue' }, zIndex: 10 },

  // Layer 3: Output (Right side)
  { id: 'pembayaran', type: 'output', position: { x: 1570, y: 670 }, data: { label: 'Pembayaran', icon: 'dollar-sign' }, zIndex: 10 },
  { id: 'status', type: 'output', position: { x: 1570, y: 900 }, data: { label: 'Status Proyek', icon: 'clipboard-check' }, zIndex: 10 },
  { id: 'audit-trail', type: 'output', position: { x: 1570, y: 1050 }, data: { label: 'Audit Trail', icon: 'activity' }, zIndex: 10 },
];

const initialEdges: Edge[] = [
  // Tahap 1
  { id: 'e1', source: 'perencana', target: 'input-kak', type: 'straight', animated: true, style: { stroke: '#64748b', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }, zIndex: 5 },
  { id: 'e2', source: 'input-kak', target: 'simpan-ledger-1', type: 'straight', style: { strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed }, zIndex: 5 },
  { id: 'e3', source: 'simpan-ledger-1', target: 'ledger', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }, zIndex: 5 },

  // Tahap 2
  { id: 'e4', source: 'ulp-pokja', target: 'seleksi', type: 'straight', animated: true, style: { stroke: '#64748b', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }, zIndex: 5 },
  { id: 'e5', source: 'seleksi', target: 'simpan-ledger-2', type: 'straight', style: { strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed }, zIndex: 5 },
  { id: 'e6', source: 'simpan-ledger-2', target: 'ledger', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }, zIndex: 5 },

  // Tahap 3
  { id: 'e7', source: 'ppk', target: 'tanda-tangan', type: 'straight', animated: true, style: { stroke: '#64748b', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }, zIndex: 5 },
  { id: 'e8', source: 'kontraktor', target: 'tanda-tangan', type: 'straight', animated: true, style: { stroke: '#64748b', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }, zIndex: 5 },
  { id: 'e9', source: 'tanda-tangan', target: 'deploy-contract', type: 'straight', style: { strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed }, zIndex: 5 },
  { id: 'e10', source: 'deploy-contract', target: 'smart-contract', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }, zIndex: 5 },

  // Tahap 4
  { id: 'e11', source: 'kontraktor', target: 'input-progres', type: 'straight', animated: true, style: { stroke: '#64748b', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }, zIndex: 5 },
  { id: 'e12', source: 'input-progres', target: 'catat-event', type: 'straight', style: { strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed }, zIndex: 5 },
  { id: 'e13', source: 'catat-event', target: 'validator', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }, zIndex: 5 },

  // Tahap 5
  { id: 'e14', source: 'pengawas', target: 'verifikasi', type: 'straight', animated: true, style: { stroke: '#64748b', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }, zIndex: 5 },
  { id: 'e15', source: 'verifikasi', target: 'validasi-ok', type: 'straight', style: { strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed }, zIndex: 5 },
  { id: 'e16', source: 'validasi-ok', target: 'ledger', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }, zIndex: 5 },

  // Tahap 6
  { id: 'e17', source: 'validator', target: 'cek-progres', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }, zIndex: 5 },
  { id: 'e18', source: 'cek-progres', target: 'bayar-termin', type: 'straight', style: { strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed }, zIndex: 5 },
  { id: 'e19', source: 'bayar-termin', target: 'pembayaran', type: 'straight', style: { stroke: '#10b981', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, zIndex: 5 },

  // Addendum
  { id: 'e20', source: 'deploy-contract', target: 'addendum', type: 'straight', style: { stroke: '#f97316', strokeWidth: 2.5, strokeDasharray: '8,8' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' }, zIndex: 5 },
  { id: 'e21', source: 'addendum', sourceHandle: 'right', target: 'update-kontrak', label: 'Ya', labelBgStyle: { fill: '#1e293b', fillOpacity: 0.8 }, labelStyle: { fill: '#f97316', fontSize: 12 }, type: 'straight', markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' }, style: { stroke: '#f97316', strokeWidth: 2.5 }, zIndex: 5 },
  { id: 'e22', source: 'update-kontrak', target: 'versi-baru', type: 'straight', style: { stroke: '#f97316', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' }, zIndex: 5 },
  { id: 'e23', source: 'versi-baru', target: 'smart-contract', type: 'straight', style: { stroke: '#3b82f6', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }, zIndex: 5 },
  { id: 'e24', source: 'addendum', sourceHandle: 'bottom', target: 'input-progres', label: 'Tidak', labelBgStyle: { fill: '#1e293b', fillOpacity: 0.8 }, labelStyle: { fill: '#64748b', fontSize: 12 }, type: 'straight', markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }, style: { stroke: '#64748b', strokeWidth: 2.5 }, zIndex: 5 },

  // Tahap 8
  { id: 'e25', source: 'bayar-termin', target: 'pho-fho', type: 'straight', style: { strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed }, zIndex: 5 },
  { id: 'e26', source: 'pho-fho', target: 'selesai', type: 'straight', style: { strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed }, zIndex: 5 },
  { id: 'e27', source: 'selesai', target: 'permanen', type: 'straight', style: { strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed }, zIndex: 5 },
  { id: 'e28', source: 'permanen', target: 'status', type: 'straight', style: { stroke: '#10b981', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, zIndex: 5 },
  { id: 'e29', source: 'permanen', target: 'audit-trail', type: 'straight', style: { stroke: '#10b981', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, zIndex: 5 },

  // Output connections
  { id: 'e30', source: 'pembayaran', target: 'audit-trail', type: 'straight', style: { stroke: '#10b981', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, zIndex: 5 },
  { id: 'e31', source: 'status', target: 'audit-trail', type: 'straight', style: { stroke: '#10b981', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, zIndex: 5 },
];

export function FlowDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-full relative">
      <Legend />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={1.5}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="#475569"
        />
      </ReactFlow>
    </div>
  );
}
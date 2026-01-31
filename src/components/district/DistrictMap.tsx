'use client';
import { useCallback, useState } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import SchoolNode from './SchoolNode';

const nodeTypes = {
    school: SchoolNode,
};

const initialNodes = [
    // District Center
    { id: 'district-1', type: 'input', position: { x: 400, y: 50 }, data: { label: 'District HQ' }, style: { background: '#D4F268', color: '#0C0A09', border: 'none', borderRadius: '50px', fontWeight: 'bold', width: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50px' } },

    // Schools
    { id: 's1', type: 'school', position: { x: 100, y: 250 }, data: { id: 'SCH-01', label: 'Lincoln High', students: 1240, performance: 92, status: 'good' } },
    { id: 's2', type: 'school', position: { x: 400, y: 300 }, data: { id: 'SCH-02', label: 'Roosevelt Elem', students: 850, performance: 78, status: 'alert' } },
    { id: 's3', type: 'school', position: { x: 700, y: 250 }, data: { id: 'SCH-03', label: 'Washington Mid', students: 1100, performance: 88, status: 'good' } },
    { id: 's4', type: 'school', position: { x: 250, y: 500 }, data: { id: 'SCH-04', label: 'Jefferson High', students: 1400, performance: 95, status: 'good' } },
    { id: 's5', type: 'school', position: { x: 550, y: 500 }, data: { id: 'SCH-05', label: 'Adams Element', students: 600, performance: 81, status: 'warning' } },
];

const initialEdges = [
    { id: 'e1-1', source: 'district-1', target: 's1', animated: true, style: { stroke: '#E7E5E4', opacity: 0.5 } },
    { id: 'e1-2', source: 'district-1', target: 's2', animated: true, style: { stroke: '#EF4444' }, label: 'Alert' }, // Red for alert
    { id: 'e1-3', source: 'district-1', target: 's3', animated: true, style: { stroke: '#E7E5E4', opacity: 0.5 } },
    { id: 'e1-4', source: 's1', target: 's4', animated: false, style: { stroke: '#E7E5E4', opacity: 0.2 } },
    { id: 'e1-5', source: 's2', target: 's5', animated: false, style: { stroke: '#E7E5E4', opacity: 0.2 } },
];

export default function DistrictMap() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div style={{ height: '100%', width: '100%' }} className="bg-stone-black/50 backdrop-blur-sm rounded-3xl border border-white/5 overflow-hidden">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                attributionPosition="bottom-right"
            >
                <Background color="#D4F268" gap={20} size={1} style={{ opacity: 0.05 }} />
                <Controls
                    className="!bg-stone-black !border-white/10 !fill-off-white [&>button]:!border-white/10 [&>button:hover]:!bg-white/10"
                />
            </ReactFlow>
        </div>
    );
}

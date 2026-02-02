'use client';
import { useCallback, useState, useEffect, useMemo } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import SchoolNode from './SchoolNode';
import { useDataStore } from '@/lib/stores';

const nodeTypes = {
    school: SchoolNode,
};

// Base node positions for the flow diagram
const nodePositions: Record<string, { x: number; y: number }> = {
    'district-1': { x: 400, y: 50 },
    's1': { x: 100, y: 250 },
    's2': { x: 400, y: 300 },
    's3': { x: 700, y: 250 },
    's4': { x: 250, y: 500 },
    's5': { x: 550, y: 500 },
};

interface DistrictMapProps {
    onSchoolSelect?: (schoolId: string | null) => void;
    selectedSchoolId?: string | null;
}

export default function DistrictMap({ onSchoolSelect, selectedSchoolId }: DistrictMapProps) {
    const schools = useDataStore((state) => state.schools);
    const [mounted, setMounted] = useState(false);

    // Handle school selection - always select on click (pane click deselects)
    const handleSchoolSelect = useCallback((schoolId: string) => {
        onSchoolSelect?.(schoolId);
    }, [onSchoolSelect]);

    // Build nodes dynamically with selection state
    const initialNodes = useMemo(() => {
        const schoolNodes = ['s1', 's2', 's3', 's4', 's5'].map(id => {
            const school = schools[id];
            if (!school) return null;

            return {
                id,
                type: 'school',
                position: nodePositions[id],
                data: {
                    id: `SCH-0${id.slice(1)}`,
                    schoolId: id, // actual store ID for lookups
                    label: school.name.replace(' School', '').replace(' Elementary', ' Elem').replace(' Middle', ' Mid'),
                    students: school.students,
                    performance: school.performance,
                    status: school.status,
                    aiSummary: school.aiSummary,
                    isSelected: selectedSchoolId === id,
                    onSelect: handleSchoolSelect,
                },
                zIndex: selectedSchoolId === id ? 100 : 10,
            };
        }).filter(Boolean) as Node[];

        // District HQ node
        const districtNode: Node = {
            id: 'district-1',
            type: 'input',
            position: nodePositions['district-1'],
            data: { label: 'District HQ' },
            style: {
                background: '#D4F268',
                color: '#0C0A09',
                border: 'none',
                borderRadius: '50px',
                fontWeight: 'bold',
                width: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50px',
            },
        };

        return [districtNode, ...schoolNodes];
    }, [schools, selectedSchoolId, handleSchoolSelect]);

    const initialEdges = useMemo(() => [
        { id: 'e1-1', source: 'district-1', target: 's1', animated: true, style: { stroke: '#E7E5E4', opacity: 0.5 } },
        {
            id: 'e1-2',
            source: 'district-1',
            target: 's2',
            animated: true,
            style: { stroke: '#F87171', strokeWidth: 2 },
            label: '! Alert',
            labelStyle: { fill: '#F87171', fontWeight: 600, fontSize: 12 },
            labelBgStyle: { fill: '#1C1917', fillOpacity: 0.9, stroke: '#F87171', strokeWidth: 1, rx: 12, ry: 12 },
            labelBgPadding: [8, 4] as [number, number],
        },
        { id: 'e1-3', source: 'district-1', target: 's3', animated: true, style: { stroke: '#E7E5E4', opacity: 0.5 } },
        { id: 'e1-4', source: 's1', target: 's4', animated: false, style: { stroke: '#E7E5E4', opacity: 0.2 } },
        { id: 'e1-5', source: 's2', target: 's5', animated: false, style: { stroke: '#E7E5E4', opacity: 0.2 } },
    ], []);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Update nodes when selection changes
    useEffect(() => {
        setNodes(initialNodes);
    }, [initialNodes, setNodes]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    // Handle pane click to deselect
    const onPaneClick = useCallback(() => {
        onSchoolSelect?.(null);
    }, [onSchoolSelect]);

    if (!mounted) return <div className="w-full h-full bg-stone-black/50 rounded-3xl animate-pulse" />;

    return (
        <div style={{ height: '100%', width: '100%' }} className="bg-stone-black/50 backdrop-blur-sm rounded-3xl border border-white/5 overflow-hidden">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onPaneClick={onPaneClick}
                fitView
                fitViewOptions={{ padding: 0.2 }}
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

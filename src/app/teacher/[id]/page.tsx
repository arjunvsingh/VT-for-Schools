'use client';
import { PageTransition } from '@/components/layout/PageTransition';
import { BentoCard } from '@/components/ui/BentoCard';
import TeacherTimeline from '@/components/teacher/TeacherTimeline';
import { BackLink } from '@/components/navigation';
import { Mail, Phone, Award, Star } from 'lucide-react';
import { useDataStore } from '@/lib/stores';

export default function TeacherPage({ params }: { params: { id: string } }) {
    const teacher = useDataStore((state) => state.getTeacher(params.id));

    // Fallback for invalid teacher ID
    const teacherName = teacher?.name ?? 'Unknown Teacher';
    const initials = teacher?.initials ?? '??';
    const role = teacher?.role ?? 'Teacher';
    const schoolId = teacher?.schoolId ?? 's1';
    const tenure = teacher?.tenure ?? 0;
    const classes = teacher?.classes ?? 0;
    const studentCount = teacher?.studentCount ?? 0;
    const rating = teacher?.rating ?? 0;
    const awards = teacher?.awards ?? [];
    const status = teacher?.status ?? 'inactive';

    return (
        <PageTransition className="p-4 md:p-8 pt-24 min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">

            {/* Left Profile Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <BackLink href={`/school/${schoolId}`} label="Back to School" />

                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center gap-4">
                    <div className="w-32 h-32 rounded-full border-2 border-acid-lime p-1">
                        <div className="w-full h-full rounded-full bg-off-white/10 flex items-center justify-center text-4xl font-serif italic text-off-white/60">
                            {initials}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{teacherName}</h1>
                        <p className="text-sm text-off-white/60">{role}</p>
                    </div>

                    <div className="flex gap-2 w-full mt-2">
                        <button className="flex-1 py-2 bg-acid-lime text-stone-black rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                            Message
                        </button>
                        <button className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                            <Mail className="w-5 h-5" />
                        </button>
                        <button className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                            <Phone className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="w-full h-px bg-white/5 my-2" />

                    <div className="flex justify-between w-full text-sm">
                        <span className="text-off-white/40">Status</span>
                        <span className={status === 'active' ? 'text-green-400' : status === 'flagged' ? 'text-orange-400' : 'text-off-white/40'} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>● {status === 'active' ? 'Active' : status === 'flagged' ? 'Flagged' : 'Inactive'}</span>
                    </div>
                    <div className="flex justify-between w-full text-sm">
                        <span className="text-off-white/40">Tenure</span>
                        <span>{tenure} Years</span>
                    </div>
                </div>

                <BentoCard title="Awards" icon={<Award className="text-yellow-400" />} glow>
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center gap-2 text-sm p-2 bg-yellow-400/10 rounded border border-yellow-400/20 text-yellow-100">
                            <Star className="w-3 h-3 text-yellow-400" /> District Excellence 2024
                        </div>
                        <div className="flex items-center gap-2 text-sm p-2 bg-yellow-400/10 rounded border border-yellow-400/20 text-yellow-100">
                            <Star className="w-3 h-3 text-yellow-400" /> Innovator Grant
                        </div>
                    </div>
                </BentoCard>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <span className="text-xs text-off-white/40 uppercase tracking-widest">Classes</span>
                        <p className="text-2xl font-mono mt-1">{classes}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <span className="text-xs text-off-white/40 uppercase tracking-widest">Students</span>
                        <p className="text-2xl font-mono mt-1">{studentCount}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <span className="text-xs text-off-white/40 uppercase tracking-widest">Rating</span>
                        <p className="text-2xl font-mono mt-1 text-acid-lime">{rating}</p>
                    </div>
                </div>

                {/* Timeline Bento */}
                <BentoCard className="flex-1" glow>
                    <TeacherTimeline />
                </BentoCard>
            </div>

        </PageTransition>
    );
}

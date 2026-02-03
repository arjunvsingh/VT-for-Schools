'use client';
import { PageTransition } from '@/components/layout/PageTransition';
import { BentoCard } from '@/components/ui/BentoCard';
import TeacherTimeline from '@/components/teacher/TeacherTimeline';
import { BackLink } from '@/components/navigation';
import { NotesButton } from '@/components/ui/NotesPanel';
import { ActionButton } from '@/components/ui/ActionButton';
import { Mail, Phone, Award, Star, AlertCircle, MessageSquare } from 'lucide-react';
import { useDataStore } from '@/lib/stores';
import { Marquee } from '@/components/ui/marquee';
import { cn } from '@/lib/utils';

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
    const feedback = teacher?.studentFeedback ?? [];

    return (
        <PageTransition className="p-4 md:p-8 pt-28 md:pt-36 min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto items-start">

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
                        <ActionButton
                            type="send_email"
                            entityType="teacher"
                            entityId={params.id}
                            entityName={teacherName}
                            variant="primary"
                            size="md"
                            customLabel="Message"
                            className="flex-1"
                        />
                        <ActionButton
                            type="send_email"
                            entityType="teacher"
                            entityId={params.id}
                            entityName={teacherName}
                            variant="secondary"
                            size="md"
                            customLabel=""
                            modalContext={{ issue: `${role} correspondence` }}
                        />
                        <ActionButton
                            type="schedule_call"
                            entityType="teacher"
                            entityId={params.id}
                            entityName={teacherName}
                            variant="secondary"
                            size="md"
                            customLabel=""
                        />
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

                    {/* Notes Button */}
                    <div className="w-full mt-4">
                        <NotesButton entityType="teacher" entityId={params.id} className="w-full justify-center" />
                    </div>

                    {/* Action button for flagged teachers */}
                    {status === 'flagged' && (
                        <div className="w-full mt-2">
                            <ActionButton
                                type="request_bridge"
                                entityType="teacher"
                                entityId={params.id}
                                entityName={teacherName}
                                variant="primary"
                                size="md"
                                className="w-full"
                                modalContext={{
                                    issue: teacher?.performanceIssues?.[0]?.type,
                                    riskFactor: teacher?.performanceIssues?.[0]?.description,
                                    severity: teacher?.performanceIssues?.[0]?.severity,
                                }}
                            />
                        </div>
                    )}
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

                {/* Performance Issues - Only if any exist */}
                {teacher?.performanceIssues && teacher.performanceIssues.length > 0 && (
                    <BentoCard title="Performance Log" icon={<AlertCircle className="text-red-400" />} className="bg-red-500/5">
                        <div className="flex flex-col gap-3 mt-2">
                            {teacher.performanceIssues.map(issue => (
                                <div key={issue.id} className="p-3 rounded-lg bg-red-400/5 border border-red-400/10">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-red-300 text-sm">{issue.type}</h4>
                                        <div className="flex gap-2">
                                            <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${issue.severity === 'high' ? 'bg-red-500 text-white' : 'bg-orange-500/20 text-orange-300'}`}>{issue.severity}</span>
                                            <span className="text-[10px] uppercase tracking-wider text-off-white/50 bg-white/5 px-1.5 py-0.5 rounded">{issue.status}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-off-white/80 mb-2">{issue.description}</p>
                                    <p className="text-[10px] text-off-white/40 font-mono text-right">{issue.date}</p>
                                </div>
                            ))}
                        </div>
                    </BentoCard>
                )}

                {/* Student Feedback Marquee */}
                {feedback.length > 0 && (
                    <BentoCard title="Student Feedback" icon={<MessageSquare className="text-cyan-400" />} glow>
                        <div className="relative flex h-[300px] w-full flex-row items-center justify-center overflow-hidden mt-2">
                            <Marquee pauseOnHover vertical className="[--duration:25s]">
                                {feedback.slice(0, Math.ceil(feedback.length / 2)).map((fb) => (
                                    <FeedbackCard key={fb.id} {...fb} />
                                ))}
                            </Marquee>
                            <Marquee reverse pauseOnHover vertical className="[--duration:25s]">
                                {feedback.slice(Math.ceil(feedback.length / 2)).map((fb) => (
                                    <FeedbackCard key={fb.id} {...fb} />
                                ))}
                            </Marquee>
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-stone-black/80 to-transparent" />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-stone-black/80 to-transparent" />
                        </div>
                    </BentoCard>
                )}

                {/* Timeline Bento */}
                <BentoCard className="flex-1" glow>
                    <TeacherTimeline timeline={teacher?.timeline} />
                </BentoCard>
            </div>

        </PageTransition>
    );
}

function FeedbackCard({ studentName, studentInitials, grade, rating, comment, subject }: {
    studentName: string;
    studentInitials: string;
    grade: number;
    rating: number;
    comment: string;
    subject?: string;
}) {
    return (
        <figure className={cn(
            "relative h-auto w-44 cursor-pointer overflow-hidden rounded-xl border p-4 transition-colors",
            "border-white/10 bg-white/5 hover:bg-white/10"
        )}>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[10px] font-mono text-cyan-200 shrink-0">
                    {studentInitials}
                </div>
                <div className="flex flex-col min-w-0">
                    <figcaption className="text-sm font-medium text-off-white truncate">{studentName}</figcaption>
                    <p className="text-[10px] text-off-white/40">Grade {grade}{subject ? ` · ${subject}` : ''}</p>
                </div>
            </div>
            <div className="flex gap-0.5 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("w-3 h-3", i < rating ? "text-yellow-400 fill-yellow-400" : "text-white/10")} />
                ))}
            </div>
            <blockquote className="mt-2 text-xs text-off-white/70 leading-relaxed">{comment}</blockquote>
        </figure>
    );
}

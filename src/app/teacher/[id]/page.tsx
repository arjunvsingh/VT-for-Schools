'use client';
import { PageTransition } from '@/components/layout/PageTransition';
import { BentoCard } from '@/components/ui/BentoCard';
import TeacherTimeline from '@/components/teacher/TeacherTimeline';
import { ArrowLeft, Mail, Phone, Award, Star } from 'lucide-react';
import Link from 'next/link';

export default function TeacherPage({ params }: { params: { id: string } }) {
    return (
        <PageTransition className="p-4 md:p-8 pt-24 min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">

            {/* Left Profile Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <Link href={`/school/s1`} className="flex items-center gap-2 text-sm text-off-white/60 hover:text-acid-lime transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" /> Back to School
                </Link>

                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center gap-4">
                    <div className="w-32 h-32 rounded-full border-2 border-acid-lime p-1">
                        <div className="w-full h-full rounded-full bg-off-white/10 flex items-center justify-center text-4xl font-serif italic text-off-white/60">
                            SC
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Sarah Carter</h1>
                        <p className="text-sm text-off-white/60">Physics Department Head</p>
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
                        <span className="text-green-400 flex items-center gap-1">● Active</span>
                    </div>
                    <div className="flex justify-between w-full text-sm">
                        <span className="text-off-white/40">Tenure</span>
                        <span>4 Years</span>
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
                        <p className="text-2xl font-mono mt-1">5</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <span className="text-xs text-off-white/40 uppercase tracking-widest">Students</span>
                        <p className="text-2xl font-mono mt-1">142</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <span className="text-xs text-off-white/40 uppercase tracking-widest">Rating</span>
                        <p className="text-2xl font-mono mt-1 text-acid-lime">4.9</p>
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

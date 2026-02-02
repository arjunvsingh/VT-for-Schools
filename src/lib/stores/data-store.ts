'use client';

import { create } from 'zustand';

// ============== Types ==============

export interface District {
    id: string;
    name: string;
    schools: string[]; // school IDs
    performance: number;
    status: 'good' | 'warning' | 'alert';
    totalStudents: number;
    totalTeachers: number;
}

export interface SchoolGoals {
    reading: { current: number; target: number };
    math: { current: number; target: number };
    attendance: { current: number; target: number };
    tutoringEngagement: { current: number; target: number };
}

export interface SchoolAISummary {
    headline: string;
    details: string[];
    suggestedActions: string[];
}

export interface School {
    id: string;
    districtId: string;
    name: string;
    grade: string;
    principal: string;
    students: number;
    teachers: number;
    performance: number;
    attendance: number;
    status: 'good' | 'warning' | 'alert';
    goals?: SchoolGoals;
    aiSummary?: SchoolAISummary;
}

// Teacher specific types
export interface TimelineEvent {
    year: string;
    title: string;
    text: string;
}

export interface PerformanceIssue {
    id: string;
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    date: string;
    status: 'open' | 'resolved';
}

export interface Teacher {
    id: string;
    schoolId: string;
    name: string;
    initials: string;
    department: string;
    role: string;
    rating: number;
    classes: number;
    studentCount: number;
    tenure: number;
    status: 'active' | 'inactive' | 'flagged';
    awards: string[];
    timeline?: TimelineEvent[];
    performanceIssues?: PerformanceIssue[];
}

// Enriched types for actionable insights
export interface AreaOfFocus {
    id: string;
    subject: string;
    issue: string;
    teacherName: string;
    teacherId: string;
    occurrences: number;
    lastDate: string;
    rootCause: string;
    recommendedAction: string;
    actionType: 'schedule_tutoring' | 'parent_outreach' | 'request_bridge' | 'send_email' | 'enroll_hdt';
}

export interface RiskFactor {
    id: string;
    type: string;
    detail: string;
    trend: 'improving' | 'stable' | 'declining';
    sinceDate: string;
    metric?: { current: number; threshold: number };
    suggestedAction: string;
    actionType: 'schedule_tutoring' | 'parent_outreach' | 'enroll_hdt';
}

export interface Student {
    id: string;
    schoolId: string;
    name: string;
    initials: string;
    grade: number;
    gpa: number;
    subjects: string[];
    badges: string[];
    status: 'excelling' | 'on-track' | 'at-risk';
    riskScore?: number; // 0-100, higher = more at risk
    riskFactors?: RiskFactor[];
    areasOfFocus?: AreaOfFocus[];
}

export interface Insight {
    id: string;
    entityType: 'school' | 'teacher' | 'student';
    entityId: string;
    severity: 'critical' | 'warning' | 'info' | 'success';
    title: string;
    description: string;
    actionLabel?: string;
    actionPath?: string;
    impactMetric?: string;
    rootCause?: string;
    priority?: 'high' | 'medium' | 'low';
}

// ============== Mock Data ==============

const mockDistricts: Record<string, District> = {
    '1': {
        id: '1',
        name: 'Central Valley',
        schools: ['s1', 's2', 's3', 's4', 's5'],
        performance: 88,
        status: 'good',
        totalStudents: 5190,
        totalTeachers: 312,
    },
    '2': {
        id: '2',
        name: 'Bay Area North',
        schools: ['s6', 's7'],
        performance: 92,
        status: 'good',
        totalStudents: 3200,
        totalTeachers: 198,
    },
};

const mockSchools: Record<string, School> = {
    's1': {
        id: 's1',
        districtId: '1',
        name: 'Lincoln High School',
        grade: 'A-',
        principal: 'Dr. S. Carter',
        students: 1240,
        teachers: 54,
        performance: 92,
        attendance: 94,
        status: 'good',
        goals: {
            reading: { current: 91, target: 90 },  // EXCEEDED
            math: { current: 86, target: 88 },     // Close but not met
            attendance: { current: 94, target: 95 },// Close but not met  
            tutoringEngagement: { current: 88, target: 85 }, // EXCEEDED
        },
        aiSummary: {
            headline: 'Strong performance with minor math gap',
            details: [
                'Reading scores exceeded target by 1.2% (Grade 11 cohort leading)',
                'Math proficiency gap of 2% in Algebra I sessions',
                'John Doe (Math) flagged: Student engagement below threshold',
            ],
            suggestedActions: ['Schedule math dept review', 'Enroll struggling students in HDT program'],
        },
    },
    's2': {
        id: 's2',
        districtId: '1',
        name: 'Roosevelt Elementary',
        grade: 'C+',
        principal: 'Ms. J. Williams',
        students: 850,
        teachers: 38,
        performance: 72,
        attendance: 85,
        status: 'alert',
        goals: {
            reading: { current: 68, target: 82 },  // Needs work
            math: { current: 62, target: 78 },     // Struggling
            attendance: { current: 85, target: 92 },// Behind
            tutoringEngagement: { current: 48, target: 70 }, // Needs significant improvement
        },
        aiSummary: {
            headline: 'Science Dept critical & attendance dropping',
            details: [
                'Science Dept critical: Michael Brown rating 2.8 (Curriculum Misalignment)',
                'Daily attendance variance: -7% vs target (Grade 9 chronic absenteeism)',
                'Math scores 16% below avg: Geometry unit failure rate 45%',
                'Tutoring utilization at 48% vs 70% target',
            ],
            suggestedActions: ['Enroll Michael Brown\'s students in HDT', 'Contact principal immediately', 'Deploy HDT attendance cohort'],
        },
    },
    's3': {
        id: 's3',
        districtId: '1',
        name: 'Washington Middle',
        grade: 'B+',
        principal: 'Mr. R. Thompson',
        students: 1100,
        teachers: 48,
        performance: 88,
        attendance: 91,
        status: 'good',
        goals: {
            reading: { current: 87, target: 85 },   // ACHIEVED
            math: { current: 89, target: 88 },      // ACHIEVED
            attendance: { current: 91, target: 93 }, // SLIGHT GAP
            tutoringEngagement: { current: 72, target: 75 }, // SLIGHT GAP
        },
        aiSummary: {
            headline: 'Solid mid-tier performer',
            details: [
                'All core metrics within acceptable range',
                'Emily Chen (Math Dept Head) excelling at 4.7 rating',
                'Attendance stable at 91%',
            ],
            suggestedActions: ['Review for potential excellence program'],
        },
    },
    's4': {
        id: 's4',
        districtId: '1',
        name: 'Jefferson High',
        grade: 'A',
        principal: 'Dr. M. Chen',
        students: 1400,
        teachers: 62,
        performance: 95,
        attendance: 96,
        status: 'good',
        goals: {
            reading: { current: 96, target: 94 },   // ACHIEVED
            math: { current: 94, target: 92 },      // ACHIEVED
            attendance: { current: 96, target: 95 }, // ACHIEVED
            tutoringEngagement: { current: 92, target: 88 }, // ACHIEVED
        },
        aiSummary: {
            headline: 'Top performer in district',
            details: [
                'Highest performance score (95%)',
                'Best attendance rate (96%)',
                'Model school for tutoring integration',
            ],
            suggestedActions: ['Document best practices', 'Share methodology with struggling schools'],
        },
    },
    's5': {
        id: 's5',
        districtId: '1',
        name: 'Adams Elementary',
        grade: 'B-',
        principal: 'Ms. L. Garcia',
        students: 600,
        teachers: 28,
        performance: 81,
        attendance: 89,
        status: 'warning',
        goals: {
            reading: { current: 79, target: 84 },   // GAP
            math: { current: 76, target: 82 },      // SIGNIFICANT GAP
            attendance: { current: 89, target: 92 }, // GAP
            tutoringEngagement: { current: 45, target: 60 }, // GAP
        },
        aiSummary: {
            headline: 'Staff shortage impacting performance',
            details: [
                'Currently 3 unfilled teaching positions',
                'Substitute coverage at 40% this month',
                'Student-teacher ratio above recommended',
            ],
            suggestedActions: ['Prioritize hiring', 'Request substitute support', 'Expand HDT sessions for coverage'],
        },
    },
};

const mockTeachers: Record<string, Teacher> = {
    't1': {
        id: 't1',
        schoolId: 's1',
        name: 'Sarah Carter',
        initials: 'SC',
        department: 'Science',
        role: 'Physics Department Head',
        rating: 4.9,
        classes: 5,
        studentCount: 142,
        tenure: 4,
        status: 'active',
        awards: ['District Excellence 2024', 'Innovator Grant'],
        timeline: [
            { year: '2025-10', title: 'Performance Review', text: 'Exceeded district benchmarks in STEM integration.' },
            { year: '2025-08', title: 'Curriculum Update', text: 'Lead the revision of grade 10 physics syllabus.' },
            { year: '2024-11', title: 'Grant Awarded', text: 'Secured $5k grant for lab equipment.' },
            { year: '2024-09', title: 'Joined District', text: 'Started tenure at Lincoln High School.' },
        ],
    },
    't2': {
        id: 't2',
        schoolId: 's1',
        name: 'John Doe',
        initials: 'JD',
        department: 'Math',
        role: 'Math Teacher',
        rating: 3.2,
        classes: 4,
        studentCount: 98,
        tenure: 2,
        status: 'flagged',
        awards: [],
        timeline: [
            { year: '2026-01', title: 'Parent Complaints', text: 'Received 3 formal complaints regarding grading transparency.' },
            { year: '2025-11', title: 'Observation', text: 'Noted lack of student engagement during algebra sessions.' },
            { year: '2025-09', title: 'New Year Start', text: 'Assigned 4 sections of Algebra I and II.' },
            { year: '2024-08', title: 'Hired', text: 'Joined Lincoln High Math Department.' },
        ],
        performanceIssues: [
            { id: 'pi-t2-1', type: 'Parent Feedback', description: 'Multiple reports of grading inconsistencies and lack of feedback.', severity: 'medium', date: '2026-01-15', status: 'open' },
            { id: 'pi-t2-2', type: 'Classroom Management', description: 'Observation revealed difficulty maintaining order in 3rd period.', severity: 'medium', date: '2025-11-20', status: 'open' },
        ],
    },
    't3': {
        id: 't3',
        schoolId: 's2',
        name: 'Maria Lopez',
        initials: 'ML',
        department: 'English',
        role: 'English Department Head',
        rating: 4.5,
        classes: 4,
        studentCount: 112,
        tenure: 8,
        status: 'active',
        awards: ['State Teaching Award 2023'],
        timeline: [
            { year: '2025-05', title: 'State Award', text: 'Recognized as English Teacher of the Year.' },
            { year: '2024-08', title: 'Dept Head', text: 'Promoted to English Department Head.' },
            { year: '2018-09', title: 'Joined District', text: 'Begun teaching at Roosevelt Elementary.' },
        ],
    },
    't4': {
        id: 't4',
        schoolId: 's1',
        name: 'Robert Kim',
        initials: 'RK',
        department: 'History',
        role: 'History Teacher',
        rating: 4.1,
        classes: 3,
        studentCount: 76,
        tenure: 5,
        status: 'active',
        awards: [],
        timeline: [
            { year: '2025-09', title: 'Club Advisor', text: 'Started the new Debate Club.' },
            { year: '2021-08', title: 'Hired', text: 'Joined as History Teacher.' },
        ],
    },
    't5': {
        id: 't5',
        schoolId: 's3',
        name: 'Emily Chen',
        initials: 'EC',
        department: 'Math',
        role: 'Math Department Head',
        rating: 4.7,
        classes: 5,
        studentCount: 134,
        tenure: 10,
        status: 'active',
        awards: ['National Education Award 2022'],
        timeline: [
            { year: '2023-04', title: 'National Award', text: 'Received National Education Excellence Award.' },
            { year: '2020-08', title: 'Curriculum Lead', text: 'Appointed district-wide math curriculum lead.' },
            { year: '2016-09', title: 'Joined', text: 'Started at Washington Middle.' },
        ],
    },
    't6': {
        id: 't6',
        schoolId: 's2',
        name: 'Michael Brown',
        initials: 'MB',
        department: 'Science',
        role: 'Biology Teacher',
        rating: 2.8,
        classes: 4,
        studentCount: 88,
        tenure: 1,
        status: 'flagged',
        awards: [],
        timeline: [
            { year: '2026-01', title: 'Performance Plan', text: 'Placed on improvement plan due to curriculum alignment issues.' },
            { year: '2025-10', title: 'Missed Training', text: 'Did not attend mandatory safety protocol training.' },
            { year: '2025-08', title: 'Hired', text: 'Joined Roosevelt Elementary Science Dept.' },
        ],
        performanceIssues: [
            { id: 'pi-t6-1', type: 'Curriculum Alignment', description: 'Teaching material not aligned with district standards for Biology.', severity: 'high', date: '2026-01-10', status: 'open' },
            { id: 'pi-t6-2', type: 'Professional Development', description: 'Missed mandatory safety training session.', severity: 'medium', date: '2025-10-15', status: 'resolved' },
        ],
    },
};

const mockStudents: Record<string, Student> = {
    'st1': {
        id: 'st1',
        schoolId: 's1',
        name: 'John Smith',
        initials: 'JS',
        grade: 11,
        gpa: 3.8,
        subjects: ['AP Physics', 'Calculus', 'English Lit', 'History', 'Spanish III', 'Gym'],
        badges: ['Honor Roll', 'Varsity Team'],
        status: 'excelling',
        areasOfFocus: [
            {
                id: 'aof-st1-1',
                subject: 'English Lit',
                issue: 'Late essay submissions',
                teacherName: 'Maria Lopez',
                teacherId: 't3',
                occurrences: 2,
                lastDate: '2026-01-28',
                rootCause: 'Over-committed with varsity basketball practice schedule conflicting with essay deadlines',
                recommendedAction: 'Adjust submission deadlines around game days or provide 48-hour extension window',
                actionType: 'send_email',
            },
        ],
    },
    'st2': {
        id: 'st2',
        schoolId: 's1',
        name: 'Alex Kim',
        initials: 'AK',
        grade: 10,
        gpa: 2.1,
        subjects: ['Algebra II', 'English', 'Biology', 'History', 'Art'],
        badges: [],
        status: 'at-risk',
        riskScore: 72,
        riskFactors: [
            {
                id: 'rf-st2-1',
                type: 'Academic Performance',
                detail: 'GPA dropped from 2.8 to 2.1 over past 2 months',
                trend: 'declining',
                sinceDate: '2025-12-01',
                metric: { current: 2.1, threshold: 2.5 },
                suggestedAction: 'Enroll in High-Dosage Tutoring for Math and Biology',
                actionType: 'enroll_hdt',
            },
            {
                id: 'rf-st2-2',
                type: 'Math Struggles',
                detail: 'Algebra II test scores averaging 58% - struggling with quadratic equations',
                trend: 'declining',
                sinceDate: '2025-11-15',
                metric: { current: 58, threshold: 70 },
                suggestedAction: 'Schedule 1:1 tutoring sessions with John Doe',
                actionType: 'schedule_tutoring',
            },
            {
                id: 'rf-st2-3',
                type: 'Assignment Completion',
                detail: '2 late assignments this week in Algebra II and Biology',
                trend: 'stable',
                sinceDate: '2026-01-27',
                suggestedAction: 'Parent outreach to discuss homework routine',
                actionType: 'parent_outreach',
            },
        ],
        areasOfFocus: [
            {
                id: 'aof-st2-1',
                subject: 'Algebra II',
                issue: 'Failing test scores and incomplete homework',
                teacherName: 'John Doe',
                teacherId: 't2',
                occurrences: 5,
                lastDate: '2026-01-30',
                rootCause: 'Foundational gaps in Algebra I concepts - specifically linear equations and graphing',
                recommendedAction: 'Schedule diagnostic assessment and enroll in Math HDT bridge program',
                actionType: 'schedule_tutoring',
            },
            {
                id: 'aof-st2-2',
                subject: 'Biology',
                issue: 'Lab report quality declining',
                teacherName: 'Michael Brown',
                teacherId: 't6',
                occurrences: 3,
                lastDate: '2026-01-25',
                rootCause: 'Difficulty understanding scientific method and data analysis - needs structured support',
                recommendedAction: 'Pair with peer tutor and schedule after-school lab sessions',
                actionType: 'schedule_tutoring',
            },
        ],
    },
    'st3': {
        id: 'st3',
        schoolId: 's1',
        name: 'Emma Johnson',
        initials: 'EJ',
        grade: 11,
        gpa: 3.2,
        subjects: ['Chemistry', 'Pre-Calc', 'English', 'History', 'French II'],
        badges: ['Perfect Attendance'],
        status: 'on-track',
        areasOfFocus: [
            {
                id: 'aof-st3-1',
                subject: 'Chemistry',
                issue: 'Lab safety protocol violations',
                teacherName: 'Sarah Carter',
                teacherId: 't1',
                occurrences: 1,
                lastDate: '2026-01-20',
                rootCause: 'Rushed during timed experiments - needs pacing guidance',
                recommendedAction: 'Review safety protocols and assign as lab partner with experienced student',
                actionType: 'send_email',
            },
        ],
    },
    'st4': {
        id: 'st4',
        schoolId: 's2',
        name: 'Marcus Williams',
        initials: 'MW',
        grade: 9,
        gpa: 1.9,
        subjects: ['Algebra I', 'English', 'Earth Science', 'History', 'PE'],
        badges: [],
        status: 'at-risk',
        riskScore: 85,
        riskFactors: [
            {
                id: 'rf-st4-1',
                type: 'Critical GPA',
                detail: 'GPA at 1.9 - below promotion threshold of 2.0',
                trend: 'declining',
                sinceDate: '2025-11-01',
                metric: { current: 1.9, threshold: 2.0 },
                suggestedAction: 'Immediate enrollment in intensive HDT program across all core subjects',
                actionType: 'enroll_hdt',
            },
            {
                id: 'rf-st4-2',
                type: 'Chronic Absenteeism',
                detail: '5 unexcused absences this month - pattern shows Monday/Friday absences',
                trend: 'declining',
                sinceDate: '2026-01-01',
                metric: { current: 5, threshold: 3 },
                suggestedAction: 'Schedule home visit and connect family with support services',
                actionType: 'parent_outreach',
            },
            {
                id: 'rf-st4-3',
                type: 'Failing Core Subject',
                detail: 'Failing Algebra I with 42% average - has not passed a test since October',
                trend: 'declining',
                sinceDate: '2025-10-15',
                metric: { current: 42, threshold: 60 },
                suggestedAction: 'Assign dedicated math tutor 3x/week with focus on foundational skills',
                actionType: 'schedule_tutoring',
            },
            {
                id: 'rf-st4-4',
                type: 'Parent Engagement',
                detail: 'No response to 3 outreach attempts since December - parent conference overdue',
                trend: 'stable',
                sinceDate: '2025-12-15',
                suggestedAction: 'Escalate to counselor for alternative contact methods',
                actionType: 'parent_outreach',
            },
        ],
        areasOfFocus: [
            {
                id: 'aof-st4-1',
                subject: 'Algebra I',
                issue: 'Failing all assessments - fundamental skill gaps',
                teacherName: 'Michael Brown',
                teacherId: 't6',
                occurrences: 8,
                lastDate: '2026-01-29',
                rootCause: 'Never mastered basic arithmetic and fractions in elementary school - needs remedial support',
                recommendedAction: 'Diagnostic test to identify gaps, then intensive HDT starting with pre-algebra concepts',
                actionType: 'enroll_hdt',
            },
        ],
    },
    'st5': {
        id: 'st5',
        schoolId: 's2',
        name: 'Sofia Rodriguez',
        initials: 'SR',
        grade: 10,
        gpa: 3.9,
        subjects: ['Geometry', 'Biology', 'English', 'Spanish III', 'Art'],
        badges: ['Honor Roll', 'Art Award'],
        status: 'excelling',
    },
    'st6': {
        id: 'st6',
        schoolId: 's3',
        name: 'David Chen',
        initials: 'DC',
        grade: 12,
        gpa: 2.7,
        subjects: ['Calculus', 'Physics', 'English', 'Economics', 'Gym'],
        badges: [],
        status: 'on-track',
        areasOfFocus: [
            {
                id: 'aof-st6-1',
                subject: 'Calculus',
                issue: 'Struggling with derivatives and integrals',
                teacherName: 'Emily Chen',
                teacherId: 't5',
                occurrences: 4,
                lastDate: '2026-01-28',
                rootCause: 'Pre-calc foundation was weak - needs targeted review of limits and rate of change concepts',
                recommendedAction: 'Schedule after-school calculus review sessions before AP exam',
                actionType: 'schedule_tutoring',
            },
        ],
    },
    // Additional at-risk students for better radar visualization
    'st7': {
        id: 'st7',
        schoolId: 's2',
        name: 'Jayden Thompson',
        initials: 'JT',
        grade: 8,
        gpa: 1.7,
        subjects: ['Pre-Algebra', 'English', 'Science', 'History', 'PE'],
        badges: [],
        status: 'at-risk',
        riskScore: 91,
        riskFactors: [
            {
                id: 'rf-st7-1',
                type: 'Critical GPA',
                detail: 'GPA at 1.7 - at risk of retention if not improved by end of semester',
                trend: 'declining',
                sinceDate: '2025-09-01',
                metric: { current: 1.7, threshold: 2.0 },
                suggestedAction: 'Emergency academic intervention plan with all teachers',
                actionType: 'enroll_hdt',
            },
            {
                id: 'rf-st7-2',
                type: 'Severe Absenteeism',
                detail: '8 absences this month alone - missing 40% of instruction',
                trend: 'declining',
                sinceDate: '2026-01-01',
                metric: { current: 8, threshold: 3 },
                suggestedAction: 'Involve school social worker and investigate home situation',
                actionType: 'parent_outreach',
            },
            {
                id: 'rf-st7-3',
                type: 'Multiple Failing Classes',
                detail: 'Failing Pre-Algebra (38%), Science (45%), and History (52%)',
                trend: 'declining',
                sinceDate: '2025-10-01',
                suggestedAction: 'Create individualized learning plan with daily check-ins',
                actionType: 'schedule_tutoring',
            },
            {
                id: 'rf-st7-4',
                type: 'Behavioral Concerns',
                detail: '3 behavior incidents this semester - primarily disengagement in class',
                trend: 'stable',
                sinceDate: '2025-11-15',
                suggestedAction: 'Counselor meeting to understand root causes and provide support',
                actionType: 'parent_outreach',
            },
        ],
        areasOfFocus: [
            {
                id: 'aof-st7-1',
                subject: 'Pre-Algebra',
                issue: 'Cannot perform basic operations with negative numbers or fractions',
                teacherName: 'Michael Brown',
                teacherId: 't6',
                occurrences: 12,
                lastDate: '2026-01-30',
                rootCause: 'Significant learning gaps from 6th grade - possibly undiagnosed learning difference',
                recommendedAction: 'Request learning specialist evaluation and begin remedial math program',
                actionType: 'enroll_hdt',
            },
        ],
    },
    'st8': {
        id: 'st8',
        schoolId: 's2',
        name: 'Aisha Patel',
        initials: 'AP',
        grade: 7,
        gpa: 2.3,
        subjects: ['Math 7', 'English', 'Science', 'Social Studies', 'Art'],
        badges: [],
        status: 'at-risk',
        riskScore: 58,
        riskFactors: [
            {
                id: 'rf-st8-1',
                type: 'GPA Trend',
                detail: 'GPA dropped from 2.9 to 2.3 since November - concerning trajectory',
                trend: 'declining',
                sinceDate: '2025-11-01',
                metric: { current: 2.3, threshold: 2.5 },
                suggestedAction: 'Early intervention with study skills workshop and peer tutoring',
                actionType: 'schedule_tutoring',
            },
            {
                id: 'rf-st8-2',
                type: 'Attendance Pattern',
                detail: '2 absences this week - both were test days in Math and Science',
                trend: 'stable',
                sinceDate: '2026-01-27',
                suggestedAction: 'Parent meeting to understand absences and discuss test anxiety support',
                actionType: 'parent_outreach',
            },
        ],
        areasOfFocus: [
            {
                id: 'aof-st8-1',
                subject: 'Math 7',
                issue: 'Test anxiety causing poor performance on assessments',
                teacherName: 'John Doe',
                teacherId: 't2',
                occurrences: 3,
                lastDate: '2026-01-28',
                rootCause: 'Performs well on homework but freezes during tests - anxiety management needed',
                recommendedAction: 'Implement testing accommodations and connect with school counselor',
                actionType: 'parent_outreach',
            },
        ],
    },
    'st9': {
        id: 'st9',
        schoolId: 's1',
        name: 'Tyler Brooks',
        initials: 'TB',
        grade: 10,
        gpa: 2.4,
        subjects: ['Geometry', 'English', 'Chemistry', 'History', 'Spanish'],
        badges: [],
        status: 'at-risk',
        riskScore: 45,
        riskFactors: [
            {
                id: 'rf-st9-1',
                type: 'Math Performance',
                detail: 'Geometry grade dropped from B to D since winter break - specific struggle with proofs',
                trend: 'declining',
                sinceDate: '2026-01-06',
                metric: { current: 62, threshold: 70 },
                suggestedAction: 'Assign peer tutor who excels at geometry proofs',
                actionType: 'schedule_tutoring',
            },
            {
                id: 'rf-st9-2',
                type: 'Assignment Completion',
                detail: 'Missing 30% of homework assignments across all classes this month',
                trend: 'declining',
                sinceDate: '2026-01-01',
                suggestedAction: 'Set up after-school homework club and parent check-in system',
                actionType: 'parent_outreach',
            },
        ],
        areasOfFocus: [
            {
                id: 'aof-st9-1',
                subject: 'Geometry',
                issue: 'Cannot complete geometric proofs independently',
                teacherName: 'Emily Chen',
                teacherId: 't5',
                occurrences: 6,
                lastDate: '2026-01-29',
                rootCause: 'Missed foundational logic unit due to illness in October - never caught up',
                recommendedAction: 'Provide recorded lessons from missed unit and schedule makeup sessions',
                actionType: 'schedule_tutoring',
            },
        ],
    },
    'st10': {
        id: 'st10',
        schoolId: 's2',
        name: 'Maya Green',
        initials: 'MG',
        grade: 9,
        gpa: 2.0,
        subjects: ['Algebra I', 'English', 'Biology', 'Geography', 'PE'],
        badges: [],
        status: 'at-risk',
        riskScore: 67,
        riskFactors: [
            {
                id: 'rf-st10-1',
                type: 'GPA at Threshold',
                detail: 'GPA exactly at 2.0 minimum - one more failed assignment could trigger academic probation',
                trend: 'stable',
                sinceDate: '2025-12-01',
                metric: { current: 2.0, threshold: 2.0 },
                suggestedAction: 'Meet with student to create grade recovery plan for each class',
                actionType: 'schedule_tutoring',
            },
            {
                id: 'rf-st10-2',
                type: 'Chronic Tardiness',
                detail: 'Late to 1st period 12 times this semester - missing morning instruction in Algebra',
                trend: 'stable',
                sinceDate: '2025-09-01',
                metric: { current: 12, threshold: 5 },
                suggestedAction: 'Investigate transportation issues and adjust schedule if needed',
                actionType: 'parent_outreach',
            },
            {
                id: 'rf-st10-3',
                type: 'Missing Homework',
                detail: '8 missing homework assignments in Algebra I alone this month',
                trend: 'declining',
                sinceDate: '2026-01-01',
                suggestedAction: 'Daily homework check-in with teacher and parent notification system',
                actionType: 'parent_outreach',
            },
        ],
        areasOfFocus: [
            {
                id: 'aof-st10-1',
                subject: 'Algebra I',
                issue: 'Missing first period leading to gaps in daily lessons',
                teacherName: 'Michael Brown',
                teacherId: 't6',
                occurrences: 12,
                lastDate: '2026-01-30',
                rootCause: 'Transportation challenges - single parent household with early work schedule',
                recommendedAction: 'Connect family with district transportation services or adjust class schedule',
                actionType: 'parent_outreach',
            },
        ],
    },
    'st11': {
        id: 'st11',
        schoolId: 's3',
        name: 'Chris Martinez',
        initials: 'CM',
        grade: 11,
        gpa: 2.2,
        subjects: ['Algebra II', 'English', 'Physics', 'History', 'Art'],
        badges: [],
        status: 'at-risk',
        riskScore: 52,
        riskFactors: [
            {
                id: 'rf-st11-1',
                type: 'Science Struggle',
                detail: 'Physics grade at D- (61%) - struggling with mathematical applications in science',
                trend: 'declining',
                sinceDate: '2025-11-01',
                metric: { current: 61, threshold: 70 },
                suggestedAction: 'Schedule joint tutoring sessions covering math skills needed for physics',
                actionType: 'schedule_tutoring',
            },
            {
                id: 'rf-st11-2',
                type: 'Parent Engagement',
                detail: 'Missed parent-teacher conference in November - no response to follow-up emails',
                trend: 'stable',
                sinceDate: '2025-11-20',
                suggestedAction: 'Try phone call or send physical letter home with student',
                actionType: 'parent_outreach',
            },
        ],
        areasOfFocus: [
            {
                id: 'aof-st11-1',
                subject: 'Physics',
                issue: 'Cannot apply algebra concepts to physics problems',
                teacherName: 'Sarah Carter',
                teacherId: 't1',
                occurrences: 7,
                lastDate: '2026-01-28',
                rootCause: 'Algebra skills are shaky - needs integrated math/physics support',
                recommendedAction: 'Create bridge tutoring program connecting Algebra II and Physics concepts',
                actionType: 'schedule_tutoring',
            },
        ],
    },
};

const mockInsights: Insight[] = [
    {
        id: 'i1',
        entityType: 'school',
        entityId: 's1',
        severity: 'critical',
        title: 'Math Dept Underperformance',
        description: '3 teachers flagged for support - HDT recommended.',
        actionLabel: 'Enroll in HDT',
        actionPath: '/teacher/t2',
        impactMetric: 'Affects 45 students in Algebra I',
        rootCause: 'Lack of tiered intervention support for struggling students',
        priority: 'high',
    },
    {
        id: 'i2',
        entityType: 'school',
        entityId: 's1',
        severity: 'info',
        title: 'Science Fair Approaching',
        description: 'Budget approval pending for 12 kits.',
        actionLabel: 'Approve',
        impactMetric: '12 student projects pending resources',
        priority: 'medium',
    },
    {
        id: 'i3',
        entityType: 'school',
        entityId: 's2',
        severity: 'critical',
        title: 'Low Math Scores',
        description: 'Below district average by 15%',
        actionLabel: 'View Details',
        actionPath: '/school/s2',
        impactMetric: 'Grade 4 cohort showing steepest decline',
        rootCause: 'Curriculum misalignment in geometry unit',
        priority: 'high',
    },
    {
        id: 'i4',
        entityType: 'student',
        entityId: 'st11',
        severity: 'warning',
        title: 'Physics Grade Drop',
        description: 'Grade dropped from B to D- in 4 weeks.',
        actionLabel: 'View Student',
        actionPath: '/student/st11',
        impactMetric: 'Risk of failing semester',
        rootCause: 'Missing foundational algebra skills required for current unit',
        priority: 'medium',
    }
];

// ============== Analytics Mock Data ==============

export interface TrendDataPoint {
    month: string;
    performance: number;
    attendance: number;
    enrollment: number;
}

export interface SubjectMastery {
    subject: string;
    mastery: number;
    trend: number; // % change
    studentCount: number;
    category: string;
}

export interface DistrictMetrics {
    totalStudents: number;
    totalTeachers: number;
    totalSchools: number;
    atRiskCount: number;
    onTrackCount: number;
    excellingCount: number;
    avgPerformance: number;
    avgAttendance: number;
    activeInterventions: number;
    avgGPA: number;
    performanceTrend: number;
    attendanceTrend: number;
}

const mockTrendData: TrendDataPoint[] = [
    { month: 'Aug', performance: 78, attendance: 92, enrollment: 820 },
    { month: 'Sep', performance: 80, attendance: 91, enrollment: 845 },
    { month: 'Oct', performance: 82, attendance: 90, enrollment: 850 },
    { month: 'Nov', performance: 81, attendance: 88, enrollment: 855 },
    { month: 'Dec', performance: 84, attendance: 89, enrollment: 858 },
    { month: 'Jan', performance: 85, attendance: 91, enrollment: 865 },
];

const mockSubjectMastery: SubjectMastery[] = [
    { subject: 'Reading Comprehension', mastery: 88, trend: 3.2, studentCount: 680, category: 'Literacy' },
    { subject: 'Linear Equations', mastery: 72, trend: -2.1, studentCount: 540, category: 'Algebra' },
    { subject: 'Scientific Method', mastery: 81, trend: 1.5, studentCount: 420, category: 'Science' },
    { subject: 'Essay Writing', mastery: 85, trend: 4.0, studentCount: 610, category: 'Literacy' },
    { subject: 'Geometry Proofs', mastery: 64, trend: -5.3, studentCount: 320, category: 'Math' },
    { subject: 'US History', mastery: 79, trend: 0.8, studentCount: 480, category: 'Social Studies' },
    { subject: 'Photosynthesis', mastery: 76, trend: 2.3, studentCount: 380, category: 'Biology' },
    { subject: 'Quadratic Equations', mastery: 58, trend: -4.7, studentCount: 290, category: 'Algebra' },
    { subject: 'Spanish Vocab', mastery: 91, trend: 1.1, studentCount: 260, category: 'Language' },
    { subject: 'Data Analysis', mastery: 70, trend: -1.8, studentCount: 350, category: 'Math' },
];

// ============== Store ==============

interface DataState {
    districts: Record<string, District>;
    schools: Record<string, School>;
    teachers: Record<string, Teacher>;
    students: Record<string, Student>;
    insights: Insight[];
    trendData: TrendDataPoint[];
    subjectMastery: SubjectMastery[];

    // Selectors
    getDistrict: (id: string) => District | undefined;
    getSchool: (id: string) => School | undefined;
    getTeacher: (id: string) => Teacher | undefined;
    getStudent: (id: string) => Student | undefined;
    getSchoolsForDistrict: (districtId: string) => School[];
    getTeachersForSchool: (schoolId: string) => Teacher[];
    getStudentsForSchool: (schoolId: string) => Student[];
    getInsightsForEntity: (entityType: string, entityId: string) => Insight[];
    getDistrictMetrics: () => DistrictMetrics;
    getAtRiskStudents: () => Student[];
    getTopSkills: (limit?: number) => SubjectMastery[];
    getWeakestSkills: (limit?: number) => SubjectMastery[];
}

export const useDataStore = create<DataState>((set, get) => ({
    districts: mockDistricts,
    schools: mockSchools,
    teachers: mockTeachers,
    students: mockStudents,
    insights: mockInsights,
    trendData: mockTrendData,
    subjectMastery: mockSubjectMastery,

    getDistrict: (id: string) => get().districts[id],

    getSchool: (id: string) => get().schools[id],

    getTeacher: (id: string) => get().teachers[id],

    getStudent: (id: string) => get().students[id],

    getSchoolsForDistrict: (districtId: string) => {
        const district = get().districts[districtId];
        if (!district) return [];
        return district.schools
            .map(id => get().schools[id])
            .filter(Boolean) as School[];
    },

    getTeachersForSchool: (schoolId: string) => {
        return Object.values(get().teachers).filter(t => t.schoolId === schoolId);
    },

    getStudentsForSchool: (schoolId: string) => {
        return Object.values(get().students).filter(s => s.schoolId === schoolId);
    },

    getInsightsForEntity: (entityType: string, entityId: string) => {
        return get().insights.filter(
            i => i.entityType === entityType && i.entityId === entityId
        );
    },

    getDistrictMetrics: () => {
        const students = Object.values(get().students);
        const schools = Object.values(get().schools);
        const teachers = Object.values(get().teachers);

        const atRisk = students.filter(s => s.status === 'at-risk');
        const onTrack = students.filter(s => s.status === 'on-track');
        const excelling = students.filter(s => s.status === 'excelling');
        const avgPerf = schools.reduce((sum, s) => sum + s.performance, 0) / schools.length;
        const avgAtt = schools.reduce((sum, s) => sum + s.attendance, 0) / schools.length;
        const avgGPA = students.reduce((sum, s) => sum + s.gpa, 0) / students.length;
        const activeInterventions = students.reduce((sum, s) => sum + (s.riskFactors?.length || 0), 0);

        return {
            totalStudents: students.length,
            totalTeachers: teachers.length,
            totalSchools: schools.length,
            atRiskCount: atRisk.length,
            onTrackCount: onTrack.length,
            excellingCount: excelling.length,
            avgPerformance: Math.round(avgPerf),
            avgAttendance: Math.round(avgAtt),
            activeInterventions,
            avgGPA: parseFloat(avgGPA.toFixed(1)),
            performanceTrend: 3.2,
            attendanceTrend: -0.8,
        };
    },

    getAtRiskStudents: () => {
        return Object.values(get().students)
            .filter(s => s.status === 'at-risk')
            .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));
    },

    getTopSkills: (limit = 5) => {
        return [...get().subjectMastery]
            .sort((a, b) => b.mastery - a.mastery)
            .slice(0, limit);
    },

    getWeakestSkills: (limit = 5) => {
        return [...get().subjectMastery]
            .sort((a, b) => a.mastery - b.mastery)
            .slice(0, limit);
    },
}));

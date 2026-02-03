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

export interface StudentFeedback {
    id: string;
    studentName: string;
    studentInitials: string;
    grade: number;
    comment: string;
    rating: number; // 1-5
    subject?: string;
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
    studentFeedback?: StudentFeedback[];
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
        schools: ['s1', 's2', 's3', 's4', 's5', 's8', 's9'],
        performance: 88,
        status: 'good',
        totalStudents: 7030,
        totalTeachers: 384,
    },
    '2': {
        id: '2',
        name: 'Bay Area North',
        schools: ['s6', 's7'],
        performance: 92,
        status: 'good',
        totalStudents: 1700,
        totalTeachers: 86,
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
    's6': {
        id: 's6',
        districtId: '2',
        name: 'Bayside Academy',
        grade: 'A-',
        principal: 'Dr. K. Nguyen',
        students: 980,
        teachers: 44,
        performance: 91,
        attendance: 93,
        status: 'good',
        goals: {
            reading: { current: 93, target: 90 },
            math: { current: 88, target: 90 },
            attendance: { current: 93, target: 94 },
            tutoringEngagement: { current: 82, target: 80 },
        },
        aiSummary: {
            headline: 'Strong overall with minor math gap',
            details: [
                'Reading and literacy programs exceeding targets across all grade levels',
                'Math proficiency dipped 2% this quarter — concentrated in 10th grade Algebra II',
                'Derek Pham (Math) flagged: pacing complaints from students and low quiz averages',
                'Tutoring engagement healthy at 82% — peer tutoring pilot showing strong results',
            ],
            suggestedActions: ['Review math curriculum pacing with Derek Pham', 'Expand peer tutoring pilot to math department'],
        },
    },
    's7': {
        id: 's7',
        districtId: '2',
        name: 'Pacific Heights Middle',
        grade: 'B',
        principal: 'Mr. A. Fernandez',
        students: 720,
        teachers: 42,
        performance: 84,
        attendance: 90,
        status: 'good',
        goals: {
            reading: { current: 83, target: 85 },
            math: { current: 80, target: 84 },
            attendance: { current: 90, target: 92 },
            tutoringEngagement: { current: 68, target: 72 },
        },
        aiSummary: {
            headline: 'Steady performance with attendance improvement needed',
            details: [
                'Reading scores trending up +2.1% since September',
                'Math scores stable but below district target by 4 points',
                'Grade 7 cohort attendance lagging at 87% — 3% below school average',
                'Lisa Nakamura (Science) leading successful after-school STEM club',
            ],
            suggestedActions: ['Investigate Grade 7 attendance dip', 'Increase HDT enrollment for math cohort'],
        },
    },
    's8': {
        id: 's8',
        districtId: '1',
        name: 'Oakwood Elementary',
        grade: 'C',
        principal: 'Ms. D. Robinson',
        students: 540,
        teachers: 24,
        performance: 68,
        attendance: 82,
        status: 'alert',
        goals: {
            reading: { current: 64, target: 80 },
            math: { current: 58, target: 76 },
            attendance: { current: 82, target: 90 },
            tutoringEngagement: { current: 35, target: 65 },
        },
        aiSummary: {
            headline: 'Critical: Multiple metrics below threshold',
            details: [
                'Math proficiency at 58% — lowest in district, 18 points below target',
                'Patricia Morales (Math) overwhelmed: 38 students per class, highest ratio in district',
                'Reading scores 16 points below target — no dedicated reading specialist on staff',
                'Tutoring engagement at 35% — families report transportation barriers to after-school programs',
                'Chronic absenteeism rate of 18% — highest in Central Valley',
            ],
            suggestedActions: ['Emergency staffing request for math support', 'Launch in-school tutoring during lunch periods', 'Connect families with district transportation services'],
        },
    },
    's9': {
        id: 's9',
        districtId: '1',
        name: 'Riverside High',
        grade: 'B+',
        principal: 'Dr. T. Alvarez',
        students: 1300,
        teachers: 48,
        performance: 87,
        attendance: 92,
        status: 'good',
        goals: {
            reading: { current: 88, target: 86 },
            math: { current: 85, target: 88 },
            attendance: { current: 92, target: 93 },
            tutoringEngagement: { current: 78, target: 80 },
        },
        aiSummary: {
            headline: 'Trending upward — close to top tier',
            details: [
                'Performance improved 5 points since August — fastest growth in district',
                'Karen Yoo (Science Dept Head) driving STEM innovation with 4.5 rating',
                'Math within 3 points of target — Algebra II cohort improving with HDT support',
                'College readiness scores up 8% year-over-year',
            ],
            suggestedActions: ['Nominate for district excellence recognition', 'Share STEM program methodology with other schools'],
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
        studentFeedback: [
            { id: 'fb-t1-1', studentName: 'Emma Wilson', studentInitials: 'EW', grade: 11, rating: 5, subject: 'AP Physics', comment: 'Mrs. Carter makes physics actually exciting. Her lab experiments are the highlight of my week.' },
            { id: 'fb-t1-2', studentName: 'Liam Patel', studentInitials: 'LP', grade: 10, rating: 5, subject: 'Physics', comment: 'Best teacher I have ever had. She explains complex topics so clearly.' },
            { id: 'fb-t1-3', studentName: 'Olivia Davis', studentInitials: 'OD', grade: 11, rating: 4, subject: 'AP Physics', comment: 'Class is challenging but Mrs. Carter is always available for extra help after school.' },
            { id: 'fb-t1-4', studentName: 'Noah Garcia', studentInitials: 'NG', grade: 10, rating: 5, subject: 'Physics', comment: 'She genuinely cares about us understanding the material, not just memorizing.' },
            { id: 'fb-t1-5', studentName: 'Ava Martinez', studentInitials: 'AM', grade: 11, rating: 5, subject: 'AP Physics', comment: 'I went from hating science to considering it as a major because of this class.' },
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
        studentFeedback: [
            { id: 'fb-t2-1', studentName: 'Alex Kim', studentInitials: 'AK', grade: 10, rating: 2, subject: 'Algebra II', comment: 'Hard to follow the lessons. Feels like he rushes through everything.' },
            { id: 'fb-t2-2', studentName: 'Sophia Lee', studentInitials: 'SL', grade: 10, rating: 3, subject: 'Algebra I', comment: 'Mr. Doe knows the material but could be better at explaining it step by step.' },
            { id: 'fb-t2-3', studentName: 'Mason Clark', studentInitials: 'MC', grade: 9, rating: 2, subject: 'Algebra I', comment: 'The class is too fast-paced and I feel lost most of the time.' },
            { id: 'fb-t2-4', studentName: 'Isabella Torres', studentInitials: 'IT', grade: 10, rating: 3, subject: 'Algebra II', comment: 'Some days are good, but grading feels inconsistent and unclear.' },
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
        studentFeedback: [
            { id: 'fb-t3-1', studentName: 'Chloe Nguyen', studentInitials: 'CN', grade: 8, rating: 5, subject: 'English', comment: 'Ms. Lopez made me love reading. Her book recommendations changed my life.' },
            { id: 'fb-t3-2', studentName: 'Ethan Brooks', studentInitials: 'EB', grade: 7, rating: 4, subject: 'English', comment: 'She pushes us to think critically about what we read, not just summarize.' },
            { id: 'fb-t3-3', studentName: 'Mia Johnson', studentInitials: 'MJ', grade: 8, rating: 5, subject: 'Creative Writing', comment: 'The creative writing workshop she runs is incredible. I feel like a real writer.' },
            { id: 'fb-t3-4', studentName: 'James Wright', studentInitials: 'JW', grade: 7, rating: 4, subject: 'English', comment: 'Fair grader and always gives detailed feedback on essays.' },
            { id: 'fb-t3-5', studentName: 'Zoe Campbell', studentInitials: 'ZC', grade: 8, rating: 5, subject: 'English', comment: 'Ms. Lopez is the reason I want to study journalism in college.' },
            { id: 'fb-t3-6', studentName: 'Daniel Rivera', studentInitials: 'DR', grade: 7, rating: 4, subject: 'English', comment: 'Class discussions are always engaging. She makes everyone feel heard.' },
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
        studentFeedback: [
            { id: 'fb-t4-1', studentName: 'Ryan Mitchell', studentInitials: 'RM', grade: 11, rating: 4, subject: 'US History', comment: 'Mr. Kim makes history feel relevant to today. His debate sessions are great.' },
            { id: 'fb-t4-2', studentName: 'Hannah Scott', studentInitials: 'HS', grade: 10, rating: 4, subject: 'World History', comment: 'I actually look forward to history class. He tells stories, not just facts.' },
            { id: 'fb-t4-3', studentName: 'Tyler Adams', studentInitials: 'TA', grade: 11, rating: 5, subject: 'US History', comment: 'The Debate Club he started is the best thing that happened to our school.' },
            { id: 'fb-t4-4', studentName: 'Lily Chen', studentInitials: 'LC', grade: 10, rating: 4, subject: 'World History', comment: 'Good teacher overall. Sometimes the workload is heavy but I learn a lot.' },
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
        studentFeedback: [
            { id: 'fb-t5-1', studentName: 'Sophie Anderson', studentInitials: 'SA', grade: 8, rating: 5, subject: 'Pre-Algebra', comment: 'Mrs. Chen made me realize I can actually be good at math. She never gives up on you.' },
            { id: 'fb-t5-2', studentName: 'Lucas Hernandez', studentInitials: 'LH', grade: 7, rating: 5, subject: 'Math 7', comment: 'She explains things in so many different ways until everyone gets it.' },
            { id: 'fb-t5-3', studentName: 'Grace Taylor', studentInitials: 'GT', grade: 8, rating: 4, subject: 'Pre-Algebra', comment: 'Challenging class but the extra practice sessions she offers really help.' },
            { id: 'fb-t5-4', studentName: 'Benjamin Flores', studentInitials: 'BF', grade: 7, rating: 5, subject: 'Math 7', comment: 'Best math teacher in the district. Her review games before tests are legendary.' },
            { id: 'fb-t5-5', studentName: 'Aria Thompson', studentInitials: 'AT', grade: 8, rating: 5, subject: 'Pre-Algebra', comment: 'I went from a C to an A this year all because of how Mrs. Chen teaches.' },
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
        studentFeedback: [
            { id: 'fb-t6-1', studentName: 'Jack Robinson', studentInitials: 'JR', grade: 7, rating: 2, subject: 'Biology', comment: 'The labs feel disorganized and I never know what we are supposed to be doing.' },
            { id: 'fb-t6-2', studentName: 'Samantha White', studentInitials: 'SW', grade: 8, rating: 3, subject: 'Biology', comment: 'Mr. Brown is nice but the class feels unstructured compared to my other classes.' },
            { id: 'fb-t6-3', studentName: 'David Park', studentInitials: 'DP', grade: 7, rating: 2, subject: 'Biology', comment: 'I wish we had more hands-on experiments instead of just reading from the textbook.' },
        ],
    },
    't7': {
        id: 't7',
        schoolId: 's6',
        name: 'Angela Reeves',
        initials: 'AR',
        department: 'English',
        role: 'English Department Head',
        rating: 4.6,
        classes: 5,
        studentCount: 128,
        tenure: 7,
        status: 'active',
        awards: ['Bay Area Educator of the Year 2024'],
        timeline: [
            { year: '2025-09', title: 'Curriculum Redesign', text: 'Led overhaul of 9th–12th grade English curriculum to include contemporary voices.' },
            { year: '2024-06', title: 'Award Received', text: 'Named Bay Area Educator of the Year for literacy innovation.' },
            { year: '2022-08', title: 'Promoted', text: 'Appointed English Department Head.' },
            { year: '2019-08', title: 'Hired', text: 'Joined Bayside Academy English department.' },
        ],
        studentFeedback: [
            { id: 'fb-t7-1', studentName: 'Nina Patel', studentInitials: 'NP', grade: 11, rating: 5, subject: 'AP English', comment: 'Ms. Reeves changed how I think about literature. Her Socratic seminars are incredible.' },
            { id: 'fb-t7-2', studentName: 'Jordan Lee', studentInitials: 'JL', grade: 10, rating: 5, subject: 'English', comment: 'She gives the most helpful feedback on essays. I improved two letter grades this semester.' },
            { id: 'fb-t7-3', studentName: 'Priya Sharma', studentInitials: 'PS', grade: 11, rating: 4, subject: 'AP English', comment: 'Challenging workload but fair. She pushes you to be a better writer.' },
            { id: 'fb-t7-4', studentName: 'Diego Morales', studentInitials: 'DM', grade: 10, rating: 5, subject: 'English', comment: 'First teacher who made Shakespeare feel relevant. Her teaching style is engaging.' },
        ],
    },
    't8': {
        id: 't8',
        schoolId: 's6',
        name: 'Derek Pham',
        initials: 'DP',
        department: 'Math',
        role: 'Math Teacher',
        rating: 2.9,
        classes: 5,
        studentCount: 146,
        tenure: 3,
        status: 'flagged',
        awards: [],
        timeline: [
            { year: '2026-01', title: 'Pacing Concerns', text: 'Department head flagged curriculum pacing — students report material moving too fast.' },
            { year: '2025-10', title: 'Low Quiz Averages', text: 'Class quiz average dropped to 61% across all sections, below 72% department average.' },
            { year: '2025-08', title: 'Increased Load', text: 'Assigned 5 sections (up from 3) due to enrollment growth — highest class sizes in math dept.' },
            { year: '2023-08', title: 'Hired', text: 'Joined Bayside Academy math department.' },
        ],
        performanceIssues: [
            { id: 'pi-t8-1', type: 'Curriculum Pacing', description: 'Students report lessons move too fast — 62% of students in Algebra II scored below proficiency on Unit 4 assessment. Department average was 78%.', severity: 'high', date: '2026-01-18', status: 'open' },
            { id: 'pi-t8-2', type: 'Student Engagement', description: 'Classroom observation on 11/15 noted minimal student interaction — lecture-only format with no formative checks. 8 students observed off-task.', severity: 'medium', date: '2025-11-15', status: 'open' },
        ],
        studentFeedback: [
            { id: 'fb-t8-1', studentName: 'Kai Nakamura', studentInitials: 'KN', grade: 10, rating: 2, subject: 'Algebra II', comment: 'He goes way too fast. By the time I understand one concept, we are on the next.' },
            { id: 'fb-t8-2', studentName: 'Zara Ahmed', studentInitials: 'ZA', grade: 10, rating: 3, subject: 'Geometry', comment: 'Mr. Pham knows the math but does not check if we actually get it before moving on.' },
            { id: 'fb-t8-3', studentName: 'Ethan Cho', studentInitials: 'EC', grade: 11, rating: 2, subject: 'Algebra II', comment: 'I had an A in math last year and now I have a C. Something is wrong with the pacing.' },
            { id: 'fb-t8-4', studentName: 'Mia Santos', studentInitials: 'MS', grade: 10, rating: 3, subject: 'Geometry', comment: 'Nice teacher but I need more practice problems before tests. We never do enough examples.' },
        ],
    },
    't9': {
        id: 't9',
        schoolId: 's7',
        name: 'Lisa Nakamura',
        initials: 'LN',
        department: 'Science',
        role: 'Science Department Head',
        rating: 4.4,
        classes: 4,
        studentCount: 104,
        tenure: 6,
        status: 'active',
        awards: ['STEM Innovation Grant 2023'],
        timeline: [
            { year: '2025-11', title: 'STEM Club Launch', text: 'Founded after-school STEM club — 45 students enrolled in first semester.' },
            { year: '2023-09', title: 'Grant Awarded', text: 'Won $8,000 STEM Innovation Grant for robotics lab equipment.' },
            { year: '2022-08', title: 'Dept Head', text: 'Promoted to Science Department Head.' },
            { year: '2020-08', title: 'Hired', text: 'Joined Pacific Heights Middle School.' },
        ],
        studentFeedback: [
            { id: 'fb-t9-1', studentName: 'Aiden Cruz', studentInitials: 'AC', grade: 8, rating: 5, subject: 'Earth Science', comment: 'The STEM club is amazing. We built actual robots and Ms. Nakamura helped us enter competitions.' },
            { id: 'fb-t9-2', studentName: 'Lily Tran', studentInitials: 'LT', grade: 7, rating: 4, subject: 'Life Science', comment: 'Really fun experiments. She makes science hands-on instead of just reading about it.' },
            { id: 'fb-t9-3', studentName: 'Omar Hassan', studentInitials: 'OH', grade: 8, rating: 5, subject: 'Earth Science', comment: 'Ms. Nakamura connects everything to real life. I actually understand why science matters now.' },
            { id: 'fb-t9-4', studentName: 'Sofia Petrov', studentInitials: 'SP', grade: 7, rating: 4, subject: 'Life Science', comment: 'She is patient and explains things well. I am not a science person but I like this class.' },
        ],
    },
    't10': {
        id: 't10',
        schoolId: 's4',
        name: 'James O\'Brien',
        initials: 'JO',
        department: 'History',
        role: 'AP History Teacher',
        rating: 4.3,
        classes: 4,
        studentCount: 96,
        tenure: 9,
        status: 'active',
        awards: ['Mock Trial Coach of the Year 2024'],
        timeline: [
            { year: '2025-05', title: 'Mock Trial Victory', text: 'Coached team to regional Mock Trial championship — first time in school history.' },
            { year: '2024-08', title: 'AP Expansion', text: 'Added AP Government section due to student demand.' },
            { year: '2017-08', title: 'Hired', text: 'Joined Jefferson High as History teacher.' },
        ],
        studentFeedback: [
            { id: 'fb-t10-1', studentName: 'Claire Donovan', studentInitials: 'CD', grade: 12, rating: 5, subject: 'AP US History', comment: 'Mr. O\'Brien makes history come alive. His primary source analysis sessions are college-level.' },
            { id: 'fb-t10-2', studentName: 'Marcus Reed', studentInitials: 'MR', grade: 11, rating: 4, subject: 'US History', comment: 'He is passionate about what he teaches. You can tell he genuinely loves history.' },
            { id: 'fb-t10-3', studentName: 'Elena Vasquez', studentInitials: 'EV', grade: 12, rating: 5, subject: 'AP Government', comment: 'Best teacher at Jefferson. Mock Trial with him was the highlight of my high school career.' },
        ],
    },
    't11': {
        id: 't11',
        schoolId: 's8',
        name: 'Patricia Morales',
        initials: 'PM',
        department: 'Math',
        role: 'Math Teacher',
        rating: 3.0,
        classes: 5,
        studentCount: 162,
        tenure: 4,
        status: 'flagged',
        awards: [],
        timeline: [
            { year: '2026-01', title: 'Overwhelmed Report', text: 'Submitted request for aide support — managing 38 students per class with no assistant.' },
            { year: '2025-09', title: 'Class Size Increase', text: 'Sections grew from 28 to 38 students after unfilled position was not replaced.' },
            { year: '2025-03', title: 'Positive Review', text: 'Mid-year review was satisfactory — before class sizes increased.' },
            { year: '2022-08', title: 'Hired', text: 'Joined Oakwood Elementary as Math teacher.' },
        ],
        performanceIssues: [
            { id: 'pi-t11-1', type: 'Class Size Impact', description: 'Student-teacher ratio of 38:1 (district average is 24:1). Unable to provide individualized feedback — homework return time increased from 2 days to 8 days.', severity: 'high', date: '2026-01-08', status: 'open' },
            { id: 'pi-t11-2', type: 'Assessment Scores', description: 'Class math proficiency dropped from 71% to 58% after class size increase. Not attributed to teaching quality — directly correlated with resource constraints.', severity: 'medium', date: '2025-12-20', status: 'open' },
        ],
        studentFeedback: [
            { id: 'fb-t11-1', studentName: 'Rosa Gutierrez', studentInitials: 'RG', grade: 5, rating: 3, subject: 'Math', comment: 'Ms. Morales is nice but the class is too crowded. She can not help everyone who needs it.' },
            { id: 'fb-t11-2', studentName: 'Kevin Huang', studentInitials: 'KH', grade: 4, rating: 3, subject: 'Math', comment: 'I like math but I wish we got our homework back faster so I know what I did wrong.' },
            { id: 'fb-t11-3', studentName: 'Jasmine Walker', studentInitials: 'JW', grade: 5, rating: 4, subject: 'Math', comment: 'She tries really hard but there are too many kids and it gets loud. Hard to focus.' },
        ],
    },
    't12': {
        id: 't12',
        schoolId: 's5',
        name: 'David Washington',
        initials: 'DW',
        department: 'English',
        role: 'English Teacher',
        rating: 3.8,
        classes: 3,
        studentCount: 72,
        tenure: 2,
        status: 'active',
        awards: [],
        timeline: [
            { year: '2025-11', title: 'Positive Feedback', text: 'Principal noted improvement in student writing scores — up 12% since September.' },
            { year: '2025-08', title: 'New Assignment', text: 'Took over 3rd grade reading intervention group.' },
            { year: '2024-08', title: 'Hired', text: 'Joined Adams Elementary English department.' },
        ],
        studentFeedback: [
            { id: 'fb-t12-1', studentName: 'Aaliyah Carter', studentInitials: 'AC', grade: 3, rating: 4, subject: 'Reading', comment: 'Mr. Washington reads to us every day and makes the voices funny. I love reading now.' },
            { id: 'fb-t12-2', studentName: 'Leo Kim', studentInitials: 'LK', grade: 4, rating: 4, subject: 'English', comment: 'He helps me sound out hard words without making me feel dumb.' },
            { id: 'fb-t12-3', studentName: 'Maya Okafor', studentInitials: 'MO', grade: 3, rating: 5, subject: 'Reading', comment: 'Best teacher! He always picks books I actually want to read.' },
        ],
    },
    't13': {
        id: 't13',
        schoolId: 's9',
        name: 'Karen Yoo',
        initials: 'KY',
        department: 'Science',
        role: 'Science Department Head',
        rating: 4.5,
        classes: 4,
        studentCount: 116,
        tenure: 8,
        status: 'active',
        awards: ['District STEM Leader Award 2025', 'AP Board Recognition'],
        timeline: [
            { year: '2025-12', title: 'STEM Award', text: 'Recognized as District STEM Leader for AP Chemistry pass rate improvement.' },
            { year: '2025-03', title: 'AP Results', text: 'AP Chemistry pass rate reached 84% — highest in district history.' },
            { year: '2021-08', title: 'Dept Head', text: 'Promoted to Science Department Head at Riverside High.' },
            { year: '2018-08', title: 'Hired', text: 'Joined Riverside High Science department.' },
        ],
        studentFeedback: [
            { id: 'fb-t13-1', studentName: 'Ryan Nakamura', studentInitials: 'RN', grade: 12, rating: 5, subject: 'AP Chemistry', comment: 'Mrs. Yoo is the reason I scored a 5 on the AP exam. Her review sessions were incredible.' },
            { id: 'fb-t13-2', studentName: 'Amara Williams', studentInitials: 'AW', grade: 11, rating: 5, subject: 'Chemistry', comment: 'She makes chemistry click. The lab experiments are always well-organized and interesting.' },
            { id: 'fb-t13-3', studentName: 'Jason Park', studentInitials: 'JP', grade: 12, rating: 4, subject: 'AP Chemistry', comment: 'Demanding but worth it. I feel prepared for college-level science because of this class.' },
            { id: 'fb-t13-4', studentName: 'Isabelle Torres', studentInitials: 'IT', grade: 11, rating: 5, subject: 'Chemistry', comment: 'She stays after school to help anyone who needs it. Best science teacher I have ever had.' },
        ],
    },
    't14': {
        id: 't14',
        schoolId: 's2',
        name: 'Marcus Thompson',
        initials: 'MT',
        department: 'Math',
        role: 'Math Teacher',
        rating: 2.6,
        classes: 4,
        studentCount: 92,
        tenure: 1,
        status: 'flagged',
        awards: [],
        timeline: [
            { year: '2026-01', title: 'Support Plan Initiated', text: 'Paired with Emily Chen (Washington Middle) for cross-school mentorship after low observation scores.' },
            { year: '2025-11', title: 'Classroom Observation', text: 'Observation scored 2/5 on engagement rubric — students disengaged during fraction unit.' },
            { year: '2025-08', title: 'Hired', text: 'First teaching position — joined Roosevelt Elementary math department.' },
        ],
        performanceIssues: [
            { id: 'pi-t14-1', type: 'Instructional Quality', description: 'Observation on 11/8 scored 2/5 on engagement rubric. Lesson on fractions relied entirely on worksheet packets — no visual aids, manipulatives, or interactive elements used.', severity: 'high', date: '2025-11-08', status: 'open' },
            { id: 'pi-t14-2', type: 'Assessment Design', description: 'Unit tests consistently too difficult — class average of 48% on Unit 3 test vs department expectation of 70%. Questions not aligned with instruction level.', severity: 'medium', date: '2025-12-15', status: 'open' },
            { id: 'pi-t14-3', type: 'Student Retention', description: '4 parent requests to transfer students out of his sections — citing lack of confidence that child is learning foundational skills.', severity: 'high', date: '2026-01-22', status: 'open' },
        ],
        studentFeedback: [
            { id: 'fb-t14-1', studentName: 'Destiny Brown', studentInitials: 'DB', grade: 5, rating: 2, subject: 'Math', comment: 'He gives us worksheets and sits at his desk. I do not understand the math but he does not explain.' },
            { id: 'fb-t14-2', studentName: 'Andre Jackson', studentInitials: 'AJ', grade: 4, rating: 1, subject: 'Math', comment: 'I used to like math but now I hate it. The tests are way harder than what we practice.' },
            { id: 'fb-t14-3', studentName: 'Fatima Al-Hassan', studentInitials: 'FA', grade: 5, rating: 2, subject: 'Math', comment: 'When I ask for help he just says try harder. I need someone to actually show me how.' },
            { id: 'fb-t14-4', studentName: 'Isaiah Williams', studentInitials: 'IW', grade: 4, rating: 3, subject: 'Math', comment: 'Some weeks are okay but most of the time I feel lost. My mom wants to move me to another class.' },
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
    // ---- Excelling students ----
    'st12': {
        id: 'st12',
        schoolId: 's4',
        name: 'Olivia Bennett',
        initials: 'OB',
        grade: 12,
        gpa: 4.0,
        subjects: ['AP Calculus', 'AP English', 'AP Chemistry', 'AP Government', 'Spanish IV'],
        badges: ['Valedictorian Candidate', 'AP Scholar', 'National Honor Society'],
        status: 'excelling',
    },
    'st13': {
        id: 'st13',
        schoolId: 's6',
        name: 'Kai Nakamura',
        initials: 'KN',
        grade: 10,
        gpa: 3.7,
        subjects: ['Algebra II', 'English', 'Chemistry', 'World History', 'Art'],
        badges: ['Honor Roll', 'Student Council'],
        status: 'excelling',
        areasOfFocus: [
            {
                id: 'aof-st13-1',
                subject: 'Algebra II',
                issue: 'Grades slipping due to pacing in Mr. Pham\'s class',
                teacherName: 'Derek Pham',
                teacherId: 't8',
                occurrences: 2,
                lastDate: '2026-01-25',
                rootCause: 'Class pacing too fast — student is capable but not getting enough practice before assessments',
                recommendedAction: 'Provide supplemental practice sets and consider moving to slower-paced section',
                actionType: 'send_email',
            },
        ],
    },
    'st14': {
        id: 'st14',
        schoolId: 's9',
        name: 'Amara Williams',
        initials: 'AW',
        grade: 11,
        gpa: 3.9,
        subjects: ['Chemistry', 'Pre-Calculus', 'AP English', 'US History', 'French III'],
        badges: ['Honor Roll', 'Science Fair Winner', 'Varsity Track'],
        status: 'excelling',
    },
    'st15': {
        id: 'st15',
        schoolId: 's3',
        name: 'Lucas Hernandez',
        initials: 'LH',
        grade: 7,
        gpa: 3.6,
        subjects: ['Math 7', 'English', 'Life Science', 'Social Studies', 'Band'],
        badges: ['Honor Roll', 'Perfect Attendance'],
        status: 'excelling',
    },
    // ---- On-track students ----
    'st16': {
        id: 'st16',
        schoolId: 's5',
        name: 'Aaliyah Carter',
        initials: 'AC',
        grade: 3,
        gpa: 3.1,
        subjects: ['Reading', 'Math', 'Science', 'Social Studies', 'Art'],
        badges: ['Reading Star'],
        status: 'on-track',
        areasOfFocus: [
            {
                id: 'aof-st16-1',
                subject: 'Math',
                issue: 'Multiplication tables not yet memorized',
                teacherName: 'Patricia Morales',
                teacherId: 't11',
                occurrences: 3,
                lastDate: '2026-01-20',
                rootCause: 'Needs more repetition — responding well to flash card practice but not yet automatic',
                recommendedAction: 'Send home multiplication practice packet and set up daily 5-minute drill',
                actionType: 'send_email',
            },
        ],
    },
    'st17': {
        id: 'st17',
        schoolId: 's7',
        name: 'Omar Hassan',
        initials: 'OH',
        grade: 8,
        gpa: 2.9,
        subjects: ['Pre-Algebra', 'English', 'Earth Science', 'Social Studies', 'PE'],
        badges: [],
        status: 'on-track',
        areasOfFocus: [
            {
                id: 'aof-st17-1',
                subject: 'Pre-Algebra',
                issue: 'Inconsistent homework completion',
                teacherName: 'Lisa Nakamura',
                teacherId: 't9',
                occurrences: 4,
                lastDate: '2026-01-28',
                rootCause: 'Works part-time after school — limited study time on weekdays',
                recommendedAction: 'Offer lunch study hall option and adjust homework deadlines to weekends',
                actionType: 'send_email',
            },
        ],
    },
    'st18': {
        id: 'st18',
        schoolId: 's8',
        name: 'Rosa Gutierrez',
        initials: 'RG',
        grade: 5,
        gpa: 2.8,
        subjects: ['Math', 'Reading', 'Science', 'Social Studies', 'Music'],
        badges: [],
        status: 'on-track',
    },
    'st19': {
        id: 'st19',
        schoolId: 's9',
        name: 'Jason Park',
        initials: 'JP',
        grade: 12,
        gpa: 3.3,
        subjects: ['AP Chemistry', 'Calculus', 'English', 'Economics', 'PE'],
        badges: ['Science Club President'],
        status: 'on-track',
        areasOfFocus: [
            {
                id: 'aof-st19-1',
                subject: 'Calculus',
                issue: 'Struggling with integration techniques',
                teacherName: 'Karen Yoo',
                teacherId: 't13',
                occurrences: 3,
                lastDate: '2026-01-27',
                rootCause: 'Strong in conceptual understanding but making procedural errors under time pressure',
                recommendedAction: 'Practice timed problem sets and review common integration patterns',
                actionType: 'schedule_tutoring',
            },
        ],
    },
    // ---- At-risk students ----
    'st20': {
        id: 'st20',
        schoolId: 's6',
        name: 'Zara Ahmed',
        initials: 'ZA',
        grade: 10,
        gpa: 1.8,
        subjects: ['Geometry', 'English', 'Biology', 'World History', 'PE'],
        badges: [],
        status: 'at-risk',
        riskScore: 78,
        riskFactors: [
            {
                id: 'rf-st20-1',
                type: 'Critical GPA',
                detail: 'GPA dropped from 2.6 to 1.8 since October — failing Geometry (48%) and Biology (55%)',
                trend: 'declining',
                sinceDate: '2025-10-01',
                metric: { current: 1.8, threshold: 2.0 },
                suggestedAction: 'Immediate HDT enrollment for Geometry with focus on proof-based reasoning',
                actionType: 'enroll_hdt',
            },
            {
                id: 'rf-st20-2',
                type: 'Disengagement',
                detail: 'Teacher reports note Zara has stopped participating in class discussions and group work since November',
                trend: 'declining',
                sinceDate: '2025-11-01',
                suggestedAction: 'Counselor meeting to assess emotional wellbeing and connect with support resources',
                actionType: 'parent_outreach',
            },
            {
                id: 'rf-st20-3',
                type: 'Missing Work',
                detail: '11 missing assignments across 3 classes in January alone — up from 2 in September',
                trend: 'declining',
                sinceDate: '2026-01-01',
                metric: { current: 11, threshold: 3 },
                suggestedAction: 'Establish daily assignment check-in system with parent notification',
                actionType: 'parent_outreach',
            },
        ],
        areasOfFocus: [
            {
                id: 'aof-st20-1',
                subject: 'Geometry',
                issue: 'Cannot complete proofs or apply theorems to multi-step problems',
                teacherName: 'Derek Pham',
                teacherId: 't8',
                occurrences: 8,
                lastDate: '2026-01-29',
                rootCause: 'Class pacing too fast for her learning style — combined with growing disengagement creating compounding gaps',
                recommendedAction: 'Transfer to smaller section if available, enroll in geometry HDT 3x/week',
                actionType: 'enroll_hdt',
            },
        ],
    },
    'st21': {
        id: 'st21',
        schoolId: 's7',
        name: 'Ethan Rivera',
        initials: 'ER',
        grade: 7,
        gpa: 2.0,
        subjects: ['Math 7', 'English', 'Life Science', 'Social Studies', 'Art'],
        badges: [],
        status: 'at-risk',
        riskScore: 63,
        riskFactors: [
            {
                id: 'rf-st21-1',
                type: 'Math Performance',
                detail: 'Math 7 grade at D (62%) — struggling with ratios, proportions, and percent applications',
                trend: 'declining',
                sinceDate: '2025-11-15',
                metric: { current: 62, threshold: 70 },
                suggestedAction: 'Enroll in after-school math tutoring with focus on proportional reasoning',
                actionType: 'schedule_tutoring',
            },
            {
                id: 'rf-st21-2',
                type: 'Attendance',
                detail: '3 unexcused absences this month — all on days with math tests or quizzes',
                trend: 'stable',
                sinceDate: '2026-01-01',
                metric: { current: 3, threshold: 2 },
                suggestedAction: 'Parent conference to discuss test avoidance pattern and math anxiety support',
                actionType: 'parent_outreach',
            },
        ],
        areasOfFocus: [
            {
                id: 'aof-st21-1',
                subject: 'Math 7',
                issue: 'Test avoidance behavior — scores drop significantly on in-class assessments vs homework',
                teacherName: 'Lisa Nakamura',
                teacherId: 't9',
                occurrences: 5,
                lastDate: '2026-01-28',
                rootCause: 'Math anxiety triggered by timed testing — homework average is 78% but test average is 51%',
                recommendedAction: 'Implement extended time accommodation and build test confidence with low-stakes quizzes',
                actionType: 'parent_outreach',
            },
        ],
    },
    'st22': {
        id: 'st22',
        schoolId: 's8',
        name: 'Kevin Huang',
        initials: 'KH',
        grade: 4,
        gpa: 1.6,
        subjects: ['Math', 'Reading', 'Science', 'Social Studies', 'PE'],
        badges: [],
        status: 'at-risk',
        riskScore: 82,
        riskFactors: [
            {
                id: 'rf-st22-1',
                type: 'Reading Level',
                detail: 'Reading 2 grade levels behind — assessed at 2nd grade level in January diagnostic',
                trend: 'stable',
                sinceDate: '2025-09-01',
                metric: { current: 2, threshold: 4 },
                suggestedAction: 'Daily 30-minute reading intervention with literacy specialist',
                actionType: 'enroll_hdt',
            },
            {
                id: 'rf-st22-2',
                type: 'Math Foundations',
                detail: 'Cannot perform long division or work with fractions — prerequisite skills for 4th grade math',
                trend: 'declining',
                sinceDate: '2025-10-01',
                metric: { current: 52, threshold: 70 },
                suggestedAction: 'Enroll in intensive math HDT targeting 3rd grade foundational gaps',
                actionType: 'enroll_hdt',
            },
            {
                id: 'rf-st22-3',
                type: 'Overcrowded Classroom',
                detail: 'In Ms. Morales\' class of 38 students — unable to receive individualized attention during lessons',
                trend: 'stable',
                sinceDate: '2025-09-01',
                suggestedAction: 'Priority placement in smaller intervention group during math block',
                actionType: 'schedule_tutoring',
            },
        ],
        areasOfFocus: [
            {
                id: 'aof-st22-1',
                subject: 'Math',
                issue: 'Foundational gaps preventing grade-level work',
                teacherName: 'Patricia Morales',
                teacherId: 't11',
                occurrences: 15,
                lastDate: '2026-01-30',
                rootCause: '3rd grade skills never mastered — compounded by large class size preventing individualized reteaching',
                recommendedAction: 'Pull-out intervention 4x/week with focus on multiplication, division, and basic fractions',
                actionType: 'enroll_hdt',
            },
        ],
    },
    'st23': {
        id: 'st23',
        schoolId: 's9',
        name: 'Destiny Brown',
        initials: 'DB',
        grade: 10,
        gpa: 2.1,
        subjects: ['Algebra II', 'English', 'Biology', 'World History', 'Choir'],
        badges: [],
        status: 'at-risk',
        riskScore: 55,
        riskFactors: [
            {
                id: 'rf-st23-1',
                type: 'Academic Decline',
                detail: 'GPA dropped from 2.8 to 2.1 — Algebra II grade is F (47%), pulling overall average down',
                trend: 'declining',
                sinceDate: '2025-11-01',
                metric: { current: 2.1, threshold: 2.5 },
                suggestedAction: 'Targeted Algebra II tutoring 3x/week with focus on polynomial operations',
                actionType: 'enroll_hdt',
            },
            {
                id: 'rf-st23-2',
                type: 'Emotional Wellbeing',
                detail: 'English teacher reports Destiny appears withdrawn — previously active participant, now rarely speaks in class',
                trend: 'declining',
                sinceDate: '2025-12-01',
                suggestedAction: 'Counselor check-in and parent conversation about home situation changes',
                actionType: 'parent_outreach',
            },
        ],
        areasOfFocus: [
            {
                id: 'aof-st23-1',
                subject: 'Algebra II',
                issue: 'Failing all polynomial and rational expression units',
                teacherName: 'Karen Yoo',
                teacherId: 't13',
                occurrences: 6,
                lastDate: '2026-01-28',
                rootCause: 'Algebra I foundation was weak — passed with D, never solidified core skills before advancing',
                recommendedAction: 'Diagnostic assessment then HDT bridge program covering Algebra I gaps alongside current material',
                actionType: 'enroll_hdt',
            },
        ],
    },
    'st24': {
        id: 'st24',
        schoolId: 's5',
        name: 'Andre Jackson',
        initials: 'AJ',
        grade: 4,
        gpa: 1.9,
        subjects: ['Math', 'Reading', 'Science', 'Social Studies', 'PE'],
        badges: [],
        status: 'at-risk',
        riskScore: 71,
        riskFactors: [
            {
                id: 'rf-st24-1',
                type: 'Math Performance',
                detail: 'Scoring 44% in math — cannot perform multi-digit subtraction or basic multiplication consistently',
                trend: 'declining',
                sinceDate: '2025-10-01',
                metric: { current: 44, threshold: 65 },
                suggestedAction: 'Immediate HDT enrollment with focus on number sense and basic operations',
                actionType: 'enroll_hdt',
            },
            {
                id: 'rf-st24-2',
                type: 'Teacher Concerns',
                detail: 'Mr. Thompson\'s class — parent requested transfer citing lack of learning. Currently in Marcus Thompson\'s section (2.6 rated)',
                trend: 'declining',
                sinceDate: '2025-11-01',
                suggestedAction: 'Consider section transfer and pair with experienced math tutor',
                actionType: 'parent_outreach',
            },
            {
                id: 'rf-st24-3',
                type: 'Confidence Issues',
                detail: 'Student self-reported "I\'m bad at math" on learning survey — showing signs of math learned helplessness',
                trend: 'stable',
                sinceDate: '2025-12-01',
                suggestedAction: 'Growth mindset intervention and celebrate small wins to rebuild confidence',
                actionType: 'schedule_tutoring',
            },
        ],
        areasOfFocus: [
            {
                id: 'aof-st24-1',
                subject: 'Math',
                issue: 'Foundational number sense gaps compounded by ineffective instruction',
                teacherName: 'Marcus Thompson',
                teacherId: 't14',
                occurrences: 10,
                lastDate: '2026-01-29',
                rootCause: 'Combination of 3rd grade skill gaps and current teacher\'s reliance on worksheets without scaffolding — student has disengaged',
                recommendedAction: 'Transfer to different section, start HDT with manipulatives-based approach, weekly parent updates',
                actionType: 'enroll_hdt',
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
    },
    {
        id: 'i5',
        entityType: 'teacher',
        entityId: 't14',
        severity: 'critical',
        title: 'New Teacher Struggling — 4 Transfer Requests',
        description: 'Marcus Thompson (Roosevelt) has 4 parent transfer requests and 2/5 observation score.',
        actionLabel: 'View Teacher',
        actionPath: '/teacher/t14',
        impactMetric: '92 students affected across 4 sections',
        rootCause: 'First-year teacher without adequate onboarding or mentor support',
        priority: 'high',
    },
    {
        id: 'i6',
        entityType: 'school',
        entityId: 's8',
        severity: 'critical',
        title: 'Oakwood Elementary — Chronic Absenteeism Crisis',
        description: '18% chronic absenteeism rate — highest in district. Math proficiency at 58%.',
        actionLabel: 'View School',
        actionPath: '/school/s8',
        impactMetric: '97 students chronically absent (15+ days)',
        rootCause: 'Transportation barriers and staff shortage reducing student engagement',
        priority: 'high',
    },
    {
        id: 'i7',
        entityType: 'school',
        entityId: 's2',
        severity: 'warning',
        title: 'HDT Utilization Below Target',
        description: 'Roosevelt tutoring engagement at 48% vs 70% target — 187 eligible students not enrolled.',
        actionLabel: 'View Details',
        actionPath: '/school/s2',
        impactMetric: '187 at-risk students missing intervention',
        rootCause: 'After-school scheduling conflicts and lack of parent awareness about program',
        priority: 'high',
    },
    {
        id: 'i8',
        entityType: 'school',
        entityId: 's5',
        severity: 'warning',
        title: 'Staffing Gap — 3 Positions Unfilled',
        description: 'Adams Elementary operating with substitute coverage at 40%. Student-teacher ratio impacted.',
        actionLabel: 'View School',
        actionPath: '/school/s5',
        impactMetric: 'Estimated 180 students in substitute-led classrooms',
        rootCause: 'Below-market salary offerings and rural location limiting candidate pool',
        priority: 'medium',
    },
    {
        id: 'i9',
        entityType: 'school',
        entityId: 's8',
        severity: 'warning',
        title: 'Budget Request — Oakwood Math Intervention',
        description: '$12,000 requested for math intervention specialist (part-time) to address proficiency gap.',
        actionLabel: 'Review Budget',
        impactMetric: 'Would serve 85 students below math proficiency threshold',
        priority: 'medium',
    },
    {
        id: 'i10',
        entityType: 'school',
        entityId: 's4',
        severity: 'info',
        title: 'College Readiness Showcase — Feb 15',
        description: 'Jefferson High hosting district-wide college prep event. 12 universities confirmed.',
        actionLabel: 'View Details',
        impactMetric: '280 seniors eligible to attend',
        priority: 'low',
    },
    {
        id: 'i11',
        entityType: 'school',
        entityId: 's9',
        severity: 'info',
        title: 'New STEM Lab Opening — March 1',
        description: 'Riverside High STEM lab funded by Karen Yoo\'s grant initiative ready for launch.',
        actionLabel: 'View Details',
        impactMetric: 'Will serve 200+ students in AP Science courses',
        priority: 'low',
    },
    {
        id: 'i12',
        entityType: 'school',
        entityId: 's9',
        severity: 'success',
        title: 'Riverside High — Fastest Growth in District',
        description: 'Performance improved 5 points since August. AP pass rates up 8% year-over-year.',
        actionLabel: 'View School',
        actionPath: '/school/s9',
        impactMetric: 'On track to reach A- grade by end of year',
        rootCause: 'Strong STEM leadership and effective HDT integration',
        priority: 'low',
    },
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
    { month: 'Feb', performance: 74, attendance: 90, enrollment: 790 },
    { month: 'Mar', performance: 75, attendance: 91, enrollment: 795 },
    { month: 'Apr', performance: 76, attendance: 90, enrollment: 800 },
    { month: 'May', performance: 77, attendance: 89, enrollment: 805 },
    { month: 'Jun', performance: 76, attendance: 88, enrollment: 808 },
    { month: 'Jul', performance: 75, attendance: 87, enrollment: 810 },
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
    { subject: 'Chemistry Concepts', mastery: 77, trend: 2.8, studentCount: 310, category: 'Science' },
    { subject: 'Fraction Operations', mastery: 62, trend: -3.1, studentCount: 440, category: 'Math' },
    { subject: 'Literary Analysis', mastery: 83, trend: 2.5, studentCount: 520, category: 'Literacy' },
    { subject: 'World Geography', mastery: 80, trend: 0.4, studentCount: 390, category: 'Social Studies' },
    { subject: 'Coding & Logic', mastery: 74, trend: 5.2, studentCount: 180, category: 'STEM' },
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

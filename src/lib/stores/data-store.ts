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
    riskFactors?: string[];
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
        riskFactors: ['GPA below 2.5', 'Math performance declining', '2 late assignments this week'],
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
        riskFactors: ['GPA below 2.0', '5 absences this month', 'Failing Math', 'Parent contact overdue'],
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
        riskFactors: ['GPA below 2.0', '8 absences this month', 'Failing 3 classes', 'Behavior incidents'],
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
        riskFactors: ['GPA trending down', '2 absences this week'],
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
        riskFactors: ['Math performance declining', 'Assignment completion dropping'],
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
        riskFactors: ['GPA at 2.0', 'Chronic lateness', 'Missing homework'],
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
        riskFactors: ['Science performance struggling', 'Missed parent conference'],
    },
};

const mockInsights: Insight[] = [
    {
        id: 'i1',
        entityType: 'school',
        entityId: 's1',
        severity: 'critical',
        title: 'Math Dept Underperformance',
        description: '3 teachers flagged for support intervention req.',
        actionLabel: 'Request Bridge',
        actionPath: '/teacher/t2',
    },
    {
        id: 'i2',
        entityType: 'school',
        entityId: 's1',
        severity: 'info',
        title: 'Science Fair Approaching',
        description: 'Budget approval pending for 12 kits.',
        actionLabel: 'Approve',
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
    },
];

// ============== Store ==============

interface DataState {
    districts: Record<string, District>;
    schools: Record<string, School>;
    teachers: Record<string, Teacher>;
    students: Record<string, Student>;
    insights: Insight[];

    // Selectors
    getDistrict: (id: string) => District | undefined;
    getSchool: (id: string) => School | undefined;
    getTeacher: (id: string) => Teacher | undefined;
    getStudent: (id: string) => Student | undefined;
    getSchoolsForDistrict: (districtId: string) => School[];
    getTeachersForSchool: (schoolId: string) => Teacher[];
    getStudentsForSchool: (schoolId: string) => Student[];
    getInsightsForEntity: (entityType: string, entityId: string) => Insight[];
}

export const useDataStore = create<DataState>((set, get) => ({
    districts: mockDistricts,
    schools: mockSchools,
    teachers: mockTeachers,
    students: mockStudents,
    insights: mockInsights,

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
}));

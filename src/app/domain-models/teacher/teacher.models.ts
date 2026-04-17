export interface TeacherFilterState {
  academicYear: string;
  semester: string;
  group: string;
  subject: string;
}

export interface StudentReportCard {
  studentId: string;
  fullName: string;
  attendancePercent: number;
  attendancePairs: number;
  groupRelativeScoreLabel: string;
  groupRelativeScore: number;
  correlation: number;
  recommendedScore: number;
}

export interface GroupMetric {
  fullName: string;
  totalScore: number;
}

export interface TableLessonColumn {
  id: string;
  title: string;
}

export interface TableStudentRow {
  id: string;
  fullName: string;
  rating: number;
  exam1: number;
  exam2: number;
  lecturesMissed: number;
  seminarsMissed: number;
  totalScore: number;
  attendanceByLesson: Record<string, boolean>;
  activityByLesson: Record<string, number>;
}

export interface TeacherTableData {
  lessons: TableLessonColumn[];
  rows: TableStudentRow[];
  topicNote: string;
}

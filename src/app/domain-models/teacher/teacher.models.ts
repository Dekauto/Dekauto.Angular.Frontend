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

/** Колонка занятия в тепловой карте (несколько пар в один день — разные id). */
export interface HeatmapSessionColumn {
  id: string;
  dateLabel: string;
  pairType: 'Л' | 'С' | 'П';
}

/** absent — не был (белая), excused — уважительно (жёлтая), present0 — был (0), score — 1..5 */
export type HeatmapCellMode = 'absent' | 'excused' | 'present0' | 'score';

export interface HeatmapCell {
  mode: HeatmapCellMode;
  score?: number | null;
}

export interface HeatmapRow {
  fullName: string;
  total: string;
  cells: HeatmapCell[];
}

export interface GroupHeatmapData {
  sessions: HeatmapSessionColumn[];
  rows: HeatmapRow[];
}

export interface TableLessonColumn {
  id: string;
  pairType: 'Л' | 'С' | 'П';
  dateDayMonth: string;
}

export type TableLessonCellMode = 'empty' | 'present' | 'excused' | 'scored';

export interface TableLessonCell {
  mode: TableLessonCellMode;
  score?: number | null;
}

export interface TableStudentRow {
  id: string;
  fullName: string;
  lessonCells: Record<string, TableLessonCell>;
}

export interface TeacherTableData {
  lessons: TableLessonColumn[];
  rows: TableStudentRow[];
}

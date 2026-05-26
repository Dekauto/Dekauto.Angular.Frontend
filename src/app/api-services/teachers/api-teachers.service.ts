import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { teachers_api_url } from '../../app.config';
import { formatReportNumber } from '../../utils/teacher-report-format';
import {
  GroupHeatmapData,
  GroupReportMetrics,
  StudentReportCard,
  TeacherFilterState,
  TeacherTableData
} from '../../domain-models/teacher/teacher.models';

export interface TeacherFilterOptionsApi {
  academicYears: string[];
  semesters: string[];
  groups: string[];
  subjects: string[];
  subjectsByGroup: Record<string, string[]>;
}

export interface GradebookCellApi {
  mode: string;
  score?: number | null;
}

export interface GradebookRowApi {
  id: string;
  fullName: string;
  isExcluded?: boolean;
  lessonCells: Record<string, GradebookCellApi>;
}

export interface GradebookTableApi {
  lessons: { lessonId: number; pairType: string; dateDayMonth: string }[];
  rows: GradebookRowApi[];
}

export interface StudentMetricsApi {
  studentId: string;
  fullName: string;
  groupName: string;
  attendanceRatio: number;
  gpa: number;
  correlation: number;
  recommendedScore: number;
  attendanceDeviation: number;
  scoreDeviation: number;
  groupRelativeScoreLabel: string;
  groupRelativeAttendanceLabel: string;
}

export interface GroupMetricsApi {
  groupId: string;
  groupName: string;
  qualityPercent: number;
  averageCorrelation: number;
  maxGpa: number;
  averageGpa: number;
  averageAttendance: number;
  studentsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiTeachersService {
  private readonly noCache = {
    headers: new HttpHeaders({
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache'
    })
  };

  constructor(private http: HttpClient) {}

  syncTimetable(teacherId: string): Observable<{ importedRows: number }> {
    return this.http.post<{ importedRows: number }>(
      `${teachers_api_url}/${encodeURIComponent(teacherId)}/timetable/sync`,
      {}
    );
  }

  getFilters(teacherId: string, semester?: string): Observable<TeacherFilterOptionsApi> {
    const params = semester ? { semester } : undefined;
    return this.http.get<TeacherFilterOptionsApi>(
      `${teachers_api_url}/${encodeURIComponent(teacherId)}/filters`,
      { params, ...this.noCache }
    );
  }

  getExclusions(teacherId: string): Observable<{ studentIds: string[] }> {
    return this.http.get<{ studentIds: string[] }>(
      `${teachers_api_url}/${encodeURIComponent(teacherId)}/exclusions`,
      this.noCache
    );
  }

  setExclusions(teacherId: string, studentIds: string[]): Observable<void> {
    return this.http.put<void>(
      `${teachers_api_url}/${encodeURIComponent(teacherId)}/exclusions`,
      { studentIds }
    );
  }

  getGradebook(
    teacherId: string,
    filters: TeacherFilterState,
    onlyPast = false
  ): Observable<GradebookTableApi> {
    const params: Record<string, string | boolean> = {
      group: filters.group,
      subject: filters.subject,
      semester: filters.semester
    };
    if (onlyPast) {
      params['onlyPast'] = true;
    }
    return this.http.get<GradebookTableApi>(
      `${teachers_api_url}/${encodeURIComponent(teacherId)}/gradebook`,
      { params, ...this.noCache }
    );
  }

  saveGradebook(
    teacherId: string,
    cells: { lessonId: number; studentId: string; mode: string; score?: number | null }[]
  ): Observable<void> {
    return this.http.put<void>(
      `${teachers_api_url}/${encodeURIComponent(teacherId)}/gradebook`,
      { cells }
    );
  }

  getStudentMetrics(teacherId: string, filters: TeacherFilterState): Observable<StudentMetricsApi[]> {
    const params = {
      group: filters.group,
      subject: filters.subject,
      semester: filters.semester
    };
    return this.http.get<StudentMetricsApi[]>(
      `${teachers_api_url}/${encodeURIComponent(teacherId)}/metrics/students`,
      { params, ...this.noCache }
    );
  }

  getGroupMetrics(teacherId: string, filters: TeacherFilterState): Observable<GroupMetricsApi> {
    const params = {
      group: filters.group,
      subject: filters.subject,
      semester: filters.semester
    };
    return this.http.get<GroupMetricsApi>(
      `${teachers_api_url}/${encodeURIComponent(teacherId)}/metrics/group`,
      { params, ...this.noCache }
    );
  }

  getAllGroupsMetrics(teacherId: string): Observable<GroupMetricsApi[]> {
    return this.http.get<GroupMetricsApi[]>(
      `${teachers_api_url}/${encodeURIComponent(teacherId)}/metrics/groups`,
      this.noCache
    );
  }
}

export function mapGradebookToTableData(api: GradebookTableApi): TeacherTableData {
  return {
    lessons: api.lessons.map((l) => ({
      id: String(l.lessonId),
      pairType: (l.pairType as 'Л' | 'С' | 'П') ?? 'Л',
      dateDayMonth: l.dateDayMonth
    })),
    rows: api.rows.map((r) => {
      const lessonCells: TeacherTableData['rows'][0]['lessonCells'] = {};
      for (const [key, cell] of Object.entries(r.lessonCells ?? {})) {
        lessonCells[key] = {
          mode: (cell.mode as TeacherTableData['rows'][0]['lessonCells'][string]['mode']) ?? 'empty',
          score: cell.score ?? null
        };
      }
      return {
        id: r.id,
        fullName: r.fullName,
        isExcluded: r.isExcluded ?? false,
        lessonCells
      };
    })
  };
}

export function mapGradebookToHeatmap(api: GradebookTableApi): GroupHeatmapData {
  const sessions = api.lessons.map((l) => ({
    id: String(l.lessonId),
    dateLabel: l.dateDayMonth,
    pairType: (l.pairType as 'Л' | 'С' | 'П') ?? 'Л'
  }));

  const activeRows = api.rows.filter((r) => !r.isExcluded);
  const rows = activeRows
    .map((r: GradebookRowApi) => {
      let total = 0;
      let count = 0;
      const cells = sessions.map((s) => {
        const raw = r.lessonCells?.[s.id] ?? r.lessonCells?.[String(s.id)];
        if (!raw) {
          return { mode: 'absent' as const };
        }
        if (raw.mode === 'scored' && raw.score != null) {
          total += raw.score;
          count++;
          return { mode: 'score' as const, score: raw.score };
        }
        if (raw.mode === 'excused') {
          return { mode: 'excused' as const };
        }
        if (raw.mode === 'present') {
          return { mode: 'present0' as const };
        }
        return { mode: 'absent' as const };
      });
      const avg = count > 0 ? total / count : 0;
      return {
        fullName: shortenName(r.fullName),
        total: avg,
        totalNumeric: avg,
        cells
      };
    })
    .sort((a, b) => b.totalNumeric - a.totalNumeric)
    .map(({ fullName, total, cells }) => ({
      fullName,
      total: total > 0 ? formatReportNumber(total) : '—',
      cells
    }));

  return { sessions, rows };
}

export function mapGroupMetrics(api: GroupMetricsApi): GroupReportMetrics {
  return {
    averageGpa: api.averageGpa,
    qualityPercent: api.qualityPercent,
    averageAttendance: api.averageAttendance * 100,
    averageCorrelation: api.averageCorrelation
  };
}

export function mapStudentMetricsToCards(items: StudentMetricsApi[]): StudentReportCard[] {
  return items
    .map((m) => ({
      studentId: m.studentId,
      fullName: m.fullName,
      attendancePercent: m.attendanceRatio * 100,
      attendancePairs: 0,
      groupRelativeScoreLabel: m.groupRelativeScoreLabel,
      groupRelativeAttendanceLabel: m.groupRelativeAttendanceLabel,
      groupRelativeScore: m.gpa,
      attendanceDeviation: m.attendanceDeviation,
      scoreDeviation: m.scoreDeviation,
      recommendedScore: Math.round(m.recommendedScore)
    }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName, 'ru'));
}

function shortenName(full: string): string {
  const parts = full.trim().split(/\s+/);
  if (parts.length < 2) {
    return full;
  }
  const surname = parts[0];
  const initials = parts.slice(1).map((p) => p.charAt(0) + '.').join(' ');
  return `${surname} ${initials}`.trim();
}

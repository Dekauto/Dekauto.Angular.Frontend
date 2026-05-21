import { Injectable } from '@angular/core';
import {
  GroupHeatmapData,
  HeatmapCell,
  StudentReportCard,
  TableLessonCell,
  TeacherFilterState,
  TeacherTableData
} from '../domain-models/teacher/teacher.models';

@Injectable({
  providedIn: 'root'
})
export class TeacherMockDataService {
  readonly academicYears = ['2024/2025', '2025/2026'];
  readonly semesters = ['Осенне-Зимний', 'Весенне-Летний'];
  readonly groups = ['22ИТ-ПИ(б/о) ПИП-1', '22ИТ-ПИ(б/о) ПИП-2'];
  readonly subjects = [
    'Вычислительные системы сети и телекоммуникации',
    'Домашние сети'
  ];

  getDefaultFilters(): TeacherFilterState {
    return {
      academicYear: this.academicYears[1],
      semester: this.semesters[0],
      group: this.groups[0],
      subject: this.subjects[0]
    };
  }

  getStudentCards(_: TeacherFilterState): StudentReportCard[] {
    return [
      {
        studentId: 'st-1',
        fullName: 'Кочанов Владислав Григорьевич',
        attendancePercent: 78,
        attendancePairs: 15,
        groupRelativeScoreLabel: 'Средняя',
        groupRelativeScore: 3.7,
        correlation: 0.72,
        recommendedScore: 13
      },
      {
        studentId: 'st-2',
        fullName: 'Кунжутова Василиса Васильевна',
        attendancePercent: 74,
        attendancePairs: 14,
        groupRelativeScoreLabel: 'Выше средней',
        groupRelativeScore: 4.2,
        correlation: 0.67,
        recommendedScore: 14
      },
      {
        studentId: 'st-3',
        fullName: 'Лушко Агафий Вольфович',
        attendancePercent: 63,
        attendancePairs: 12,
        groupRelativeScoreLabel: 'Средняя',
        groupRelativeScore: 3.4,
        correlation: 0.55,
        recommendedScore: 11
      },
      {
        studentId: 'st-4',
        fullName: 'Сумочкин Иван Сергеев',
        attendancePercent: 81,
        attendancePairs: 16,
        groupRelativeScoreLabel: 'Выше средней',
        groupRelativeScore: 4.5,
        correlation: 0.7,
        recommendedScore: 14
      }
    ];
  }

  getGroupHeatmap(_: TeacherFilterState): GroupHeatmapData {
    const sessions = [
      { id: 's1', dateLabel: '05.02', pairType: 'Л' as const },
      { id: 's2', dateLabel: '05.02', pairType: 'П' as const },
      { id: 's3', dateLabel: '12.02', pairType: 'С' as const },
      { id: 's4', dateLabel: '19.02', pairType: 'Л' as const },
      { id: 's5', dateLabel: '26.02', pairType: 'П' as const },
      { id: 's6', dateLabel: '04.03', pairType: 'Л' as const }
    ];

    const mk = (...cells: HeatmapCell[]): HeatmapCell[] => cells;

    return {
      sessions,
      rows: [
        {
          fullName: 'Бречалин Д. М.',
          total: '8,8',
          cells: mk(
            { mode: 'score', score: 5 },
            { mode: 'present0' },
            { mode: 'score', score: 4 },
            { mode: 'score', score: 5 },
            { mode: 'excused' },
            { mode: 'score', score: 5 }
          )
        },
        {
          fullName: 'Шевелева Д. Р.',
          total: '8,4',
          cells: mk(
            { mode: 'score', score: 4 },
            { mode: 'score', score: 3 },
            { mode: 'absent' },
            { mode: 'score', score: 4 },
            { mode: 'score', score: 5 },
            { mode: 'score', score: 4 }
          )
        },
        {
          fullName: 'Лосева Л. Г.',
          total: '7,9',
          cells: mk(
            { mode: 'score', score: 3 },
            { mode: 'present0' },
            { mode: 'score', score: 3 },
            { mode: 'excused' },
            { mode: 'score', score: 2 },
            { mode: 'score', score: 3 }
          )
        },
        {
          fullName: 'Кочанов В. Г.',
          total: '7,0',
          cells: mk(
            { mode: 'absent' },
            { mode: 'absent' },
            { mode: 'present0' },
            { mode: 'score', score: 2 },
            { mode: 'score', score: 3 },
            { mode: 'present0' }
          )
        }
      ]
    };
  }

  getAllYearsMetrics(_: TeacherFilterState): {
    averageScore: number;
    qualityPercent: number;
    averageAttendance: number;
  } {
    return {
      averageScore: 11.5,
      qualityPercent: 65,
      averageAttendance: 85
    };
  }

  getTableData(_: TeacherFilterState): TeacherTableData {
    const lessons = [
      { id: 'l-1', pairType: 'Л' as const, dateDayMonth: '05.02' },
      { id: 'l-2', pairType: 'С' as const, dateDayMonth: '12.02' },
      { id: 'l-3', pairType: 'П' as const, dateDayMonth: '19.02' },
      { id: 'l-4', pairType: 'Л' as const, dateDayMonth: '26.02' }
    ];

    const emptyCell = (): TableLessonCell => ({ mode: 'empty' });

    const cellsFor = (partial: Record<string, TableLessonCell>): Record<string, TableLessonCell> => {
      const out: Record<string, TableLessonCell> = {};
      for (const l of lessons) {
        out[l.id] = partial[l.id] ?? emptyCell();
      }
      return out;
    };

    return {
      lessons,
      rows: [
        {
          id: 'st-1',
          fullName: 'Сумочкин Иван Сергеев',
          lessonCells: cellsFor({
            'l-1': { mode: 'empty' },
            'l-2': { mode: 'empty' },
            'l-3': { mode: 'empty' },
            'l-4': { mode: 'empty' }
          })
        },
        {
          id: 'st-2',
          fullName: 'Кочанов Владислав Григорьевич',
          lessonCells: cellsFor({
            'l-1': { mode: 'present' },
            'l-2': { mode: 'scored', score: 3 },
            'l-3': { mode: 'empty' },
            'l-4': { mode: 'excused' }
          })
        }
      ]
    };
  }
}

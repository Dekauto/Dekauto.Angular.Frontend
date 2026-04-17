import { Injectable } from '@angular/core';
import {
  GroupMetric,
  StudentReportCard,
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

  getGroupMetrics(_: TeacherFilterState): GroupMetric[] {
    return [
      { fullName: 'Бречалин Д. М.', totalScore: 8.8 },
      { fullName: 'Шевелева Д. Р.', totalScore: 8.4 },
      { fullName: 'Лосева Л. Г.', totalScore: 7.9 },
      { fullName: 'Фалатова А. А.', totalScore: 7.8 },
      { fullName: 'Кочанов В. Г.', totalScore: 7.0 }
    ];
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
      { id: 'l-1', title: 'Домашние сети' },
      { id: 'l-2', title: 'Офисные сети' },
      { id: 'l-3', title: 'IP и MAC адреса' }
    ];

    return {
      lessons,
      rows: [
        {
          id: 'st-1',
          fullName: 'Сумочкин Иван Сергеев',
          rating: 0,
          exam1: 2,
          exam2: 2,
          lecturesMissed: 10,
          seminarsMissed: 44,
          totalScore: 0,
          attendanceByLesson: { 'l-1': false, 'l-2': false, 'l-3': false },
          activityByLesson: { 'l-1': 0, 'l-2': 0, 'l-3': 0 }
        },
        {
          id: 'st-2',
          fullName: 'Кочанов Владислав Григорьевич',
          rating: 0,
          exam1: 2,
          exam2: 2,
          lecturesMissed: 8,
          seminarsMissed: 40,
          totalScore: 3,
          attendanceByLesson: { 'l-1': true, 'l-2': false, 'l-3': false },
          activityByLesson: { 'l-1': 3, 'l-2': 0, 'l-3': 0 }
        }
      ],
      topicNote: 'Тема: Домашние сети'
    };
  }
}

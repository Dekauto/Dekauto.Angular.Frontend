import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentReportCard } from '../../domain-models/teacher/teacher.models';
import { TeacherStateService } from '../../services/teacher-state.service';
import { TeacherReportSideNavComponent } from '../teacher-report-side-nav/teacher-report-side-nav.component';

@Component({
  selector: 'app-teacher-report-main-students',
  imports: [CommonModule, RouterModule, TeacherReportSideNavComponent],
  templateUrl: './teacher-report-main-students.component.html',
  styleUrl: './teacher-report-main-students.component.css'
})
export class TeacherReportMainStudentsComponent implements OnInit {
  cards: StudentReportCard[] = [];
  openedStudentId: string | null = null;

  constructor(private teacherStateService: TeacherStateService) {}

  ngOnInit(): void {
    this.cards = this.teacherStateService.getStudentCards();
    this.openedStudentId = this.cards[0]?.studentId ?? null;
    this.teacherStateService.setSelectedStudent(this.openedStudentId);
  }

  toggleStudent(studentId: string): void {
    this.openedStudentId = this.openedStudentId === studentId ? null : studentId;
    this.teacherStateService.setSelectedStudent(this.openedStudentId);
  }

  isOpened(studentId: string): boolean {
    return this.openedStudentId === studentId;
  }

  /** Нормализация 0..max → класс heat-0 … heat-4 (зелёнее = лучше) */
  metricHeatClass(value: number, max: number): string {
    if (max <= 0 || !Number.isFinite(value)) {
      return 'metric-cell heat-0';
    }
    const t = Math.min(1, Math.max(0, value / max));
    const step = Math.min(4, Math.floor(t * 5));
    return `metric-cell heat-${step}`;
  }

  /** Для шкалы 0..maxScore (например 15 для ведомости) */
  metricHeatClassFromScore(score: number, maxScore: number): string {
    return this.metricHeatClass(score, maxScore);
  }
}

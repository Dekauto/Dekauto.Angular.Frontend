import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentReportCard } from '../../domain-models/teacher/teacher.models';
import { TeacherStateService } from '../../services/teacher-state.service';
import {
  formatReportInteger,
  formatReportNumber,
  formatReportPercent
} from '../../utils/teacher-report-format';
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
  readonly loading$;

  readonly formatNumber = formatReportNumber;
  readonly formatPercent = formatReportPercent;
  readonly formatInteger = formatReportInteger;

  constructor(private state: TeacherStateService) {
    this.loading$ = this.state.loading$;
  }

  ngOnInit(): void {
    this.state.loadStudentReportCards().subscribe((cards) => this.applyCards(cards));
  }

  private applyCards(cards: StudentReportCard[]): void {
    this.cards = cards;
    this.openedStudentId = cards[0]?.studentId ?? null;
    this.state.setSelectedStudent(this.openedStudentId);
  }

  toggleStudent(studentId: string): void {
    this.openedStudentId = this.openedStudentId === studentId ? null : studentId;
    this.state.setSelectedStudent(this.openedStudentId);
  }

  isOpened(studentId: string): boolean {
    return this.openedStudentId === studentId;
  }

  metricRygStyle(normalized: number): Record<string, string> {
    const t = Math.min(1, Math.max(0, normalized));
    const hue = t * 120;
    return { background: `hsl(${hue}deg 72% 88%)` };
  }

  deviationStyle(deviation: number): Record<string, string> {
    return this.metricRygStyle(0.5 + deviation / 2);
  }

  formatDeviation(deviation: number): string {
    const sign = deviation > 0 ? '+' : '';
    return `${sign}${formatReportPercent(deviation * 100)}`;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentReportCard } from '../../domain-models/teacher/teacher.models';
import { TeacherStateService } from '../../services/teacher-state.service';

@Component({
  selector: 'app-teacher-report-main-students',
  imports: [CommonModule, RouterModule],
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
}

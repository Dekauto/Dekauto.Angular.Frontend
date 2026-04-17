import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherTableData } from '../../domain-models/teacher/teacher.models';
import { TeacherStateService } from '../../services/teacher-state.service';

@Component({
  selector: 'app-teacher-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-table.component.html',
  styleUrl: './teacher-table.component.css'
})
export class TeacherTableComponent implements OnInit {
  data!: TeacherTableData;
  currentLessonId: string | null = null;
  topicNote = '';

  constructor(private teacherStateService: TeacherStateService) {}

  ngOnInit(): void {
    this.data = this.teacherStateService.getTableData();
    this.currentLessonId = this.data.lessons[0]?.id ?? null;
    this.topicNote = this.data.topicNote;
  }

  toggleAttendance(rowId: string, lessonId: string): void {
    const row = this.data.rows.find((item) => item.id === rowId);
    if (!row) {
      return;
    }
    row.attendanceByLesson[lessonId] = !row.attendanceByLesson[lessonId];
  }

  setActivity(rowId: string, lessonId: string, score: number): void {
    const row = this.data.rows.find((item) => item.id === rowId);
    if (!row) {
      return;
    }
    row.activityByLesson[lessonId] = score;
    row.totalScore = Math.max(row.totalScore, score);
  }

  trackRow(_: number, row: { id: string }): string {
    return row.id;
  }
}

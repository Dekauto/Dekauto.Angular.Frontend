import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableLessonCell, TeacherTableData } from '../../domain-models/teacher/teacher.models';
import { TeacherStateService } from '../../services/teacher-state.service';

@Component({
  selector: 'app-teacher-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-table.component.html',
  styleUrl: './teacher-table.component.css'
})
export class TeacherTableComponent implements OnInit {
  data!: TeacherTableData;
  /** Тема занятия по id колонки (локально, без API) */
  topicByLessonId: Record<string, string> = {};
  editingTopicLessonId: string | null = null;

  overlay: { rowId: string; lessonId: string; fullName: string } | null = null;

  constructor(private teacherStateService: TeacherStateService) {}

  ngOnInit(): void {
    this.data = this.teacherStateService.getTableData();
    for (const lesson of this.data.lessons) {
      if (this.topicByLessonId[lesson.id] === undefined) {
        this.topicByLessonId[lesson.id] = '';
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.overlay) {
      return;
    }
    const el = event.target as HTMLElement | null;
    if (el?.closest('.grade-overlay-panel')) {
      return;
    }
    this.cancelOverlay();
  }

  trackRow(_: number, row: { id: string }): string {
    return row.id;
  }

  cell(rowId: string, lessonId: string): TableLessonCell {
    const row = this.data.rows.find((r) => r.id === rowId);
    return row?.lessonCells[lessonId] ?? { mode: 'empty' };
  }

  onCellClick(event: MouseEvent, rowId: string, lessonId: string): void {
    const row = this.data.rows.find((r) => r.id === rowId);
    if (!row) {
      return;
    }
    const cell = row.lessonCells[lessonId];
    if (!cell) {
      return;
    }
    if (this.overlay) {
      return;
    }
    if (cell.mode === 'empty') {
      cell.mode = 'present';
      event.stopPropagation();
      return;
    }
    this.openOverlay(rowId, lessonId, row.fullName);
    event.stopPropagation();
  }

  openOverlay(rowId: string, lessonId: string, fullName: string): void {
    this.overlay = { rowId, lessonId, fullName };
  }

  cancelOverlay(): void {
    this.overlay = null;
  }

  setCellMode(rowId: string, lessonId: string, mode: TableLessonCell['mode'], score?: number | null): void {
    const row = this.data.rows.find((r) => r.id === rowId);
    if (!row) {
      return;
    }
    const cell = row.lessonCells[lessonId];
    if (!cell) {
      return;
    }
    cell.mode = mode;
    if (mode === 'scored') {
      cell.score = score ?? null;
    } else {
      cell.score = null;
    }
    this.cancelOverlay();
  }

  deleteCell(): void {
    if (!this.overlay) {
      return;
    }
    this.setCellMode(this.overlay.rowId, this.overlay.lessonId, 'empty');
  }

  pickScore(score: number): void {
    if (!this.overlay) {
      return;
    }
    this.setCellMode(this.overlay.rowId, this.overlay.lessonId, 'scored', score);
  }

  pickExcused(): void {
    if (!this.overlay) {
      return;
    }
    this.setCellMode(this.overlay.rowId, this.overlay.lessonId, 'excused');
  }

  lessonScoreMax(lessonId: string): number {
    let max = 1;
    for (const row of this.data.rows) {
      const c = row.lessonCells[lessonId];
      if (c?.mode === 'scored' && c.score != null) {
        max = Math.max(max, c.score);
      }
    }
    return max;
  }

  scoredCellStyle(rowId: string, lessonId: string): Record<string, string> {
    const c = this.cell(rowId, lessonId);
    if (c.mode !== 'scored' || c.score == null) {
      return {};
    }
    const max = this.lessonScoreMax(lessonId);
    const t = max <= 1 ? 1 : (c.score - 1) / (max - 1);
    const sat = 12 + t * 50;
    const light = 90 - t * 34;
    return { background: `hsl(118deg ${sat}% ${light}%)` };
  }

  startTopicEdit(lessonId: string, ev: Event): void {
    ev.stopPropagation();
    this.editingTopicLessonId = lessonId;
  }

  stopTopicEdit(): void {
    this.editingTopicLessonId = null;
  }
}

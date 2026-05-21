import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeacherMockDataService } from '../../services/teacher-mock-data.service';
import { TeacherStateService } from '../../services/teacher-state.service';
import { TeacherFilterState } from '../../domain-models/teacher/teacher.models';

@Component({
  selector: 'app-teacher-report-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-report-search.component.html',
  styleUrl: './teacher-report-search.component.css'
})
export class TeacherReportSearchComponent {
  get years() {
    return this.mock.academicYears;
  }
  get semesters() {
    return this.mock.semesters;
  }
  get groups() {
    return this.mock.groups;
  }
  get subjects() {
    return this.mock.subjects;
  }

  filters: TeacherFilterState;

  constructor(
    private mock: TeacherMockDataService,
    private state: TeacherStateService,
    private router: Router
  ) {
    this.filters = { ...this.state.filtersValue };
  }

  submit(): void {
    this.state.patchFilters(this.filters);
    this.router.navigate(['/teacher/reports/students']);
  }
}

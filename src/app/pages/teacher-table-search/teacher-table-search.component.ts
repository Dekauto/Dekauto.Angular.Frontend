import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeacherFilterState } from '../../domain-models/teacher/teacher.models';
import { TeacherStateService } from '../../services/teacher-state.service';

@Component({
  selector: 'app-teacher-table-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-table-search.component.html',
  styleUrl: './teacher-table-search.component.css'
})
export class TeacherTableSearchComponent implements OnInit {
  filters: TeacherFilterState = {
    academicYear: '',
    semester: '',
    group: '',
    subject: ''
  };
  years: string[] = [];
  semesters: string[] = [];
  groups: string[] = [];
  subjects: string[] = [];
  readonly loading$;

  constructor(
    private state: TeacherStateService,
    private router: Router
  ) {
    this.filters = { ...this.state.filtersValue };
    this.loading$ = this.state.loading$;
  }

  ngOnInit(): void {
    this.state.filterOptions$.subscribe((opts) => {
      if (!opts) {
        return;
      }
      this.years = opts.academicYears;
      this.semesters = opts.semesters;
      this.groups = opts.groups;
      this.filters = { ...this.state.filtersValue };
      this.refreshSubjects();
    });
    this.state.loadFilterOptions().subscribe();
  }

  onSemesterChange(): void {
    this.state.patchFilters({ semester: this.filters.semester });
    this.state.loadFilterOptions(this.filters.semester || undefined).subscribe(() => {
      this.filters = { ...this.state.filtersValue };
      this.refreshSubjects();
    });
  }

  onGroupChange(): void {
    this.state.applyGroupChange(this.filters.group);
    this.filters = { ...this.state.filtersValue };
    this.refreshSubjects();
  }

  private refreshSubjects(): void {
    this.subjects = this.state.subjectsForGroup(this.filters.group);
    if (this.subjects.length && !this.subjects.includes(this.filters.subject)) {
      this.filters.subject = this.subjects[0];
    }
  }

  submit(): void {
    this.state.patchFilters(this.filters);
    this.state.loadTableData().subscribe({
      next: () => this.router.navigate(['/teacher/table']),
      error: () => this.router.navigate(['/teacher/table'])
    });
  }
}

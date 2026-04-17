import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  StudentReportCard,
  TeacherFilterState,
  TeacherTableData
} from '../domain-models/teacher/teacher.models';
import { TeacherMockDataService } from './teacher-mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherStateService {
  private readonly filtersSubject = new BehaviorSubject<TeacherFilterState>(
    this.teacherMockDataService.getDefaultFilters()
  );
  readonly filters$ = this.filtersSubject.asObservable();

  private readonly selectedStudentIdSubject = new BehaviorSubject<string | null>(null);
  readonly selectedStudentId$ = this.selectedStudentIdSubject.asObservable();

  constructor(private teacherMockDataService: TeacherMockDataService) {}

  get filtersValue(): TeacherFilterState {
    return this.filtersSubject.value;
  }

  patchFilters(patch: Partial<TeacherFilterState>): void {
    this.filtersSubject.next({
      ...this.filtersValue,
      ...patch
    });
  }

  getStudentCards(): StudentReportCard[] {
    return this.teacherMockDataService.getStudentCards(this.filtersValue);
  }

  getTableData(): TeacherTableData {
    return this.teacherMockDataService.getTableData(this.filtersValue);
  }

  setSelectedStudent(studentId: string | null): void {
    this.selectedStudentIdSubject.next(studentId);
  }
}

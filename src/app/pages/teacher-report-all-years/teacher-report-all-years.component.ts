import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeacherMockDataService } from '../../services/teacher-mock-data.service';
import { TeacherStateService } from '../../services/teacher-state.service';

@Component({
  selector: 'app-teacher-report-all-years',
  imports: [CommonModule, RouterModule],
  templateUrl: './teacher-report-all-years.component.html',
  styleUrl: './teacher-report-all-years.component.css'
})
export class TeacherReportAllYearsComponent implements OnInit {
  averageScore = 0;
  qualityPercent = 0;
  averageAttendance = 0;

  constructor(
    private mock: TeacherMockDataService,
    private state: TeacherStateService
  ) {}

  ngOnInit(): void {
    const metrics = this.mock.getAllYearsMetrics(this.state.filtersValue);
    this.averageScore = metrics.averageScore;
    this.qualityPercent = metrics.qualityPercent;
    this.averageAttendance = metrics.averageAttendance;
  }
}

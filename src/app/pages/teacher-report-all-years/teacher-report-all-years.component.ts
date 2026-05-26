import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeacherStateService } from '../../services/teacher-state.service';
import { formatReportNumber, formatReportPercent } from '../../utils/teacher-report-format';
import { TeacherReportSideNavComponent } from '../teacher-report-side-nav/teacher-report-side-nav.component';

@Component({
  selector: 'app-teacher-report-all-years',
  imports: [CommonModule, RouterModule, TeacherReportSideNavComponent],
  templateUrl: './teacher-report-all-years.component.html',
  styleUrl: './teacher-report-all-years.component.css'
})
export class TeacherReportAllYearsComponent implements OnInit {
  averageScore = '';
  qualityPercent = '';
  averageAttendance = '';

  readonly formatNumber = formatReportNumber;
  readonly formatPercent = formatReportPercent;

  constructor(private state: TeacherStateService) {}

  ngOnInit(): void {
    this.state.loadAllYearsMetrics().subscribe((m) => {
      this.averageScore = formatReportNumber(m.averageScore);
      this.qualityPercent = formatReportPercent(m.qualityPercent);
      this.averageAttendance = formatReportPercent(m.averageAttendance);
    });
  }
}

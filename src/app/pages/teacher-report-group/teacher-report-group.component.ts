import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GroupMetric } from '../../domain-models/teacher/teacher.models';
import { TeacherMockDataService } from '../../services/teacher-mock-data.service';
import { TeacherStateService } from '../../services/teacher-state.service';

@Component({
  selector: 'app-teacher-report-group',
  imports: [CommonModule, RouterModule],
  templateUrl: './teacher-report-group.component.html',
  styleUrl: './teacher-report-group.component.css'
})
export class TeacherReportGroupComponent implements OnInit {
  metrics: GroupMetric[] = [];

  constructor(
    private mock: TeacherMockDataService,
    private state: TeacherStateService
  ) {}

  ngOnInit(): void {
    this.metrics = this.mock.getGroupMetrics(this.state.filtersValue);
  }
}

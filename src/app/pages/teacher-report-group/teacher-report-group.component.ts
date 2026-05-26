import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GroupHeatmapData, GroupReportMetrics, HeatmapCell } from '../../domain-models/teacher/teacher.models';
import { TeacherStateService } from '../../services/teacher-state.service';
import { formatReportNumber, formatReportPercent } from '../../utils/teacher-report-format';
import { TeacherReportSideNavComponent } from '../teacher-report-side-nav/teacher-report-side-nav.component';

@Component({
  selector: 'app-teacher-report-group',
  imports: [CommonModule, RouterModule, TeacherReportSideNavComponent],
  templateUrl: './teacher-report-group.component.html',
  styleUrl: './teacher-report-group.component.css'
})
export class TeacherReportGroupComponent implements OnInit {
  heatmap: GroupHeatmapData | null = null;
  metrics: GroupReportMetrics | null = null;
  columnScoreMaxes: number[] = [];
  readonly loading$;

  readonly formatNumber = formatReportNumber;
  readonly formatPercent = formatReportPercent;

  constructor(private state: TeacherStateService) {
    this.loading$ = this.state.loading$;
  }

  ngOnInit(): void {
    this.state.loadGroupReport().subscribe(({ heatmap, metrics }) => this.applyReport(heatmap, metrics));
  }

  private applyReport(heatmap: GroupHeatmapData, metrics: GroupReportMetrics): void {
    this.heatmap = heatmap;
    this.metrics = metrics;
    this.columnScoreMaxes = this.computeColumnScoreMaxes(heatmap);
  }

  private computeColumnScoreMaxes(data: GroupHeatmapData): number[] {
    const n = data.sessions.length;
    const maxes = Array.from({ length: n }, () => 1);
    for (let col = 0; col < n; col++) {
      for (const row of data.rows) {
        const cell = row.cells[col];
        if (cell?.mode === 'score' && cell.score != null) {
          maxes[col] = Math.max(maxes[col], cell.score);
        }
      }
    }
    return maxes;
  }

  scoreCellStyle(cell: HeatmapCell, colIndex: number): Record<string, string> {
    if (cell.mode !== 'score' || cell.score == null) {
      return {};
    }
    const max = Math.max(1, this.columnScoreMaxes[colIndex] ?? 1);
    const t = max <= 1 ? 1 : (cell.score - 1) / (max - 1);
    const sat = 12 + t * 48;
    const light = 92 - t * 32;
    return { background: `hsl(118deg ${sat}% ${light}%)` };
  }

  trackSession(_: number, s: { id: string }): string {
    return s.id;
  }

  trackRow(_: number, r: { fullName: string }): string {
    return r.fullName;
  }
}

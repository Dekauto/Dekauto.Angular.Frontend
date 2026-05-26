import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherStateService } from '../../services/teacher-state.service';

@Component({
  selector: 'app-teacher-loading-overlay',
  imports: [CommonModule],
  templateUrl: './teacher-loading-overlay.component.html',
  styleUrl: './teacher-loading-overlay.component.css'
})
export class TeacherLoadingOverlayComponent {
  readonly loading$;

  constructor(state: TeacherStateService) {
    this.loading$ = state.loading$;
  }
}

import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TeacherStateService } from '../../services/teacher-state.service';

@Component({
  selector: 'app-teacher-main-menu',
  imports: [RouterModule],
  templateUrl: './teacher-main-menu.component.html',
  styleUrl: './teacher-main-menu.component.css'
})
export class TeacherMainMenuComponent implements OnInit {
  constructor(private teacherState: TeacherStateService) {}

  ngOnInit(): void {
    this.teacherState.loadFilterOptions().subscribe();
    this.teacherState.syncTimetable().subscribe(() => {
      this.teacherState.loadFilterOptions().subscribe();
    });
  }
}

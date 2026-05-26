import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { TeacherLoadingOverlayComponent } from '../teacher-loading-overlay/teacher-loading-overlay.component';

@Component({
  selector: 'app-teacher-layout',
  imports: [CommonModule, RouterModule, RouterOutlet, TeacherLoadingOverlayComponent],
  templateUrl: './teacher-layout.component.html',
  styleUrl: './teacher-layout.component.css'
})
export class TeacherLayoutComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

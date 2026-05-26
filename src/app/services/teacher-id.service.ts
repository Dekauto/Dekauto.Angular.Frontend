import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { decodeJwtPayload } from './auth/auth-credentials.util';

@Injectable({
  providedIn: 'root'
})
export class TeacherIdService {
  constructor(private authService: AuthService) {}

  getTeacherId(): string | null {
    const user = this.authService.currentUser;
    const fromUser = user?.externalTeacherId?.trim();
    if (fromUser) {
      return fromUser;
    }

    const token = this.authService.getAccessToken();
    if (!token) {
      return null;
    }

    const payload = decodeJwtPayload(token);
    const fromJwt = payload?.['external_teacher_id'];
    return fromJwt != null && fromJwt !== '' ? String(fromJwt) : null;
  }
}

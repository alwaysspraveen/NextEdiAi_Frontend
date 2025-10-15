// admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../auth/auth';

@Injectable({ providedIn: 'root' })
export class StudentGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.auth.getToken();
    if (token) {
      const payload: any = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'STUDENT') {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}

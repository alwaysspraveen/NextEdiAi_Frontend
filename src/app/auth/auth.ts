// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { authApiUrl } from '../config/config';
import { Auth } from '../core/interface/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authApiUrl = authApiUrl; // Use the auth API URL from config
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<Auth> {
    return this.http.post<Auth>(`${this.authApiUrl}/login`, {
      email,
      password,
    });
  }

  // loginWithGoogle(idToken: string): Observable<Auth> {
  //   return this.http.post<Auth>(`${this.authApiUrl}/google-login`, { idToken });
  // }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId() {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id; // Adjust based on your token structure
    }
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
      } catch (e) {
        console.error('Error decoding token', e);
        return null;
      }
    }
    return null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isStaff(): boolean {
    return this.getUserRole() === 'staff';
  }
}

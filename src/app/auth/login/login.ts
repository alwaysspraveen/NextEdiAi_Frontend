import { Component, NgZone } from '@angular/core';
import { ImportsModule } from '../../imports/imports';
import { Auth } from '../../core/interface/auth.interface';
import { Router } from '@angular/router';
import { AuthService } from '../auth';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [ImportsModule],
  standalone: true,
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  error: string | undefined;
  loading: any;
  success: boolean = false;
  form: any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private zone: NgZone,
    private messageService: MessageService
  ) {}
  onLogin(): void {
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe(
      (res: Auth) => {
        // ✅ normal login flow
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        console.log('Login response:', res);

        let targetRoute = '/dashboard'; // default

        switch (res.user.role) {
          case 'PRINCIPAL':
            targetRoute = '/principal/dashboard';
            break;
          case 'TEACHER':
            targetRoute = '/teacher/dashboard';
            break;
          case 'STUDENT':
            targetRoute = '/student/dashboard';
            break;
          default:
            targetRoute = '/dashboard';
        }
        this.messageService.add({
          severity: 'success', // ✅ Use success
          summary: 'Login Successful',
          detail: 'Welcome back!',
          life: 3000,
        });
        this.zone.run(() => this.router.navigate([targetRoute]));
      },
      (error) => {
        this.messageService.add({
          severity: 'error', // ✅ Correct
          summary: 'Login Failed',
          detail: 'Please check your credentials.',
          life: 3000,
        });
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../imports/imports';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { Header } from "../../components/header/header";
import { AuthService } from '../../auth/auth';

@Component({
  selector: 'app-teacher-layout',
  standalone: true,
  imports: [ImportsModule, RouterModule, Header],
  templateUrl: './teacher-layout.html',
  styleUrl: './teacher-layout.css',
})
export class TeacherLayout {
  items: MenuItem[] = [];
  constructor(protected authService: AuthService) {}
  ngOnInit() {
    this.items = [
      {
        label: 'Overview',
        icon: 'pi pi-chart-line',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
            routerLink: '/teacher/dashboard',
          },
        ],
      },
      {
        label: 'My Classes',
        icon: 'pi pi-users',
        items: [
          {
            label: 'View Assigned Classes',
            icon: 'pi pi-clipboard',
            routerLink: '/teacher/view-assigned-classes',
          },
          {
            label: 'Manage Students',
            icon: 'pi pi-user',
            routerLink: '/teacher/manage-students',
          },
          {
            label: 'Upload Study Material',
            icon: 'pi pi-upload',
            routerLink: '/teacher/upload-materials',
          },
        ],
      },
      {
        label: 'Attendance',
        icon: 'pi pi-check-square',
        items: [
          {
            label: 'Mark Daily Attendance',
            icon: 'pi pi-calendar-plus',
            routerLink: '/teacher/mark-daily-attendance',
          },
          {
            label: 'Class Attendance Reports',
            icon: 'pi pi-chart-bar',
            routerLink: '/teacher/class-attendance-reports',
          },
        ],
      },
      {
        label: 'Exams & Gradebook',
        icon: 'pi pi-book',
        items: [
          {
            label: 'Create Exam Paper',
            icon: 'pi pi-file-edit',
            routerLink: '/teacher/create-exam-paper',
          },
          {
            label: 'Enter Marks',
            icon: 'pi pi-pencil',
            routerLink: '/teacher/enter-marks',
          },
          {
            label: 'Generate Grade Reports',
            icon: 'pi pi-file',
            routerLink: '/teacher/generate-grade-reports',
          },
        ],
      },
      {
        label: 'Assignments & Submissions',
        icon: 'pi pi-folder',
        items: [
          {
            label: 'Upload Assignment',
            icon: 'pi pi-upload',
            routerLink: '/teacher/upload-assignment',
          },
          {
            label: 'View Student Submissions',
            icon: 'pi pi-eye',
            routerLink: '/teacher/view-student-submission',
          },
          {
            label: 'Grade Assignment',
            icon: 'pi pi-check-circle',
            routerLink: '/teacher/grade-assignment',
          },
        ],
      },
      {
        label: 'Quizzes',
        icon: 'pi pi-question-circle',
        items: [
          {
            label: 'Create Quizzes',
            icon: 'pi pi-plus-circle',
            routerLink: '/teacher/create-quizzes',
          },
          {
            label: 'Auto-Grading',
            icon: 'pi pi-sliders-h',
            routerLink: '/teacher/auto-grading',
          },
          {
            label: 'Review Results',
            icon: 'pi pi-chart-line',
            routerLink: '/teacher/review-results',
          },
        ],
      },
      {
        label: 'LMS',
        icon: 'pi pi-graduation-cap',
        items: [
          {
            label: 'Manage Courses',
            icon: 'pi pi-folder',
            routerLink: '/teacher/manage-courses',
          },
          {
            label: 'Track Student Progress',
            icon: 'pi pi-chart-line',
            routerLink: '/teacher/track-student-progress',
          },
        ],
      },
      {
        label: 'Notices',
        icon: 'pi pi-bell',
        items: [
          {
            label: 'View Notices',
            icon: 'pi pi-eye',
            routerLink: '/teacher/view-notices',
          },
          {
            label: 'My Leaves',
            icon: 'pi pi-eye',
            routerLink: '/teacher/manage-leaves',
          },
          {
            label: 'Post Class Announcements',
            icon: 'pi pi-megaphone',
            routerLink: '/teacher/post-class-announcements',
          },
        ],
      },
    ];
  }
}

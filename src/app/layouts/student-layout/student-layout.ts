import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../imports/imports';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth';

@Component({
  selector: 'app-student-layout',
  imports: [ImportsModule, RouterModule],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.css',
})
export class StudentLayout {
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
            routerLink: '/student/dashboard',
          },
        ],
      },
      {
        label: 'My Profile',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Personal Information',
            icon: 'pi pi-id-card',
            routerLink: '/student/personal-information',
          },
          {
            label: 'Update Details',
            icon: 'pi pi-pencil',
            routerLink: '/student/update-details',
          },
          {
            label: 'Parent Details',
            icon: 'pi pi-users',
            routerLink: '/student/parent-details',
          },
        ],
      },
      {
        label: 'My Classes',
        icon: 'pi pi-users',
        items: [
          {
            label: 'View Enrolled Classes',
            icon: 'pi pi-clipboard',
            routerLink: '/student/view-enrolled-classes',
          },
          {
            label: 'Class Timetable',
            icon: 'pi pi-calendar',
            routerLink: '/student/class-timetable',
          },
          {
            label: 'Teachers & Subjects',
            icon: 'pi pi-book',
            routerLink: '/student/teachers-and-subjects',
          },
        ],
      },
      {
        label: 'Attendance',
        icon: 'pi pi-check-square',
        items: [
          {
            label: 'My Attendance Report',
            icon: 'pi pi-chart-bar',
            routerLink: '/student/my-attendance-report',
          },
          {
            label: 'Monthly Summary',
            icon: 'pi pi-calendar-plus',
            routerLink: '/student/monthly-summary',
          },
        ],
      },
      {
        label: 'Exams & Gradebook',
        icon: 'pi pi-book',
        items: [
          {
            label: 'View Marks',
            icon: 'pi pi-pencil',
            routerLink: '/student/view-marks',
          },
          {
            label: 'Download Report Cards',
            icon: 'pi pi-file-pdf',
            routerLink: '/student/download-report-cards',
          },
          {
            label: 'Upcoming Exams',
            icon: 'pi pi-clock',
            routerLink: '/student/upcoming-exams',
          },
        ],
      },
      {
        label: 'Assignments',
        icon: 'pi pi-folder',
        items: [
          {
            label: 'View Assignments',
            icon: 'pi pi-eye',
            routerLink: '/student/view-assignments',
          },
          {
            label: 'Submit Work',
            icon: 'pi pi-upload',
            routerLink: '/student/submit-work',
          },
          {
            label: 'Check Grades',
            icon: 'pi pi-check-circle',
            routerLink: '/student/check-grades',
          },
        ],
      },
      {
        label: 'LMS',
        icon: 'pi pi-graduation-cap',
        items: [
          {
            label: 'View Courses',
            icon: 'pi pi-book',
            routerLink: '/student/view-courses',
          },
          {
            label: 'Access Videos, PDFs, Links',
            icon: 'pi pi-video',
            routerLink: '/student/access-resources',
          },
          {
            label: 'Track Learning Progress',
            icon: 'pi pi-chart-line',
            routerLink: '/student/track-learning-progress',
          },
        ],
      },
      {
        label: 'Notices & Calendar',
        icon: 'pi pi-bell',
        items: [
          {
            label: 'School Announcements',
            icon: 'pi pi-megaphone',
            routerLink: '/student/school-announcements',
          },
          {
            label: 'Exam Schedules',
            icon: 'pi pi-calendar',
            routerLink: '/student/exam-schedules',
          },
          {
            label: 'Upcoming Events',
            icon: 'pi pi-clock',
            routerLink: '/student/upcoming-events',
          },
        ],
      },
    ];
  }
}

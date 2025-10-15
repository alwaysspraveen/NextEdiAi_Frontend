import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../imports/imports';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-principal-layout',
  templateUrl: './principal-layout.html',
  styleUrl: './principal-layout.css',
  standalone: true,
  imports: [ImportsModule, RouterModule, Header],
})
export class PrincipalLayout implements OnInit {
  items: MenuItem[] = [];
  constructor(protected authService: AuthService) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Overview',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
            routerLink: '/principal/dashboard',
          },
        ],
      },
      {
        label: 'Users & Classes',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Manage Teachers',
            icon: 'pi pi-id-card',
            routerLink: '/principal/manage-teachers',
          },
          {
            label: 'Manage Students',
            icon: 'pi pi-user',
            routerLink: '/principal/manage-students',
          },
           {
            label: 'Manage Leaves',
            icon: 'pi pi-user',
            routerLink: '/principal/manage-leaves',
          },
        ],
      },

      {
        label: 'Academics',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Manage Subjects',
            icon: 'pi pi-book',
            routerLink: '/principal/manage-subjects',
          },
          {
            label: 'Manage Classes',
            icon: 'pi pi-sitemap',
            routerLink: '/principal/classrooms',
          },
          {
            label: 'Manage Time Table',
            icon: 'pi pi-calendar',
            routerLink: '/principal/manage-time-table',
          },
        ],
      },
      {
        label: 'Attendance',
        icon: 'pi pi-check-square',
        items: [
          {
            label: 'Daily Attendance',
            icon: 'pi pi-calendar-plus',
            routerLink: '/principal/daily-attendance',
          },
          {
            label: 'Monthly Reports',
            icon: 'pi pi-calendar',
            routerLink: '/principal/monthly-report',
          },
          {
            label: 'Class-Wise Summary',
            icon: 'pi pi-table',
            routerLink: '/principal/class-wise-summary',
          },
        ],
      },
      // {
      //   label: 'Exams & Gradebook',
      //   icon: 'pi pi-book',
      //   items: [
      //     {
      //       label: 'Exam Scheduling',
      //       icon: 'pi pi-clock',
      //       routerLink: '/principal/exam-scheduling',
      //     },
      //     {
      //       label: 'Marks Entry',
      //       icon: 'pi pi-pencil',
      //       routerLink: '/principal/marks-entry',
      //     },
      //     {
      //       label: 'Automated Results',
      //       icon: 'pi pi-cog',
      //       routerLink: '/principal/automated-results',
      //     },
      //     {
      //       label: 'Performance Reports',
      //       icon: 'pi pi-chart-line',
      //       routerLink: '/principal/performance-reports',
      //     },
      //   ],
      // },
      // {
      //   label: 'Fees Management',
      //   icon: 'pi pi-wallet',
      //   items: [
      //     {
      //       label: 'Fee Structures',
      //       icon: 'pi pi-sliders-h',
      //       routerLink: '/principal/fee-structures',
      //     },
      //     {
      //       label: 'Collect Fees',
      //       icon: 'pi pi-money-bill',
      //       routerLink: '/principal/collect-fees',
      //     },
      //     {
      //       label: 'Pending Dues',
      //       icon: 'pi pi-exclamation-circle',
      //       routerLink: '/principal/pending-due',
      //     },
      //     {
      //       label: 'Receipts & Invoices',
      //       icon: 'pi pi-file',
      //       routerLink: '/principal/receipt-invoice',
      //     },
      //   ],
      // },
      {
        label: 'Notices & Calendar',
        icon: 'pi pi-bell',
        items: [
          {
            label: 'Create Notices',
            icon: 'pi pi-plus',
            routerLink: '/principal/create-notice',
          },
          {
            label: 'Publish Announcements',
            icon: 'pi pi-megaphone',
            routerLink: '/principal/publish-announcement',
          },
          {
            label: 'Event Calendar',
            icon: 'pi pi-calendar',
            routerLink: '/principal/event-calendar',
          },
        ],
      },
      {
        label: 'LMS',
        icon: 'pi pi-graduation-cap',
        items: [
          {
            label: 'Courses & Materials',
            icon: 'pi pi-folder-open',
            routerLink: '/principal/course-material',
          },
          {
            label: 'Assignments',
            icon: 'pi pi-briefcase',
            routerLink: '/principal/assignments',
          },
          {
            label: 'Quizzes',
            icon: 'pi pi-question-circle',
            routerLink: '/principal/quizzes',
          },
          {
            label: 'Progress Reports',
            icon: 'pi pi-chart-bar',
            routerLink: '/principal/progress-reports',
          },
        ],
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Role Management',
            icon: 'pi pi-users',
            routerLink: '/principal/role-manage',
          },
          {
            label: 'System Configurations',
            icon: 'pi pi-sliders-v',
            routerLink: '/principal/settings/system',
          },
          {
            label: 'Audit Logs',
            icon: 'pi pi-history',
            routerLink: '/principal/settings/audit',
          },
        ],
      },
    ];
  }
}

import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../../imports/imports';
import { BackendServices } from '../../../api/backend';
import { User } from '../../../core/interface/user.interface';
import { EventCalendar } from '../event-calendar/event-calendar';
import { AddTeacher } from '../../../components/add-teacher/add-teacher';
import { ConfirmationService, MessageService } from 'primeng/api';

type TeacherRow = User & { subjectList: string }; // for filtering on a string

@Component({
  selector: 'app-manage-teachers',
  standalone: true,
  imports: [ImportsModule, AddTeacher],
  templateUrl: './manage-teachers.html',
  styleUrls: ['./manage-teachers.css'],
  providers: [ConfirmationService, MessageService],
})
export class ManageTeachers implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  availableAgents = 0; // teachers count
  showTeacherForm: boolean = false;
  isEditMode: boolean = false;
  editing: any;

  constructor(private backendService: BackendServices) {}

  ngOnInit() {
    this.loadUsers();
  }

  editTeacher(teacher: User) {
    this.editing = teacher || null;
    this.showTeacherForm = true;
    this.isEditMode = !!teacher;
  }

  loadUsers(): void {
    this.backendService.getUsers('TEACHER').subscribe({
      next: (data: User[]) => {
        const teachers = (data || []).filter((u) => u.role === 'TEACHER');
        const mapped: TeacherRow[] = teachers.map((u) => ({
          ...u,
          subjectList: Array.isArray(u.teacherSubjects)
            ? u.teacherSubjects.join(', ')
            : '',
          class: (u as any).classTeacherName || null, // Assuming classTeacherName is provided by backend
        }));

        this.users = mapped;
        this.filteredUsers = mapped;
        this.availableAgents = mapped.length;
        // console.log('Teachers:', this.users);
      },
      error: (error) => console.error('Error loading users:', error),
    });
  }

  trackById(_index: number, item: TeacherRow) {
    // your sample shows _id, not id
    return (item as any)._id ?? (item as any).id ?? item.email;
  }
}

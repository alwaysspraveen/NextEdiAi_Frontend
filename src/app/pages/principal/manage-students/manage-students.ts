import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ImportsModule } from '../../../imports/imports';
import { BackendServices } from '../../../api/backend';
import { User } from '../../../core/interface/user.interface';
import { AddStudent } from '../../../components/add-student/add-student';
import { MessageService } from 'primeng/api';

type TeacherRow = User & { subjectList: string }; // for filtering on a string

@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [ImportsModule, AddStudent],
  templateUrl: './manage-students.html',
  styleUrls: ['./manage-students.css'],
  providers: [MessageService],
})
export class ManageStudents implements OnInit {
  users: User[] = [];
  availableAgents = 0; // teachers count
  isEditMode: boolean = false;
  showStudentForm: boolean = false;
  editing: any;
  displayDialog: any;
  classNames = [
    { label: 'Nursery', value: 'Nursery' },
    { label: 'LKG', value: 'LKG' },
    { label: 'UKG', value: 'UKG' },
    { label: '1st Std', value: '1st Std' },
    { label: '2nd Std', value: '2nd Std' },
    { label: '3rd Std', value: '3rd Std' },
    { label: '4th Std', value: '4th Std' },
    { label: '5th Std', value: '5th Std' },
    { label: '6th Std', value: '6th Std' },
    { label: '7th Std', value: '7th Std' },
    { label: '8th Std', value: '8th Std' },
    { label: '9th Std', value: '9th Std' },
    { label: '10th Std', value: '10th Std' },
  ];
  constructor(
    private backendService: BackendServices,
    private message: MessageService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadClassOptions();
  }

  editStudent(student: User) {
    this.editing = student || null;
    this.showStudentForm = true;
    this.isEditMode = true;
  }

  deleteStudent(student: User) {
    this.backendService.deleteUser(student._id || '').subscribe({
      next: () => {
        this.loadUsers();
        this.message.add({
          severity: 'success',
          summary: 'Student Deleted',
          detail: 'Student Deleted successfully',
          life: 2500,
        });
      },
      error: (err) => {
        console.error('Error deleting student:', err);
      },
    });
    console.log('Delete student:', student);
  }

  loadUsers(): void {
    this.backendService.getUsers('STUDENT').subscribe({
      next: (data: User[]) => {
        this.users = (data || []).filter((u) => u.role === 'STUDENT');
      },
      error: (error) => console.error('Error loading users:', error),
    });
  }

  trackById(_index: number, item: TeacherRow) {
    // your sample shows _id, not id
    return (item as any)._id ?? (item as any).id ?? item.email;
  }

  selectedClass: string = '';
  onClassChange(event: any) {
    const selectedClassId = event.value;
    this.selectedClass = selectedClassId;
    if (selectedClassId) {
      this.loadStudentByClass(selectedClassId);
    } else {
      this.loadUsers();
    }
  }
  classes: any[] = [];
  @ViewChild('classSelect') classSelect: any;

  loadClassOptions() {
    this.backendService.getClassrooms().subscribe({
      next: (res: any) => {
        this.classNames = res.map((cls: any) => ({
          label: cls.name,
          value: cls._id,
        }));
      },
      error: () =>
        this.message.add({
          severity: 'error',
          summary: 'Failed to load classes',
        }),
    });
  }

  showAllClasses() {
    this.backendService.getClassrooms().subscribe({
      next: (res: any) => {
        this.classes = res;
      },
      error: () =>
        this.message.add({
          severity: 'error',
          summary: 'Failed to load classes',
        }),
    });
  }

  loadStudentByClass(id: string) {
    this.backendService.getStudentsByClass(id).subscribe({
      next: (res: any) => {
        this.users = res.students;
      },
      error: () =>
        this.message.add({
          severity: 'error',
          summary: 'Failed to load classes',
        }),
    });
  }
}

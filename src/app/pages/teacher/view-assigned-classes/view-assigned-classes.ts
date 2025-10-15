import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../../imports/imports';
import { AddStudent } from '../../../components/add-student/add-student';
import { CreateClass } from '../../../components/add-classroom/add-classroom';
import { BackendServices } from '../../../api/backend';
import { PopoverModule } from 'primeng/popover';
import { RouterLink } from '@angular/router';
import { Classrooms } from '../../principal/classrooms/classrooms';
import { AuthService } from '../../../auth/auth';

interface DropdownOption {
  label: string;
  value: string;
}

interface Teacher {
  _id: string;
  name: string;
}
@Component({
  selector: 'app-view-assigned-classes',
  imports: [ImportsModule, CreateClass, PopoverModule],
  templateUrl: './view-assigned-classes.html',
  styleUrl: './view-assigned-classes.css',
  providers: [MessageService],
})
export class ViewAssignedClasses {
  classes: any[] = [];
  form!: FormGroup;
  displayDialog = false;
  editing = false;
  loading = false;
  isEditMode = false;
  showClassForm: boolean = false;
  editClassRoom: any[] = [];

  // Dropdown options
  sectionOptions: DropdownOption[] = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
  ];

  subjectOptions: DropdownOption[] = [
    { label: 'Maths', value: 'Maths' },
    { label: 'Science', value: 'Science' },
    { label: 'English', value: 'English' },
    { label: 'Hindi', value: 'Hindi' },
    { label: 'Social Science', value: 'Social Science' },
    { label: 'Computer', value: 'Computer' },
  ];

  teacherOptions: Teacher[] = [
    { _id: 't1', name: 'Rahul Sharma' },
    { _id: 't2', name: 'Neha Verma' },
    { _id: 't3', name: 'Ankit Mehta' },
  ];
  selectedSubject: any;
  selectedTeacher: any;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private api: BackendServices,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.auth.getUserId();
    this.loadClassOptions(id);
    this.showAllClasses(id);
  }
  editStudent(student: Classrooms) {
    this.editClassRoom = this.classes || null;
    this.showClassForm = true;
    this.isEditMode = !!student;
  }
  /** Initialize Reactive Form */
  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      section: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      subjects: [[], Validators.required],
      classTeacher: [''],
    });
  }

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

  sections = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
  ];

  academicYears = [
    { label: '2024-2025', value: '2024-2025' },
    { label: '2025-2026', value: '2025-2026' },
    { label: '2026-2027', value: '2026-2027' },
  ];

  teachers: any[] = [];

  selectedClass: string = '';
  onClassChange(event: any) {
    const selectedClassId = event.value;
    this.selectedClass = selectedClassId;
    if (selectedClassId) {
      this.loadClassesByName(selectedClassId);
    }
  }
  @ViewChild('classSelect') classSelect: any;

  clearFilter() {
    this.selectedClass = '';
    if (this.classSelect) {
      this.classSelect.value = null; // or ''
    }
  }

  loadClassOptions(teacherID: string) {
    this.api.getClassByTeacher(teacherID).subscribe({
      next: (res: any) => {
        this.classNames = res.map((cls: any) => ({
          label: cls.name,
          value: cls._id,
        }));
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to load classes',
        }),
    });
  }

  showAllClasses(teacherID: string) {
    this.api.getClassByTeacher(teacherID).subscribe({
      next: (res: any) => {
        this.classes = res;
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to load classes',
        }),
    });
  }

  loadClassesByName(id: string) {
    this.api.getClassroomsById(id).subscribe({
      next: (res: any) => {
        this.classes = res;
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to load classes',
        }),
    });
  }

  /** Show Dialog */
  showAddDialog() {
    this.isEditMode = false;
    this.editing = false;
    this.editClassRoom = []; // <-- Set to empty array to match type any[]
    this.form.reset({
      academicYear: '2025-2026',
    });
    this.displayDialog = true;
  }

  /** Hide Dialog */
  hideDialog() {
    this.displayDialog = false;
    this.form.reset();
  }

  /** Edit Class */
  editClass(classData: any) {
    this.editClassRoom = classData;
    this.displayDialog = true;
    this.isEditMode = true;
  }

  /** Delete Class */
  deleteClass(classData: any) {
    this.classes = this.classes.filter((c) => c._id !== classData._id);
    this.api.deleteClassroom(classData._id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Deleted',
          detail: 'Class removed successfully!',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Delete Failed',
          detail: 'Failed to delete class.',
        });
      },
    });
  }
}

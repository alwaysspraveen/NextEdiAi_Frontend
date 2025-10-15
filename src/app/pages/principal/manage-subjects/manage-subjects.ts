import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImportsModule } from '../../../imports/imports';
import { BackendServices } from '../../../api/backend';
import { AddSubject } from '../../../components/add-subject/add-subject';
import { Subject } from '../../../core/interface/subject.interface';
import { SelectChangeEvent } from 'primeng/select';

interface DropdownOption {
  label: string;
  value: string;
}

interface Teacher {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-subject',
  imports: [ImportsModule, AddSubject],
  standalone: true,
  templateUrl: './manage-subjects.html',
  styleUrl: './manage-subjects.css',
  providers: [MessageService, ConfirmationService],
})
export class ManageSubjects implements OnInit {
  subjects: Subject[] = [];
  form!: FormGroup;
  displayDialog = false;
  editing: any;
  loading = false;
  isEditMode: boolean = false;

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

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private api: BackendServices, // Replace 'any' with actual BackendServices type
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSubjects();
    this.loadClassOptions();
  }

  showAllSubjects() {
    this.loadSubjects();
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
  /** Load Dummy Data Initially */
  selectedClass: string = '';
  onClassChange(event: any) {
    const selectedClassId = event.value;
    this.selectedClass = selectedClassId;
    if (selectedClassId) {
      this.loadClassesByName(selectedClassId);
    } else {
      this.loadSubjects();
    }
  }
  @ViewChild('classSelect') classSelect: any;

  clearFilter() {
    this.selectedClass = '';
    if (this.classSelect) {
      this.classSelect.value = null; // or ''
    }
    this.loadSubjects();
  }

  loadClassOptions() {
    this.api.getClassrooms().subscribe({
      next: (res: any) => {
        this.classNames = res.map((cls: any) => ({
          label: `${cls.name} - ${cls.section} Section `,
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
  loadSubjects() {
    this.api.getSubjects().subscribe({
      next: (res: any) => {
        this.subjects = res;
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to load subjects',
        }),
    });
  }
  loadClassesByName(id: string) {
    this.api.getSubjectsByClass(id).subscribe({
      next: (res: any) => {
        this.subjects = res;
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
    this.editing = false;
    this.displayDialog = true;
  }

  /** Hide Dialog */
  hideDialog() {
    this.displayDialog = false;
  }

  /** Edit Class */
  editSubject(subjectData: any) {
    this.editing = subjectData;
    console.log(this.editing);
    this.displayDialog = true;
  }

  /** Delete Class */
  deleteSubject(subjectData: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this subject?',
      header: 'Delete Subject',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.api.deleteSubject(subjectData._id).subscribe();
        this.messageService.add({
          severity: 'warn',
          summary: 'Deleted',
          detail: 'Subject removed successfully!',
        });
        this.loadSubjects();
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }
}

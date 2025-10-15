import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { ImportsModule } from '../../imports/imports';
import { BackendServices } from '../../api/backend';

@Component({
  selector: 'app-create-class',
  templateUrl: './add-classroom.html',
  imports: [ImportsModule],
  standalone: true,
  styleUrl: './add-classroom.css',
  providers: [MessageService],
})
export class CreateClass implements OnInit {
  classForm!: FormGroup;
  loading = false;
  @Input() isEditMode: boolean = false;
  @Input() set class(value: any | null) {
    if (value && this.classForm) {
      this.classForm.patchValue({
        ...value,
        id: value._id,
        classTeacher: value.classTeacher?._id || '',
      });
    } else if (this.classForm) {
      this.classForm.reset({
        academicYear: '2025-2026',
      });
    }
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

  teacherNames: { label: string; value: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private api: BackendServices,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.classForm = this.fb.group({
      id:[''],
      name: ['', Validators.required],
      section: ['', Validators.required],
      academicYear: ['', Validators.required],
      classTeacher: [''],
    });
  }

  ngOnInit(): void {
    this.loadTeacher();
  }

  loadTeacher() {

    this.api.getUsers('TEACHER').subscribe({
      next: (res: any) => {
        this.teacherNames = res.map((cls: any) => ({
          label: cls.name || cls.fname,
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

  submitClass() {
    if (this.classForm.invalid) return;

    this.loading = true;

    if (this.isEditMode) {
      this.api
        .updateClass(this.classForm.value.id, this.classForm.value)
        .subscribe({
          next: () => {
            this.loading = false;
            this.showSuccess('Class updated successfully');
            this.resetForm();
          },
          error: (err) => {
            this.loading = false;
            this.showError(err.error.message || 'Failed to update class');
          },
        });
    } else {
      this.api.addClassroom(this.classForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.showSuccess('Class created successfully');
          this.resetForm();
        },
        error: (err) => {
          this.loading = false;
          this.showError(err.error.message || 'Failed to create class');
        },
      });
    }
  }

  resetForm() {
    this.classForm.reset();
  }

  showSuccess(detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail,
    });
  }

  showError(detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail,
    });
  }
}

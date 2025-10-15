import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../imports/imports';
import { BackendServices } from '../../api/backend';
import { User } from '../../core/interface/user.interface';
import { Subject } from '../../core/interface/subject.interface';
import { Emitter } from '@fullcalendar/core/internal.js';

@Component({
  selector: 'app-create-subject',
  templateUrl: './add-subject.html',
  imports: [ImportsModule],
  standalone: true,
  styleUrl: './add-subject.css',
  providers: [MessageService],
})
export class AddSubject implements OnInit {
  subjectForm!: FormGroup;
  loading = false;
  classNames: { label: string; value: string }[] = [];
  teacherNames: { label: string; value: string }[] = [];
  @Output() saved = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Input() isEditMode: boolean = false;
  @Input() set subject(value: any | null) {
    this.loadClasses();

    if (value && this.subjectForm) {
      this.subjectForm.patchValue({
        ...value,
        id: value._id,
        teacher: value.teacher?._id || value.teacher || '',
        classroom: value.classroom?._id || value.classroom || '',
      });
    } else {
      this.subjectForm.reset();
    }
  }

  loadClasses() {
    this.api.getClassrooms().subscribe({
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

  constructor(
    private fb: FormBuilder,
    private api: BackendServices,
    private messageService: MessageService
  ) {
    this.subjectForm = this.fb.group({
      _id: [''],
      name: ['', Validators.required],
      code: [''],
      classroom: ['', Validators.required],
      academicYear: ['', Validators.required],
      teacher: [''],
    });
  }

  ngOnInit(): void {
    this.loadClasses();
    this.loadTeacher();
  }

  submitClass() {
    if (this.subjectForm.invalid) return;
    if (!this.isEditMode || this.subject) {
      this.loading = true;
      this.api.addSubject(this.subjectForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.showSuccess('subject created successfully');
          this.resetForm();
          this.saved.emit();
          this.close.emit();
        },
        error: (err) => {
          this.loading = false;
          this.showError(err.error.message || 'Failed to create class');
        },
      });
    } else if (this.isEditMode) {
      console.log(this.subjectForm.value._id);

      this.api
        .updateSubject(this.subjectForm.value._id, this.subjectForm.value)
        .subscribe({
          next: () => {
            this.loading = false;
            this.showSuccess('subject created successfully');
            this.resetForm();
            this.saved.emit();
            this.close.emit();
          },
          error: (err) => {
            this.loading = false;
            this.showError(err.error.message || 'Failed to create class');
          },
        });
    }
  }

  resetForm() {
    this.subjectForm.reset();
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

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../../imports/imports';
import { BackendServices } from '../../../api/backend';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../auth/auth';

type Status = 'P' | 'A' | 'L'; // Backend format

@Component({
  selector: 'app-mark-daily-attendance',
  imports: [ImportsModule],
  templateUrl: './mark-daily-attendance.html',
  styleUrl: './mark-daily-attendance.css',
  providers: [MessageService],
})
export class MarkDailyAttendance {
  attendanceForm!: FormGroup;
  selectedDate: Date = new Date();
  classes: any[] = [];
  students: any[] = [];
  attendance: Record<string, Status> = {}; // studentId -> 'P' | 'A' | 'L'

  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private api: BackendServices,
    private toast: MessageService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.attendanceForm = this.fb.group({
      classId: ['', Validators.required],
      date: [this.selectedDate, Validators.required],
    });

    const teacherId = this.auth.getUserId();
    console.log(teacherId);

    this.loadClassByTeacher(teacherId);
  }

  onInlineDateChange(d: Date) {
    this.attendanceForm.patchValue({ date: d });
    this.onDateChange();
  }

  get totalStudents(): number {
    return this.students.length;
  }

  get presentCount(): number {
    return Object.values(this.attendance).filter((s) => s === 'P').length;
  }

  get absentCount(): number {
    return Object.values(this.attendance).filter((s) => s === 'A').length;
  }

  get leaveCount(): number {
    return Object.values(this.attendance).filter((s) => s === 'L').length;
  }

  loadClassByTeacher(id: string) {
    this.api.getClassByTeacher(id).subscribe({
      next: (res: any) => {
        this.classes = res.map((cls: any) => ({
          label: cls.name,
          value: cls._id,
        }));
      },
      error: () =>
        this.toast.add({
          severity: 'error',
          summary: 'Failed to load classes',
        }),
    });
  }

  onClassChange() {
    this.loadStudents();
  }

  onDateChange() {
    this.prefillExistingAttendance();
  }

  loadStudents() {
    const classId = this.attendanceForm.value.classId;
    if (!classId) return;

    this.loading = true;
    this.api
      .getStudentsByClass(classId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          this.students = Array.isArray(res) ? res : res?.students ?? [];
          this.attendance = {};
          for (const s of this.students) this.attendance[s._id] = 'P';
          this.prefillExistingAttendance();
        },
        error: () =>
          this.toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load students',
          }),
      });
  }

  prefillExistingAttendance() {
    const classId = this.attendanceForm.value.classId;
    const date = this.attendanceForm.value.date;
    if (!classId || !date) return;

    const dateISO = new Date(date).toISOString().slice(0, 10);

    this.api.getAttendanceByClassAndDate(classId, dateISO).subscribe({
      next: (res: any) => {
        const records = res?.records || [];
        for (const r of records) {
          this.attendance[r.student?._id || r.student] = r.status as Status;
        }
      },
      error: () => {
        // Silent if not found
      },
    });
  }

  markAttendance(studentId: string, status: 'present' | 'absent' | 'leave') {
    this.attendance[studentId] = this.toCode(status);
  }

  toCode(status: 'present' | 'absent' | 'leave'): Status {
    return status === 'present' ? 'P' : status === 'absent' ? 'A' : 'L';
  }

  toLabel(code: Status): string {
    return code === 'P' ? 'present' : code === 'A' ? 'absent' : 'leave';
  }

  save() {
    const classId = this.attendanceForm.value.classId;
    const dateISO = new Date(this.attendanceForm.value.date).toISOString();

    const payload = {
      classId,
      date: dateISO,
      records: this.students.map((s) => ({
        student: s._id,
        status: this.attendance[s._id] || 'P',
        note: s.note || '',
      })),
    };

    this.saving = true;
    this.api
      .saveAttendance(payload)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () =>
          this.toast.add({
            severity: 'success',
            summary: 'Saved',
            detail: 'Attendance saved successfully',
          }),
        error: (err) =>
          this.toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message || 'Failed to save attendance',
          }),
      });
  }
}

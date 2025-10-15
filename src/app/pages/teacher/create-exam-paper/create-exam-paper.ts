import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BackendServices } from '../../../api/backend';
import { AuthService } from '../../../auth/auth';
import { ImportsModule } from '../../../imports/imports';
import { RagApiService } from '../../../core/services/rag';

@Component({
  selector: 'app-create-exam-paper',
  imports: [ImportsModule],
  templateUrl: './create-exam-paper.html',
  styleUrl: './create-exam-paper.css',
  providers: [MessageService],
})
export class CreateExamPaper {
  // dropdown data
  classNames: { label: string; value: string }[] = [];
  subjectNames: { label: string; value: string }[] = [];
  examTypes = [
    { label: 'Unit Test', value: 'UNIT_TEST' },
    { label: 'Mid Term', value: 'MID_TERM' },
    { label: 'Final', value: 'FINAL' },
    { label: 'Quiz', value: 'QUIZ' },
  ];
  modes = [
    { label: 'Offline', value: 'OFFLINE' },
    { label: 'Online', value: 'ONLINE' },
  ];

  // form model
  classId = '';
  subjectId = '';
  title = '';
  examType: 'UNIT_TEST' | 'MID_TERM' | 'FINAL' | 'QUIZ' | '' = '';
  mode: 'OFFLINE' | 'ONLINE' | '' = 'OFFLINE';
  dateTime?: Date;
  durationMin?: number; // minutes
  totalMarks?: number;
  instructions = '';

  // upload
  uploading = false;
  paperFile: File | null = null;

  saving = false;

  constructor(
    private api: RagApiService,
    private backend: BackendServices,
    private auth: AuthService,
    private toast: MessageService
  ) {}

  ngOnInit() {
    const teacherId = this.auth.getUserId();
    if (!teacherId) {
      this.toast.add({ severity: 'warn', summary: 'No teacher ID found' });
      return;
    }
    // load classes from “subject-teacher map” like your other component
    this.backend.getSubjectsByTeacher(teacherId).subscribe({
      next: (res: any[]) => {
        // unique class list from subject records
        const uniq = new Map<string, string>();
        res.forEach((r: any) => {
          if (r?.classroom?._id && r?.classroom?.name) {
            uniq.set(r.classroom._id, r.classroom.name);
          }
        });
        this.classNames = Array.from(uniq, ([value, label]) => ({
          label,
          value,
        }));
      },
      error: () =>
        this.toast.add({
          severity: 'error',
          summary: 'Failed to load classes',
        }),
    });
  }

  onClassChange(classId: string) {
    this.subjectId = '';
    if (!classId) return;
    const teacherId = this.auth.getUserId();
    if (!teacherId) return;

    this.backend.getSubjectsByClassandTeacher(classId, teacherId).subscribe({
      next: (res: any[]) => {
        this.subjectNames = res.map((s: any) => ({
          label: s.name,
          value: s._id,
        }));
      },
      error: () =>
        this.toast.add({
          severity: 'error',
          summary: 'Failed to load subjects',
        }),
    });
  }

  onPaperUpload(ev: any) {
    // p-fileUpload custom mode
    const file: File | undefined = ev?.files?.[0];
    if (!file) return;
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
      this.toast.add({
        severity: 'warn',
        summary: 'Invalid file',
        detail: 'Only PDF/DOCX allowed',
      });
      ev?.options?.clear?.(); // clear Prime upload
      return;
    }
    this.paperFile = file;
    this.toast.add({
      severity: 'info',
      summary: 'Attached',
      detail: file.name,
    });
    ev?.options?.clear?.();
  }

  removePaper() {
    this.paperFile = null;
  }

  get valid() {
    return (
      !!this.classId &&
      !!this.subjectId &&
      !!this.title.trim() &&
      !!this.examType &&
      !!this.mode &&
      this.dateTime instanceof Date &&
      !isNaN(this.dateTime.getTime()) &&
      !!this.durationMin &&
      !!this.totalMarks
    );
  }

  create() {
    if (!this.valid) {
      this.toast.add({ severity: 'warn', summary: 'Fill required fields' });
      return;
    }

    const teacherId = this.auth.getUserId();
    if (!teacherId) {
      this.toast.add({ severity: 'warn', summary: 'No teacher ID found' });
      return;
    }

    this.saving = true;

    // If paper file present, send FormData. Else JSON.
    if (this.paperFile) {
      const form = new FormData();
      form.append('classId', this.classId);
      form.append('subjectId', this.subjectId);
      form.append('title', this.title.trim());
      form.append('type', this.examType);
      form.append('mode', this.mode);
      form.append('dateTime', this.dateTime!.toISOString());
      form.append('durationMin', String(this.durationMin));
      form.append('totalMarks', String(this.totalMarks));
      form.append('instructions', this.instructions || '');
      form.append('teacherId', teacherId);
      form.append('paper', this.paperFile);

      this.api.createExam(form).subscribe({
        next: () => {
          this.toast.add({ severity: 'success', summary: 'Exam created' });
          this.reset();
        },
        error: (err) => {
          this.toast.add({
            severity: 'error',
            summary: 'Create failed',
            detail: err?.message || String(err),
          });
          this.saving = false;
        },
      });
    } else {
      const payload = {
        classId: this.classId,
        subjectId: this.subjectId,
        title: this.title.trim(),
        type: this.examType,
        mode: this.mode,
        dateTime: this.dateTime!.toISOString(),
        durationMin: this.durationMin,
        totalMarks: this.totalMarks,
        instructions: this.instructions || '',
        teacherId,
      };
      this.api.createExam(payload).subscribe({
        next: () => {
          this.toast.add({ severity: 'success', summary: 'Exam created' });
          this.reset();
        },
        error: (err) => {
          this.toast.add({
            severity: 'error',
            summary: 'Create failed',
            detail: err?.message || String(err),
          });
          this.saving = false;
        },
      });
    }
  }

  protected reset() {
    this.saving = false;
    this.paperFile = null;
    this.title = '';
    this.examType = '';
    this.mode = 'OFFLINE';
    this.dateTime = undefined;
    this.durationMin = undefined;
    this.totalMarks = undefined;
    this.instructions = '';
  }
}

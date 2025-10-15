import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../../imports/imports';
import { BackendServices } from '../../../api/backend';
import { User } from '../../../core/interface/user.interface';
import { Subject } from '../../../core/interface/subject.interface';
import dayjs from 'dayjs';

/** ---- Interfaces (simplified) ---- */
interface Classroom {
  _id: string;
  name: string;
  section?: string;
  academicYear: string;
}
// Remove the local Subject interface, use the imported one.
interface Teacher {
  _id: string;
  name: string;
  email?: string;
}

// add near your interfaces
interface Substitution {
  date: string; // ISO date (yyyy-mm-dd...)
  classroomId: string;
  periodKey: string; // e.g., 'P3'
  subjectId?: string; // optional override
  absentTeacherId: string;
  substituteTeacherId?: string;
  mode: 'SUBJECT' | 'ALT_SUBJECT' | 'SUPERVISION';
}

interface DayTemplate {
  periods: { key: string; label: string; isBreak?: boolean }[];
  workingDays: string[];
} // e.g., Mon..Sat
interface TTEntry {
  day: string; // 'Mon' | 'Tue' ...
  periodKey: string; // 'P1' | 'BREAK' ...
  subject?: string;
  teacher?: string;
  roomId?: string;
}

@Component({
  selector: 'app-manage-timetable',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ImportsModule],
  templateUrl: './manage-time-table.html',
  styleUrls: ['./manage-time-table.css'],
  providers: [MessageService],
})
export class ManageTimeTable implements OnInit {
  // Filters
  academicYears = ['2024-2025', '2025-2026', '2026-2027'];
  selectedYear = this.academicYears[1];
  overrides = new Map<string, Substitution>(); // key: `${day}-${periodKey}`
  subSlots = new Set<string>(); // for UI highlight

  classrooms: Classroom[] = [];
  selectedClassId: string | null = null;

  selectedWeek: Date = new Date();

  subjects: any[] = [];
  teachers: any[] = [];

  template: DayTemplate | null = null;
  days: string[] = [];
  periods: { key: string; label: string; isBreak?: boolean }[] = [];

  private cellMap = new Map<string, TTEntry>();

  conflicts = signal<string[]>([]);

  assignVisible = false;
  assignContext: { day?: string; periodKey?: string } = {};
  assignSubjectId: string | null = null;
  assignTeacherId: string | null = null;

  constructor(private api: BackendServices, private toast: MessageService) {}

  ngOnInit(): void {
    this.loadClassrooms();
    this.loadTeacher();
    this.loadTemplate();
  }
  weekRangeISO(d: Date) {
    const start = dayjs(this.weekStartISO(d));
    const end = start.add(6, 'day').endOf('day');
    return { fromISO: start.toISOString(), toISO: end.toISOString() };
  }
  dowFromISO(iso: string) {
    // -> 'Mon'|'Tue'...
    return dayjs(iso).format('ddd');
  }
  isSubSlot(day: string, periodKey: string) {
    return this.subSlots.has(this.k(day, periodKey));
  }

  /** ---------- LOADERS ---------- */
  loadClassrooms() {
    this.api.getClassrooms().subscribe({
      next: (list: any[]) => {
        this.classrooms = list;

        if (list.length > 0) {
          // Set default class
          this.selectedClassId = list[0]._id;
          this.onClassChange(this.selectedClassId); // 👈 load data!
        }
      },
      error: () =>
        this.toast.add({
          severity: 'error',
          summary: 'Failed',
          detail: 'Could not load classes',
        }),
    });
  }

  loadTemplate() {
    // You can serve this from backend; here’s a sensible default:
    this.template = {
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      periods: [
        { key: 'P1', label: 'P1' },
        { key: 'P2', label: 'P2' },
        { key: 'P3', label: 'P3' },
        { key: 'BREAK', label: 'Break', isBreak: true },
        { key: 'P4', label: 'P4' },
        { key: 'P5', label: 'P5' },
        { key: 'P6', label: 'P6' },
      ],
    };
    this.days = this.template.workingDays;
    this.periods = this.template.periods;
  }

  onClassChange(eventOrId: any) {
    const classId =
      typeof eventOrId === 'string' ? eventOrId : eventOrId?.value;

    this.selectedClassId = classId || null;
    if (!this.selectedClassId) return;

    this.loadSubjectsForClass(this.selectedClassId);
    this.loadTeacher();
  }

  loadSubjectsForClass(classId: string) {
    this.api.getSubjectsByClass(classId).subscribe({
      next: (subs: any[]) => {
        this.subjects = (subs || []).map((s) => ({
          label: s.name,
          value: s._id,
        }));
        this.loadGrid();
      },
    });
  }

  loadTeacher() {
    this.api.getUsers('TEACHER').subscribe({
      next: (res: any[]) => {
        this.teachers = (res || []).map((t) => ({
          label:
            [t.fname, t.lname].filter(Boolean).join(' ').trim() ||
            t.name ||
            '(No name)',
          value: t._id,
        }));
      },
      error: () =>
        this.toast.add({
          severity: 'error',
          summary: 'Failed to load teachers',
        }),
    });
  }

  loadGrid() {
    if (!this.selectedClassId || !this.template) return;

    const weekStartISO = this.weekStartISO(this.selectedWeek);
    const { fromISO, toISO } = this.weekRangeISO(this.selectedWeek);

    this.api.getTimetable(this.selectedClassId, weekStartISO).subscribe({
      next: (res: any) => {
        let rows: TTEntry[] = [];
        if (Array.isArray(res)) rows = res;
        else if (Array.isArray(res?.entries)) rows = res.entries;
        else if (Array.isArray(res?.timetable?.entries))
          rows = res.timetable.entries;

        // 1) base grid
        this.cellMap.clear();
        for (const day of this.days) {
          for (const p of this.periods) {
            const existing = rows.find(
              (r) => r.day === day && r.periodKey === p.key
            );
            this.cellMap.set(
              this.k(day, p.key),
              existing || {
                day,
                periodKey: p.key,
                subject: undefined,
                teacher: undefined,
                roomId: undefined,
              }
            );
          }
        }

        // 2) overlay substitutions (NEW)
        this.api
          .getSubstitutions(this.selectedClassId!, fromISO, toISO)
          .subscribe({
            next: (subs: Substitution[]) => {
              this.applySubstitutions(subs || []);
              this.checkConflicts();
            },
            error: () => {
              this.applySubstitutions([]); // clear overlays if any
              this.checkConflicts();
            },
          });
      },
      error: () => {
        this.cellMap.clear();
        this.applySubstitutions([]);
        this.checkConflicts();
      },
    });
  }
  private applySubstitutions(subs: Substitution[]) {
    this.overrides.clear();
    this.subSlots.clear();

    for (const s of subs) {
      const day = this.dowFromISO(s.date); // 'Mon'..'Sat'
      const key = this.k(day, s.periodKey);
      const cell =
        this.cellMap.get(key) || ({ day, periodKey: s.periodKey } as TTEntry);

      // Apply teacher/subject override if present
      if (s.substituteTeacherId) cell.teacher = s.substituteTeacherId;
      if (s.subjectId) cell.subject = s.subjectId;

      // Keep a marker for UI + quick detail
      (cell as any)._substitution = s;
      this.cellMap.set(key, cell);
      this.overrides.set(key, s);
      this.subSlots.add(key);
    }

    // Force change detection on Maps in Angular signals world
    this.cellMap = new Map(this.cellMap);
  }

  k(day: string, periodKey: string) {
    return `${day}-${periodKey}`;
  }
  cell(day: string, periodKey: string): TTEntry | undefined {
    return this.cellMap.get(this.k(day, periodKey));
  }
  subjectName(id?: string) {
    return this.subjects.find((s) => s.value === id)?.label ?? '—';
  }
  teacherName(id?: string) {
    return this.teachers.find((t) => t.value === id)?.label ?? '—';
  }

  openAssign(day: string, periodKey: string) {
    if (this.periods.find((p) => p.key === periodKey)?.isBreak) return;

    const existing = this.cell(day, periodKey);
    this.assignContext = { day, periodKey };

    this.assignSubjectId = (existing?.subject as any) || null;
    this.assignTeacherId = (existing?.teacher as any) || null;

    this.assignVisible = true;
  }

  saveAssign() {
    const { day, periodKey } = this.assignContext;
    if (!day || !periodKey) return;

    const entry: TTEntry = {
      day,
      periodKey,
      subject: this.normId(this.assignSubjectId),
      teacher: this.normId(this.assignTeacherId),
    };

    this.cellMap.set(this.k(day, periodKey), entry);
    this.cellMap = new Map(this.cellMap);
    this.assignVisible = false;
    this.checkConflicts();
  }

  autoGenerate() {
    if (!this.selectedClassId) return;
    const weekStart = this.weekStartISO(this.selectedWeek);
    this.api
      .generateTimetable({ classroomId: this.selectedClassId, weekStart })
      .subscribe({
        next: (rows: TTEntry[]) => {
          this.cellMap.clear();
          rows.forEach((e) => this.cellMap.set(this.k(e.day, e.periodKey), e));
          this.toast.add({
            severity: 'success',
            summary: 'Generated',
            detail: 'Timetable created',
          });
          this.checkConflicts();
          this.loadGrid();
        },
        error: (e) =>
          this.toast.add({
            severity: 'error',
            summary: 'Failed',
            detail: e?.error?.message || 'Generation failed',
          }),
      });
  }

  validate() {
    const payload = this.toArray();
    this.api.validateTimetable(payload).subscribe({
      next: (result: { conflicts: string[] }) => {
        this.conflicts.set(result.conflicts || []);
        this.toast.add({
          severity: result.conflicts?.length ? 'warn' : 'success',
          summary: 'Validate',
          detail: result.conflicts?.length ? 'Issues found' : 'No conflicts',
        });
      },
      error: () =>
        this.toast.add({
          severity: 'error',
          summary: 'Failed',
          detail: 'Validation error',
        }),
    });
  }

  private normId(v: any): string | undefined {
    if (!v) return undefined;
    if (typeof v === 'string') return v;
    if (typeof v === 'object') return v._id || v.value || undefined;
    return undefined;
  }

  private serializeEntries(): any[] {
    if (!this.template) return [];
    const out: any[] = [];

    for (const day of this.days) {
      for (const p of this.periods) {
        const saved = this.cell(day, p.key);

        if (p.isBreak) {
          out.push({
            day,
            periodKey: p.key,
            isBreak: true,
          });
          continue;
        }

        out.push({
          day,
          periodKey: p.key,
          subjectId: this.normId(saved?.subject),
          teacherId: this.normId(saved?.teacher),
          room: this.normId(saved?.roomId),
          isBreak: false,
        });
      }
    }
    return out;
  }

  publish() {
    if (!this.selectedClassId) {
      this.toast.add({ severity: 'warn', summary: 'Pick a class first' });
      return;
    }
    this.checkConflicts();

    const payload = {
      classroomId: this.selectedClassId,
      weekStart: this.weekStartISO(this.selectedWeek),
      entries: this.serializeEntries(),
    };

    this.api.publishTimetable(payload).subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: 'Published' });
        this.loadGrid();
      },
      error: (err) => {
        console.error('Publish error', err);
        this.toast.add({
          severity: 'error',
          summary: 'Publish failed',
          detail: err?.error?.message || 'Invalid payload',
        });
        if (err?.error?.problems) console.table(err.error.problems);
      },
    });
  }

  resetGrid() {
    this.cellMap.clear();
    this.conflicts.set([]);
  }

  toArray(): TTEntry[] {
    return Array.from(this.cellMap.values());
  }

  weekStartISO(d: Date) {
    const copy = new Date(d);
    const day = copy.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    copy.setDate(copy.getDate() + diff);
    copy.setHours(0, 0, 0, 0);
    return copy.toISOString();
  }

  checkConflicts() {
    const issues: string[] = [];
    const byDayPeriod = new Map<string, { teacherId?: string }[]>();

    for (const e of this.cellMap.values()) {
      if (!e.teacher || !e.subject) continue;
      const key = this.k(e.day, e.periodKey);
      const list = byDayPeriod.get(key) || [];
      list.push({ teacherId: e.teacher });
      byDayPeriod.set(key, list);
    }
    for (const [slot, list] of byDayPeriod) {
      const seen = new Set<string>();
      list.forEach((x) => {
        if (!x.teacherId) return;
        if (seen.has(x.teacherId)) issues.push(`Teacher overlap at ${slot}`);
        seen.add(x.teacherId);
      });
    }
    this.conflicts.set(issues);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  signal,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ImportsModule } from '../../../imports/imports';
import { BackendServices } from '../../../api/backend';
import { Popover } from 'primeng/popover';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface Teacher {
  _id: string;
  name: string;
  email?: string;
  dept?: string;
}
export interface Subject {
  _id: string;
  name: string;
  code?: string;
}
export interface Classroom {
  _id: string;
  name: string;
  section?: string;
}

export interface LeavePeriod {
  date: string;
  day: string; // Mon/Tue/...
  periodKey: string;
  subject?: Subject | string;
  classroomId?: Classroom | string;
}

export interface Leave {
  _id: string;
  teacherId: string | Teacher;
  type:
    | 'CASUAL'
    | 'SICK'
    | 'EARNED'
    | 'OD'
    | 'COMP_OFF'
    | 'UNPAID'
    | 'MATERNITY'
    | 'PATERNITY';
  startDate: string;
  endDate: string;
  approverId?: string;
  periods: LeavePeriod[];
  reason?: string;
  status: LeaveStatus;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-manage-leaves',
  standalone: true,
  imports: [ImportsModule, Popover],
  templateUrl: './manage-leaves.html',
  styleUrls: ['./manage-leaves.css'],
  providers: [MessageService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageLeaves implements OnInit {
  // Filters
  statusControl = new FormControl<LeaveStatus | 'ALL'>('ALL', {
    nonNullable: true,
  });
  dateRange = new FormControl<[Date | null, Date | null]>([null, null]);

  // Data
  loading = signal(false);
  rows = signal<Leave[]>([]);
  // use signals with explicit change handler (no banana-in-a-box on signals)
  selected = signal<Leave[]>([]);

  // Details / periods viewer
  detailsOpen = signal(false);
  activeLeave = signal<Leave | null>(null);

  // Reject dialog
  rejectOpen = signal(false);
  rejectRemark = new FormControl<string>('', { nonNullable: true });

  // UI helpers
  statusOptions = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Cancelled', value: 'CANCELLED' },
    { label: 'All', value: 'ALL' },
  ];

  // Derived
  periodsForActive = computed<LeavePeriod[]>(
    () => this.activeLeave()?.periods ?? []
  );

  constructor(
    private api: BackendServices,
    private toast: MessageService,
    private confirm: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.fetch();
    effect(() => {
      // re-fetch on filter changes
      void this.statusControl.value;
      void this.dateRange.value;
      this.fetch();
    });
  }

  fetch() {
    this.loading.set(true);

    const params: any = {};
    const status = this.statusControl.value;
    const range = this.dateRange.value;

    if (status && status !== 'ALL') {
      params.status = status;
    }

    if (Array.isArray(range) && range.length === 2) {
      const [from, to] = range;
      if (from) params.from = from.toISOString();
      if (to) params.to = to.toISOString();
    }

    this.api.getLeaves(params).subscribe({
      next: (items) => {
        this.rows.set(
          Array.isArray(items) ? items : (items as any).items || []
        );
        this.loading.set(false);
        this.selected.set([]);
      },
      error: () => {
        this.loading.set(false);
        this.toast.add({
          severity: 'error',
          summary: 'Failed',
          detail: 'Could not load leaves.',
        });
      },
    });
  }

  /* ===== Details panel ===== */
  openDetails(row: Leave) {
    this.activeLeave.set(row);
    this.detailsOpen.set(true);
  }

  /* ===== Approve / Reject ===== */
  approve(row: Leave) {
    if (row.status !== 'PENDING') return;
    this.confirm.confirm({
      header: 'Approve Leave',
      message: 'Approve this leave request?',
      acceptLabel: 'Approve',
      rejectLabel: 'Cancel',
      accept: () => {
        this.api.approveLeave(row._id).subscribe({
          next: () => {
            this.toast.add({
              severity: 'success',
              summary: 'Approved',
              detail: 'Leave approved.',
            });
            this.detailsOpen.set(false);
            this.fetch();
          },
          error: (e) => {
            this.toast.add({
              severity: 'error',
              summary: 'Approval failed',
              detail: e?.error?.message || 'Try again.',
            });
          },
        });
      },
    });
  }

  openReject(row: Leave) {
    this.activeLeave.set(row);
    this.rejectRemark.setValue('');

    this.rejectOpen.set(true);
  }
  onDateRangeSelect(range: Date[] | null) {
    if (range && range.length === 2) {
      this.dateRange.setValue([range[0], range[1]]);
    } else {
      this.dateRange.setValue([null, null]);
    }
  }

  submitReject() {
    const row = this.activeLeave();
    if (!row) return;
    const remark = this.rejectRemark.value.trim();
    if (!remark) {
      this.toast.add({
        severity: 'warn',
        summary: 'Remark required',
        detail: 'Please add a reason.',
      });
      return;
    }
    this.api.rejectLeave(row._id, remark).subscribe({
      next: () => {
        this.toast.add({
          severity: 'success',
          summary: 'Rejected',
          detail: 'Leave rejected.',
        });
        this.rejectOpen.set(false);
        this.detailsOpen.set(false);
        this.fetch();
      },
      error: (e) => {
        this.toast.add({
          severity: 'error',
          summary: 'Rejection failed',
          detail: e?.error?.message || 'Try again.',
        });
      },
    });
  }

  /* ===== Helpers ===== */
  statusSeverity(s: LeaveStatus) {
    return s === 'PENDING'
      ? 'warning'
      : s === 'APPROVED'
      ? 'success'
      : s === 'REJECTED'
      ? 'danger'
      : 'info';
  }

  teacherName(l: Leave) {
    const t: any = l.teacherId;
    return typeof t === 'object' && t?.fname ? t.fname : String(t);
  }

  teacherDept(val: unknown): string {
    if (!val) return '';
    if (typeof val === 'object' && 'dept' in (val as any)) {
      return (val as any).dept || '';
    }
    return '';
  }

  selectedLeave: Leave | null = null;

  openLeavePopover(row: Leave, popover: any) {
    this.selectedLeave = row;
    popover.show(event); // call this from your button click
  }

  // put this inside the ManageLeaves class
  displayName(val: unknown): string {
    if (val == null) return '—';
    if (typeof val === 'string') return val || '—';
    const v = val as any;
    // prefer 'name', then 'code', then '_id'
    return (v?.name ?? v?.code ?? v?._id ?? '—').toString();
  }

  // signals-friendly table selection handlers
  onSelectionChange(list: Leave[]) {
    this.selected.set(list);
  }

  trackById = (_: number, row: Leave) => row._id;
  trackByPeriod = (_: number, p: LeavePeriod) =>
    `${p.date}-${p.periodKey}-${(p.classroomId as any)?._id || p.classroomId}`;
}

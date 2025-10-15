import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ChartData, ChartOptions } from 'chart.js';
import { ImportsModule } from '../../../imports/imports';
import { BackendServices, ClasswiseRow } from '../../../api/backend';
import { Popover } from 'primeng/popover';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ClassWiseSummaryChart } from '../../../components/class-wise-summary-chart/class-wise-summary-chart';

@Component({
  selector: 'app-class-daily-summary',
  standalone: true,
  imports: [
    ImportsModule,
    Popover,
    ClassWiseSummaryChart,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './class-wise-summary.html',
  styleUrls: ['./class-wise-summary.css'],
  providers: [MessageService],
})
export class ClassWiseSummary implements OnInit {
  data: ChartData<'doughnut'> = {
    labels: ['Present', 'Late', 'Absent', 'Unmarked'],
    datasets: [{ data: [0, 0, 0, 0], backgroundColor: [] }],
  };

  options: ChartOptions<'doughnut'> = {
    cutout: '60%',
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  // Called on row hover
  showPopover(event: Event, row: ClasswiseRow, popover: any) {
    this.data = {
      labels: ['Present', 'Late', 'Absent', 'Unmarked'],
      datasets: [
        {
          data: [row.present, row.late, row.absent, row.unmarked],
          backgroundColor: ['#22c55e', '#eab308', '#ef4444', '#9ca3af'],
        },
      ],
    };
    popover.show(event);
  }

  hidePopover(popover: any) {
    popover.hide();
  }
  loading = signal(false);
  rows = signal<ClasswiseRow[]>([]);

  // filters (simple fields = safe with [(ngModel)])
  date = new Date();
  classroomId: string | null = null; // optional
  minPct: number | null = null;
  onlyUnmarked = false;

  // dropdown options (optional)
  classroomOptions: Array<{ label: string; value: string }> = [];

  constructor(private api: BackendServices, private toast: MessageService) {}

  ngOnInit(): void {
    // optional: populate class dropdown
    this.api.getClassrooms().subscribe({
      next: (res: any) => {
        this.classroomOptions = res.map((cls: any) => ({
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
    this.fetch();
  }

  get chartMinWidthPx(): number {
    // ~140px per class label; minimum width for nice layout
    const n = this.rows()?.length || 0;
    return Math.max(900, n * 140);
  }
  getStatusLabel(percentage: number, unmarked: number): string {
    if (unmarked > 0) return 'Unmarked';
    if (percentage >= 95) return 'Great';
    if (percentage >= 85) return 'Good';
    if (percentage >= 75) return 'Ok';
    return 'Low';
  }

  getStatusSeverity(percentage: number, unmarked: number): string {
    if (unmarked > 0) return 'warning';
    if (percentage >= 95) return 'success';
    if (percentage >= 85) return 'info';
    if (percentage >= 75) return 'warning';
    return 'danger';
  }

  // Simple KPI aggregation
  get kpi() {
    const items = this.rows() || [];
    const sums = items.reduce(
      (acc, r) => {
        acc.total += r.total || 0;
        acc.present += r.present || 0;
        acc.late += r.late || 0;
        acc.absent += r.absent || 0;
        acc.unmarked += r.unmarked || 0;
        acc.pctSum += r.percentage || 0;
        acc.count += 1;
        return acc;
      },
      {
        total: 0,
        present: 0,
        late: 0,
        absent: 0,
        unmarked: 0,
        pctSum: 0,
        count: 0,
      }
    );

    const best = [...items]
      .filter((r) => typeof r.percentage === 'number')
      .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))[0];
    const worst = [...items]
      .filter((r) => typeof r.percentage === 'number')
      .sort((a, b) => (a.percentage || 0) - (b.percentage || 0))[0];

    return {
      total: sums.total,
      present: sums.present,
      late: sums.late,
      absent: sums.absent,
      unmarked: sums.unmarked,
      avgPct: sums.count ? sums.pctSum / sums.count : 0,
      best: best
        ? {
            label: `${best.classroom.name}${
              best.classroom.section ? ' - ' + best.classroom.section : ''
            }`,
            pct: best.percentage || 0,
          }
        : null,
      worst: worst
        ? {
            label: `${worst.classroom.name}${
              worst.classroom.section ? ' - ' + worst.classroom.section : ''
            }`,
            pct: worst.percentage || 0,
          }
        : null,
    };
  }

  fetch() {
    this.loading.set(true);
    const params = {
      date: this.date?.toISOString(),
      classroomId: this.classroomId || undefined,
      minPct: this.minPct ?? undefined,
      onlyUnmarked: this.onlyUnmarked || undefined,
    };

    this.api.getClasswiseSummary(params).subscribe({
      next: (res) => {
        this.rows.set(res.items || []);
        this.loading.set(false);
      },
      error: (e) => {
        this.loading.set(false);
        this.toast.add({
          severity: 'error',
          summary: 'Failed',
          detail: e?.error?.message || 'Could not load summary.',
        });
      },
    });
  }

  rowSeverity(pct: number, unmarked: number) {
    if (unmarked > 0) return 'warning';
    if (pct >= 95) return 'success';
    if (pct >= 85) return 'info';
    return 'danger';
  }

  exportCSV() {
    const head = [
      'Class',
      'Total',
      'Present',
      'Late',
      'Absent',
      'Unmarked',
      'Percentage',
    ];
    const lines = this.rows().map((r) => {
      const cls = `${r.classroom.name}${
        r.classroom.section ? ' - ' + r.classroom.section : ''
      }`;
      return [
        cls,
        r.total,
        r.present,
        r.late,
        r.absent,
        r.unmarked,
        r.percentage + '%',
      ].join(',');
    });
    const blob = new Blob([head.join(',') + '\n' + lines.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `classwise-summary-${this.date
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  trackByClass = (_: number, r: ClasswiseRow) => r.classroom._id;
}

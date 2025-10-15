import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ImportsModule } from '../../imports/imports';
import { ChartData, ChartOptions } from 'chart.js';
import { ClasswiseRow } from '../../api/backend';
import 'chart.js/auto';

@Component({
  selector: 'app-class-wise-summary-chart',
  standalone: true,
  imports: [ImportsModule],
  template: `
    <div class="w-full h-full" [style.height]="height">
      <p-chart
        type="bar"
        [data]="stackedData"
        [options]="stackedOptions"
        class="w-full h-full"
      ></p-chart>
    </div>
  `,
})
export class ClassWiseSummaryChart implements OnChanges {
  @Input() items: ClasswiseRow[] = [];
  @Input() height: string = '28rem';

  stackedData: ChartData<'bar'> = { labels: [], datasets: [] };
  stackedOptions: ChartOptions<'bar'> = {
    maintainAspectRatio: false,
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'bottom' } },
    scales: {
      x: { stacked: true, border: { display: false } },
      y: { stacked: true, border: { display: false } },
    },
  };

  ngOnChanges(_: SimpleChanges) {
    const labels = (this.items || []).map(
      (r) =>
        `${r.classroom.name}${
          r.classroom.section ? ' - ' + r.classroom.section : ''
        }`
    );

    // Try to read theme vars for nicer colors; fallback to hex if not available
    const cs =
      typeof window !== 'undefined'
        ? getComputedStyle(document.documentElement)
        : ({} as any);

    const green = cs.getPropertyValue('--p-green-500')?.trim() || '#22c55e';
    const amber = cs.getPropertyValue('--p-amber-500')?.trim() || '#eab308';
    const red = cs.getPropertyValue('--p-red-500')?.trim() || '#ef4444';
    const gray = cs.getPropertyValue('--p-gray-500')?.trim() || '#9ca3af';

    this.stackedData = {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Present',
          backgroundColor: green,
          data: this.items.map((r) => r.present || 0),
        },
        {
          type: 'bar',
          label: 'Late',
          backgroundColor: amber,
          data: this.items.map((r) => r.late || 0),
        },
        {
          type: 'bar',
          label: 'Absent',
          backgroundColor: red,
          data: this.items.map((r) => r.absent || 0),
        },
        {
          type: 'bar',
          label: 'Unmarked',
          backgroundColor: gray,
          data: this.items.map((r) => r.unmarked || 0),
        },
      ],
    };

    const maxTotal = Math.max(...this.items.map((r) => r.total || 0), 0);

    this.stackedOptions = {
      ...this.stackedOptions,
      scales: {
        x: { stacked: true, border: { display: false } },
        y: {
          stacked: true,
          border: { display: false },
          suggestedMax: maxTotal, // ✅ auto-scale to class size
          ticks: {
            stepSize: 1, // good for attendance counts
          },
        },
      },
    };
  }
}

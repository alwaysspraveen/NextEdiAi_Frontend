import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-event-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">Event Calendar</h2>
      <full-calendar [options]="calendarOptions"></full-calendar>
    </div>
  `,
  styles: [`
    ::ng-deep .fc {
      width: 100%;
    }
  `]
})
export class EventCalendarComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [
      { title: 'Orientation', date: '2025-08-30' },
      { title: 'Holiday', date: '2025-09-01' },
      { title: 'Exam', date: '2025-09-10' }
    ]
  };
}

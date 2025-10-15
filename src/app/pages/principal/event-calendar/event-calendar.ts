import { Component, effect, signal, ViewChild } from '@angular/core';
import { CalendarService } from '../../../core/services/calendar';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventInput,
} from '@fullcalendar/core/index.js';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, {
  DateClickArg,
  EventResizeDoneArg,
} from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { Card } from 'primeng/card';
import { ImportsModule } from '../../../imports/imports';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-event-calendar',
  imports: [FullCalendarModule, ImportsModule],
  templateUrl: './event-calendar.html',
  styleUrl: './event-calendar.css',
  providers: [MessageService],
})
export class EventCalendar {
  // signal to hold events from service (realtime updates push here)
  eventsSig = signal<EventInput[]>([]);
  isEditing: any;

  constructor(
    private cal: CalendarService,
    private messageService: MessageService
  ) {
    // keep signal in sync with service
    effect(() => {
      this.eventsSig.set(this.cal.events());
    });
  }
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  // dialog state
  showDialog = false;
  form: any = {
    title: '',
    description: '',
    location: '',
    start: null,
    end: null,
    allDay: false,
  };

  options: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    selectable: true,
    selectMirror: true,
    nowIndicator: true,
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
      startTime: '09:00',
      endTime: '18:00',
    },
    timeZone: 'local',

    events: (info, success, failure) => {
      this.cal
        .fetchRange(info.startStr, info.endStr)
        .then(success)
        .catch(failure);
    },

    // ✅ Use your form handler instead of prompt
    select: (info: DateSelectArg) => this.onSelect(info),

    // ✅ Hook event click to open dialog
    eventClick: (arg: EventClickArg) => this.onEventClick(arg),

    eventDrop: async (arg: EventDropArg) => {
      await this.cal.move(arg.event.id, arg.event.start!, arg.event.end!);
    },

    eventResize: async (arg: EventResizeDoneArg) => {
      await this.cal.move(arg.event.id, arg.event.start!, arg.event.end!);
    },

    eventContent: (info) => {
      const title = info.event.title;
      const join = info.event.extendedProps['joinUrl'];
      const el = document.createElement('div');
      el.className = 'px-2 py-1 rounded-md border-l-4';
      el.style.borderLeftColor = info.event.backgroundColor || '#3b82f6';
      el.innerHTML = `
      <div class="text-sm font-semibold truncate">${title}</div>
      ${join ? `<div class="text-xs underline">Join</div>` : ''}
    `;
      return { domNodes: [el] };
    },
  };
  private defaultEnd(start: Date, end: Date | null, allDay: boolean) {
    if (end && end > start) return end;
    const d = new Date(start);
    d.setMinutes(d.getMinutes() + (allDay ? 24 * 60 : 60)); // +1 day for allDay, +1h otherwise
    return d;
  }

  onSelect(info: DateSelectArg) {
    // clear the blue selection highlight
    info.view.calendar.unselect();

    this.isEditing = false;
    this.form = {
      id: null,
      title: '',
      description: '',
      location: '',
      start: info.start, // 👈 prefilled
      end: this.defaultEnd(info.start, info.end, info.allDay), // 👈 prefilled
      allDay: info.allDay,
    };

    this.showDialog = true; // 👈 open the form
  }

  onEventClick(arg: EventClickArg) {
    // optional: open same form for editing
    const e = arg.event;
    this.isEditing = true;
    this.form = {
      id: e.id,
      title: e.title || '',
      description: (e.extendedProps as any)?.description || '',
      location: (e.extendedProps as any)?.location || '',
      start: e.start ? new Date(e.start) : null,
      end: e.end ? new Date(e.end) : null,
      allDay: e.allDay ?? false,
    };
    this.showDialog = true;
  }
  async saveEvent() {
    // guard
    if (!this.form.start || !this.form.end || !this.form.title) return;

    // normalize times
    let start = new Date(this.form.start);
    let end = new Date(this.form.end);

    // If all-day, make it [00:00, next day 00:00) in local time, then to UTC
    if (this.form.allDay) {
      const s = new Date(start);
      s.setHours(0, 0, 0, 0);
      const e = new Date(end);
      e.setHours(0, 0, 0, 0);
      e.setDate(e.getDate() + 1);
      start = s;
      end = e; // end exclusive
    }

    if (end <= start) {
      // show your toast/snackbar here instead of alert
      alert('End must be after start');
      return;
    }

    const payload = {
      title: this.form.title,
      description: this.form.description,
      location: this.form.location,
      allDay: this.form.allDay,
      start: start.toISOString(), // ✅ UTC ISO
      end: end.toISOString(), // ✅ UTC ISO
      // joinUrl: `/meet/${crypto.randomUUID()}` // optional
    };

    try {
      if (this.form.id) {
        await this.cal.update(this.form.id, payload); // PATCH any changed fields
        this.showSuccess('Event updated successfully');
      } else {
        await this.cal.create(payload);
        this.showSuccess('Event created successfully');
      }
    } catch (err) {
      console.error('[Calendar] save error:', err);
      this.showError('Failed to save event. Please try again.');
    } finally {
      this.showDialog = false;
    }
    this.showDialog = false;
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

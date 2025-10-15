// src/app/calendar/calendar.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import type { EventInput } from '@fullcalendar/core';
import { eventsApiUrl } from '../../config/config';

const API = eventsApiUrl; // e.g., 'http://localhost:5000/api/events'

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private socket: Socket;
  private _events = signal<EventInput[]>([]);

  constructor(private http: HttpClient) {
    // Connect to WebSocket
    this.socket = io('/', { path: '/socket.io' });

    // WebSocket event listeners
    this.socket.on('event:created', (e: EventInput) => this.merge([e]));
    this.socket.on('event:updated', (e: EventInput) => this.upsert(e));
    this.socket.on('event:deleted', (id: string) => this.remove(id));
  }

  // Getter for events
  events = () => this._events();

  // Fetch events in a date range
  async fetchRange(startISO: string, endISO: string): Promise<EventInput[]> {
    try {
      const fromUTC = new Date(startISO).toISOString();
      const toUTC = new Date(endISO).toISOString();

      const data = await this.http
        .get<EventInput[]>(`${API}?from=${fromUTC}&to=${toUTC}`)
        .toPromise();

      this._events.set(data || []);
      return this._events();
    } catch (err) {
      console.error('[CalendarService] fetchRange error:', err);
      return [];
    }
  }

  // Create new event
  async create(payload: EventInput) {
    try {
      const created = await this.http
        .post<EventInput>(API, payload)
        .toPromise();
      this.merge([created!]);
    } catch (err) {
      console.error('[CalendarService] create error:', err);
    }
  }

  // Update event (e.g. drag to new time)
  async move(id: string, start: Date, end: Date) {
    try {
      const updated = await this.http
        .patch<EventInput>(`${API}/${id}`, { start, end })
        .toPromise();
      this.upsert(updated!);
    } catch (err) {
      console.error('[CalendarService] move error:', err);
    }
  }

  // Merge new events with existing state
  private merge(list: EventInput[]) {
    const map = new Map((this._events() || []).map((e) => [String(e.id), e]));
    for (const e of list) map.set(String(e.id), e);
    this._events.set([...map.values()]);
  }

  private upsert(e: EventInput) {
    this.merge([e]);
  }

  private remove(id: string) {
    this._events.set(this._events().filter((e) => String(e.id) !== id));
  }

  async update(id: string, changes: Partial<EventInput>) {
    try {
      const updated = await this.http
        .patch<EventInput>(`${API}/${id}`, changes)
        .toPromise();

      this.upsert(updated!); // replace in local signal/store
    } catch (err) {
      console.error('[CalendarService] update error:', err);
    }
  }
}

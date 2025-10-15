import { UploadMaterials } from './../pages/teacher/upload-materials/upload-materials';
import { AddSubject } from './../components/add-subject/add-subject';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { config, Observable } from 'rxjs';
import {
  authApiUrl,
  classroomApiUrl,
  subjectApiUrl,
  userApiUrl,
  timetableApiUrl,
  attendanceApiUrl,
  materialsApiUrl,
  leaveApiUrl,
} from '../config/config';
import { User } from '../core/interface/user.interface';
import { Classroom } from '../core/interface/class.interface';
import { Subject } from '../core/interface/subject.interface';
// src/app/core/interface/timetable.interface.ts
export interface TTEntry {
  day: string;
  periodKey: string;
  subjectId?: string | null;
  teacherId?: string | null;
  roomId?: string | null;
}
export interface ClasswiseRow {
  classroom: { _id: string; name: string; section?: string };
  teacher?: { _id: string; name: string } | null;
  total: number;
  present: number;
  late: number;
  absent: number;
  unmarked: number;
  percentage: number;
  lastMarkedAt?: string;
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

export interface PublishTimetableDto {
  classroomId: string;
  weekStart: string; // ISO string
  entries: TTEntry[];
}

@Injectable({
  providedIn: 'root',
})
export class BackendServices {
  private authApiUrl = authApiUrl;
  private userApiUrl = userApiUrl;
  private classroomApiUrl = classroomApiUrl;
  private subjectApiUrl = subjectApiUrl;

  constructor(private http: HttpClient) {}

  // register(user: User): Observable<User> {
  //   return this.http.post<User>(`${this.userApiUrl}`, user);
  // }

  // changepassword(
  //   user: ChangePasswordPayload
  // ): Observable<ChangePasswordPayload> {
  //   return this.http.post<ChangePasswordPayload>(
  //     `${this.authApiUrl}/change-password`,
  //     user
  //   );
  // }

  getUsers(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.userApiUrl}?role=${role}`);
  }
  addUser(data: FormData | User): Observable<any> {
    return this.http.post(`${this.userApiUrl}`, data);
  }
  // backend.service.ts
  getSubstitutions(classroomId: string, fromISO: string, toISO: string) {
    return this.http.get<Substitution[]>('/api/substitutions', {
      params: { classroomId, from: fromISO, to: toISO },
    });
  }
  getLeaves(params: any) {
    return this.http.get(`${leaveApiUrl}/all`, { params });
  }
  approveLeave(leaveId: string) {
    return this.http.post<{ ok: boolean; substitutions: any[] }>(
      `${leaveApiUrl}/${leaveId}/approve`,
      {}
    );
  }

  rejectLeave(id: string, remark: string) {
    return this.http.post(`${leaveApiUrl}/${id}/reject`, { remark });
  }

  // Optional: If you add cancel endpoint
  cancelLeave(id: string) {
    return this.http.post(`${leaveApiUrl}/${id}/cancel`, {});
  }

  addStudent(data: FormData | User): Observable<any> {
    return this.http.post(`${this.userApiUrl}`, data);
  }

  getStudentsByClass(classId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.userApiUrl}/${classId}`);
  }
  updateStudent(id: string, data: Partial<User> | FormData): Observable<User> {
    return this.http.put<User>(`${this.userApiUrl}/${id}`, data);
  }
  deleteStudent(id: string): Observable<User> {
    return this.http.delete<any>(`${this.userApiUrl}/${id}`);
  }

  getParentsByClassSection(classId?: string, section?: string) {
    let params: any = {};
    if (classId) params.classId = classId;
    if (section) params.section = section;

    return this.http.get(`${this.userApiUrl}/parents`, { params });
  }

  getClassrooms(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${this.classroomApiUrl}`);
  }

  getClassroomsById(id: string): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(
      `${this.classroomApiUrl}/by-classname/${id}`
    );
  }
  addClassroom(data: FormData): Observable<any> {
    return this.http.post(`${this.classroomApiUrl}`, data);
  }

  deleteClassroom(id: string): Observable<Classroom> {
    return this.http.delete<Classroom>(
      `${this.classroomApiUrl}/delete-class/${id}`
    );
  }

  addSubject(data: FormData | Subject): Observable<Subject> {
    return this.http.post<Subject>(`${this.subjectApiUrl}`, data);
  }

  getSubjectsByClass(id: string): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.subjectApiUrl}/by-class/${id}`);
  }
  deleteSubject(id: string): Observable<Subject> {
    return this.http.delete<Subject>(`${this.subjectApiUrl}/${id}`);
  }

  updateSubject(id: string, data: Partial<Subject>): Observable<Subject> {
    return this.http.put<Subject>(`${this.subjectApiUrl}/${id}`, data);
  }

  getSubjectsByClassandTeacher(
    classId: string,
    teacherId: string
  ): Observable<Subject[]> {
    return this.http.get<Subject[]>(
      `${this.subjectApiUrl}/by-class/${classId}/teacher/${teacherId}`
    );
  }
  getSubjectsByTeacher(teacherId: string): Observable<Subject[]> {
    return this.http.get<Subject[]>(
      `${this.subjectApiUrl}/teacher/${teacherId}`
    );
  }

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.subjectApiUrl}`);
  }

  updateUser(id: string, data: Partial<User> | FormData): Observable<User> {
    return this.http.put<User>(`${this.userApiUrl}/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.userApiUrl}/${id}`);
  }

  //Country State City
  getCountries(): Observable<any> {
    return this.http.get<any>(
      `https://countriesnow.space/api/v0.1/countries/currency`
    );
  }

  getClassByTeacher(teacherId: string): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(
      `${this.classroomApiUrl}/by-teacher/${teacherId}`
    );
  }

  UploadMaterials(
    classId: string,
    subjectId: string,
    materialId: string
  ): Observable<any> {
    return this.http.post(`${materialsApiUrl}`, {
      classId: classId,
      subjectId: subjectId,
      materialId: materialId,
    });
  }
  getMaterialId(classId: string, subjectId: string): Observable<any> {
    return this.http.get<any>(`${materialsApiUrl}/${classId}/${subjectId}`);
  }

  updateClass(id: string, data: Partial<Classroom>): Observable<Classroom> {
    return this.http.put<Classroom>(`${classroomApiUrl}/${id}`, data);
  }
  getStates(payload: { country: string }) {
    return this.http.post(
      'https://countriesnow.space/api/v0.1/countries/states',
      payload
    );
  }

  getCities(country: string, state: string): Observable<any> {
    return this.http.post<any>(
      `https://countriesnow.space/api/v0.1/countries/state/cities`,
      { country, state }
    );
  }

  getTimetable(classroomId: string, weekStartISO: string) {
    return this.http.get<any[]>(`${timetableApiUrl}`, {
      params: { classroomId, weekStart: weekStartISO },
    });
  }

  generateTimetable(body: { classroomId: string; weekStart: string }) {
    return this.http.post<any[]>(`${timetableApiUrl}/generate`, body);
  }

  validateTimetable(entries: any[]) {
    return this.http.post<{ conflicts: string[] }>(
      `${timetableApiUrl}/validate`,
      {
        entries,
      }
    );
  }
  publishTimetable(body: PublishTimetableDto) {
    // IMPORTANT: do not spread body, just pass the object
    return this.http.post(`${timetableApiUrl}/publish`, body);
  }

  // GET /api/attendance/:classId/:date   (date = YYYY-MM-DD)
  getAttendanceByClassAndDate(classId: string, date: string): Observable<any> {
    return this.http.get(`${attendanceApiUrl}/${classId}/${date}`);
  }

  saveAttendance(data: any): Observable<any> {
    return this.http.post(`${attendanceApiUrl}`, data);
  }

  getClasswiseSummary(params: {
    date?: string; // ISO (yyyy-mm-dd or full ISO)
    classroomId?: string; // optional
    minPct?: number; // optional (e.g. 85)
    onlyUnmarked?: boolean; // optional
  }): Observable<{ date: string; items: ClasswiseRow[] }> {
    let hp = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') hp = hp.set(k, String(v));
    });
    return this.http.get<{ date: string; items: ClasswiseRow[] }>(
      `${attendanceApiUrl}/classwise-summary`,
      { params: hp }
    );
  }
}

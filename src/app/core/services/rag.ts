// src/app/rag-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  UploadResponse,
  ChatMessage,
  ChatResponse,
} from '../../shared/models/Agent';

@Injectable({ providedIn: 'root' })
export class RagApiService {
  private base = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  uploadMaterial(form: FormData): Observable<UploadResponse> {
    return this.http.post<UploadResponse>(
      `${this.base}/api/materials/upload`,
      form
    );
  }

  chat(
    materialId: string,
    input: string,
    chatHistory: ChatMessage[]
  ): Observable<ChatResponse> {
    const body = {
      materialId,
      input,
      chat_history: chatHistory.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ChatResponse>(`${this.base}/api/rag/chat`, body, {
      headers,
    });
  }
  // createExam accepts FormData (with file) or plain JSON
  createExam(body: FormData | object) {
    if (body instanceof FormData) {
      return this.http.post(`${this.base}/exams`, body); // multipart
    }
    return this.http.post(`${this.base}/exams`, body); // application/json
  }
}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import DOMPurify from 'dompurify';
import { Message } from 'primeng/message';
// add FileUpload to your imports
import {
  FileUploadModule,
  FileUploadHandlerEvent,
  FileUpload,
} from 'primeng/fileupload';

import { RagApiService } from '../../../core/services/rag';
import {
  UploadResponse,
  ChatResponse,
  ChatMessage,
} from '../../../shared/models/Agent';
import { ImportsModule } from '../../../imports/imports';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { BackendServices } from '../../../api/backend';
import { AuthService } from '../../../auth/auth';

@Component({
  selector: 'app-upload-materials',
  imports: [ImportsModule],
  templateUrl: './upload-materials.html',
  styleUrl: './upload-materials.css',
  providers: [MessageService],
})
export class UploadMaterials {
  // Upload form state
  materialId = '';
  title = '';
  subjectId = 'GENERAL';

  // Upload result/state
  uploading = false;
  uploadInfo: UploadResponse | null = null;

  // Chat state
  messages: ChatMessage[] = [];
  input = '';
  sending = false;

  @ViewChild('messagesViewport') messagesViewport?: ElementRef<HTMLDivElement>;
  @ViewChild('uploader') uploader?: FileUpload;
  classId: any;
  cities: any[] | undefined;
  classes: any[] = [];

  constructor(
    private api: RagApiService,
    private toast: MessageService,
    private sanitizer: DomSanitizer,
    private backendService: BackendServices,
    private auth: AuthService
  ) {
    // Nice defaults so line breaks work like ChatGPT
    marked.setOptions({ breaks: true, gfm: true });
  }

  ngOnInit() {
    const teacherId = this.auth.getUserId();
    console.log(teacherId);

    this.loadSubjectBasedClassByTeacher(teacherId);
  }

  onClassChange(classId: string) {
    this.subjectId = ''; // Clear previously selected subject

    const teacherId = this.auth.getUserId();
    if (!teacherId) {
      this.toast.add({ severity: 'warn', summary: 'No teacher ID found' });
      return;
    }

    this.backendService
      .getSubjectsByClassandTeacher(classId, teacherId)
      .subscribe({
        next: (res: any) => {
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
  onSubjectChange() {
    this.backendService.getMaterialId(this.classId, this.subjectId).subscribe({
      next: (res: any) => {
        this.materialNames = res.map((s: any) => ({
          label: s.materialId,
          value: s.materialId,
        }));
      },
      error: () =>
        this.toast.add({
          severity: 'error',
          summary: 'Failed to load subjects',
        }),
    });
  }

  get materialIdBadge(): string {
    return this.materialId || this.uploadInfo?.materialId || 'no material yet';
  }

  // ---------- CLEAN + RENDER ----------
  private cleanLLMText(raw: string): string {
    if (!raw) return '';

    let t = raw;

    // Normalize newlines/spacing
    t = t
      .replace(/\r/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n');

    // Convert funky bullet chars to markdown bullets
    t = t.replace(/^[•·▪►]\s*/gm, '- ');

    // Remove inline footnote styles like [1], [12], 〔1〕, and RAG styles like
    t = t
      .replace(/ ?\[\d+\]/g, '')
      .replace(/ ?〔\d+〕/g, '')
      .replace(/ ?【\d+[^】]*】/g, '');

    // Collapse leftover multiple spaces
    t = t.replace(/[^\S\r\n]{2,}/g, ' ');

    // Unwrap accidental quotes/backticks on whole message
    t = t.trim();
    if (
      (t.startsWith('"') && t.endsWith('"')) ||
      (t.startsWith('“') && t.endsWith('”'))
    ) {
      t = t.slice(1, -1).trim();
    }

    return t.trim();
  }

  render(md: string): SafeHtml {
    const cleaned = this.cleanLLMText(md);
    const html: string = marked.parse(cleaned) as string;

    // Sanitize to prevent XSS, then tell Angular it's safe
    const safe = DOMPurify.sanitize(html);
    return this.sanitizer.bypassSecurityTrustHtml(safe);
  }
  // ------------------------------------

  onCustomUpload(ev: FileUploadHandlerEvent) {
    const file = ev.files?.[0];
    if (!file) return;
    // 🔐 Ensure all required fields are filled
    if (!this.classId || !this.subjectId) {
      this.toast.add({
        severity: 'warn',
        summary: 'Missing Data',
        detail:
          'Please select class, subject and enter a title before uploading.',
      });
      return;
    }
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
      this.toast.add({
        severity: 'warn',
        summary: 'Invalid file',
        detail: 'Only PDF/DOCX are supported.',
      });
      this.uploader?.clear();
      return;
    }

    const mid = this.materialId || randId();

    const form = new FormData();
    form.append('classId', this.classId);
    form.append('subjectId', this.subjectId || 'GENERAL');
    form.append('teacherId', this.auth.getUserId());
    form.append('type', ext);
    form.append('materialId', mid);
    form.append('file', file);

    this.uploading = true;
    this.api.uploadMaterial(form).subscribe({
      next: (json) => {
        this.uploadInfo = json;
        if (!json.ok) {
          this.toast.add({
            severity: 'error',
            summary: 'Upload failed',
            detail: json.error || 'Unexpected error',
          });
        } else {
          this.materialId = json.materialId ?? mid;
          this.toast.add({
            severity: 'success',
            summary: 'Uploaded',
            detail: `Chunks: ${json.chunks}`,
          });
          if (this.classId && this.subjectId && this.materialId) {
            console.log('data updated');

            this.backendService
              .UploadMaterials(this.classId, this.subjectId, this.materialId)
              .subscribe();
          }
        }
        this.uploading = false;
        this.uploader?.clear();
      },
      error: (err) => {
        this.toast.add({
          severity: 'error',
          summary: 'Upload error',
          detail: err?.message || String(err),
        });
        this.uploading = false;
        this.uploader?.clear();
      },
    });
  }
  subjectNames: { label: string; value: string }[] = [];
  classNames: { label: string; value: string }[] = [];
  materialNames: { label: string; value: string }[] = [];

  loadSubjectBasedClassByTeacher(id: string) {
    this.backendService.getSubjectsByTeacher(id).subscribe({
      next: (res: any) => {
        this.classNames = res.map((cls: any) => ({
          label: cls.classroom.name,
          value: cls.classroom._id,
        }));
      },
      error: () =>
        this.toast.add({
          severity: 'error',
          summary: 'Failed to load classes',
        }),
    });
  }

  onComposerKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!this.sending) this.send();
    }
  }

  clearChat() {
    this.messages = [];
  }

  private scrollSoon() {
    queueMicrotask(() => {
      const el = this.messagesViewport?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  send() {
    const text = this.input.trim();
    if (!text) return;

    const mid = this.materialId || this.uploadInfo?.materialId || '';
    if (!mid) {
      this.toast.add({
        severity: 'warn',
        summary: 'No material',
        detail: 'Upload or select a material first.',
      });
      return;
    }

    const userMsg: ChatMessage = { role: 'user', content: text };
    this.messages = [...this.messages, userMsg];
    this.input = '';
    this.sending = true;
    this.scrollSoon();

    this.api.chat(mid, userMsg.content, this.messages).subscribe({
      next: (res: ChatResponse) => {
        const raw = res.ok
          ? res.output || ''
          : '⚠️ ' + (res.error || 'Chat error.');
        const assistantMsg: ChatMessage = { role: 'assistant', content: raw };
        this.messages = [...this.messages, assistantMsg];
        this.sending = false;
        this.scrollSoon();
      },
      error: (err) => {
        this.messages = [
          ...this.messages,
          {
            role: 'assistant',
            content: '⚠️ ' + (err?.message || String(err)),
          } as ChatMessage,
        ];
        this.sending = false;
        this.scrollSoon();
      },
    });
  }
}

function randId(): string {
  return Math.random().toString(36).substring(2, 10);
}

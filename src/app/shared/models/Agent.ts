// src/app/models.ts
export type Role = 'user' | 'assistant';

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface UploadStats {
  totalPages: number;
  pagesWithText: number;
  emptyPages: number[];
}

export interface UploadResponse {
  ok: boolean;
  materialId?: string;
  chunks?: number;
  stats?: UploadStats;
  error?: string;
}

export interface ChatResponse {
  ok: boolean;
  output?: string;
  error?: string;
}

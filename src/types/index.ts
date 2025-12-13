// Minimal shared types for the OCR frontend

export type OCRPage = {
  page_number: number;
  width?: number;
  height?: number;
  text: string;
};

export type ExtractResult = {
  filename: string;
  content_type: string;
  duration_ms: number;
  num_pages: number;
  pages: OCRPage[];
  warnings?: string[];
};

export type FileRecord = ExtractResult & {
  id: string; // local UUID
  createdAt: string; // ISO date
  size?: number;
};

export type UserProfile = {
  id: string;
  name?: string;
  email?: string;
};

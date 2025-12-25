/* _.. ___ .._ _ ... ._...___ .__.__ */

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

export type Template = {
    id: string; // UUID
    name: string;
    description?: string;
    imageUrl: string; // Matches backend field
    fields: TemplateField[];
    createdAt: string;
    updatedAt: string;
};

export type TemplateField = {
    id: string;
    name: string;
    type: "TEXT" | "NUMBER" | "DATE" | "EMAIL";
    x: number;
    y: number;
    width: number;
    height: number;
};

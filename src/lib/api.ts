/* _.. ___ .._ _ ... ._...___ .__.__ */

import axios from "axios";
import {ExtractResult, FileRecord, Template, UserProfile} from "@/types";

const DEFAULT_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

function getBaseUrl() {
    return DEFAULT_BASE.replace(/\/$/, "");
}

async function uploadFile(file: File, languages = "por"): Promise<FileRecord> {
    const url = `${getBaseUrl()}/extract`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("langs", languages);

    const {data} = await axios.post(url, fd);

    return {
        ...data,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: new Date().toISOString(),
        size: file.size,
    };
}

async function uploadFiles(files: File[], languages = "por") {
    const results: FileRecord[] = [];
    for (const f of files) {
        const r = await uploadFile(f, languages);
        results.push(r);
    }
    return results;
}

async function getHistory(): Promise<FileRecord[]> {
    // The backend doesn't provide persistence yet. We'll use localStorage-backed history in the frontend.
    const raw = typeof window !== "undefined" ? localStorage.getItem("ocr_history") : null;
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw) as FileRecord[];
        // sort desc
        parsed.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        return parsed;
    } catch (e) {
        console.error("Failed to parse history", e);
        return [];
    }
}

async function saveToHistory(records: FileRecord[]) {
    const prev = (await getHistory()) || [];
    const merged = [...records, ...prev];
    try {
        localStorage.setItem("ocr_history", JSON.stringify(merged));
    } catch (e) {
        console.error("Failed to save history", e);
    }
}

async function getProfile(): Promise<UserProfile> {
    // No backend stub; return placeholder profile
    return {id: "local-1", name: "Acme Corp", email: "hello@acme.test"};
}

async function extractTextFromInvoice(file: File, language: string = "por"): Promise<ExtractResult> {
    const url = `${getBaseUrl()}/extract`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("langs", language);

    const { data } = await axios.post(url, formData);
    return data;
}

async function createTemplate(template: Template): Promise<Template> {
    const {data} = await axios.post(`${getBaseUrl()}/templates`, template);
    return data;
}

async function getTemplates(): Promise<Template[]> {
    const {data} = await axios.get(`${getBaseUrl()}/templates`);
    return data;
}

async function updateTemplate(id: string, template: Partial<Template>): Promise<Template> {
    const {data} = await axios.put(`${getBaseUrl()}/templates/${id}`, template);
    return data;
}

async function deleteTemplate(id: string): Promise<void> {
    await axios.delete(`${getBaseUrl()}/templates/${id}`);
}

export {
    getBaseUrl,
    uploadFile,
    uploadFiles,
    getHistory,
    saveToHistory,
    getProfile,
    extractTextFromInvoice,
    createTemplate,
    getTemplates,
    updateTemplate,
    deleteTemplate
};

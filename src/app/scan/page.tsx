"use client";

import {AppLayout} from "@/components/app-layout"
import {useCallback, useState} from "react";
import UploadForm from "@/components/UploadForm";
import {ExtractResult, OCRPage} from "@/types";

export default function ScanPage() {
    const [ocrResult, setOcrResult] = useState<ExtractResult | null>(null);

    const content = useCallback((result: ExtractResult) => {
        return result.pages.map((page: OCRPage) => page.text).join("\n\n");
    }, []);

    return (
        <AppLayout>
            <div className="p-6">
                <UploadForm onUploadSuccess={setOcrResult}/>
                {ocrResult && (
                    <div className="mt-6">
                        <h2 className="text-lg font-bold">OCR Result</h2>
                        <pre className="mt-2 whitespace-pre-wrap rounded bg-gray-100 p-4 text-sm">
                            {content(ocrResult)}
                        </pre>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}

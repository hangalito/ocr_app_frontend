"use client"

import type React from "react"
import {useCallback, useState} from "react"
import {Check, Copy, Download, FileText, ImageIcon, Loader2, Upload, X} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {cn} from "@/lib/utils"

type ScanStatus = "idle" | "uploading" | "processing" | "complete" | "error"

interface UploadedFile {
    name: string
    size: number
    preview: string
}

export function ScanContent() {
    const [status, setStatus] = useState<ScanStatus>("idle")
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
    const [extractedText, setExtractedText] = useState("")
    const [copied, setCopied] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleFileUpload = useCallback(async (file: File) => {
        setStatus("uploading")

        const formData = new FormData()
        formData.append("file", file)
        formData.append("langs", "por")

        try {
            const response = await fetch("http://localhost:8000/extract", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Failed to process the file.")
            }

            const result = await response.json()
            setUploadedFile({
                name: file.name,
                size: file.size,
                preview: URL.createObjectURL(file),
            })
            setExtractedText(result.pages.map((page: { text: string }) => page.text).join("\n\n"))
            setStatus("complete")
        } catch (error) {
            console.error(error)
            setStatus("error")
        }
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)

            const file = e.dataTransfer.files[0]
            if (file && file.type.startsWith("image/")) {
                handleFileUpload(file)
            }
        },
        [handleFileUpload],
    )

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (file) {
                handleFileUpload(file)
            }
        },
        [handleFileUpload],
    )

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(extractedText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }, [extractedText])

    const handleDownload = useCallback(() => {
        const blob = new Blob([extractedText], {type: "text/plain"})
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${uploadedFile?.name.split(".")[0] || "extracted"}_text.txt`
        a.click()
        URL.revokeObjectURL(url)
    }, [extractedText, uploadedFile])

    const handleReset = useCallback(() => {
        setStatus("idle")
        setUploadedFile(null)
        setExtractedText("")
    }, [])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Digitalizar Imagem</h1>
                <p className="text-muted-foreground">Carregue uma imagem para extrair o texto</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Upload Area */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5"/>
                            Imagem Original
                        </CardTitle>
                        <CardDescription>Arraste uma imagem ou clique para selecionar</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {status === "idle" ? (
                            <label
                                className={cn(
                                    "flex min-h-[400px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
                                    isDragging
                                        ? "border-primary bg-primary/5"
                                        : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                                )}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect}/>
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                        <Upload className="h-8 w-8 text-muted-foreground"/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Arraste a imagem aqui</p>
                                        <p className="text-xs text-muted-foreground">ou clique para selecionar do
                                            computador</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP até 10MB</p>
                                </div>
                            </label>
                        ) : (
                            <div className="space-y-4">
                                <div className="relative min-h-[400px] overflow-hidden rounded-lg bg-muted">
                                    {uploadedFile?.preview && (
                                        <img
                                            src={uploadedFile.preview || "/placeholder.svg"}
                                            alt="Imagem carregada"
                                            className="h-full w-full object-contain"
                                        />
                                    )}
                                    {(status === "uploading" || status === "processing") && (
                                        <div
                                            className="absolute inset-0 flex items-center justify-center bg-background/80">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                                                <p className="text-sm font-medium">
                                                    {status === "uploading" ? "A carregar..." : "A processar OCR..."}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {uploadedFile && (
                                    <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                                        <div className="flex items-center gap-3">
                                            <ImageIcon className="h-5 w-5 text-muted-foreground"/>
                                            <div>
                                                <p className="text-sm font-medium">{uploadedFile.name}</p>
                                                <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={handleReset}>
                                            <X className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Results Area */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5"/>
                                    Texto Extraído
                                </CardTitle>
                                <CardDescription>Resultado do processamento OCR</CardDescription>
                            </div>
                            {status === "complete" && (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={handleCopy}>
                                        {copied ? <Check className="mr-1 h-4 w-4"/> : <Copy className="mr-1 h-4 w-4"/>}
                                        {copied ? "Copiado" : "Copiar"}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleDownload}>
                                        <Download className="mr-1 h-4 w-4"/>
                                        Exportar
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {status === "idle" ? (
                            <div
                                className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-muted-foreground/25">
                                <div className="text-center">
                                    <FileText className="mx-auto h-12 w-12 text-muted-foreground/50"/>
                                    <p className="mt-3 text-sm text-muted-foreground">O texto extraído aparecerá
                                        aqui</p>
                                </div>
                            </div>
                        ) : status === "complete" ? (
                            <Textarea
                                value={extractedText}
                                onChange={(e) => setExtractedText(e.target.value)}
                                className="min-h-[400px] resize-none font-mono text-sm"
                                placeholder="Texto extraído..."
                            />
                        ) : (
                            <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-muted">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                                    <p className="text-sm text-muted-foreground">A aguardar processamento...</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Stats */}
            {status === "complete" && (
                <Card>
                    <CardContent className="py-4">
                        <div className="flex items-center justify-around">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary">{extractedText.length}</p>
                                <p className="text-xs text-muted-foreground">Caracteres</p>
                            </div>
                            <div className="h-8 w-px bg-border"/>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary">{extractedText.split(/\s+/).filter(Boolean).length}</p>
                                <p className="text-xs text-muted-foreground">Palavras</p>
                            </div>
                            <div className="h-8 w-px bg-border"/>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary">{extractedText.split("\n").filter(Boolean).length}</p>
                                <p className="text-xs text-muted-foreground">Linhas</p>
                            </div>
                            <div className="h-8 w-px bg-border"/>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary">98.5%</p>
                                <p className="text-xs text-muted-foreground">Confiança</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

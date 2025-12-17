"use client"

import type React from "react"
import {useCallback, useEffect, useState} from "react"
import {Check, Copy, Download, FileBox, FileText, ImageIcon, Loader2, Upload, X} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {cn} from "@/lib/utils"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Label} from "@/components/ui/label"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Alert, AlertDescription} from "@/components/ui/alert"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ScanStatus = "idle" | "uploading" | "processing" | "complete" | "error"

interface UploadedFile {
  name: string
  size: number
  preview: string
}

interface Template {
  id: number
  name: string
  language: string
  fields: Array<{ name: string; x: number; y: number; width: number; height: number }>
  image: string
  createdAt: string
}

export function ScanContent() {
  const [status, setStatus] = useState<ScanStatus>("idle")
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [extractedText, setExtractedText] = useState("")
  const [copied, setCopied] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [extractionMode, setExtractionMode] = useState<"simple" | "template">("simple")
  const [extractedData, setExtractedData] = useState<Record<string, string>>({})

  useEffect(() => {
    const savedModels = localStorage.getItem("ocrModels")
    if (savedModels) {
      setTemplates(JSON.parse(savedModels))
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const simulateOCR = useCallback(
    (file: File) => {
      setStatus("uploading")

      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedFile({
          name: file.name,
          size: file.size,
          preview: e.target?.result as string,
        })

        setStatus("processing")

        if (extractionMode === "template" && selectedTemplate) {
          const template = templates.find((t) => t.id.toString() === selectedTemplate)
          if (template) {
            setTimeout(() => {
              const data: Record<string, string> = {}
              template.fields.forEach((field) => {
                data[field.name] = `Valor extraído para ${field.name}`
              })
              setExtractedData(data)
              setStatus("complete")
            }, 2500)
            return
          }
        }

        setTimeout(() => {
          setExtractedText(`FATURA Nº 2024/001234

Data: 09 de Dezembro de 2024

CLIENTE:
Empresa Exemplo, Lda.
Rua das Flores, 123
4000-001 Porto
NIF: 501234567

DESCRIÇÃO DOS SERVIÇOS:
1. Consultoria de Software - 40 horas
   Valor unitário: €75,00
   Subtotal: €3.000,00

2. Desenvolvimento de Aplicação Web
   Subtotal: €5.500,00

3. Manutenção Mensal
   Subtotal: €450,00

SUBTOTAL: €8.950,00
IVA (23%): €2.058,50
TOTAL: €11.008,50

Condições de Pagamento: 30 dias
IBAN: PT50 0000 0000 0000 0000 0000 0

Obrigado pela preferência!`)
          setStatus("complete")
        }, 2000)
      }
      reader.readAsDataURL(file)
    },
    [extractionMode, selectedTemplate, templates],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        simulateOCR(file)
      }
    },
    [simulateOCR],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        simulateOCR(file)
      }
    },
    [simulateOCR],
  )

  const handleExportJSON = useCallback(() => {
    const data = extractionMode === "template" ? extractedData : { text: extractedText }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${uploadedFile?.name.split(".")[0] || "extracted"}_data.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [extractedData, extractedText, extractionMode, uploadedFile])

  const handleExportCSV = useCallback(() => {
    let csvContent = ""

    if (extractionMode === "template") {
      csvContent = "Campo,Valor\n"
      Object.entries(extractedData).forEach(([key, value]) => {
        csvContent += `"${key}","${value.replace(/"/g, '""')}"\n`
      })
    } else {
      csvContent = "Texto Extraído\n"
      csvContent += `"${extractedText.replace(/"/g, '""')}"`
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${uploadedFile?.name.split(".")[0] || "extracted"}_data.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [extractedData, extractedText, extractionMode, uploadedFile])

  const handleExportPDF = useCallback(() => {
    // Create a simple PDF-like HTML structure that prints well
    const content =
      extractionMode === "template"
        ? Object.entries(extractedData)
            .map(([key, value]) => `<div style="margin-bottom: 12px;"><strong>${key}:</strong> ${value}</div>`)
            .join("")
        : `<pre style="white-space: pre-wrap; font-family: monospace;">${extractedText}</pre>`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>OCR - ${uploadedFile?.name || "Resultado"}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 24px; margin-bottom: 20px; }
            .metadata { color: #666; font-size: 12px; margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <h1>Resultado OCR</h1>
          <div class="metadata">Arquivo: ${uploadedFile?.name || "N/A"} | Data: ${new Date().toLocaleDateString("pt-PT")}</div>
          ${content}
        </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const printWindow = window.open(url, "_blank")

    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print()
        URL.revokeObjectURL(url)
      }
    }
  }, [extractedData, extractedText, extractionMode, uploadedFile])

  const handleCopyToClipboard = useCallback(async () => {
    const textToCopy =
      extractionMode === "template"
        ? Object.entries(extractedData)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n")
        : extractedText

    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [extractedData, extractedText, extractionMode])

  const handleReset = useCallback(() => {
    setStatus("idle")
    setUploadedFile(null)
    setExtractedText("")
    setExtractedData({})
    setSelectedTemplate("")
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Digitalizar Imagem</h1>
        <p className="text-muted-foreground">Carregue uma imagem para extrair o texto</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modo de Extração</CardTitle>
          <CardDescription>Escolha como deseja processar a imagem</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={extractionMode} onValueChange={(v) => setExtractionMode(v as "simple" | "template")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple">Extração Simples</TabsTrigger>
              <TabsTrigger value="template">Usar Modelo</TabsTrigger>
            </TabsList>
            <TabsContent value="simple" className="space-y-4">
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Extração simples de todo o texto presente na imagem. Ideal para documentos gerais.
                </AlertDescription>
              </Alert>
            </TabsContent>
            <TabsContent value="template" className="space-y-4">
              <Alert>
                <FileBox className="h-4 w-4" />
                <AlertDescription>
                  Use um modelo pré-definido para extrair campos específicos. Ideal para facturas e formulários.
                </AlertDescription>
              </Alert>
              {templates.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    Não tem modelos criados.{" "}
                    <Link href="/templates" className="font-medium underline">
                      Criar o primeiro modelo
                    </Link>
                  </AlertDescription>
                </Alert>
              ) : (
                <div>
                  <Label htmlFor="template-select">Selecione um Modelo</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger id="template-select" className="mt-2">
                      <SelectValue placeholder="Escolha um modelo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.name} ({template.fields.length} campos)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
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
                  extractionMode === "template" && !selectedTemplate && "opacity-50 pointer-events-none",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={extractionMode === "template" && !selectedTemplate}
                />
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    {extractionMode === "template" && !selectedTemplate ? (
                      <>
                        <p className="text-sm font-medium">Selecione um modelo primeiro</p>
                        <p className="text-xs text-muted-foreground">Escolha um modelo acima para continuar</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium">Arraste a imagem aqui</p>
                        <p className="text-xs text-muted-foreground">ou clique para selecionar do computador</p>
                      </>
                    )}
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
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{uploadedFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {extractionMode === "template" ? "Dados Extraídos" : "Texto Extraído"}
                </CardTitle>
                <CardDescription>Resultado do processamento OCR</CardDescription>
              </div>
              {status === "complete" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-4 w-4" />
                      Exportar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleCopyToClipboard}>
                      {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                      {copied ? "Copiado!" : "Copiar para Área de Transferência"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleExportJSON}>
                      <FileText className="mr-2 h-4 w-4" />
                      Exportar como JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportCSV}>
                      <FileText className="mr-2 h-4 w-4" />
                      Exportar como CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportPDF}>
                      <FileText className="mr-2 h-4 w-4" />
                      Exportar como PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {status === "idle" ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-muted-foreground/25">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    {extractionMode === "template"
                      ? "Os dados extraídos aparecerão aqui"
                      : "O texto extraído aparecerá aqui"}
                  </p>
                </div>
              </div>
            ) : status === "complete" ? (
              <>
                {extractionMode === "template" ? (
                  <div className="space-y-3 min-h-[400px]">
                    {Object.entries(extractedData).map(([key, value]) => (
                      <div key={key} className="rounded-lg border bg-muted/30 p-4">
                        <Label className="text-xs text-muted-foreground">{key}</Label>
                        <p className="mt-1 text-sm font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="min-h-[400px] resize-none font-mono text-sm"
                    placeholder="Texto extraído..."
                  />
                )}
              </>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-muted">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">A aguardar processamento...</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {status === "complete" && (
        <Card>
          <CardContent className="py-4">
            {extractionMode === "template" ? (
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{Object.keys(extractedData).length}</p>
                  <p className="text-xs text-muted-foreground">Campos Extraídos</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {templates.find((t) => t.id.toString() === selectedTemplate)?.name || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">Modelo Usado</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">97.8%</p>
                  <p className="text-xs text-muted-foreground">Confiança</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{extractedText.length}</p>
                  <p className="text-xs text-muted-foreground">Caracteres</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{extractedText.split(/\s+/).filter(Boolean).length}</p>
                  <p className="text-xs text-muted-foreground">Palavras</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{extractedText.split("\n").filter(Boolean).length}</p>
                  <p className="text-xs text-muted-foreground">Linhas</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">98.5%</p>
                  <p className="text-xs text-muted-foreground">Confiança</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

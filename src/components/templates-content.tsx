"use client"

import type React from "react"
import {useRef, useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {FileText, Info, Plus, RotateCcw, Save, Trash2, Upload, ZoomIn, ZoomOut} from "lucide-react"
import {Badge} from "@/components/ui/badge"
import {Alert, AlertDescription} from "@/components/ui/alert"

interface Field {
    name: string
    x: number
    y: number
    width: number
    height: number
}

interface Selection {
    x: number
    y: number
    width: number
    height: number
}

export function TemplatesContent() {
    const [modelName, setModelName] = useState("")
    const [fieldName, setFieldName] = useState("")
    const [language, setLanguage] = useState("por")
    const [currentImage, setCurrentImage] = useState<string | null>(null)
    const [fields, setFields] = useState<Field[]>([])
    const [isSelecting, setIsSelecting] = useState(false)
    const [currentSelection, setCurrentSelection] = useState<Selection | null>(null)
    const [zoom, setZoom] = useState(1)
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null)

    const imageRef = useRef<HTMLImageElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            setCurrentImage(event.target?.result as string)
            setFields([])
            setCurrentSelection(null)
        }
        reader.readAsDataURL(file)
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return

        const rect = imageRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / zoom
        const y = (e.clientY - rect.top) / zoom

        setIsSelecting(true)
        setStartPos({x, y})
        setCurrentSelection({x, y, width: 0, height: 0})
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isSelecting || !startPos || !imageRef.current) return

        const rect = imageRef.current.getBoundingClientRect()
        const currentX = (e.clientX - rect.left) / zoom
        const currentY = (e.clientY - rect.top) / zoom

        const width = currentX - startPos.x
        const height = currentY - startPos.y

        setCurrentSelection({
            x: width < 0 ? currentX : startPos.x,
            y: height < 0 ? currentY : startPos.y,
            width: Math.abs(width),
            height: Math.abs(height),
        })
    }

    const handleMouseUp = () => {
        setIsSelecting(false)
    }

    const addField = () => {
        if (!fieldName.trim()) {
            alert("Por favor, insira um nome para o campo")
            return
        }

        if (!currentSelection || currentSelection.width < 5 || currentSelection.height < 5) {
            alert("Por favor, selecione uma área na imagem")
            return
        }

        if (!imageRef.current) return

        const imgWidth = imageRef.current.naturalWidth
        const imgHeight = imageRef.current.naturalHeight

        const field: Field = {
            name: fieldName,
            x: currentSelection.x / imageRef.current.width,
            y: currentSelection.y / imageRef.current.height,
            width: currentSelection.width / imageRef.current.width,
            height: currentSelection.height / imageRef.current.height,
        }

        setFields([...fields, field])
        setFieldName("")
        setCurrentSelection(null)
    }

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index))
    }

    const saveModel = () => {
        if (!modelName.trim()) {
            alert("Por favor, insira um nome para o modelo")
            return
        }

        if (fields.length === 0) {
            alert("Por favor, adicione pelo menos um campo")
            return
        }

        const model = {
            id: Date.now(),
            name: modelName,
            language,
            fields,
            image: currentImage,
            createdAt: new Date().toISOString(),
        }

        const savedModels = JSON.parse(localStorage.getItem("ocrModels") || "[]")
        savedModels.push(model)
        localStorage.setItem("ocrModels", JSON.stringify(savedModels))

        alert("Modelo guardado com sucesso!")

        // Reset
        setModelName("")
        setFieldName("")
        setFields([])
        setCurrentImage(null)
        setCurrentSelection(null)
        setZoom(1)
    }

    const zoomIn = () => setZoom(Math.min(zoom + 0.25, 3))
    const zoomOut = () => setZoom(Math.max(zoom - 0.25, 0.5))
    const resetZoom = () => setZoom(1)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Criar Modelo de Factura</h1>
                <p className="text-muted-foreground mt-2">Defina áreas personalizadas para extração de dados</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration Panel */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Configurações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="model-name">Nome do Modelo</Label>
                                <Input
                                    id="model-name"
                                    placeholder="Ex: Factura de Energia"
                                    value={modelName}
                                    onChange={(e) => setModelName(e.target.value)}
                                />
                            </div>

                            <Alert>
                                <Info className="h-4 w-4"/>
                                <AlertDescription className="text-xs">
                                    <strong>Como usar:</strong> 1. Digite o nome do campo → 2. Selecione a área na
                                    imagem → 3. Clique em
                                    Confirmar
                                </AlertDescription>
                            </Alert>

                            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                                <Label htmlFor="field-name" className="text-primary">
                                    Nome do Campo
                                </Label>
                                <Input
                                    id="field-name"
                                    placeholder="Ex: Valor Total"
                                    value={fieldName}
                                    onChange={(e) => setFieldName(e.target.value)}
                                    className="mt-2 bg-background"
                                />
                                <Button onClick={addField} className="w-full mt-3" variant="default">
                                    <Plus className="mr-2 h-4 w-4"/>
                                    Confirmar Ponto Selecionado
                                </Button>
                            </div>

                            <div>
                                <Label htmlFor="language">Idioma</Label>
                                <Select value={language} onValueChange={setLanguage}>
                                    <SelectTrigger id="language">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="por">Português</SelectItem>
                                        <SelectItem value="eng">Inglês</SelectItem>
                                        <SelectItem value="spa">Espanhol</SelectItem>
                                        <SelectItem value="fra">Francês</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Carregar Imagem Exemplo</Label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <Button
                                    variant="outline"
                                    className="w-full mt-2 bg-transparent"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="mr-2 h-4 w-4"/>
                                    Carregar Imagem
                                </Button>
                            </div>

                            {fields.length > 0 && (
                                <div>
                                    <Label>Campos Definidos ({fields.length})</Label>
                                    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                                        {fields.map((field, index) => (
                                            <div key={index}
                                                 className="flex items-center justify-between bg-secondary p-2 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-primary"/>
                                                    <span className="text-sm font-medium">{field.name}</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeField(index)}
                                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5"/>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button onClick={saveModel} className="w-full" variant="default" size="lg">
                                <Save className="mr-2 h-4 w-4"/>
                                Guardar Modelo
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Image Workspace */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Modelo Selecionado</CardTitle>
                            {currentImage && (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" onClick={zoomOut}>
                                        <ZoomOut className="h-4 w-4"/>
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={resetZoom}>
                                        <RotateCcw className="h-4 w-4"/>
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={zoomIn}>
                                        <ZoomIn className="h-4 w-4"/>
                                    </Button>
                                    <Badge variant="secondary" className="px-3">
                                        {Math.round(zoom * 100)}%
                                    </Badge>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            {!currentImage ? (
                                <div
                                    className="min-h-[500px] border-2 border-dashed border-muted rounded-lg flex items-center justify-center bg-muted/30">
                                    <div className="text-center p-8">
                                        <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4"/>
                                        <p className="text-lg font-semibold text-foreground">Carregue uma imagem exemplo
                                            para começar</p>
                                        <p className="text-sm text-muted-foreground mt-2">Formatos suportados: JPG,
                                            PNG</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-auto max-h-[600px] border rounded-lg bg-muted/30">
                                    <div
                                        ref={containerRef}
                                        className="relative inline-block"
                                        style={{transform: `scale(${zoom})`, transformOrigin: "top left"}}
                                        onMouseDown={handleMouseDown}
                                        onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp}
                                        onMouseLeave={handleMouseUp}
                                    >
                                        <img
                                            ref={imageRef}
                                            src={currentImage || "/placeholder.svg"}
                                            alt="Template"
                                            className="max-w-full select-none"
                                            draggable={false}
                                        />

                                        {/* Saved Fields */}
                                        {imageRef.current &&
                                            fields.map((field, index) => (
                                                <div
                                                    key={index}
                                                    className="absolute border-2 border-primary bg-primary/10 pointer-events-none"
                                                    style={{
                                                        left: `${field.x * imageRef.current!.width}px`,
                                                        top: `${field.y * imageRef.current!.height}px`,
                                                        width: `${field.width * imageRef.current!.width}px`,
                                                        height: `${field.height * imageRef.current!.height}px`,
                                                    }}
                                                >
                                                    <div
                                                        className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap">
                                                        {field.name}
                                                    </div>
                                                </div>
                                            ))}

                                        {/* Current Selection */}
                                        {currentSelection && currentSelection.width > 0 && currentSelection.height > 0 && (
                                            <div
                                                className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
                                                style={{
                                                    left: `${currentSelection.x}px`,
                                                    top: `${currentSelection.y}px`,
                                                    width: `${currentSelection.width}px`,
                                                    height: `${currentSelection.height}px`,
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

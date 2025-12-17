"use client"

import {useState} from "react"
import {
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    Eye,
    FileText,
    Filter,
    MoreHorizontal,
    Search,
    Trash2,
    XCircle,
} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Badge} from "@/components/ui/badge"
import {cn} from "@/lib/utils"

const historyItems = [
    {
        id: 1,
        name: "fatura_2024_001.png",
        date: "2024-12-09T14:30:00",
        chars: 1245,
        words: 187,
        confidence: 99.2,
        status: "complete",
        fileSize: "245 KB",
    },
    {
        id: 2,
        name: "contrato_arrendamento.jpg",
        date: "2024-12-09T11:15:00",
        chars: 4521,
        words: 623,
        confidence: 97.8,
        status: "complete",
        fileSize: "1.2 MB",
    },
    {
        id: 3,
        name: "recibo_novembro.png",
        date: "2024-12-08T16:45:00",
        chars: 542,
        words: 78,
        confidence: 98.5,
        status: "complete",
        fileSize: "156 KB",
    },
    {
        id: 4,
        name: "documento_corrupto.jpg",
        date: "2024-12-08T10:20:00",
        chars: 0,
        words: 0,
        confidence: 0,
        status: "error",
        fileSize: "2.1 MB",
    },
    {
        id: 5,
        name: "carta_cliente_importante.png",
        date: "2024-12-07T09:00:00",
        chars: 1876,
        words: 267,
        confidence: 96.4,
        status: "complete",
        fileSize: "890 KB",
    },
    {
        id: 6,
        name: "manual_instrucoes.jpg",
        date: "2024-12-06T15:30:00",
        chars: 8234,
        words: 1156,
        confidence: 94.1,
        status: "complete",
        fileSize: "3.4 MB",
    },
    {
        id: 7,
        name: "nota_despesas.png",
        date: "2024-12-06T11:00:00",
        chars: 324,
        words: 45,
        confidence: 99.8,
        status: "complete",
        fileSize: "89 KB",
    },
    {
        id: 8,
        name: "processo_em_curso.jpg",
        date: "2024-12-09T15:00:00",
        chars: 0,
        words: 0,
        confidence: 0,
        status: "processing",
        fileSize: "1.8 MB",
    },
]

const statusConfig = {
    complete: {
        label: "Concluído",
        icon: CheckCircle2,
        variant: "default" as const,
        className: "bg-green-100 text-green-700 hover:bg-green-100",
    },
    processing: {
        label: "A processar",
        icon: Clock,
        variant: "secondary" as const,
        className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    },
    error: {
        label: "Erro",
        icon: XCircle,
        variant: "destructive" as const,
        className: "bg-red-100 text-red-700 hover:bg-red-100",
    },
}

export function HistoryContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const filteredItems = historyItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || item.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("pt-PT", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    const toggleSelect = (id: number) => {
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Histórico</h1>
                    <p className="text-muted-foreground">{filteredItems.length} digitalizações encontradas</p>
                </div>
                {selectedItems.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{selectedItems.length} selecionados</span>
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4"/>
                            Exportar
                        </Button>
                        <Button variant="destructive" size="sm">
                            <Trash2 className="mr-2 h-4 w-4"/>
                            Eliminar
                        </Button>
                    </div>
                )}
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                            <Input
                                placeholder="Pesquisar ficheiros..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <Filter className="mr-2 h-4 w-4"/>
                                <SelectValue placeholder="Estado"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os estados</SelectItem>
                                <SelectItem value="complete">Concluídos</SelectItem>
                                <SelectItem value="processing">A processar</SelectItem>
                                <SelectItem value="error">Com erros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* History List */}
            <Card>
                <CardHeader>
                    <CardTitle>Digitalizações</CardTitle>
                    <CardDescription>Lista de todas as digitalizações realizadas</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {filteredItems.map((item) => {
                            const statusInfo = statusConfig[item.status as keyof typeof statusConfig]
                            const StatusIcon = statusInfo.icon
                            const isSelected = selectedItems.includes(item.id)

                            return (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50",
                                        isSelected && "border-primary bg-primary/5",
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleSelect(item.id)}
                                        className="h-4 w-4 rounded border-input"
                                    />

                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                        <FileText className="h-6 w-6 text-muted-foreground"/>
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{item.name}</p>
                                            <Badge className={statusInfo.className}>
                                                <StatusIcon className="mr-1 h-3 w-3"/>
                                                {statusInfo.label}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3"/>
                          {formatDate(item.date)}
                      </span>
                                            <span>{item.fileSize}</span>
                                            {item.status === "complete" && (
                                                <>
                                                    <span>{item.chars.toLocaleString()} caracteres</span>
                                                    <span>{item.confidence}% confiança</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Eye className="mr-2 h-4 w-4"/>
                                                Ver detalhes
                                            </DropdownMenuItem>
                                            {item.status === "complete" && (
                                                <DropdownMenuItem>
                                                    <Download className="mr-2 h-4 w-4"/>
                                                    Exportar texto
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4"/>
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )
                        })}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground/50"/>
                            <p className="mt-4 text-sm font-medium">Nenhum resultado encontrado</p>
                            <p className="text-sm text-muted-foreground">Tente ajustar os filtros de pesquisa</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

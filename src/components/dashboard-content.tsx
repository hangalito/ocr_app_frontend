/* _.. ___ .._ _ ... ._...___ .__.__ */

"use client"

import { FileText, ImageIcon, Clock, TrendingUp, ArrowUpRight, ArrowDownRight, FilePlus2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

const stats = [
  {
    title: "Modelos Criados",
    value: "12",
    change: "+3",
    trend: "up",
    icon: FilePlus2,
  },
  {
    title: "Total de Digitalizações",
    value: "1,284",
    change: "+12.5%",
    trend: "up",
    icon: FileText,
  },
  {
    title: "Imagens Processadas",
    value: "3,847",
    change: "+8.2%",
    trend: "up",
    icon: ImageIcon,
  },
  {
    title: "Tempo Médio",
    value: "2.3s",
    change: "-15%",
    trend: "down",
    icon: Clock,
  },
  {
    title: "Taxa de Precisão",
    value: "98.5%",
    change: "+2.1%",
    trend: "up",
    icon: TrendingUp,
  },
]

const chartData = [
  { name: "Seg", scans: 45 },
  { name: "Ter", scans: 52 },
  { name: "Qua", scans: 38 },
  { name: "Qui", scans: 65 },
  { name: "Sex", scans: 48 },
  { name: "Sáb", scans: 28 },
  { name: "Dom", scans: 15 },
]

const recentScans = [
  { id: 1, name: "documento_fiscal.png", date: "Há 5 min", chars: 1245, status: "Concluído" },
  { id: 2, name: "contrato_v2.jpg", date: "Há 23 min", chars: 3421, status: "Concluído" },
  { id: 3, name: "recibo_compra.png", date: "Há 1 hora", chars: 542, status: "Concluído" },
  { id: 4, name: "carta_cliente.jpg", date: "Há 2 horas", chars: 1876, status: "Concluído" },
]

export function DashboardContent() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Resumo da atividade da sua conta</p>
        </div>
        <Button asChild>
          <Link href="/scan">
            <ImageIcon className="mr-2 h-4 w-4" />
            Nova Digitalização
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-green-600" />
                )}
                <span className="text-green-600">{stat.change}</span>
                <span className="ml-1 text-muted-foreground">vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart and Recent Scans */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Atividade Semanal</CardTitle>
            <CardDescription>Número de digitalizações por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="scans"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Digitalizações Recentes</CardTitle>
            <CardDescription>Últimas digitalizações realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentScans.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{scan.name}</p>
                      <p className="text-xs text-muted-foreground">{scan.chars} caracteres</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{scan.date}</p>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                      {scan.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full bg-transparent" asChild>
              <Link href="/history">Ver todo o histórico</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

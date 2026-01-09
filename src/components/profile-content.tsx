/* _.. ___ .._ _ ... ._...___ .__.__ */

"use client"

import {useState} from "react"
import {Bell, Building2, Camera, CreditCard, Key, Mail, MapPin, Save, Shield, User} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Switch} from "@/components/ui/switch"
import {Separator} from "@/components/ui/separator"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Badge} from "@/components/ui/badge"

export function ProfileContent() {
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(false)
    const [weeklyReport, setWeeklyReport] = useState(true)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Perfil</h1>
                <p className="text-muted-foreground">Gerir informações e definições da conta</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="profile">
                        <User className="mr-2 h-4 w-4"/>
                        Perfil
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Shield className="mr-2 h-4 w-4"/>
                        Segurança
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="mr-2 h-4 w-4"/>
                        Notificações
                    </TabsTrigger>
                    <TabsTrigger value="billing">
                        <CreditCard className="mr-2 h-4 w-4"/>
                        Faturação
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Pessoais</CardTitle>
                            <CardDescription>Atualize os seus dados pessoais</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Avatar Section */}
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src="/professional-user.png"/>
                                        <AvatarFallback className="text-2xl">JD</AvatarFallback>
                                    </Avatar>
                                    <Button size="icon" variant="secondary"
                                            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full">
                                        <Camera className="h-4 w-4"/>
                                    </Button>
                                </div>
                                <div>
                                    <p className="font-medium">João Dias</p>
                                    <p className="text-sm text-muted-foreground">joao@exemplo.pt</p>
                                    <Button variant="link" className="h-auto p-0 text-sm">
                                        Alterar fotografia
                                    </Button>
                                </div>
                            </div>

                            <Separator/>

                            {/* Form Fields */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Primeiro Nome</Label>
                                    <div className="relative">
                                        <User
                                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                        <Input id="firstName" defaultValue="João" className="pl-9"/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Apelido</Label>
                                    <div className="relative">
                                        <User
                                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                        <Input id="lastName" defaultValue="Dias" className="pl-9"/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail
                                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                        <Input id="email" type="email" defaultValue="joao@exemplo.pt" className="pl-9"/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company">Empresa</Label>
                                    <div className="relative">
                                        <Building2
                                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                        <Input id="company" defaultValue="Tech Solutions, Lda." className="pl-9"/>
                                    </div>
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="address">Morada</Label>
                                    <div className="relative">
                                        <MapPin
                                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                        <Input id="address" defaultValue="Rua das Flores, 123, 4000-001 Porto"
                                               className="pl-9"/>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button>
                                    <Save className="mr-2 h-4 w-4"/>
                                    Guardar Alterações
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Alterar Palavra-passe</CardTitle>
                            <CardDescription>Certifique-se de usar uma palavra-passe forte</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Palavra-passe Atual</Label>
                                <div className="relative">
                                    <Key
                                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                    <Input id="currentPassword" type="password" className="pl-9"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Nova Palavra-passe</Label>
                                <div className="relative">
                                    <Key
                                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                    <Input id="newPassword" type="password" className="pl-9"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Palavra-passe</Label>
                                <div className="relative">
                                    <Key
                                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                    <Input id="confirmPassword" type="password" className="pl-9"/>
                                </div>
                            </div>
                            <Button>Atualizar Palavra-passe</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Autenticação de Dois Fatores</CardTitle>
                            <CardDescription>Adicione uma camada extra de segurança à sua conta</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Estado: Desativado</p>
                                <p className="text-sm text-muted-foreground">Proteja a sua conta com autenticação em
                                    duas etapas</p>
                            </div>
                            <Button variant="outline">Ativar 2FA</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferências de Notificação</CardTitle>
                            <CardDescription>Configure como pretende ser notificado</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Notificações por Email</p>
                                    <p className="text-sm text-muted-foreground">
                                        Receber emails quando as digitalizações estiverem concluídas
                                    </p>
                                </div>
                                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications}/>
                            </div>
                            <Separator/>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Notificações Push</p>
                                    <p className="text-sm text-muted-foreground">Receber notificações no navegador</p>
                                </div>
                                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications}/>
                            </div>
                            <Separator/>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Relatório Semanal</p>
                                    <p className="text-sm text-muted-foreground">Receber um resumo semanal da atividade
                                        da conta</p>
                                </div>
                                <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport}/>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="billing" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plano Atual</CardTitle>
                            <CardDescription>Gerir o seu plano de subscrição</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold">Plano Profissional</p>
                                        <Badge>Ativo</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">€29/mês • 5.000 digitalizações/mês</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Próxima fatura</p>
                                    <p className="font-medium">9 de Janeiro, 2025</p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <h4 className="text-sm font-medium">Utilização Este Mês</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Digitalizações utilizadas</span>
                                        <span>1.284 / 5.000</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                                        <div className="h-full bg-primary transition-all" style={{width: "25.68%"}}/>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Renova em 30 dias • 3.716
                                        digitalizações restantes</p>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <Button variant="outline">Alterar Plano</Button>
                                <Button variant="outline">Ver Faturas</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Método de Pagamento</CardTitle>
                            <CardDescription>Gerir os seus cartões de pagamento</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-14 items-center justify-center rounded bg-muted">
                                        <CreditCard className="h-6 w-6 text-muted-foreground"/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                                        <p className="text-xs text-muted-foreground">Expira 12/2026</p>
                                    </div>
                                </div>
                                <Badge variant="outline">Predefinido</Badge>
                            </div>
                            <Button variant="outline" className="mt-4 bg-transparent">
                                Adicionar Cartão
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

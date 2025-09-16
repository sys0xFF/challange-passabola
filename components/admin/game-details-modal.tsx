"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, Trophy, Calendar, MapPin, Users, Ticket } from "lucide-react"
import { Game, TicketPurchase } from "@/lib/database-service"
import { getAllTickets } from "@/lib/admin-service"

interface GameDetailsModalProps {
  game: Game & { id: string }
  tournamentName?: string
  trigger?: React.ReactNode
  onGameUpdated?: () => void
}

export function GameDetailsModal({ 
  game, 
  tournamentName,
  trigger,
  onGameUpdated 
}: GameDetailsModalProps) {
  const [open, setOpen] = useState(false)
  const [tickets, setTickets] = useState<(TicketPurchase & { id: string })[]>([])
  const [loading, setLoading] = useState(false)

  const loadTickets = async () => {
    setLoading(true)
    try {
      const allTickets = await getAllTickets()
      const gameTickets = allTickets.filter(ticket => ticket.gameId === game.id)
      setTickets(gameTickets)
    } catch (error) {
      console.error("Error loading tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      loadTickets()
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default'
      case 'in-progress': return 'destructive'
      case 'completed': return 'secondary'
      case 'cancelled': return 'outline'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Agendado'
      case 'in-progress': return 'Em Andamento'
      case 'completed': return 'Finalizado'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  const totalTicketsSold = tickets.length
  const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.totalPrice, 0)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            Ver Detalhes
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {game.title}
          </DialogTitle>
          <DialogDescription>
            {tournamentName && `${tournamentName} • `}
            {game.phase} • {formatDate(game.date)} às {game.time}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Informações do Jogo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Status</h4>
                  <Badge variant={getStatusColor(game.status)}>
                    {getStatusText(game.status)}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Fase</h4>
                  <p>{game.phase}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Data e Hora</h4>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(game.date)} às {game.time}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Local</h4>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{game.location}</span>
                  </div>
                </div>
                {game.stadium && (
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-sm text-muted-foreground">Estádio</h4>
                    <p>{game.stadium}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Times */}
          <Card>
            <CardHeader>
              <CardTitle>Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">{game.team1}</div>
                  {game.result && (
                    <div className="text-3xl font-bold text-primary mt-2">
                      {game.result.team1Score}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-lg text-muted-foreground">VS</div>
                  {game.result && (
                    <div className="text-lg text-muted-foreground mt-2">-</div>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{game.team2}</div>
                  {game.result && (
                    <div className="text-3xl font-bold text-primary mt-2">
                      {game.result.team2Score}
                    </div>
                  )}
                </div>
              </div>
              
              {game.result && (
                <div className="mt-4 text-center">
                  <Badge variant="secondary" className="text-lg">
                    Vencedor: {game.result.winner}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tipos de Ingressos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                Tipos de Ingressos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {game.ticketTypes.map((ticketType, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <h4 className="font-semibold">{ticketType.name}</h4>
                      {ticketType.description && (
                        <p className="text-sm text-muted-foreground">{ticketType.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(ticketType.price)}</p>
                      <p className="text-sm text-muted-foreground">
                        Máx: {ticketType.maxQuantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas de Vendas */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-primary">{totalTicketsSold}</div>
                  <p className="text-sm text-muted-foreground">Ingressos Vendidos</p>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalRevenue)}
                  </div>
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-blue-600">
                    {game.ticketTypes.reduce((sum, type) => sum + type.maxQuantity, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Capacidade Total</p>
                </div>
              </div>

              {loading && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Carregando dados de vendas...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de Ingressos Vendidos */}
          {tickets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Ingressos Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="flex justify-between items-center p-2 border rounded text-sm">
                      <div>
                        <p className="font-medium">{ticket.ticketTypeName}</p>
                        <p className="text-muted-foreground">
                          {ticket.purchaseDetails.customerName} • Qtd: {ticket.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(ticket.totalPrice)}</p>
                        <p className="text-muted-foreground text-xs">
                          {new Date(ticket.purchaseDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

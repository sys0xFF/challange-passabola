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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Eye, 
  Users, 
  Trophy, 
  User,
  MapPin,
  Mail,
  Phone,
  Calendar
} from "lucide-react"
import { GameTeam } from "@/lib/database-service"

interface TeamDetailsModalProps {
  team: GameTeam
  trigger: React.ReactNode
}

export function TeamDetailsModal({ team, trigger }: TeamDetailsModalProps) {
  const [open, setOpen] = useState(false)

  const getPositionIcon = (position: string) => {
    if (position.toLowerCase().includes('goleira') || position.toLowerCase().includes('goleiro')) {
      return "🥅"
    }
    return "⚽"
  }

  const getTeamTypeLabel = (type: string) => {
    switch (type) {
      case 'registered':
        return { label: 'Time Registrado', color: 'bg-green-100 text-green-800', icon: '📋' }
      case 'auto-generated':
        return { label: 'Time Automático', color: 'bg-blue-100 text-blue-800', icon: '🤖' }
      default:
        return { label: 'Desconhecido', color: 'bg-gray-100 text-gray-800', icon: '❓' }
    }
  }

  const teamType = getTeamTypeLabel(team.type)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg">{teamType.icon}</span>
            <Trophy className="h-5 w-5" />
            {team.name}
          </DialogTitle>
          <DialogDescription>
            Detalhes completos do time e jogadores
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Informações Gerais do Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Informações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Nome do Time:</span>
                  <span>{team.name}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Tipo:</span>
                  <Badge className={`${teamType.color} flex items-center gap-1`}>
                    <span>{teamType.icon}</span>
                    {teamType.label}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total de Jogadores:</span>
                  <Badge variant="outline">
                    {team.players.length} jogadores
                  </Badge>
                </div>

                {team.registeredTeamId && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">ID de Registro:</span>
                    <span className="text-sm text-muted-foreground font-mono">
                      {team.registeredTeamId}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lista de Jogadores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Elenco ({team.players.length} jogadores)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {team.players.length > 0 ? (
                    team.players.map((player, index) => (
                      <div key={player.id}>
                        <div className="flex items-start justify-between p-4 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{player.name}</span>
                                <span className="text-xl">{getPositionIcon(player.position)}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {player.position}
                                </Badge>
                                {player.isFromIndividual && (
                                  <Badge variant="secondary" className="text-xs">
                                    Jogadora Individual
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right text-xs text-muted-foreground">
                            {player.individualId && (
                              <div className="font-mono">ID: {player.individualId}</div>
                            )}
                          </div>
                        </div>
                        
                        {index < team.players.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum jogador cadastrado</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas do Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {team.players.filter(p => p.position.toLowerCase().includes('goleira')).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Goleiras</div>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {team.players.filter(p => !p.position.toLowerCase().includes('goleira')).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Jogadoras de Linha</div>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {team.players.filter(p => p.isFromIndividual).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Individuais</div>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {team.players.filter(p => !p.isFromIndividual).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Registradas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

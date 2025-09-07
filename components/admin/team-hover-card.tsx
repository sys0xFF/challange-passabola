"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { 
  Users, 
  Trophy, 
  User,
  Clock
} from "lucide-react"
import { GameTeam } from "@/lib/database-service"

interface TeamHoverCardProps {
  team: GameTeam
  children: React.ReactNode
}

export function TeamHoverCard({ team, children }: TeamHoverCardProps) {
  const getTeamTypeInfo = (type: string) => {
    switch (type) {
      case 'registered':
        return { label: 'Time Registrado', color: 'bg-green-100 text-green-800', icon: '📋' }
      case 'auto-generated':
        return { label: 'Time Automático', color: 'bg-blue-100 text-blue-800', icon: '🤖' }
      default:
        return { label: 'Desconhecido', color: 'bg-gray-100 text-gray-800', icon: '❓' }
    }
  }

  const teamType = getTeamTypeInfo(team.type)
  
  const goalkeepers = team.players.filter(p => 
    p.position.toLowerCase().includes('goleira') || p.position.toLowerCase().includes('goleiro')
  ).length

  const fieldPlayers = team.players.length - goalkeepers
  const individualPlayers = team.players.filter(p => p.isFromIndividual).length

  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80" side="right">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-lg">{teamType.icon}</span>
              <Trophy className="h-4 w-4" />
              {team.name}
            </CardTitle>
            <Badge className={`${teamType.color} flex items-center gap-1 w-fit`}>
              <span>{teamType.icon}</span>
              {teamType.label}
            </Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{team.players.length}</span>
                <span className="text-muted-foreground">jogadores</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-lg">🥅</span>
                  <div>
                    <div className="font-semibold">{goalkeepers}</div>
                    <div className="text-muted-foreground">Goleiras</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-lg">⚽</span>
                  <div>
                    <div className="font-semibold">{fieldPlayers}</div>
                    <div className="text-muted-foreground">De linha</div>
                  </div>
                </div>
              </div>

              {individualPlayers > 0 && (
                <div className="flex items-center gap-2 text-xs border-t pt-2">
                  <User className="h-3 w-3 text-blue-500" />
                  <span className="text-muted-foreground">
                    {individualPlayers} jogadora{individualPlayers > 1 ? 's' : ''} individual{individualPlayers > 1 ? 'is' : ''}
                  </span>
                </div>
              )}

              <div className="text-xs text-muted-foreground border-t pt-2">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Clique no olho para ver detalhes completos
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverCardContent>
    </HoverCard>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Eye, 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Trophy, 
  Shuffle,
  Save,
  Play,
  Loader2
} from "lucide-react"
import { Tournament, GameTeam, Match } from "@/lib/database-service"
import { 
  getAllTeams, 
  getAllIndividuals, 
  generateAutomaticBracket, 
  generateAutoTeamsFromIndividuals,
  updateTournamentBracket,
  advanceWinnersToNextRound
} from "@/lib/admin-service"
import { TeamRegistration, IndividualRegistration } from "@/lib/database-service"
import { toast } from "sonner"

interface TournamentDetailsModalProps {
  tournament: Tournament & { id: string }
  trigger: React.ReactNode
  onTournamentUpdated: () => void
}

export function TournamentDetailsModal({ tournament, trigger, onTournamentUpdated }: TournamentDetailsModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [availableTeams, setAvailableTeams] = useState<Array<TeamRegistration & { id: string }>>([])
  const [availableIndividuals, setAvailableIndividuals] = useState<Array<IndividualRegistration & { id: string }>>([])
  const [tournamentTeams, setTournamentTeams] = useState<GameTeam[]>(tournament.teams || [])
  const [bracket, setBracket] = useState<Match[]>(tournament.bracket || [])
  const [activeTab, setActiveTab] = useState("info")

  useEffect(() => {
    if (open) {
      loadAvailableParticipants()
    }
  }, [open])

  const loadAvailableParticipants = async () => {
    try {
      const [teams, individuals] = await Promise.all([
        getAllTeams(),
        getAllIndividuals()
      ])
      
      setAvailableTeams(teams)
      setAvailableIndividuals(individuals)
    } catch (error) {
      console.error("Error loading participants:", error)
      toast.error("Erro ao carregar participantes")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'draft': 'secondary',
      'registration-open': 'default',
      'registration-closed': 'outline',
      'in-progress': 'default',
      'completed': 'secondary'
    } as const

    const labels = {
      'draft': 'Rascunho',
      'registration-open': 'Inscrições Abertas',
      'registration-closed': 'Inscrições Fechadas',
      'in-progress': 'Em Andamento',
      'completed': 'Finalizado'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  const canStartTournament = () => {
    const totalParticipants = availableTeams.length + Math.floor(availableIndividuals.length / 7)
    return totalParticipants >= 2 && totalParticipants >= tournament.maxTeams
  }

  const generateBracket = async () => {
    try {
      setLoading(true)

      // Combinar times registrados com times gerados automaticamente
      const registeredTeams: GameTeam[] = availableTeams.slice(0, tournament.maxTeams).map(team => ({
        id: team.id,
        name: team.teamData.nomeTime,
        type: 'registered',
        registeredTeamId: team.id,
        players: [
          {
            id: `captain-${team.id}`,
            name: team.captainData.nomeCompleto,
            position: team.captainData.posicao,
          },
          ...team.players.map(player => ({
            id: `player-${player.id}`,
            name: player.nomeCompleto,
            position: player.posicao,
          }))
        ]
      }))

      // Gerar times automáticos se necessário
      const remainingSlots = tournament.maxTeams - registeredTeams.length
      const autoTeams = remainingSlots > 0 ? generateAutoTeamsFromIndividuals(availableIndividuals).slice(0, remainingSlots) : []

      const allTournamentTeams = [...registeredTeams, ...autoTeams]
      
      if (allTournamentTeams.length < 2) {
        toast.error("Não há participantes suficientes para gerar o chaveamento")
        return
      }

      // Embaralhar times para distribuição aleatória
      const shuffledTeams = [...allTournamentTeams].sort(() => Math.random() - 0.5)
      
      // Gerar chaveamento automático
      const generatedBracket = generateAutomaticBracket(shuffledTeams)

      setTournamentTeams(shuffledTeams)
      setBracket(generatedBracket)

      toast.success("Chaveamento gerado com sucesso!")
    } catch (error) {
      console.error("Error generating bracket:", error)
      toast.error("Erro ao gerar chaveamento")
    } finally {
      setLoading(false)
    }
  }

  const saveBracket = async () => {
    try {
      setLoading(true)

      const result = await updateTournamentBracket(tournament.id, bracket, tournamentTeams)

      if (result.success) {
        toast.success("Chaveamento salvo com sucesso! Status do torneio atualizado.")
        onTournamentUpdated()
      } else {
        toast.error("Erro ao salvar chaveamento")
      }
    } catch (error) {
      console.error("Error saving bracket:", error)
      toast.error("Erro inesperado ao salvar chaveamento")
    } finally {
      setLoading(false)
    }
  }

  const updateMatchScore = async (matchId: string, team1Score: number, team2Score: number) => {
    try {
      const updatedBracket = bracket.map(match => {
        if (match.id === matchId) {
          const winner = team1Score > team2Score ? match.team1?.id : match.team2?.id
          return {
            ...match,
            score: { team1: team1Score, team2: team2Score },
            winner,
            status: 'completed' as const
          }
        }
        return match
      })
      
      setBracket(updatedBracket)
      
      // Automaticamente avançar os vencedores para a próxima rodada
      const advanceResult = await advanceWinnersToNextRound(tournament.id, updatedBracket)
      
      if (advanceResult.success) {
        setBracket(advanceResult.bracket)
        toast.success("Resultado salvo! Vencedores avançaram automaticamente.")
        onTournamentUpdated()
      } else {
        toast.error("Resultado salvo, mas houve erro ao avançar vencedores")
      }
    } catch (error) {
      console.error("Error updating match score:", error)
      toast.error("Erro ao salvar resultado da partida")
    }
  }

  const getRoundName = (round: number) => {
    const totalRounds = Math.ceil(Math.log2(tournament.maxTeams))
    if (round === totalRounds) return "Final"
    if (round === totalRounds - 1) return "Semifinal"
    if (round === totalRounds - 2) return "Quartas de Final"
    return `${round}ª Rodada`
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {tournament.name}
          </DialogTitle>
          <DialogDescription>
            Detalhes e gerenciamento do torneio
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="participants">Participantes</TabsTrigger>
            <TabsTrigger value="bracket">Chaveamento</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {getStatusBadge(tournament.status)}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  {tournament.isCopaPassaBola ? (
                    <Badge className="bg-[#8e44ad] text-white">Copa Passa Bola Oficial</Badge>
                  ) : (
                    <Badge variant="outline">Torneio Regular</Badge>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Equipes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-lg font-bold">{tournamentTeams.length}</span>
                  <span className="text-sm text-muted-foreground"> / {tournament.maxTeams}</span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Inscrição
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tournament.isPaid ? (
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(tournament.entryFee || 0)}
                    </span>
                  ) : (
                    <Badge variant="secondary">Gratuito</Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Período do Torneio:</strong> {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Inscrições:</strong> {formatDate(tournament.registrationStart)} - {formatDate(tournament.registrationEnd)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Local:</strong> {tournament.location}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Horário:</strong> {tournament.gameTime}
                </span>
              </div>

              {tournament.description && (
                <div>
                  <strong className="text-sm">Descrição:</strong>
                  <p className="text-sm text-muted-foreground mt-1">{tournament.description}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="participants" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Times Registrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{availableTeams.length}</p>
                    <p className="text-sm text-muted-foreground">times disponíveis</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Jogadoras Individuais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{availableIndividuals.length}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.floor(availableIndividuals.length / 7)} times possíveis
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Status do Torneio</h4>
              {canStartTournament() ? (
                <div className="text-green-600">
                  ✅ Participantes suficientes para iniciar o torneio
                </div>
              ) : (
                <div className="text-orange-600">
                  ⚠️ Aguardando mais participantes para atingir o mínimo necessário
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bracket" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Chaveamento do Torneio</h3>
              <div className="flex gap-2">
                <Button 
                  onClick={generateBracket}
                  disabled={loading || !canStartTournament()}
                  variant="outline"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Shuffle className="mr-2 h-4 w-4" />
                  )}
                  Gerar Chaveamento
                </Button>
                
                {bracket.length > 0 && (
                  <Button onClick={saveBracket} disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Salvar
                  </Button>
                )}
              </div>
            </div>

            {bracket.length > 0 ? (
              <div className="space-y-6">
                {Array.from(new Set(bracket.map(m => m.round))).sort((a, b) => a - b).map(round => (
                  <div key={round}>
                    <h4 className="font-semibold mb-3">{getRoundName(round)}</h4>
                    <div className="grid gap-3">
                      {bracket
                        .filter(match => match.round === round)
                        .map(match => (
                          <Card key={match.id} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">
                                    {match.team1?.name || "TBD"}
                                  </span>
                                  {match.score && (
                                    <span className="text-sm bg-muted px-2 py-1 rounded">
                                      {match.score.team1}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {match.team2?.name || "TBD"}
                                  </span>
                                  {match.score && (
                                    <span className="text-sm bg-muted px-2 py-1 rounded">
                                      {match.score.team2}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {match.team1 && match.team2 && match.status === 'pending' && (
                                <div className="flex gap-2">
                                  <div className="space-y-2">
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      min="0"
                                      className="w-16"
                                      id={`${match.id}-team1-score`}
                                    />
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      min="0"
                                      className="w-16"
                                      id={`${match.id}-team2-score`}
                                    />
                                  </div>
                                  <Button 
                                    size="sm"
                                    onClick={() => {
                                      const team1Score = parseInt((document.getElementById(`${match.id}-team1-score`) as HTMLInputElement)?.value || "0")
                                      const team2Score = parseInt((document.getElementById(`${match.id}-team2-score`) as HTMLInputElement)?.value || "0")
                                      updateMatchScore(match.id, team1Score, team2Score)
                                    }}
                                  >
                                    Salvar Resultado
                                  </Button>
                                </div>
                              )}

                              {match.winner && (
                                <Badge className="ml-4">
                                  Vencedor: {bracket.find(m => m.id === match.id)?.team1?.id === match.winner ? match.team1?.name : match.team2?.name}
                                </Badge>
                              )}
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum chaveamento gerado ainda</p>
                <p className="text-sm">Clique em "Gerar Chaveamento" para começar</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

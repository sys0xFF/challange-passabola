"use client"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2, Trash2 } from "lucide-react"
import { saveGame } from "@/lib/database-service"
import { toast } from "sonner"
import { Tournament } from "@/lib/database-service"

interface GameCreateModalProps {
  tournaments: (Tournament & { id: string })[]
  onGameCreated: () => void
}

interface TicketType {
  id: string
  name: string
  price: number
  description: string
  maxQuantity: number
  benefits: string[]
  category?: string
  isSmartBand?: boolean
}

// Tipos de ingressos pré-definidos baseados na página de ingressos
const predefinedTicketTypes: TicketType[] = [
  {
    id: "arquibancada",
    name: "Ingresso Arquibancada",
    price: 25.00,
    description: "Acesso à arquibancada geral do estádio",
    maxQuantity: 500,
    category: "Básico",
    benefits: [
      "Acesso ao estádio",
      "Vista geral do campo",
      "Acesso aos banheiros e lanchonetes"
    ],
    isSmartBand: false
  },
  {
    id: "pulseira-smart",
    name: "Ingresso Pulseira Smart",
    price: 45.00,
    description: "Arquibancada + Pulseira Inteligente incluída",
    maxQuantity: 300,
    category: "Recomendado",
    benefits: [
      "Acesso à arquibancada",
      "Pulseira inteligente inclusa",
      "Ganho de pontos por participação",
      "Interações em tempo real",
      "Acesso ao app exclusivo"
    ],
    isSmartBand: true
  },
  {
    id: "cadeira-numerada",
    name: "Ingresso Cadeira Numerada",
    price: 65.00,
    description: "Cadeira numerada + Pulseira Smart",
    maxQuantity: 200,
    category: "Conforto",
    benefits: [
      "Cadeira numerada com encosto",
      "Pulseira inteligente inclusa",
      "Vista privilegiada do campo",
      "Acesso a área VIP de alimentação",
      "Brindes exclusivos"
    ],
    isSmartBand: true
  },
  {
    id: "experiencia-vip",
    name: "Experiência VIP",
    price: 120.00,
    description: "Experiência completa VIP",
    maxQuantity: 50,
    category: "Premium",
    benefits: [
      "Camarote climatizado",
      "Pulseira inteligente premium",
      "Open bar e open food",
      "Meet & greet com jogadoras",
      "Kit exclusivo da Copa",
      "Estacionamento incluso"
    ],
    isSmartBand: true
  }
]

export function GameCreateModal({ tournaments, onGameCreated }: GameCreateModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("")
  
  const selectedTournament = tournaments.find(t => t.id === selectedTournamentId)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    stadium: "",
    status: "scheduled" as const
  })
  
  const [selectedTeam1, setSelectedTeam1] = useState<string>("")
  const [selectedTeam2, setSelectedTeam2] = useState<string>("")
  const [selectedPhase, setSelectedPhase] = useState<string>("")
  
  const [selectedTicketTypes, setSelectedTicketTypes] = useState<string[]>([])
  const [customTicketTypes, setCustomTicketTypes] = useState<TicketType[]>([])
  
  // Combinar tipos selecionados pré-definidos com tipos customizados
  const allTicketTypes = [
    ...predefinedTicketTypes.filter(type => selectedTicketTypes.includes(type.id)),
    ...customTicketTypes
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTicketTypeSelection = (ticketTypeId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedTicketTypes(prev => [...prev, ticketTypeId])
    } else {
      setSelectedTicketTypes(prev => prev.filter(id => id !== ticketTypeId))
    }
  }

  const addCustomTicketType = () => {
    const newTicket: TicketType = {
      id: `custom-${customTicketTypes.length + 1}`,
      name: "",
      price: 0,
      description: "",
      maxQuantity: 100,
      benefits: [""],
      category: "Personalizado"
    }
    setCustomTicketTypes([...customTicketTypes, newTicket])
  }

  const removeCustomTicketType = (index: number) => {
    setCustomTicketTypes(customTicketTypes.filter((_, i) => i !== index))
  }

  const updateCustomTicketType = (index: number, field: string, value: string | number | string[]) => {
    const updated = [...customTicketTypes]
    updated[index] = { ...updated[index], [field]: value }
    setCustomTicketTypes(updated)
  }

  const handleSubmit = async () => {
    try {
      // Validações básicas
      if (!selectedTournamentId) {
        toast.error("Selecione um torneio")
        return
      }
      
      if (!formData.title.trim()) {
        toast.error("Título do jogo é obrigatório")
        return
      }

      if (!selectedPhase.trim()) {
        toast.error("Fase do torneio é obrigatória")
        return
      }

      if (!selectedTeam1.trim() || !selectedTeam2.trim()) {
        toast.error("Ambas as equipes são obrigatórias")
        return
      }

      if (selectedTeam1 === selectedTeam2) {
        toast.error("Selecione equipes diferentes")
        return
      }

      if (!formData.date || !formData.time) {
        toast.error("Data e horário são obrigatórios")
        return
      }

      if (!formData.location.trim() || !formData.stadium.trim()) {
        toast.error("Local e estádio são obrigatórios")
        return
      }

      // Validar tipos de ingressos
      if (allTicketTypes.length === 0) {
        toast.error("Selecione pelo menos um tipo de ingresso")
        return
      }

      const validTickets = allTicketTypes.filter(ticket => 
        ticket.name.trim() && ticket.price > 0 && ticket.maxQuantity > 0
      )

      if (validTickets.length === 0) {
        toast.error("Pelo menos um tipo de ingresso válido é obrigatório")
        return
      }

      setLoading(true)

      const gameData = {
        tournamentId: selectedTournament?.id || "",
        tournamentName: selectedTournament?.name || "",
        title: formData.title,
        phase: selectedPhase,
        team1: selectedTeam1,
        team2: selectedTeam2,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        stadium: formData.stadium,
        ticketTypes: validTickets.map(ticket => ({
          ...ticket,
          soldQuantity: 0
        })),
        status: formData.status,
        createdBy: 'admin'
      }

      const result = await saveGame(gameData)

      if (result.success) {
        toast.success("Jogo criado com sucesso!")
        setOpen(false)
        resetForm()
        onGameCreated()
      } else {
        toast.error("Erro ao criar jogo. Tente novamente.")
      }
    } catch (error) {
      console.error("Error creating game:", error)
      toast.error("Erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      stadium: "",
      status: "scheduled"
    })
    setSelectedTournamentId("")
    setSelectedTeam1("")
    setSelectedTeam2("")
    setSelectedPhase("")
    setSelectedTicketTypes([])
    setCustomTicketTypes([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Criar Jogo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Jogo{selectedTournament ? ` - ${selectedTournament.name}` : ""}</DialogTitle>
          <DialogDescription>
            Adicione um novo jogo para este torneio
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Seleção de torneio */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Seleção de Torneio</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="tournament">Torneio *</Label>
              <Select value={selectedTournamentId} onValueChange={setSelectedTournamentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um torneio" />
                </SelectTrigger>
                <SelectContent>
                  {tournaments.map((tournament) => (
                    <SelectItem key={tournament.id} value={tournament.id}>
                      {tournament.name} - {tournament.status === 'draft' && 'Rascunho'}
                      {tournament.status === 'registration-open' && 'Inscrições Abertas'}
                      {tournament.status === 'registration-closed' && 'Inscrições Fechadas'}
                      {tournament.status === 'in-progress' && 'Em Andamento'}
                      {tournament.status === 'completed' && 'Finalizado'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Informações básicas do jogo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações do Jogo</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título do Jogo *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Ex: Quartas de Final - Jogo 1"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phase">Fase do Torneio *</Label>
                <Select 
                  value={selectedPhase} 
                  onValueChange={setSelectedPhase}
                  disabled={!selectedTournament}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedTournament ? "Selecione a fase" : "Selecione um torneio primeiro"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fase de Grupos">Fase de Grupos</SelectItem>
                    <SelectItem value="Oitavas de Final">Oitavas de Final</SelectItem>
                    <SelectItem value="Quartas de Final">Quartas de Final</SelectItem>
                    <SelectItem value="Semifinal">Semifinal</SelectItem>
                    <SelectItem value="Final">Final</SelectItem>
                    <SelectItem value="Terceiro Lugar">Terceiro Lugar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="team1">Equipe 1 *</Label>
                <Select 
                  value={selectedTeam1} 
                  onValueChange={setSelectedTeam1}
                  disabled={!selectedTournament}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedTournament ? "Selecione a primeira equipe" : "Selecione um torneio primeiro"} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTournament?.teams?.map((team) => (
                      <SelectItem key={team.id} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="team2">Equipe 2 *</Label>
                <Select 
                  value={selectedTeam2} 
                  onValueChange={setSelectedTeam2}
                  disabled={!selectedTournament}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedTournament ? "Selecione a segunda equipe" : "Selecione um torneio primeiro"} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTournament?.teams?.filter(team => team.name !== selectedTeam1).map((team) => (
                      <SelectItem key={team.id} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Horário *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Local *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Ex: Centro Esportivo Municipal"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="stadium">Estádio *</Label>
                <Input
                  id="stadium"
                  value={formData.stadium}
                  onChange={(e) => handleInputChange("stadium", e.target.value)}
                  placeholder="Ex: Estádio Municipal"
                />
              </div>
            </div>
          </div>

          {/* Tipos de Ingressos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tipos de Ingressos</h3>
            
            {/* Tipos Pré-definidos */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Tipos Pré-definidos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {predefinedTicketTypes.map((ticketType) => (
                  <div key={ticketType.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <input
                      type="checkbox"
                      id={ticketType.id}
                      checked={selectedTicketTypes.includes(ticketType.id)}
                      onChange={(e) => handleTicketTypeSelection(ticketType.id, e.target.checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor={ticketType.id} className="font-medium cursor-pointer">
                        {ticketType.name}
                      </label>
                      <p className="text-sm text-muted-foreground">{ticketType.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-green-600">
                          R$ {ticketType.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • Máx: {ticketType.maxQuantity}
                        </span>
                        {ticketType.isSmartBand && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            Pulseira Smart
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tipos Customizados */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm text-muted-foreground">Tipos Customizados</h4>
                <Button onClick={addCustomTicketType} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Tipo Customizado
                </Button>
              </div>

            {customTicketTypes.map((ticket, index) => (
              <div key={ticket.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Tipo de Ingresso {index + 1}</h4>
                  {customTicketTypes.length > 0 && (
                    <Button 
                      onClick={() => removeCustomTicketType(index)} 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Nome do Ingresso *</Label>
                    <Input
                      value={ticket.name}
                      onChange={(e) => updateCustomTicketType(index, "name", e.target.value)}
                      placeholder="Ex: VIP, Arquibancada, Camarote"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Preço (R$) *</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={ticket.price}
                      onChange={(e) => updateCustomTicketType(index, "price", parseFloat(e.target.value) || 0)}
                      placeholder="25.00"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={ticket.description}
                    onChange={(e) => updateCustomTicketType(index, "description", e.target.value)}
                    placeholder="Descrição do que está incluído no ingresso"
                    rows={2}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Quantidade Máxima *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={ticket.maxQuantity}
                    onChange={(e) => updateCustomTicketType(index, "maxQuantity", parseInt(e.target.value) || 1)}
                    placeholder="100"
                  />
                </div>
              </div>
            ))}

            {customTicketTypes.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum tipo customizado adicionado
              </p>
            )}
          </div>
        </div>
      </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar Jogo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

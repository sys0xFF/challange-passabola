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
import { Switch } from "@/components/ui/switch"
import { Plus, Loader2 } from "lucide-react"
import { saveTournament } from "@/lib/database-service"
import { toast } from "sonner"

interface TournamentCreateModalProps {
  onTournamentCreated: () => void
}

export function TournamentCreateModal({ onTournamentCreated }: TournamentCreateModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    maxTeams: "",
    isCopaPassaBola: false,
    startDate: "",
    endDate: "",
    registrationStart: "",
    registrationEnd: "",
    isPaid: false,
    entryFee: "",
    description: "",
    status: "draft" as const
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      // Validações básicas
      if (!formData.name.trim()) {
        toast.error("Nome do torneio é obrigatório")
        return
      }

      const maxTeams = parseInt(formData.maxTeams)
      
      if (!formData.maxTeams || maxTeams < 2) {
        toast.error("Quantidade mínima de equipes é 2")
        return
      }

      if (maxTeams > 16) {
        toast.error("Sistema suporta no máximo 16 equipes")
        return
      }

      if (maxTeams % 2 !== 0) {
        toast.error("O número de equipes deve ser PAR para permitir chaveamento adequado")
        return
      }

      if (!formData.startDate || !formData.endDate) {
        toast.error("Datas de início e término são obrigatórias")
        return
      }

      if (!formData.registrationStart || !formData.registrationEnd) {
        toast.error("Datas de inscrição são obrigatórias")
        return
      }

      if (formData.isPaid && (!formData.entryFee || parseFloat(formData.entryFee) <= 0)) {
        toast.error("Valor da inscrição é obrigatório para torneios pagos")
        return
      }

      setLoading(true)

      const tournamentData = {
        name: formData.name,
        maxTeams: parseInt(formData.maxTeams),
        isCopaPassaBola: formData.isCopaPassaBola,
        startDate: formData.startDate,
        endDate: formData.endDate,
        registrationStart: formData.registrationStart,
        registrationEnd: formData.registrationEnd,
        isPaid: formData.isPaid,
        ...(formData.isPaid && { entryFee: parseFloat(formData.entryFee) }),
        description: formData.description,
        status: formData.status,
        createdBy: 'admin' // Em uma implementação real, pegar do contexto de autenticação
      }

      const result = await saveTournament(tournamentData)

      if (result.success) {
        toast.success("Torneio criado com sucesso!")
        setOpen(false)
        setFormData({
          name: "",
          maxTeams: "",
          isCopaPassaBola: false,
          startDate: "",
          endDate: "",
          registrationStart: "",
          registrationEnd: "",
          isPaid: false,
          entryFee: "",
          description: "",
          status: "draft"
        })
        onTournamentCreated()
      } else {
        toast.error("Erro ao criar torneio. Tente novamente.")
      }
    } catch (error) {
      console.error("Error creating tournament:", error)
      toast.error("Erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Criar Novo Torneio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Torneio</DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo torneio/jogo
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Torneio *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ex: Copa Passa Bola 2025"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="maxTeams">Quantidade de Equipes *</Label>
              <Input
                id="maxTeams"
                type="number"
                min="2"
                max="16"
                step="2"
                value={formData.maxTeams}
                onChange={(e) => handleInputChange("maxTeams", e.target.value)}
                placeholder="8"
                className={
                  formData.maxTeams && (parseInt(formData.maxTeams) % 2 !== 0 || parseInt(formData.maxTeams) > 16)
                    ? "border-red-500 focus:border-red-500" 
                    : ""
                }
              />
              {formData.maxTeams && parseInt(formData.maxTeams) % 2 !== 0 && (
                <p className="text-sm text-red-500">
                  ⚠️ O número deve ser PAR para permitir chaveamento
                </p>
              )}
              {formData.maxTeams && parseInt(formData.maxTeams) > 16 && (
                <p className="text-sm text-red-500">
                  ⚠️ Sistema suporta no máximo 16 equipes
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Suporta: 2, 4, 6, 8, 10, 12, 14, 16 equipes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Data de Início *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endDate">Data de Término *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="registrationStart">Início das Inscrições *</Label>
              <Input
                id="registrationStart"
                type="date"
                value={formData.registrationStart}
                onChange={(e) => handleInputChange("registrationStart", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="registrationEnd">Término das Inscrições *</Label>
              <Input
                id="registrationEnd"
                type="date"
                value={formData.registrationEnd}
                onChange={(e) => handleInputChange("registrationEnd", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isCopaPassaBola"
              checked={formData.isCopaPassaBola}
              onCheckedChange={(checked) => handleInputChange("isCopaPassaBola", checked)}
            />
            <Label htmlFor="isCopaPassaBola">É a Copa Passa Bola oficial</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPaid"
              checked={formData.isPaid}
              onCheckedChange={(checked) => handleInputChange("isPaid", checked)}
            />
            <Label htmlFor="isPaid">Torneio pago</Label>
          </div>

          {formData.isPaid && (
            <div className="grid gap-2">
              <Label htmlFor="entryFee">Valor da Inscrição (R$) *</Label>
              <Input
                id="entryFee"
                type="number"
                min="0"
                step="0.01"
                value={formData.entryFee}
                onChange={(e) => handleInputChange("entryFee", e.target.value)}
                placeholder="50.00"
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Informações adicionais sobre o torneio..."
              rows={3}
            />
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
              "Criar Torneio"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

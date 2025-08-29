"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TeamRegistration, IndividualRegistration, VolunteerRegistration, DonationData, PurchaseData } from "@/lib/database-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Eye, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  User, 
  Trophy, 
  Heart,
  ShoppingBag,
  CreditCard,
  DollarSign
} from "lucide-react"

interface DetailModalProps {
  trigger: React.ReactNode
  title: string
  data: any
  type: 'team' | 'individual' | 'volunteer' | 'donation' | 'purchase'
}

export function DetailModal({ trigger, title, data, type }: DetailModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const renderTeamDetails = (team: TeamRegistration & { id: string }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Informações da Equipe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome da Equipe</p>
              <p className="text-lg font-bold">{team.teamData.nomeTime}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome do Capitão</p>
              <p>{team.teamData.nomeCapitao}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data de Registro</p>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(team.registrationDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados do Capitão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
              <p>{team.captainData.nomeCompleto}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Idade</p>
                <p>{team.captainData.idade} anos</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Posição</p>
                <p>{team.captainData.posicao}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{team.captainData.email}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Telefone</p>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{team.captainData.telefone}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cidade/Bairro</p>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{team.captainData.cidadeBairro}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Já Participou</p>
              <p>{team.captainData.jaParticipou}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Jogadoras da Equipe ({team.players.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.players.map((player, index) => (
              <Card key={player.id} className="bg-gray-50 dark:bg-slate-800">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{player.nomeCompleto}</p>
                      <Badge variant="outline">#{player.id}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <span>{player.idade} anos</span>
                      <span>{player.posicao}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{player.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{player.telefone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{player.cidadeBairro}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Aceita termos:</span>
            <Badge variant={team.preferences.acceptTerms ? "default" : "secondary"}>
              {team.preferences.acceptTerms ? "Sim" : "Não"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Quer notificações:</span>
            <Badge variant={team.preferences.wantNotifications ? "default" : "secondary"}>
              {team.preferences.wantNotifications ? "Sim" : "Não"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderIndividualDetails = (individual: IndividualRegistration & { id: string }) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Dados da Jogadora
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
            <p className="text-lg font-bold">{individual.captainData.nomeCompleto}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Idade</p>
              <p>{individual.captainData.idade} anos</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Posição</p>
              <p>{individual.captainData.posicao}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{individual.captainData.email}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Telefone</p>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{individual.captainData.telefone}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Cidade/Bairro</p>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{individual.captainData.cidadeBairro}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Já Participou</p>
            <p>{individual.captainData.jaParticipou}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Data de Registro</p>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(individual.registrationDate)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Aceita termos:</span>
            <Badge variant={individual.preferences.acceptTerms ? "default" : "secondary"}>
              {individual.preferences.acceptTerms ? "Sim" : "Não"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Quer notificações:</span>
            <Badge variant={individual.preferences.wantNotifications ? "default" : "secondary"}>
              {individual.preferences.wantNotifications ? "Sim" : "Não"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderVolunteerDetails = (volunteer: VolunteerRegistration & { id: string }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
              <p className="font-bold">{volunteer.formData.nomeCompleto}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Idade</p>
                <p>{volunteer.formData.idade} anos</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profissão</p>
                <p>{volunteer.formData.profissao}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{volunteer.formData.email}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Telefone</p>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{volunteer.formData.telefone}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cidade/Bairro</p>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{volunteer.formData.cidadeBairro}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Áreas de Interesse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {volunteer.selectedAreas.map((area) => (
                <Badge key={area} className="bg-[#8e44ad] text-white">
                  {area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Disponibilidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Dias da Semana</p>
            <div className="flex flex-wrap gap-2">
              {volunteer.formData.disponibilidadeDias.map((dia) => (
                <Badge key={dia} variant="outline">{dia}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Horários</p>
            <div className="flex flex-wrap gap-2">
              {volunteer.formData.disponibilidadeHorarios.map((horario) => (
                <Badge key={horario} variant="outline">{horario}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tem Transporte Próprio</p>
            <Badge variant={volunteer.formData.temTransporte === "sim" ? "default" : "secondary"}>
              {volunteer.formData.temTransporte}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {volunteer.formData.motivacao && (
        <Card>
          <CardHeader>
            <CardTitle>Motivação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{volunteer.formData.motivacao}</p>
          </CardContent>
        </Card>
      )}

      {volunteer.formData.experienciaAnterior && (
        <Card>
          <CardHeader>
            <CardTitle>Experiência Anterior</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{volunteer.formData.experienciaAnterior}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderDonationDetails = (donation: DonationData & { id: string }) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Informações da Doação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo</p>
              <Badge variant={donation.donationType === 'identified' ? 'default' : 'secondary'}>
                {donation.donationType === 'identified' ? 'Identificada' : 'Anônima'}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Valor</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(donation.amount)}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Método de Pagamento</p>
            <div className="flex items-center gap-1">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>{donation.paymentMethod.toUpperCase()}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Data da Doação</p>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(donation.donationDate)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {donation.donationType === 'identified' && donation.donorData && (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Doador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
              <p className="font-bold">{donation.donorData.nomeCompleto}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{donation.donorData.email}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{donation.donorData.telefone}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">CPF</p>
                <p>{donation.donorData.cpf}</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span>Receber recibo:</span>
                <Badge variant={donation.donorData.receberRecibo ? "default" : "secondary"}>
                  {donation.donorData.receberRecibo ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span>Receber notícias:</span>
                <Badge variant={donation.donorData.receberNoticias ? "default" : "secondary"}>
                  {donation.donorData.receberNoticias ? "Sim" : "Não"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderPurchaseDetails = (purchase: PurchaseData & { id: string }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Informações do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número do Pedido</p>
              <p className="font-mono text-lg">#{purchase.orderId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(purchase.pricing.total)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subtotal</p>
                <p>{formatCurrency(purchase.pricing.subtotal)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Frete</p>
                <p>{formatCurrency(purchase.pricing.shipping)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Método de Pagamento</p>
              <div className="flex items-center gap-1">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>{purchase.paymentMethod.toUpperCase()}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data da Compra</p>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(purchase.purchaseDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
              <p className="font-bold">{purchase.customerData.nomeCompleto}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{purchase.customerData.email}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{purchase.customerData.telefone}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">CPF</p>
                <p>{purchase.customerData.cpf}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Endereço</p>
              <div className="text-sm">
                <p>{purchase.customerData.endereco}, {purchase.customerData.numero}</p>
                {purchase.customerData.complemento && <p>{purchase.customerData.complemento}</p>}
                <p>{purchase.customerData.bairro} - {purchase.customerData.cidade}/{purchase.customerData.estado}</p>
                <p>CEP: {purchase.customerData.cep}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Itens do Pedido ({purchase.items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {purchase.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Qtd: {item.quantity}</span>
                      {item.selectedSize && <Badge variant="outline">{item.selectedSize}</Badge>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(item.price)}</p>
                  <p className="text-sm text-muted-foreground">cada</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          {type === 'team' && renderTeamDetails(data)}
          {type === 'individual' && renderIndividualDetails(data)}
          {type === 'volunteer' && renderVolunteerDetails(data)}
          {type === 'donation' && renderDonationDetails(data)}
          {type === 'purchase' && renderPurchaseDetails(data)}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

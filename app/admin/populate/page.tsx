"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Bebas_Neue } from "next/font/google"
import Image from "next/image"
import { 
  Database,
  Users, 
  Trophy, 
  Heart, 
  ShoppingBag,
  UserCheck,
  Loader2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { 
  saveTeamRegistration,
  saveIndividualRegistration,
  saveVolunteerRegistration,
  saveDonation,
  savePurchase,
  saveTournament
} from "@/lib/database-service"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

export default function PopulatePage() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({
    teams: 'idle',
    individuals: 'idle',
    volunteers: 'idle',
    donations: 'idle',
    purchases: 'idle',
    tournaments: 'idle'
  })

  const updateProgress = (key: string, status: 'idle' | 'loading' | 'success' | 'error') => {
    setProgress(prev => ({ ...prev, [key]: status }))
  }

  const generateTeamsData = async () => {
    updateProgress('teams', 'loading')
    
    const teamsData = [
      {
        teamData: { nomeTime: "Amazonas FC", nomeCapitao: "Marina Silva" },
        captainData: {
          nomeCompleto: "Marina Silva Santos",
          idade: "28",
          email: "marina.silva@email.com",
          telefone: "(11) 99876-5432",
          cidadeBairro: "Vila Madalena, São Paulo",
          posicao: "Meio-campo",
          jaParticipou: "Sim"
        },
        players: [
          {
            id: 1,
            nomeCompleto: "Ana Carolina Souza",
            idade: "24",
            email: "ana.souza@email.com",
            telefone: "(11) 98765-4321",
            cidadeBairro: "Pinheiros, São Paulo",
            posicao: "Goleira",
            jaParticipou: "Não"
          },
          {
            id: 2,
            nomeCompleto: "Beatriz Lima Costa",
            idade: "26",
            email: "beatriz.lima@email.com",
            telefone: "(11) 97654-3210",
            cidadeBairro: "Itaim Bibi, São Paulo",
            posicao: "Zagueira",
            jaParticipou: "Sim"
          },
          {
            id: 3,
            nomeCompleto: "Carla Fernanda Oliveira",
            idade: "25",
            email: "carla.oliveira@email.com",
            telefone: "(11) 96543-2109",
            cidadeBairro: "Vila Olímpia, São Paulo",
            posicao: "Lateral",
            jaParticipou: "Não"
          },
          {
            id: 4,
            nomeCompleto: "Daniela Santos Pereira",
            idade: "29",
            email: "daniela.pereira@email.com",
            telefone: "(11) 95432-1098",
            cidadeBairro: "Mooca, São Paulo",
            posicao: "Meio-campo",
            jaParticipou: "Sim"
          },
          {
            id: 5,
            nomeCompleto: "Eduarda Mendes Silva",
            idade: "23",
            email: "eduarda.silva@email.com",
            telefone: "(11) 94321-0987",
            cidadeBairro: "Tatuapé, São Paulo",
            posicao: "Atacante",
            jaParticipou: "Não"
          },
          {
            id: 6,
            nomeCompleto: "Fernanda Costa Rodrigues",
            idade: "27",
            email: "fernanda.rodrigues@email.com",
            telefone: "(11) 93210-9876",
            cidadeBairro: "Santana, São Paulo",
            posicao: "Atacante",
            jaParticipou: "Sim"
          }
        ],
        preferences: { acceptTerms: true, wantNotifications: true },
        type: "team" as const
      },
      {
        teamData: { nomeTime: "Panteras Douradas", nomeCapitao: "Julia Martins" },
        captainData: {
          nomeCompleto: "Julia Martins Ferreira",
          idade: "30",
          email: "julia.martins@email.com",
          telefone: "(11) 99123-4567",
          cidadeBairro: "Liberdade, São Paulo",
          posicao: "Zagueira",
          jaParticipou: "Sim"
        },
        players: [
          {
            id: 1,
            nomeCompleto: "Gabriela Ramos Silva",
            idade: "22",
            email: "gabriela.ramos@email.com",
            telefone: "(11) 98123-4567",
            cidadeBairro: "Bela Vista, São Paulo",
            posicao: "Goleira",
            jaParticipou: "Não"
          },
          {
            id: 2,
            nomeCompleto: "Helena Castro Oliveira",
            idade: "25",
            email: "helena.castro@email.com",
            telefone: "(11) 97123-4567",
            cidadeBairro: "República, São Paulo",
            posicao: "Lateral",
            jaParticipou: "Sim"
          },
          {
            id: 3,
            nomeCompleto: "Isabel Rodrigues Santos",
            idade: "28",
            email: "isabel.santos@email.com",
            telefone: "(11) 96123-4567",
            cidadeBairro: "Consolação, São Paulo",
            posicao: "Zagueira",
            jaParticipou: "Não"
          },
          {
            id: 4,
            nomeCompleto: "Joana Pereira Lima",
            idade: "24",
            email: "joana.lima@email.com",
            telefone: "(11) 95123-4567",
            cidadeBairro: "Higienópolis, São Paulo",
            posicao: "Meio-campo",
            jaParticipou: "Sim"
          },
          {
            id: 5,
            nomeCompleto: "Karen Almeida Costa",
            idade: "26",
            email: "karen.costa@email.com",
            telefone: "(11) 94123-4567",
            cidadeBairro: "Santa Cecília, São Paulo",
            posicao: "Atacante",
            jaParticipou: "Não"
          },
          {
            id: 6,
            nomeCompleto: "Laura Oliveira Souza",
            idade: "27",
            email: "laura.souza@email.com",
            telefone: "(11) 93123-4567",
            cidadeBairro: "Campos Elíseos, São Paulo",
            posicao: "Meio-campo",
            jaParticipou: "Sim"
          }
        ],
        preferences: { acceptTerms: true, wantNotifications: true },
        type: "team" as const
      },
      {
        teamData: { nomeTime: "Tigres de Aço", nomeCapitao: "Renata Alves" },
        captainData: {
          nomeCompleto: "Renata Alves Pereira",
          idade: "32",
          email: "renata.alves@email.com",
          telefone: "(11) 99234-5678",
          cidadeBairro: "Brooklin, São Paulo",
          posicao: "Goleira",
          jaParticipou: "Sim"
        },
        players: [
          {
            id: 1,
            nomeCompleto: "Mariana Santos Cruz",
            idade: "21",
            email: "mariana.cruz@email.com",
            telefone: "(11) 98234-5678",
            cidadeBairro: "Campo Belo, São Paulo",
            posicao: "Zagueira",
            jaParticipou: "Não"
          },
          {
            id: 2,
            nomeCompleto: "Natalia Costa Ferreira",
            idade: "23",
            email: "natalia.ferreira@email.com",
            telefone: "(11) 97234-5678",
            cidadeBairro: "Saúde, São Paulo",
            posicao: "Lateral",
            jaParticipou: "Sim"
          },
          {
            id: 3,
            nomeCompleto: "Olivia Rodrigues Lima",
            idade: "25",
            email: "olivia.lima@email.com",
            telefone: "(11) 96234-5678",
            cidadeBairro: "Vila Mariana, São Paulo",
            posicao: "Meio-campo",
            jaParticipou: "Não"
          },
          {
            id: 4,
            nomeCompleto: "Patricia Silva Santos",
            idade: "29",
            email: "patricia.santos@email.com",
            telefone: "(11) 95234-5678",
            cidadeBairro: "Ipiranga, São Paulo",
            posicao: "Meio-campo",
            jaParticipou: "Sim"
          },
          {
            id: 5,
            nomeCompleto: "Quezia Oliveira Costa",
            idade: "24",
            email: "quezia.costa@email.com",
            telefone: "(11) 94234-5678",
            cidadeBairro: "Cursino, São Paulo",
            posicao: "Atacante",
            jaParticipou: "Não"
          },
          {
            id: 6,
            nomeCompleto: "Rosa Maria Pereira",
            idade: "31",
            email: "rosa.pereira@email.com",
            telefone: "(11) 93234-5678",
            cidadeBairro: "Jabaquara, São Paulo",
            posicao: "Atacante",
            jaParticipou: "Sim"
          }
        ],
        preferences: { acceptTerms: true, wantNotifications: true },
        type: "team" as const
      }
    ]

    try {
      for (const team of teamsData) {
        await saveTeamRegistration(team)
        await new Promise(resolve => setTimeout(resolve, 500)) // Delay para não sobrecarregar
      }
      updateProgress('teams', 'success')
      toast.success(`${teamsData.length} equipes criadas com sucesso!`)
    } catch (error) {
      updateProgress('teams', 'error')
      toast.error("Erro ao criar equipes")
      console.error(error)
    }
  }

  const generateIndividualsData = async () => {
    updateProgress('individuals', 'loading')
    
    const individualsData = [
      {
        captainData: {
          nomeCompleto: "Sofia Almeida Castro",
          idade: "26",
          email: "sofia.castro@email.com",
          telefone: "(11) 99345-6789",
          cidadeBairro: "Perdizes, São Paulo",
          posicao: "Goleira",
          jaParticipou: "Não"
        },
        preferences: { acceptTerms: true, wantNotifications: true },
        type: "individual" as const
      },
      {
        captainData: {
          nomeCompleto: "Tatiana Ferreira Souza",
          idade: "24",
          email: "tatiana.souza@email.com",
          telefone: "(11) 99456-7890",
          cidadeBairro: "Pompeia, São Paulo",
          posicao: "Zagueira",
          jaParticipou: "Sim"
        },
        preferences: { acceptTerms: true, wantNotifications: false },
        type: "individual" as const
      },
      {
        captainData: {
          nomeCompleto: "Ursula Santos Lima",
          idade: "28",
          email: "ursula.lima@email.com",
          telefone: "(11) 99567-8901",
          cidadeBairro: "Lapa, São Paulo",
          posicao: "Meio-campo",
          jaParticipou: "Não"
        },
        preferences: { acceptTerms: true, wantNotifications: true },
        type: "individual" as const
      },
      {
        captainData: {
          nomeCompleto: "Vitoria Costa Oliveira",
          idade: "22",
          email: "vitoria.oliveira@email.com",
          telefone: "(11) 99678-9012",
          cidadeBairro: "Barra Funda, São Paulo",
          posicao: "Atacante",
          jaParticipou: "Sim"
        },
        preferences: { acceptTerms: true, wantNotifications: true },
        type: "individual" as const
      },
      {
        captainData: {
          nomeCompleto: "Wanda Silva Pereira",
          idade: "30",
          email: "wanda.pereira@email.com",
          telefone: "(11) 99789-0123",
          cidadeBairro: "Água Branca, São Paulo",
          posicao: "Lateral",
          jaParticipou: "Não"
        },
        preferences: { acceptTerms: true, wantNotifications: false },
        type: "individual" as const
      },
      {
        captainData: {
          nomeCompleto: "Ximena Rodriguez Santos",
          idade: "25",
          email: "ximena.santos@email.com",
          telefone: "(11) 99890-1234",
          cidadeBairro: "Alto da Lapa, São Paulo",
          posicao: "Meio-campo",
          jaParticipou: "Sim"
        },
        preferences: { acceptTerms: true, wantNotifications: true },
        type: "individual" as const
      },
      {
        captainData: {
          nomeCompleto: "Yasmin Oliveira Costa",
          idade: "27",
          email: "yasmin.costa@email.com",
          telefone: "(11) 99901-2345",
          cidadeBairro: "Vila Leopoldina, São Paulo",
          posicao: "Goleira",
          jaParticipou: "Não"
        },
        preferences: { acceptTerms: true, wantNotifications: true },
        type: "individual" as const
      },
      {
        captainData: {
          nomeCompleto: "Zara Santos Ferreira",
          idade: "29",
          email: "zara.ferreira@email.com",
          telefone: "(11) 99012-3456",
          cidadeBairro: "Jaguaré, São Paulo",
          posicao: "Atacante",
          jaParticipou: "Sim"
        },
        preferences: { acceptTerms: true, wantNotifications: false },
        type: "individual" as const
      }
    ]

    try {
      for (const individual of individualsData) {
        await saveIndividualRegistration(individual)
        await new Promise(resolve => setTimeout(resolve, 300))
      }
      updateProgress('individuals', 'success')
      toast.success(`${individualsData.length} jogadoras individuais criadas com sucesso!`)
    } catch (error) {
      updateProgress('individuals', 'error')
      toast.error("Erro ao criar jogadoras individuais")
      console.error(error)
    }
  }

  const generateVolunteersData = async () => {
    updateProgress('volunteers', 'loading')
    
    const volunteersData = [
      {
        formData: {
          nomeCompleto: "Amanda Silva Santos",
          idade: "35",
          email: "amanda.santos@email.com",
          telefone: "(11) 99111-2222",
          cidadeBairro: "Jardins, São Paulo",
          profissao: "Enfermeira",
          experienciaAnterior: "Trabalho voluntário em hospitais",
          motivacao: "Amor pelo esporte feminino",
          disponibilidadeDias: ["Sábado", "Domingo"],
          disponibilidadeHorarios: ["Manhã", "Tarde"],
          temTransporte: "Sim",
          referencias: "Hospital São Camilo",
          antecedentes: "Não",
          observacoes: "Disponível para primeiros socorros"
        },
        selectedAreas: ["Atendimento Médico", "Organização"],
        preferences: { acceptTerms: true, wantNotifications: true },
        type: "volunteer" as const
      },
      {
        formData: {
          nomeCompleto: "Bruna Costa Lima",
          idade: "28",
          email: "bruna.lima@email.com",
          telefone: "(11) 99222-3333",
          cidadeBairro: "Moema, São Paulo",
          profissao: "Designer Gráfica",
          experienciaAnterior: "Design para ONGs",
          motivacao: "Apoiar o futebol feminino",
          disponibilidadeDias: ["Sexta-feira", "Sábado"],
          disponibilidadeHorarios: ["Tarde", "Noite"],
          temTransporte: "Sim",
          referencias: "Estúdio Creative",
          antecedentes: "Não",
          observacoes: "Posso ajudar com material gráfico"
        },
        selectedAreas: ["Marketing", "Mídia Social"],
        preferences: { acceptTerms: true, wantNotifications: true },
        type: "volunteer" as const
      },
      {
        formData: {
          nomeCompleto: "Cristina Rodrigues Oliveira",
          idade: "42",
          email: "cristina.oliveira@email.com",
          telefone: "(11) 99333-4444",
          cidadeBairro: "Vila Nova Conceição, São Paulo",
          profissao: "Administradora",
          experienciaAnterior: "Gestão de eventos esportivos",
          motivacao: "Experiência em organização",
          disponibilidadeDias: ["Sábado", "Domingo"],
          disponibilidadeHorarios: ["Manhã", "Tarde", "Noite"],
          temTransporte: "Sim",
          referencias: "Clube Atlético Paulistano",
          antecedentes: "Não",
          observacoes: "Experiência em coordenação"
        },
        selectedAreas: ["Organização", "Logística"],
        preferences: { acceptTerms: true, wantNotifications: false },
        type: "volunteer" as const
      }
    ]

    try {
      for (const volunteer of volunteersData) {
        await saveVolunteerRegistration(volunteer)
        await new Promise(resolve => setTimeout(resolve, 300))
      }
      updateProgress('volunteers', 'success')
      toast.success(`${volunteersData.length} voluntárias criadas com sucesso!`)
    } catch (error) {
      updateProgress('volunteers', 'error')
      toast.error("Erro ao criar voluntárias")
      console.error(error)
    }
  }

  const generateDonationsData = async () => {
    updateProgress('donations', 'loading')
    
    const donationsData = [
      {
        donationType: "identified" as const,
        amount: 100.00,
        paymentMethod: "pix" as const,
        donorData: {
          nomeCompleto: "Carlos Eduardo Silva",
          email: "carlos.silva@email.com",
          telefone: "(11) 99444-5555",
          cpf: "123.456.789-01",
          receberRecibo: true,
          receberNoticias: true
        },
        type: "donation" as const
      },
      {
        donationType: "anonymous" as const,
        amount: 50.00,
        paymentMethod: "card" as const,
        type: "donation" as const
      },
      {
        donationType: "identified" as const,
        amount: 200.00,
        paymentMethod: "pix" as const,
        donorData: {
          nomeCompleto: "Maria Fernanda Costa",
          email: "maria.costa@email.com",
          telefone: "(11) 99555-6666",
          cpf: "987.654.321-00",
          receberRecibo: true,
          receberNoticias: false
        },
        type: "donation" as const
      },
      {
        donationType: "anonymous" as const,
        amount: 25.00,
        paymentMethod: "pix" as const,
        type: "donation" as const
      },
      {
        donationType: "identified" as const,
        amount: 150.00,
        paymentMethod: "card" as const,
        donorData: {
          nomeCompleto: "Roberto Santos Lima",
          email: "roberto.lima@email.com",
          telefone: "(11) 99666-7777",
          cpf: "456.789.123-45",
          receberRecibo: false,
          receberNoticias: true
        },
        cardData: {
          numero: "4111 1111 1111 1111",
          nome: "Roberto Santos Lima",
          validade: "12/2026",
          cvv: "123"
        },
        type: "donation" as const
      }
    ]

    try {
      for (const donation of donationsData) {
        await saveDonation(donation)
        await new Promise(resolve => setTimeout(resolve, 300))
      }
      updateProgress('donations', 'success')
      toast.success(`${donationsData.length} doações criadas com sucesso!`)
    } catch (error) {
      updateProgress('donations', 'error')
      toast.error("Erro ao criar doações")
      console.error(error)
    }
  }

  const generatePurchasesData = async () => {
    updateProgress('purchases', 'loading')
    
    const purchasesData = [
      {
        customerData: {
          nomeCompleto: "Ana Paula Rodrigues",
          email: "ana.rodrigues@email.com",
          telefone: "(11) 99777-8888",
          cpf: "111.222.333-44",
          cep: "01310-100",
          endereco: "Av. Paulista",
          numero: "1500",
          complemento: "Apto 120",
          bairro: "Bela Vista",
          cidade: "São Paulo",
          estado: "SP",
          receberNoticias: true
        },
        items: [
          {
            id: "camisa-oficial",
            name: "Camisa Oficial Copa Passa Bola",
            price: 89.90,
            quantity: 2,
            selectedSize: "M"
          },
          {
            id: "caneca",
            name: "Caneca Copa Passa Bola",
            price: 25.00,
            quantity: 1
          }
        ],
        paymentMethod: "pix" as const,
        pricing: {
          subtotal: 204.80,
          shipping: 15.00,
          total: 219.80
        },
        type: "purchase" as const
      },
      {
        customerData: {
          nomeCompleto: "Beatriz Santos Silva",
          email: "beatriz.silva@email.com",
          telefone: "(11) 99888-9999",
          cpf: "555.666.777-88",
          cep: "04038-001",
          endereco: "Rua Domingos de Morais",
          numero: "2781",
          complemento: "",
          bairro: "Vila Mariana",
          cidade: "São Paulo",
          estado: "SP",
          receberNoticias: false
        },
        items: [
          {
            id: "bone",
            name: "Boné Copa Passa Bola",
            price: 45.00,
            quantity: 1
          },
          {
            id: "sacola",
            name: "Sacola Ecológica",
            price: 20.00,
            quantity: 3
          }
        ],
        paymentMethod: "card" as const,
        cardData: {
          numero: "5555 5555 5555 4444",
          nome: "Beatriz Santos Silva",
          validade: "08/2027",
          cvv: "321"
        },
        pricing: {
          subtotal: 105.00,
          shipping: 12.00,
          total: 117.00
        },
        type: "purchase" as const
      }
    ]

    try {
      for (const purchase of purchasesData) {
        await savePurchase(purchase)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      updateProgress('purchases', 'success')
      toast.success(`${purchasesData.length} compras criadas com sucesso!`)
    } catch (error) {
      updateProgress('purchases', 'error')
      toast.error("Erro ao criar compras")
      console.error(error)
    }
  }

  const generateTournamentsData = async () => {
    updateProgress('tournaments', 'loading')
    
    const tournamentsData = [
      {
        name: "Copa Passa Bola 2025",
        maxTeams: 16,
        isCopaPassaBola: true,
        startDate: "2025-10-15",
        endDate: "2025-10-17",
        registrationStart: "2025-09-01",
        registrationEnd: "2025-10-01",
        isPaid: false,
        location: "Centro Esportivo Municipal",
        gameTime: "08:00",
        description: "A principal competição feminina de futebol do ano! Venha participar da Copa Passa Bola 2025 e mostrar seu talento!",
        status: "registration-open" as const,
        createdBy: "admin"
      },
      {
        name: "Torneio de Verão",
        maxTeams: 8,
        isCopaPassaBola: false,
        startDate: "2025-12-20",
        endDate: "2025-12-22",
        registrationStart: "2025-11-15",
        registrationEnd: "2025-12-10",
        isPaid: true,
        entryFee: 50.00,
        location: "Complexo Esportivo da Vila",
        gameTime: "14:00",
        description: "Torneio de pré-temporada para aquecer os motores para 2026!",
        status: "draft" as const,
        createdBy: "admin"
      },
      {
        name: "Amistoso das Estrelas",
        maxTeams: 4,
        isCopaPassaBola: false,
        startDate: "2025-11-05",
        endDate: "2025-11-05",
        registrationStart: "2025-10-20",
        registrationEnd: "2025-11-01",
        isPaid: false,
        location: "Campo da Praça Central",
        gameTime: "16:00",
        description: "Jogo amistoso para promover o esporte feminino na comunidade.",
        status: "registration-closed" as const,
        createdBy: "admin"
      }
    ]

    try {
      for (const tournament of tournamentsData) {
        await saveTournament(tournament)
        await new Promise(resolve => setTimeout(resolve, 400))
      }
      updateProgress('tournaments', 'success')
      toast.success(`${tournamentsData.length} torneios criados com sucesso!`)
    } catch (error) {
      updateProgress('tournaments', 'error')
      toast.error("Erro ao criar torneios")
      console.error(error)
    }
  }

  const populateAll = async () => {
    setLoading(true)
    
    try {
      await generateTeamsData()
      await generateIndividualsData()
      await generateVolunteersData()
      await generateDonationsData()
      await generatePurchasesData()
      await generateTournamentsData()
      
      toast.success("🎉 Base de dados populada com sucesso!")
    } catch (error) {
      toast.error("Erro ao popular base de dados")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'loading':
        return 'Criando...'
      case 'success':
        return 'Concluído'
      case 'error':
        return 'Erro'
      default:
        return 'Pronto'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Dashboard
                </Button>
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8">
                  <Image src="/logo.png" alt="Passa Bola Logo" fill className="object-contain" />
                </div>
                <div>
                  <h1 className={`${bebasNeue.className} text-xl text-[#8e44ad] dark:text-primary tracking-wider`}>
                    POPULAR BASE DE DADOS
                  </h1>
                  <Badge className="bg-amber-500 text-white text-xs">DESENVOLVIMENTO</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Warning */}
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                    ⚠️ Ambiente de Desenvolvimento
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Esta página é destinada apenas para popular a base de dados com dados fictícios para testes e desenvolvimento. 
                    Use com cuidado em produção!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Popular Base de Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Equipes</span>
                        </div>
                        {getStatusIcon(progress.teams)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        3 equipes completas com jogadoras
                      </p>
                      <Button 
                        onClick={generateTeamsData} 
                        disabled={progress.teams === 'loading' || loading}
                        size="sm" 
                        className="w-full"
                      >
                        {getStatusText(progress.teams)}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 dark:bg-green-900/10 border-green-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Individuais</span>
                        </div>
                        {getStatusIcon(progress.individuals)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        8 jogadoras individuais
                      </p>
                      <Button 
                        onClick={generateIndividualsData} 
                        disabled={progress.individuals === 'loading' || loading}
                        size="sm" 
                        className="w-full"
                      >
                        {getStatusText(progress.individuals)}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 dark:bg-purple-900/10 border-purple-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">Voluntárias</span>
                        </div>
                        {getStatusIcon(progress.volunteers)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        3 voluntárias especializadas
                      </p>
                      <Button 
                        onClick={generateVolunteersData} 
                        disabled={progress.volunteers === 'loading' || loading}
                        size="sm" 
                        className="w-full"
                      >
                        {getStatusText(progress.volunteers)}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-pink-50 dark:bg-pink-900/10 border-pink-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-pink-600" />
                          <span className="font-medium">Doações</span>
                        </div>
                        {getStatusIcon(progress.donations)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        5 doações variadas (R$ 525,00)
                      </p>
                      <Button 
                        onClick={generateDonationsData} 
                        disabled={progress.donations === 'loading' || loading}
                        size="sm" 
                        className="w-full"
                      >
                        {getStatusText(progress.donations)}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-50 dark:bg-orange-900/10 border-orange-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-orange-600" />
                          <span className="font-medium">Compras</span>
                        </div>
                        {getStatusIcon(progress.purchases)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        2 pedidos da loja (R$ 336,80)
                      </p>
                      <Button 
                        onClick={generatePurchasesData} 
                        disabled={progress.purchases === 'loading' || loading}
                        size="sm" 
                        className="w-full"
                      >
                        {getStatusText(progress.purchases)}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-amber-600" />
                          <span className="font-medium">Torneios</span>
                        </div>
                        {getStatusIcon(progress.tournaments)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        3 torneios (incluindo Copa PB)
                      </p>
                      <Button 
                        onClick={generateTournamentsData} 
                        disabled={progress.tournaments === 'loading' || loading}
                        size="sm" 
                        className="w-full"
                      >
                        {getStatusText(progress.tournaments)}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div className="flex justify-center">
                  <Button 
                    onClick={populateAll} 
                    disabled={loading}
                    size="lg"
                    className="bg-[#8e44ad] hover:bg-[#7d3c98] text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Populando Base de Dados...
                      </>
                    ) : (
                      <>
                        <Database className="mr-2 h-4 w-4" />
                        Popular Tudo de Uma Vez
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

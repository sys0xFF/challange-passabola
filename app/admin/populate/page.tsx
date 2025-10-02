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
import { faker } from '@faker-js/faker'
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

  
  // Arrays para gerar nomes de times aleatórios
  const teamPrefixes = [
    'Águias', 'Leões', 'Tigres', 'Panteras', 'Falcões', 'Dragões', 'Lobos', 'Cobras',
    'Tubarões', 'Raios', 'Trovões', 'Meteoros', 'Cometas', 'Estrelas', 'Sóis', 'Luas',
    'Amazonas', 'Guerreiras', 'Valquírias', 'Spartanas', 'Gladiadoras', 'Vikingues', 
    'Piratas', 'Corsárias', 'Tempestades', 'Furacões', 'Ciclones', 'Tornados'
  ]
  
  const teamSuffixes = [
    'Douradas', 'Prateadas', 'de Ferro', 'de Aço', 'de Fogo', 'de Gelo', 'Negras',
    'Vermelhas', 'Azuis', 'Verdes', 'Roxas', 'Brancas', 'do Norte', 'do Sul',
    'do Leste', 'do Oeste', 'Invencíveis', 'Imortais', 'Selvagens', 'Ferozes',
    'Brilhantes', 'Radiantes', 'Místicas', 'Lendárias', 'Supremas', 'Divinas'
  ]

  const positions = ['Goleira', 'Zagueira', 'Lateral', 'Meio-campo', 'Atacante']
  const saoPauloNeighborhoods = [
    'Vila Madalena', 'Pinheiros', 'Itaim Bibi', 'Vila Olímpia', 'Mooca', 'Tatuapé',
    'Santana', 'Liberdade', 'Bela Vista', 'República', 'Consolação', 'Higienópolis',
    'Santa Cecília', 'Campos Elíseos', 'Brooklin', 'Campo Belo', 'Saúde', 'Vila Mariana',
    'Ipiranga', 'Cursino', 'Jabaquara', 'Morumbi', 'Butantã', 'Cidade Jardim',
    'Alto de Pinheiros', 'Jardim América', 'Vila Nova Conceição', 'Moema',
    'Jardim Paulista', 'Perdizes', 'Sumaré', 'Pompeia', 'Lapa', 'Barra Funda'
  ]

  const generateRandomTeamName = () => {
    const prefix = faker.helpers.arrayElement(teamPrefixes)
    const suffix = faker.helpers.arrayElement(teamSuffixes)
    return `${prefix} ${suffix}`
  }

  const generatePlayer = (id: number) => {
    const firstName = faker.person.firstName('female')
    const lastName = faker.person.lastName()
    return {
      id,
      nomeCompleto: `${firstName} ${lastName}`,
      idade: faker.number.int({ min: 18, max: 35 }).toString(),
      email: faker.internet.email().toLowerCase(),
      telefone: `(11) 9${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
      cidadeBairro: `${faker.helpers.arrayElement(saoPauloNeighborhoods)}, São Paulo`,
      posicao: faker.helpers.arrayElement(positions),
      jaParticipou: faker.helpers.arrayElement(['Sim', 'Não'])
    }
  }

  const generateTeam = () => {
    const captainName = faker.person.fullName({ sex: 'female' })
    const teamName = generateRandomTeamName()
    
    return {
      teamData: { 
        nomeTime: teamName, 
        nomeCapitao: captainName.split(' ').slice(0, 2).join(' ') 
      },
      captainData: {
        nomeCompleto: captainName,
        idade: faker.number.int({ min: 20, max: 35 }).toString(),
        email: faker.internet.email().toLowerCase(),
        telefone: `(11) 9${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
        cidadeBairro: `${faker.helpers.arrayElement(saoPauloNeighborhoods)}, São Paulo`,
        posicao: faker.helpers.arrayElement(positions),
        jaParticipou: faker.helpers.arrayElement(['Sim', 'Não'])
      },
      players: Array.from({ length: 6 }, (_, i) => generatePlayer(i + 1)),
      preferences: { 
        acceptTerms: true, 
        wantNotifications: faker.datatype.boolean() 
      },
      type: "team" as const
    }
  }

  const generateTeamsData = async () => {
    updateProgress('teams', 'loading')
    
    try {
      const numberOfTeams = 8 // Gerar 8 equipes
      const teamsData = Array.from({ length: numberOfTeams }, () => generateTeam())
      
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

  const generateIndividual = () => {
    return {
      captainData: {
        nomeCompleto: faker.person.fullName({ sex: 'female' }),
        idade: faker.number.int({ min: 18, max: 35 }).toString(),
        email: faker.internet.email().toLowerCase(),
        telefone: `(11) 9${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
        cidadeBairro: `${faker.helpers.arrayElement(saoPauloNeighborhoods)}, São Paulo`,
        posicao: faker.helpers.arrayElement(positions),
        jaParticipou: faker.helpers.arrayElement(['Sim', 'Não'])
      },
      preferences: { 
        acceptTerms: true, 
        wantNotifications: faker.datatype.boolean() 
      },
      type: "individual" as const
    }
  }

  const generateIndividualsData = async () => {
    updateProgress('individuals', 'loading')
    
    try {
      const numberOfIndividuals = 8 // Gerar 8 jogadoras individuais
      const individualsData = Array.from({ length: numberOfIndividuals }, () => generateIndividual())
      
      // Garantir que pelo menos 1 seja goleira
      individualsData[0].captainData.posicao = 'Goleira'
      
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

  const volunteerAreas = [
    'Atendimento Médico', 'Organização', 'Logística', 'Marketing', 'Mídia Social',
    'Segurança', 'Limpeza', 'Transporte', 'Alimentação', 'Recepção'
  ]
  
  const professions = [
    'Enfermeira', 'Médica', 'Designer', 'Administradora', 'Professora', 'Estudante',
    'Engenheira', 'Advogada', 'Psicóloga', 'Fisioterapeuta', 'Jornalista', 'Contador'
  ]
  
  const dias = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo']
  const horarios = ['Manhã', 'Tarde', 'Noite']

  const generateVolunteer = () => {
    const name = faker.person.fullName({ sex: 'female' })
    return {
      formData: {
        nomeCompleto: name,
        idade: faker.number.int({ min: 18, max: 60 }).toString(),
        email: faker.internet.email().toLowerCase(),
        telefone: `(11) 9${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
        cidadeBairro: `${faker.helpers.arrayElement(saoPauloNeighborhoods)}, São Paulo`,
        profissao: faker.helpers.arrayElement(professions),
        experienciaAnterior: faker.lorem.sentence(),
        motivacao: faker.lorem.sentence(),
        disponibilidadeDias: faker.helpers.arrayElements(dias, { min: 1, max: 3 }),
        disponibilidadeHorarios: faker.helpers.arrayElements(horarios, { min: 1, max: 2 }),
        temTransporte: faker.helpers.arrayElement(['Sim', 'Não']),
        referencias: faker.company.name(),
        antecedentes: 'Não',
        observacoes: faker.lorem.sentence()
      },
      selectedAreas: faker.helpers.arrayElements(volunteerAreas, { min: 1, max: 3 }),
      preferences: { 
        acceptTerms: true, 
        wantNotifications: faker.datatype.boolean() 
      },
      type: "volunteer" as const
    }
  }

  const generateVolunteersData = async () => {
    updateProgress('volunteers', 'loading')
    
    try {
      const numberOfVolunteers = 5 // Gerar 5 voluntárias
      const volunteersData = Array.from({ length: numberOfVolunteers }, () => generateVolunteer())
      
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

  const generateDonation = () => {
    const isAnonymous = faker.datatype.boolean()
    const paymentMethod = faker.helpers.arrayElement(['pix', 'card'])
    const amount = faker.number.float({ min: 25, max: 500, fractionDigits: 2 })
    
    const baseDonation = {
      donationType: isAnonymous ? "anonymous" as const : "identified" as const,
      amount,
      paymentMethod: paymentMethod as 'pix' | 'card',
      type: "donation" as const
    }

    if (!isAnonymous) {
      const name = faker.person.fullName()
      return {
        ...baseDonation,
        donorData: {
          nomeCompleto: name,
          email: faker.internet.email().toLowerCase(),
          telefone: `(11) 9${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
          cpf: faker.string.numeric(11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
          receberRecibo: faker.datatype.boolean(),
          receberNoticias: faker.datatype.boolean()
        },
        ...(paymentMethod === 'card' && {
          cardData: {
            numero: "4111 1111 1111 1111",
            nome: name,
            validade: "12/2026",
            cvv: "123"
          }
        })
      }
    }

    return baseDonation
  }

  const generateDonationsData = async () => {
    updateProgress('donations', 'loading')
    
    try {
      const numberOfDonations = 6 // Gerar 6 doações
      const donationsData = Array.from({ length: numberOfDonations }, () => generateDonation())
      
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

  const products = [
    { id: "camisa-oficial", name: "Camisa Oficial Copa Passa Bola", price: 89.90, hasSize: true },
    { id: "caneca", name: "Caneca Copa Passa Bola", price: 25.00, hasSize: false },
    { id: "bone", name: "Boné Copa Passa Bola", price: 45.00, hasSize: true },
    { id: "sacola", name: "Sacola Ecológica", price: 20.00, hasSize: false },
    { id: "chaveiro", name: "Chaveiro Copa Passa Bola", price: 15.00, hasSize: false },
    { id: "garrafa", name: "Garrafa Esportiva", price: 35.00, hasSize: false }
  ]

  const sizes = ['PP', 'P', 'M', 'G', 'GG']
  const saoPauloCEPs = ['01310-100', '04038-001', '05508-020', '01227-200', '04567-001']

  const generatePurchase = () => {
    const name = faker.person.fullName()
    const paymentMethod = faker.helpers.arrayElement(['pix', 'card'])
    const numberOfItems = faker.number.int({ min: 1, max: 3 })
    const selectedProducts = faker.helpers.arrayElements(products, numberOfItems)
    
    const items = selectedProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: faker.number.int({ min: 1, max: 2 }),
      ...(product.hasSize && { selectedSize: faker.helpers.arrayElement(sizes) })
    }))

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = faker.number.float({ min: 10, max: 20, fractionDigits: 2 })
    const total = subtotal + shipping

    return {
      customerData: {
        nomeCompleto: name,
        email: faker.internet.email().toLowerCase(),
        telefone: `(11) 9${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
        cpf: faker.string.numeric(11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
        cep: faker.helpers.arrayElement(saoPauloCEPs),
        endereco: faker.location.streetAddress(),
        numero: faker.location.buildingNumber(),
        complemento: faker.datatype.boolean() ? faker.location.secondaryAddress() : "",
        bairro: faker.helpers.arrayElement(saoPauloNeighborhoods),
        cidade: "São Paulo",
        estado: "SP",
        receberNoticias: faker.datatype.boolean()
      },
      items,
      paymentMethod: paymentMethod as 'pix' | 'card',
      ...(paymentMethod === 'card' && {
        cardData: {
          numero: faker.helpers.arrayElement(["4111 1111 1111 1111", "5555 5555 5555 4444"]),
          nome: name,
          validade: `${faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0')}/${faker.number.int({ min: 2025, max: 2030 })}`,
          cvv: faker.string.numeric(3)
        }
      }),
      pricing: {
        subtotal: Number(subtotal.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        total: Number(total.toFixed(2))
      },
      type: "purchase" as const
    }
  }

  const generatePurchasesData = async () => {
    updateProgress('purchases', 'loading')
    
    try {
      const numberOfPurchases = 4 // Gerar 4 compras
      const purchasesData = Array.from({ length: numberOfPurchases }, () => generatePurchase())
      
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

  const tournamentTypes = [
    "Copa", "Torneio", "Campeonato", "Liga", "Festival", "Taça", "Troféu", "Championship"
  ]
  
  const tournamentThemes = [
    "Feminino", "das Estrelas", "de Verão", "de Inverno", "Amistoso", "Regional", 
    "Municipal", "Jovem", "Veterano", "da Amizade", "da Paz", "Solidário"
  ]

  const locations = [
    "Centro Esportivo Municipal", "Complexo Esportivo da Vila", "Campo da Praça Central",
    "Estádio Municipal", "Arena Esportiva", "Campo do Parque", "Centro de Treinamento",
    "Quadra Poliesportiva"
  ]

  const gameTimes = ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00", "19:00", "20:00"]
  const tournamentStatuses = ["draft", "registration-open", "registration-closed", "ongoing", "completed"]

  const generateTournament = () => {
    const tournamentType = faker.helpers.arrayElement(tournamentTypes)
    const theme = faker.helpers.arrayElement(tournamentThemes)
    const name = `${tournamentType} ${theme} ${faker.date.future().getFullYear()}`
    
    const isCopaPassaBola = name.includes("Copa") && faker.datatype.boolean(0.3) // 30% chance
    const isPaid = faker.datatype.boolean(0.4) // 40% chance
    
    // Gerar datas futuras em sequência lógica
    const registrationStart = faker.date.between({ 
      from: new Date(), 
      to: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // próximos 60 dias
    })
    
    const registrationEnd = faker.date.between({ 
      from: registrationStart, 
      to: new Date(registrationStart.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 dias após início
    })
    
    const startDate = faker.date.between({ 
      from: registrationEnd, 
      to: new Date(registrationEnd.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 dias após fim inscrições
    })
    
    const tournamentDuration = faker.number.int({ min: 1, max: 5 }) // 1 a 5 dias
    const endDate = new Date(startDate.getTime() + tournamentDuration * 24 * 60 * 60 * 1000)

    return {
      name,
      maxTeams: faker.helpers.arrayElement([4, 8, 12, 16, 20]),
      isCopaPassaBola,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      registrationStart: registrationStart.toISOString().split('T')[0],
      registrationEnd: registrationEnd.toISOString().split('T')[0],
      isPaid,
      ...(isPaid && { entryFee: faker.number.float({ min: 25, max: 100, fractionDigits: 2 }) }),
      location: faker.helpers.arrayElement(locations),
      gameTime: faker.helpers.arrayElement(gameTimes),
      description: `${faker.lorem.sentence()} Venha participar e mostrar seu talento no futebol feminino!`,
      status: faker.helpers.arrayElement(tournamentStatuses) as any,
      createdBy: "admin"
    }
  }

  const generateTournamentsData = async () => {
    updateProgress('tournaments', 'loading')
    
    try {
      const numberOfTournaments = 5 // Gerar 5 torneios
      const tournamentsData = Array.from({ length: numberOfTournaments }, () => generateTournament())
      
      // Garantir que pelo menos um seja Copa Passa Bola
      if (!tournamentsData.some(t => t.isCopaPassaBola)) {
        tournamentsData[0] = {
          ...tournamentsData[0],
          name: "Copa Passa Bola 2025",
          isCopaPassaBola: true,
          maxTeams: 16,
          isPaid: false,
          description: "A principal competição feminina de futebol do ano! Venha participar da Copa Passa Bola 2025 e mostrar seu talento!"
        }
      }
      
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
                        7 equipes completas com jogadoras
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

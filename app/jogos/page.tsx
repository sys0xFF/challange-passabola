'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bebas_Neue } from 'next/font/google'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollAnimation } from '@/components/animations/ScrollAnimation'
import PurchaseModal from '@/components/PurchaseModal'
import { useAuth } from '@/contexts/auth-context'
import { getAllGames, getAllTournaments } from '@/lib/admin-service'
import { saveTicketPurchase, Game, Tournament, TicketType } from '@/lib/database-service'
import { Calendar, Clock, MapPin, Users, Search, Ticket, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthButton } from '@/components/ui/auth-button'
import { MobileMenu } from '@/components/ui/mobile-menu'

const bebasNeue = Bebas_Neue({ 
  weight: '400', 
  subsets: ['latin'] 
})

export default function JogosPage() {
  const { user, signIn } = useAuth()
  const router = useRouter()
  const [games, setGames] = useState<(Game & { id: string })[]>([])
  const [tournaments, setTournaments] = useState<(Tournament & { id: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroFase, setFiltroFase] = useState("Todas as Fases")
  const [filtroEstadio, setFiltroEstadio] = useState("Todos os Estádios")
  const [busca, setBusca] = useState("")
  const [selectedGame, setSelectedGame] = useState<(Game & { id: string }) | null>(null)
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  const [purchaseLoading, setPurchaseLoading] = useState(false)

  // Carregar jogos e torneios
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [gamesData, tournamentsData] = await Promise.all([
          getAllGames(),
          getAllTournaments()
        ])
        
        // Filtrar apenas jogos futuros e em progresso
        const activeGames = gamesData.filter(game => 
          game.status === 'scheduled' || game.status === 'in-progress'
        )
        
        setGames(activeGames)
        setTournaments(tournamentsData)
      } catch (error) {
        console.error("Erro ao carregar jogos:", error)
        toast.error("Erro ao carregar jogos")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filtrar jogos
  const jogosFiltrados = games.filter(game => {
    const matchFase = filtroFase === "Todas as Fases" || game.phase === filtroFase
    const matchEstadio = filtroEstadio === "Todos os Estádios" || game.location === filtroEstadio
    const matchBusca = busca === "" || 
      game.team1.toLowerCase().includes(busca.toLowerCase()) ||
      game.team2.toLowerCase().includes(busca.toLowerCase()) ||
      game.title.toLowerCase().includes(busca.toLowerCase())
    
    return matchFase && matchEstadio && matchBusca
  })

  // Separar jogos por status
  const proximosJogos = jogosFiltrados.filter(game => game.status === 'scheduled')
  const jogosAoVivo = jogosFiltrados.filter(game => game.status === 'in-progress')

  // Obter listas únicas para filtros
  const fases = ["Todas as Fases", ...Array.from(new Set(games.map(game => game.phase)))]
  const estadios = ["Todos os Estádios", ...Array.from(new Set(games.map(game => game.location)))]

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', { 
      weekday: 'short',
      day: '2-digit', 
      month: 'short' 
    })
  }

  const handleBuyTickets = (game: Game & { id: string }) => {
    if (!user) {
      toast.error("🔐 Acesso Restrito: Para comprar ingressos você precisa estar logado. Clique no botão de login no canto superior direito!")
      // Aguardar um pouco para o toast aparecer antes de abrir o modal
      setTimeout(() => signIn(), 100)
      return
    }
    
    setSelectedGame(game)
    setPurchaseModalOpen(true)
  }

  const handlePurchase = async (ticketType: TicketType, quantity: number) => {
    if (!user || !selectedGame) return

    try {
      setPurchaseLoading(true)
      
      const purchase = {
        userId: user.id,
        gameId: selectedGame.id,
        gameName: `${selectedGame.team1} vs ${selectedGame.team2}`,
        ticketTypeId: ticketType.id,
        ticketTypeName: ticketType.name,
        quantity,
        totalPrice: ticketType.price * quantity,
        status: 'confirmed' as const,
        purchaseDetails: {
          customerName: user.name,
          customerEmail: user.email,
          customerPhone: user.telefone || ''
        }
      }
      
      await saveTicketPurchase(purchase)
      
      toast.success(`Compra realizada! ${quantity}x ${ticketType.name}`)
      // Removido: setPurchaseModalOpen(false) - deixar o modal controlar o fechamento
      // Removido: setSelectedGame(null) - será limpo quando o modal fechar
    } catch (error) {
      console.error("Erro na compra:", error)
      toast.error("Erro ao processar compra")
      throw error // Re-throw para que o modal saiba que houve erro
    } finally {
      setPurchaseLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#8e44ad]" />
          <p className="text-gray-600">Carregando jogos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative h-8 w-8">
                  <Image src="/logo.png" alt="Copa Passa Bola" fill className="object-contain" />
                </div>
                <span className={`${bebasNeue.className} text-2xl text-[#8e44ad] tracking-wider`}>
                  PASSA BOLA
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <AuthButton />
              <div className="md:hidden">
                <MobileMenu />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <ScrollAnimation>
        <div className="relative bg-gradient-to-r from-[#8e44ad] to-purple-600 text-white pt-28 pb-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.h1 
              className={`${bebasNeue.className} text-5xl md:text-7xl font-bold mb-6`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              JOGOS
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 opacity-90"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Acompanhe todos os jogos da Copa Passa Bola
            </motion.p>
          </div>
        </div>
      </ScrollAnimation>

      <main className="container mx-auto px-4 py-8 pt-8">
        {/* Botão Voltar */}
        <ScrollAnimation>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </ScrollAnimation>

        {/* Filtros */}
        <ScrollAnimation>
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar Jogo
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Buscar por time..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fase
                  </label>
                  <Select value={filtroFase} onValueChange={setFiltroFase}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fases.map((fase) => (
                        <SelectItem key={fase} value={fase}>
                          {fase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Local
                  </label>
                  <Select value={filtroEstadio} onValueChange={setFiltroEstadio}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {estadios.map((estadio) => (
                        <SelectItem key={estadio} value={estadio}>
                          {estadio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollAnimation>

        {/* Próximos Jogos */}
        {proximosJogos.length > 0 && (
          <ScrollAnimation delay={0.1}>
            <div className="mb-8">
              <h2 className={`${bebasNeue.className} text-3xl font-bold text-[#8e44ad] mb-6`}>
                PRÓXIMOS JOGOS
              </h2>
              <div className="grid gap-6">
                {proximosJogos.map((jogo) => (
                  <Card 
                    key={jogo.id} 
                    className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#8e44ad]/30"
                  >
                    <CardContent className="p-5 md:p-6">
                      {/* Layout Mobile First - Bem Estruturado */}
                      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-6 md:items-center">
                        
                        {/* Seção Times - Destaque Principal */}
                        <div className="md:col-span-6">
                          <div className="bg-gradient-to-r from-[#8e44ad]/5 to-purple-100/50 rounded-lg p-4 border border-[#8e44ad]/10">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 text-center">
                                <h3 className="font-bold text-xl text-gray-800 mb-1">{jogo.team1}</h3>
                              </div>
                              
                              <div className="mx-4 bg-[#8e44ad] text-white px-3 py-1 rounded-full">
                                <span className="text-sm font-bold">VS</span>
                              </div>
                              
                              <div className="flex-1 text-center">
                                <h3 className="font-bold text-xl text-gray-800 mb-1">{jogo.team2}</h3>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Informações do Jogo - Organizadas */}
                        <div className="md:col-span-4">
                          <div className="space-y-3">
                            <div className="text-center md:text-left">
                              <Badge className="bg-[#8e44ad] text-white px-3 py-1 text-sm font-medium">
                                {jogo.phase}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-2 text-sm">
                              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                                <Calendar className="h-4 w-4 text-[#8e44ad]" />
                                <span className="font-medium">{formatarData(jogo.date)}</span>
                              </div>
                              
                              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                                <Clock className="h-4 w-4 text-[#8e44ad]" />
                                <span className="font-medium">{jogo.time}</span>
                              </div>
                              
                              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                                <MapPin className="h-4 w-4 text-[#8e44ad]" />
                                <span className="font-medium truncate">{jogo.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Botão de Ação - Destaque */}
                        <div className="md:col-span-2">
                          <Button 
                            className="w-full bg-[#c2ff28] text-[#8e44ad] hover:bg-[#c2ff28]/90 font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-2 border-[#c2ff28] hover:border-[#c2ff28]/90"
                            onClick={() => handleBuyTickets(jogo)}
                          >
                            <Ticket className="mr-2 h-4 w-4" />
                            <span className="text-sm md:text-base">Comprar Ingressos</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        )}

        {/* Jogos Ao Vivo */}
        {jogosAoVivo.length > 0 && (
          <ScrollAnimation delay={0.2}>
            <div className="mb-8">
              <h2 className={`${bebasNeue.className} text-3xl font-bold text-red-600 mb-6`}>
                🔴 AO VIVO
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {jogosAoVivo.map((jogo) => (
                  <Card key={jogo.id} className="border-2 border-red-500 bg-red-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#8e44ad]/10 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-[#8e44ad]" />
                          </div>
                          <h3 className="font-bold">{jogo.team1}</h3>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-xl font-bold text-red-600">
                            {jogo.result?.team1Score || 0} - {jogo.result?.team2Score || 0}
                          </div>
                          <div className="text-xs text-red-600 animate-pulse">AO VIVO</div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold">{jogo.team2}</h3>
                          <div className="w-10 h-10 bg-[#8e44ad]/10 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-[#8e44ad]" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center text-sm text-gray-600">
                        <Badge className="bg-[#8e44ad] text-white">{jogo.phase}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        )}

        {/* Nenhum jogo encontrado */}
        {jogosFiltrados.length === 0 && !loading && (
          <ScrollAnimation>
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum jogo encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                Tente ajustar os filtros para encontrar mais jogos
              </p>
              <Button 
                onClick={() => {
                  setFiltroFase("Todas as Fases")
                  setFiltroEstadio("Todos os Estádios")
                  setBusca("")
                }}
                variant="outline"
              >
                Limpar Filtros
              </Button>
            </div>
          </ScrollAnimation>
        )}

        {/* Modal de Compra */}
        {selectedGame && (
          <PurchaseModal
            game={selectedGame}
            open={purchaseModalOpen}
            onOpenChange={setPurchaseModalOpen}
            onPurchase={(ticketType: TicketType, quantity: number) => handlePurchase(ticketType, quantity)}
            loading={purchaseLoading}
            onClose={() => setSelectedGame(null)}
          />
        )}
      </main>
    </div>
  )
}
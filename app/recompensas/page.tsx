"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollAnimation } from "@/components/animations/ScrollAnimation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Gift, 
  Star, 
  Trophy, 
  Heart, 
  ShoppingBag,
  ArrowLeft,
  Zap,
  Users,
  Calendar,
  Sparkles,
  Crown,
  Camera,
  Music,
  Coffee,
  MapPin,
  Phone,
  User,
  Home,
  Loader2,
  CheckCircle
} from "lucide-react"
import { Bebas_Neue } from "next/font/google"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { saveRewardPurchase } from "@/lib/database-service"
import { deductUserPoints } from "@/lib/admin-service"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

const recompensas = {
  produtos: [
    {
      id: 1,
      nome: "Camisa Oficial Copa Passa Bola",
      pontos: 500,
      categoria: "Vestuário",
      disponivel: true,
      imagem: "/products/camisa.jpg",
      descricao: "Camisa oficial do torneio com tecnologia dry-fit",
      icone: ShoppingBag,
      cor: "from-blue-500 to-blue-600",
      tipo: "produto" as const,
      needsAddress: true
    },
    {
      id: 2,
      nome: "Caneca Térmica Personalizada", 
      pontos: 200,
      categoria: "Acessórios",
      disponivel: true,
      imagem: "/products/caneca.jpg",
      descricao: "Caneca térmica com logo da Copa Passa Bola",
      icone: Coffee,
      cor: "from-orange-500 to-orange-600",
      tipo: "produto" as const,
      needsAddress: true
    },
    {
      id: 3,
      nome: "Boné Oficial",
      pontos: 300,
      categoria: "Acessórios", 
      disponivel: true,
      imagem: "/products/bone.jpg",
      descricao: "Boné ajustável com bordado exclusivo",
      icone: ShoppingBag,
      cor: "from-purple-500 to-purple-600",
      tipo: "produto" as const,
      needsAddress: true
    },
    {
      id: 4,
      nome: "Garrafa de Água Inteligente",
      pontos: 450,
      categoria: "Acessórios",
      disponivel: false,
      imagem: "/products/garrafa.jpg", 
      descricao: "Garrafa com LED que pisca durante os gols",
      icone: Zap,
      cor: "from-green-500 to-green-600",
      tipo: "produto" as const,
      needsAddress: true
    },
    {
      id: 5,
      nome: "Moletom Linha Premium",
      pontos: 800,
      categoria: "Vestuário",
      disponivel: true,
      imagem: "/products/moletom.jpg",
      descricao: "Moletom de edição limitada com capuz",
      icone: Star,
      cor: "from-indigo-500 to-indigo-600",
      tipo: "produto" as const,
      needsAddress: true
    },
    {
      id: 6,
      nome: "Kit Torcedora Completo",
      pontos: 1200,
      categoria: "Kit",
      disponivel: true,
      imagem: "/products/sacola.jpg",
      descricao: "Kit com camisa, boné, caneca e adesivos",
      icone: Gift,
      cor: "from-pink-500 to-pink-600",
      tipo: "produto" as const,
      needsAddress: true
    }
  ],
  experiencias: [
    {
      id: 7,
      nome: "Meet & Greet com Jogadoras",
      pontos: 1500,
      categoria: "Encontro",
      disponivel: true,
      descricao: "Encontro exclusivo com as atletas após o jogo",
      icone: Heart,
      cor: "from-red-500 to-red-600",
      vagas: 5,
      tipo: "experiencia" as const,
      needsAddress: false
    },
    {
      id: 8,
      nome: "Acesso ao Camarote VIP",
      pontos: 2000,
      categoria: "Experiência",
      disponivel: true,
      descricao: "Acesso ao camarote com open bar em um jogo",
      icone: Crown,
      cor: "from-yellow-500 to-yellow-600",
      vagas: 3,
      tipo: "experiencia" as const,
      needsAddress: false
    },
    {
      id: 9,
      nome: "Sessão de Fotos Profissional",
      pontos: 800,
      categoria: "Fotografia",
      disponivel: true,
      descricao: "Ensaio fotográfico no campo após o jogo", 
      icone: Camera,
      cor: "from-cyan-500 to-cyan-600",
      vagas: 8,
      tipo: "experiencia" as const,
      needsAddress: false
    },
    {
      id: 10,
      nome: "Show Exclusivo no Estádio",
      pontos: 3000,
      categoria: "Entretenimento",
      disponivel: false,
      descricao: "Apresentação musical exclusiva para torcedoras VIP",
      icone: Music,
      cor: "from-purple-500 to-purple-600",
      vagas: 0,
      tipo: "experiencia" as const,
      needsAddress: false
    }
  ],
  especiais: [
    {
      id: 11,
      nome: "Ingresso Temporada Completa",
      pontos: 5000,
      categoria: "Temporada",
      disponivel: true,
      descricao: "Acesso a todos os jogos da próxima temporada",
      icone: Trophy,
      cor: "from-emerald-500 to-emerald-600",
      tipo: "especial" as const,
      needsAddress: false
    },
    {
      id: 12,
      nome: "Naming Rights - Arquibancada",
      pontos: 10000,
      categoria: "Exclusivo",
      disponivel: true,
      descricao: "Tenha uma arquibancada com seu nome por 1 temporada",
      icone: Crown,
      cor: "from-amber-500 to-amber-600",
      tipo: "especial" as const,
      needsAddress: false
    }
  ]
}

export default function RecompensasPage() {
  const [categoria, setCategoria] = useState("produtos")
  const [filtro, setFiltro] = useState("todos")
  const { user, refreshUserData } = useAuth()
  const [selectedReward, setSelectedReward] = useState<any>(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showSuccessScreen, setShowSuccessScreen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addressData, setAddressData] = useState({
    nome: user?.name || '',
    telefone: user?.telefone || '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  })

  const pontosUsuario = user?.points || 0

  const handleResgatar = async (recompensa: any) => {
    if (!user) {
      toast.error("Você precisa estar logado para resgatar recompensas.")
      return
    }

    if (pontosUsuario >= recompensa.pontos && recompensa.disponivel) {
      setSelectedReward(recompensa)
      
      if (recompensa.needsAddress) {
        setShowAddressModal(true)
      } else {
        await processReward(recompensa, null)
      }
    } else if (!recompensa.disponivel) {
      toast.error("Esta recompensa não está disponível no momento.")
    } else {
      toast.error(`Você precisa de ${recompensa.pontos - pontosUsuario} pontos a mais.`)
    }
  }

  const processReward = async (recompensa: any, endereco: any) => {
    if (!user) return
    
    setLoading(true)
    try {
      // Deduzir pontos do usuário
      const deductResult = await deductUserPoints(user.id, recompensa.pontos)
      if (!deductResult.success) {
        throw new Error('Falha ao deduzir pontos')
      }

      // Salvar a compra
      const purchaseResult = await saveRewardPurchase({
        userId: user.id,
        recompensa: {
          id: recompensa.id,
          nome: recompensa.nome,
          pontos: recompensa.pontos,
          categoria: recompensa.categoria,
          tipo: recompensa.tipo
        },
        endereco: endereco
      })

      if (purchaseResult.success) {
        // Atualizar dados do usuário
        await refreshUserData()
        
        // Mostrar tela de sucesso
        setShowSuccessScreen(true)
        
        // Limpar formulário para próxima vez
        setAddressData({
          nome: user?.name || '',
          telefone: user?.telefone || '',
          cep: '',
          endereco: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: ''
        })
      }
    } catch (error) {
      console.error('Error processing reward:', error)
      toast.error("❌ Erro no Resgate: Não foi possível processar seu resgate. Verifique sua conexão e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmAddress = async () => {
    if (!selectedReward) return

    // Validar campos obrigatórios
    if (!addressData.nome || !addressData.telefone || !addressData.cep || 
        !addressData.endereco || !addressData.numero || !addressData.bairro || 
        !addressData.cidade || !addressData.estado) {
      toast.error("⚠️ Informações Incompletas: Por favor, preencha todos os campos obrigatórios (*) para continuar com o resgate.")
      return
    }

    await processReward(selectedReward, addressData)
  }

  const handleCloseModal = () => {
    setShowAddressModal(false)
    setShowSuccessScreen(false)
    setSelectedReward(null)
  }

  const podeResgatar = (pontos: number, disponivel: boolean) => {
    return pontosUsuario >= pontos && disponivel
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-[#8e44ad] hover:text-[#8e44ad]/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Voltar</span>
            </Link>
            <h1 className={`${bebasNeue.className} text-2xl font-bold text-[#8e44ad] tracking-wider`}>
              RECOMPENSAS
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Status dos Pontos */}
        <ScrollAnimation>
          <Card className="mb-8 bg-gradient-to-r from-[#8e44ad] via-purple-600 to-[#9b59b6] text-white shadow-xl border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h2 className={`${bebasNeue.className} text-3xl font-bold mb-2 tracking-wider`}>
                    SEUS PONTOS
                  </h2>
                  <p className="text-purple-100 text-lg">Use seus pontos para resgatar recompensas incríveis!</p>
                  {!user && (
                    <p className="text-yellow-200 font-medium">
                      Faça login para ver seus pontos e resgatar recompensas
                    </p>
                  )}
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-5xl font-bold text-yellow-300 mb-2 font-mono">
                    {user ? pontosUsuario.toLocaleString() : '---'}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-purple-100">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-medium">Pontos disponíveis</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollAnimation>

        {/* Navegação por Categorias */}
        <ScrollAnimation delay={0.1}>
          <Tabs value={categoria} onValueChange={setCategoria} className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="produtos" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Produtos
              </TabsTrigger>
              <TabsTrigger value="experiencias" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Experiências
              </TabsTrigger>
              <TabsTrigger value="especiais" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Especiais
              </TabsTrigger>
            </TabsList>

            {/* Produtos */}
            <TabsContent value="produtos">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recompensas.produtos.map((produto) => {
                  const Icone = produto.icone
                  const disponivel = podeResgatar(produto.pontos, produto.disponivel)
                  
                  return (
                    <ScrollAnimation key={produto.id} delay={0.1}>
                      <Card className={`group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border-0 bg-white/80 backdrop-blur-sm ${
                        !produto.disponivel ? "opacity-60" : ""
                      }`}>
                        <div className={`h-3 bg-gradient-to-r ${produto.cor} group-hover:h-4 transition-all duration-300`}></div>
                        
                        <CardContent className="p-6">
                          <div className="relative h-48 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden group-hover:shadow-lg transition-all duration-300">
                            <Image
                              src={produto.imagem}
                              alt={produto.nome}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {!produto.disponivel && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                <Badge className="bg-red-500 text-white border-0 px-4 py-2 text-sm font-bold">
                                  ESGOTADO
                                </Badge>
                              </div>
                            )}
                            <div className="absolute top-3 right-3">
                              <div className={`p-2 rounded-full bg-gradient-to-r ${produto.cor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <Icone className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3 mb-4">
                            <h3 className="font-bold text-xl text-[#8e44ad] mb-2 group-hover:text-purple-700 transition-colors line-clamp-2">
                              {produto.nome}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                              {produto.descricao}
                            </p>
                            <Badge variant="outline" className="text-xs border-purple-200 text-purple-700 bg-purple-50">
                              {produto.categoria}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between mb-6">
                            <div className="text-3xl font-bold text-[#8e44ad]">
                              {produto.pontos} <span className="text-sm font-normal">pontos</span>
                            </div>
                            {disponivel && (
                              <Badge className="bg-green-500 text-white border-0 px-3 py-1">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Disponível
                              </Badge>
                            )}
                          </div>
                          
                          <Button 
                            className={`w-full h-12 font-semibold transition-all duration-300 ${
                              disponivel 
                                ? "bg-gradient-to-r from-[#8e44ad] to-purple-700 hover:from-[#8e44ad]/90 hover:to-purple-700/90 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                            onClick={() => handleResgatar(produto)}
                            disabled={!disponivel}
                          >
                            {disponivel ? (
                              <div className="flex items-center gap-2">
                                <Gift className="w-4 h-4" />
                                Resgatar Agora
                              </div>
                            ) : (
                              !produto.disponivel ? "Esgotado" : "Pontos Insuficientes"
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    </ScrollAnimation>
                  )
                })}
              </div>
            </TabsContent>

            {/* Experiências */}
            <TabsContent value="experiencias">
              <div className="grid md:grid-cols-2 gap-6">
                {recompensas.experiencias.map((experiencia) => {
                  const Icone = experiencia.icone
                  const disponivel = podeResgatar(experiencia.pontos, experiencia.disponivel)
                  
                  return (
                    <ScrollAnimation key={experiencia.id} delay={0.1}>
                      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${
                        !experiencia.disponivel ? "opacity-60" : ""
                      }`}>
                        <div className={`h-3 bg-gradient-to-r ${experiencia.cor}`}></div>
                        
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-full bg-gradient-to-r ${experiencia.cor}`}>
                              <Icone className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-xl text-[#8e44ad] mb-2">{experiencia.nome}</h3>
                              <p className="text-gray-600 mb-3">{experiencia.descricao}</p>
                              <div className="flex items-center gap-4 mb-4">
                                <Badge variant="outline">{experiencia.categoria}</Badge>
                                {experiencia.vagas && experiencia.vagas > 0 && (
                                  <Badge className="bg-orange-500 text-white">
                                    {experiencia.vagas} vagas
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-3xl font-bold text-[#8e44ad]">
                              {experiencia.pontos} <span className="text-sm font-normal">pontos</span>
                            </div>
                            {disponivel && (
                              <Badge className="bg-green-500 text-white">Disponível</Badge>
                            )}
                          </div>
                          
                          <Button 
                            className={`w-full ${
                              disponivel 
                                ? "bg-[#8e44ad] hover:bg-[#8e44ad]/90 text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            onClick={() => handleResgatar(experiencia)}
                            disabled={!disponivel}
                          >
                            {disponivel ? "Resgatar Experiência" : 
                             !experiencia.disponivel ? "Indisponível" : "Pontos Insuficientes"}
                          </Button>
                        </CardContent>
                      </Card>
                    </ScrollAnimation>
                  )
                })}
              </div>
            </TabsContent>

            {/* Especiais */}
            <TabsContent value="especiais">
              <div className="grid gap-6">
                {recompensas.especiais.map((especial) => {
                  const Icone = especial.icone
                  const disponivel = podeResgatar(especial.pontos, especial.disponivel)
                  
                  return (
                    <ScrollAnimation key={especial.id} delay={0.1}>
                      <Card className="overflow-hidden border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50">
                        <div className={`h-4 bg-gradient-to-r ${especial.cor}`}></div>
                        
                        <CardContent className="p-8">
                          <div className="flex items-center gap-6">
                            <div className={`p-4 rounded-full bg-gradient-to-r ${especial.cor} shadow-lg`}>
                              <Icone className="h-8 w-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-2xl text-[#8e44ad]">{especial.nome}</h3>
                                <Crown className="h-6 w-6 text-yellow-500" />
                              </div>
                              <p className="text-gray-700 mb-3 text-lg">{especial.descricao}</p>
                              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
                                {especial.categoria}
                              </Badge>
                            </div>
                            <div className="text-center">
                              <div className="text-4xl font-bold text-[#8e44ad] mb-2">
                                {especial.pontos.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600 mb-4">pontos</div>
                              <Button 
                                size="lg"
                                className={`${
                                  disponivel 
                                    ? "bg-gradient-to-r from-[#8e44ad] to-purple-700 hover:from-[#8e44ad]/90 hover:to-purple-700/90 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                                onClick={() => handleResgatar(especial)}
                                disabled={!disponivel}
                              >
                                {disponivel ? "Resgatar" : "Pontos Insuficientes"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollAnimation>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollAnimation>

        {/* CTA para ganhar mais pontos */}
        <ScrollAnimation delay={0.3}>
          <Card className="mt-8 bg-gradient-to-r from-[#8e44ad] to-[#9b59b6] text-white">
            <CardContent className="text-center py-8">
              <Zap className="h-12 w-12 mx-auto mb-4" />
              <h3 className={`${bebasNeue.className} text-2xl font-bold mb-4 tracking-wider`}>
                PRECISA DE MAIS PONTOS?
              </h3>
              <p className="mb-6 max-w-2xl mx-auto">
                Participe mais ativamente dos jogos, complete desafios e suba no ranking para ganhar 
                mais pontos e desbloquear recompensas exclusivas!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/loja">
                  <Button size="lg" className="bg-white text-[#8e44ad] hover:bg-white/90">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Visitar Loja
                  </Button>
                </Link>
                <Link href="/jogos">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#8e44ad] bg-transparent">
                    <Calendar className="mr-2 h-5 w-5" />
                    Próximos Jogos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </ScrollAnimation>
      </main>

      {/* Modal de Endereço */}
      <Dialog open={showAddressModal} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {!showSuccessScreen ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-[#8e44ad]">
                  <MapPin className="h-5 w-5" />
                  Informações de Entrega
                </DialogTitle>
              </DialogHeader>
              
              {selectedReward && (
                <div className="space-y-6">
                  {/* Resumo da Recompensa */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-full bg-gradient-to-r ${selectedReward.cor}`}>
                        <Gift className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#8e44ad]">{selectedReward.nome}</h3>
                        <p className="text-sm text-gray-600">{selectedReward.categoria}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#8e44ad]">
                        {selectedReward.pontos} pontos
                      </span>
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Pontos suficientes
                      </Badge>
                    </div>
                  </div>

                  {/* Formulário de Endereço */}
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Nome Completo *
                        </Label>
                        <Input
                          id="nome"
                          value={addressData.nome}
                          onChange={(e) => setAddressData(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Seu nome completo"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Telefone *
                        </Label>
                        <Input
                          id="telefone"
                          value={addressData.telefone}
                          onChange={(e) => setAddressData(prev => ({ ...prev, telefone: e.target.value }))}
                          placeholder="(11) 99999-9999"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="cep">CEP *</Label>
                        <Input
                          id="cep"
                          value={addressData.cep}
                          onChange={(e) => setAddressData(prev => ({ ...prev, cep: e.target.value }))}
                          placeholder="00000-000"
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="endereco">Endereço *</Label>
                        <Input
                          id="endereco"
                          value={addressData.endereco}
                          onChange={(e) => setAddressData(prev => ({ ...prev, endereco: e.target.value }))}
                          placeholder="Rua, Avenida, etc."
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="numero">Número *</Label>
                        <Input
                          id="numero"
                          value={addressData.numero}
                          onChange={(e) => setAddressData(prev => ({ ...prev, numero: e.target.value }))}
                          placeholder="123"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="complemento">Complemento</Label>
                        <Input
                          id="complemento"
                          value={addressData.complemento}
                          onChange={(e) => setAddressData(prev => ({ ...prev, complemento: e.target.value }))}
                          placeholder="Apto 456"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bairro">Bairro *</Label>
                        <Input
                          id="bairro"
                          value={addressData.bairro}
                          onChange={(e) => setAddressData(prev => ({ ...prev, bairro: e.target.value }))}
                          placeholder="Centro"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cidade">Cidade *</Label>
                        <Input
                          id="cidade"
                          value={addressData.cidade}
                          onChange={(e) => setAddressData(prev => ({ ...prev, cidade: e.target.value }))}
                          placeholder="São Paulo"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="estado">Estado *</Label>
                        <Input
                          id="estado"
                          value={addressData.estado}
                          onChange={(e) => setAddressData(prev => ({ ...prev, estado: e.target.value }))}
                          placeholder="SP"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={handleCloseModal}
                      className="flex-1"
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleConfirmAddress}
                      className="flex-1 bg-[#8e44ad] hover:bg-[#8e44ad]/90"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirmar Resgate
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    * Campos obrigatórios. A entrega será feita em até 15 dias úteis.
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Tela de Sucesso */
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                  Resgate Realizado com Sucesso!
                </h2>
                <div className="w-16 h-1 bg-green-600 mx-auto rounded-full"></div>
              </div>

              {selectedReward && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 mb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${selectedReward.cor}`}>
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{selectedReward.nome}</h3>
                      <p className="text-green-600 font-semibold">{selectedReward.pontos} pontos resgatados</p>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-gray-700">
                      Parabéns! Sua recompensa foi processada com sucesso.
                    </p>
                    {selectedReward.needsAddress ? (
                      <p className="text-sm text-green-600 font-medium">
                        O produto será enviado para o endereço informado em até 15 dias úteis.
                      </p>
                    ) : (
                      <p className="text-sm text-green-600 font-medium">
                        Nossa equipe entrará em contato em breve com mais informações!
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Button
                onClick={handleCloseModal}
                className="bg-[#8e44ad] hover:bg-[#8e44ad]/90 text-white px-8 py-2"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Continuar Navegando
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

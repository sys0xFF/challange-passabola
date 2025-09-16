"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollAnimation } from "@/components/animations/ScrollAnimation"
import { 
  Zap, 
  Trophy, 
  Heart, 
  Users, 
  Target,
  ArrowLeft,
  Gift,
  Star,
  TrendingUp,
  Activity,
  Calendar,
  MapPin,
  Flame
} from "lucide-react"
import { Bebas_Neue } from "next/font/google"
import { motion } from "framer-motion"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

const estatisticasUsuario = {
  pontosTotal: 2847,
  pontosHoje: 125,
  nivel: 8,
  proximoNivel: 9,
  pontosParaProximoNivel: 153,
  jogosAssistidos: 12,
  interacoesRealizadas: 456,
  posicaoRanking: 23
}

const atividades = [
  {
    id: 1,
    tipo: "gol",
    descricao: "Comemorou gol do Leoas FC",
    pontos: 25,
    tempo: "há 2 min",
    icon: "⚽",
    multiplicador: "2x"
  },
  {
    id: 2, 
    tipo: "ola",
    descricao: "Participou da ola coletiva",
    pontos: 15,
    tempo: "há 5 min",
    icon: "🌊",
    multiplicador: null
  },
  {
    id: 3,
    tipo: "quiz",
    descricao: "Acertou pergunta sobre estatísticas",
    pontos: 30,
    tempo: "há 8 min", 
    icon: "🧠",
    multiplicador: null
  },
  {
    id: 4,
    tipo: "presenca",
    descricao: "Chegou no estádio",
    pontos: 50,
    tempo: "há 45 min",
    icon: "📍",
    multiplicador: null
  }
]

const desafiosAtivos = [
  {
    id: 1,
    titulo: "Torcedora Mais Animada",
    descricao: "Participe de 5 interações durante o jogo",
    progresso: 3,
    meta: 5,
    recompensa: 100,
    icone: Heart,
    cor: "from-pink-500 to-pink-600"
  },
  {
    id: 2,
    titulo: "Especialista em Quiz",
    descricao: "Acerte 3 perguntas seguidas",
    progresso: 2,
    meta: 3,
    recompensa: 75,
    icone: Trophy,
    cor: "from-yellow-500 to-yellow-600"
  },
  {
    id: 3,
    titulo: "Presença VIP",
    descricao: "Assista a 3 jogos neste mês",
    progresso: 2,
    meta: 3,
    recompensa: 200,
    icone: Star,
    cor: "from-purple-500 to-purple-600"
  }
]

const proximosJogos = [
  {
    id: 1,
    time1: "Leoas FC",
    time2: "Fênix FC", 
    data: "2025-09-20",
    horario: "15:00",
    estadio: "Estádio Municipal"
  },
  {
    id: 2,
    time1: "Guerreiras FC", 
    time2: "Amazonas FC",
    data: "2025-09-22",
    horario: "17:00",
    estadio: "Arena Copa Passa Bola"
  }
]

export default function PulseiraPage() {
  const [pontosAnimados, setPontosAnimados] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPontosAnimados(estatisticasUsuario.pontosTotal)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const calcularProgresso = () => {
    const totalPontos = 3000 // Pontos necessários para o próximo nível
    const pontosAtual = estatisticasUsuario.pontosTotal
    return (pontosAtual / totalPontos) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-[#8e44ad] hover:text-[#8e44ad]/80">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Voltar</span>
            </Link>
            <h1 className={`${bebasNeue.className} text-2xl font-bold text-[#8e44ad]`}>
              MINHA PULSEIRA INTELIGENTE
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Status da Pulseira */}
        <ScrollAnimation>
          <Card className="mb-8 bg-gradient-to-r from-[#8e44ad] to-purple-700 text-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6 items-center">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <Zap className="h-8 w-8 text-[#c2ff28]" />
                    <span className="text-[#c2ff28] font-semibold">STATUS ATIVO</span>
                  </div>
                  <h2 className={`${bebasNeue.className} text-3xl font-bold mb-2`}>
                    NÍVEL {estatisticasUsuario.nivel}
                  </h2>
                  <p className="text-purple-100">Torcedora Veterana</p>
                </div>

                <div className="text-center">
                  <motion.div 
                    className="text-5xl font-bold text-[#c2ff28] mb-2"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {pontosAnimados.toLocaleString()}
                  </motion.div>
                  <p className="text-purple-100">Pontos Totais</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <span className="text-sm text-orange-200">+{estatisticasUsuario.pontosHoje} hoje</span>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <div className="mb-2">
                    <span className="text-sm text-purple-100">Progresso para Nível {estatisticasUsuario.proximoNivel}</span>
                  </div>
                  <Progress 
                    value={calcularProgresso()} 
                    className="w-full mb-2"
                  />
                  <span className="text-sm text-purple-100">
                    Faltam {estatisticasUsuario.pontosParaProximoNivel} pontos
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollAnimation>

        {/* Estatísticas Rápidas */}
        <ScrollAnimation delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <Users className="h-8 w-8 text-[#8e44ad] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#8e44ad]">#{estatisticasUsuario.posicaoRanking}</div>
                <div className="text-sm text-gray-600">Ranking</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <Calendar className="h-8 w-8 text-[#8e44ad] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#8e44ad]">{estatisticasUsuario.jogosAssistidos}</div>
                <div className="text-sm text-gray-600">Jogos</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <Activity className="h-8 w-8 text-[#8e44ad] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#8e44ad]">{estatisticasUsuario.interacoesRealizadas}</div>
                <div className="text-sm text-gray-600">Interações</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <TrendingUp className="h-8 w-8 text-[#8e44ad] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#8e44ad]">+{estatisticasUsuario.pontosHoje}</div>
                <div className="text-sm text-gray-600">Hoje</div>
              </CardContent>
            </Card>
          </div>
        </ScrollAnimation>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Atividades Recentes */}
          <ScrollAnimation delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#8e44ad]" />
                  Atividades Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {atividades.map((atividade) => (
                  <div key={atividade.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{atividade.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{atividade.descricao}</p>
                      <p className="text-xs text-gray-500">{atividade.tempo}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[#8e44ad]">+{atividade.pontos}</span>
                        {atividade.multiplicador && (
                          <Badge className="text-xs bg-orange-500 text-white">
                            {atividade.multiplicador}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Ver Mais Atividades
                </Button>
              </CardContent>
            </Card>
          </ScrollAnimation>

          {/* Desafios Ativos */}
          <ScrollAnimation delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#8e44ad]" />
                  Desafios Ativos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {desafiosAtivos.map((desafio) => {
                  const Icone = desafio.icone
                  return (
                    <div key={desafio.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2 rounded-full bg-gradient-to-r ${desafio.cor}`}>
                          <Icone className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{desafio.titulo}</h4>
                          <p className="text-xs text-gray-600 mb-2">{desafio.descricao}</p>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={(desafio.progresso / desafio.meta) * 100} 
                              className="flex-1 h-2"
                            />
                            <span className="text-xs text-gray-500">
                              {desafio.progresso}/{desafio.meta}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-[#8e44ad]">
                            +{desafio.recompensa}
                          </span>
                          <p className="text-xs text-gray-500">pontos</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>

        {/* Próximos Jogos */}
        <ScrollAnimation delay={0.4}>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#8e44ad]" />
                Próximos Jogos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {proximosJogos.map((jogo) => (
                  <div key={jogo.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-semibold mb-2">
                      {jogo.time1} <span className="text-[#8e44ad]">vs</span> {jogo.time2}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(jogo.data).toLocaleDateString('pt-BR')} às {jogo.horario}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {jogo.estadio}
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-[#8e44ad] hover:bg-[#8e44ad]/90">
                      Ver Detalhes
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollAnimation>

        {/* CTAs */}
        <ScrollAnimation delay={0.5}>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="text-center py-8">
                <Gift className="h-12 w-12 mx-auto mb-4" />
                <h3 className={`${bebasNeue.className} text-xl font-bold mb-4`}>
                  TROQUE SEUS PONTOS
                </h3>
                <p className="mb-6 text-green-100">
                  Você tem pontos suficientes para resgatar recompensas incríveis!
                </p>
                <Link href="/recompensas">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-white/90">
                    <Gift className="mr-2 h-5 w-5" />
                    Ver Recompensas
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto mb-4" />
                <h3 className={`${bebasNeue.className} text-xl font-bold mb-4`}>
                  RANKING DE TORCEDORAS
                </h3>
                <p className="mb-6 text-orange-100">
                  Você está no top 25! Continue participando para subir no ranking.
                </p>
                <Button size="lg" className="bg-white text-orange-600 hover:bg-white/90">
                  <Trophy className="mr-2 h-5 w-5" />
                  Ver Ranking
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollAnimation>
      </main>
    </div>
  )
}

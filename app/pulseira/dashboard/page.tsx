"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Bebas_Neue } from "next/font/google"
import { 
  getBandDevices, 
  getBandScores, 
  startEventForAllBands, 
  stopEventForAllBands,
  controlBandEvent,
  extractBandId,
  formatBandId,
  MOVEMENT_PRESETS,
  BandDevice,
  MovementPreset
} from "@/lib/band-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Activity,
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw,
  Timer,
  TrendingUp,
  Zap,
  Users,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

interface BandScoreData {
  bandId: string
  timestamp: number
  scoreX: number
  scoreY: number
  scoreZ: number
}

interface EventStatus {
  isRunning: boolean
  selectedPreset?: MovementPreset
  customDuration?: number
  customAxis?: 'X' | 'Y' | 'Z'
  startTime?: number
  duration?: number
}

export default function BandDashboard() {
  const router = useRouter()
  
  // Estados para dispositivos e dados
  const [devices, setDevices] = useState<BandDevice[]>([])
  const [scoreHistory, setScoreHistory] = useState<BandScoreData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para controle de eventos
  const [eventStatus, setEventStatus] = useState<EventStatus>({ isRunning: false })
  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [customDuration, setCustomDuration] = useState<string>('60')
  const [customAxis, setCustomAxis] = useState<'X' | 'Y' | 'Z'>('Y')
  const [eventMessage, setEventMessage] = useState<string>('')
  
  // Estados para interface
  const [activeTab, setActiveTab] = useState('overview')

  // Carrega dispositivos na inicialização
  useEffect(() => {
    loadDevices()
    
    // Atualiza dados a cada 5 segundos quando não há evento ativo
    const interval = setInterval(() => {
      if (!eventStatus.isRunning) {
        refreshScores()
      }
    }, 5000)
    
    return () => clearInterval(interval)
  }, [eventStatus.isRunning])

  // Atualiza dados em tempo real durante eventos
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (eventStatus.isRunning) {
      interval = setInterval(() => {
        refreshScores()
        
        // Verifica se o evento deve terminar
        if (eventStatus.startTime && eventStatus.duration) {
          const elapsed = Date.now() - eventStatus.startTime
          if (elapsed >= eventStatus.duration * 1000) {
            handleStopEvent()
          }
        }
      }, 1000) // Atualiza a cada segundo durante eventos
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [eventStatus])

  const loadDevices = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await getBandDevices()
      setDevices(response.devices)
      
      // Carrega scores iniciais
      await refreshScores(response.devices)
      
    } catch (err) {
      setError('Erro ao carregar dispositivos: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const refreshScores = async (deviceList?: BandDevice[]) => {
    try {
      setRefreshing(true)
      
      const devicesToUse = deviceList || devices
      if (devicesToUse.length === 0) return
      
      const timestamp = Date.now()
      const newScoreData: BandScoreData[] = []
      
      for (const device of devicesToUse) {
        const bandId = extractBandId(device.entity_name)
        if (bandId) {
          try {
            // Se o evento estiver parado, valores ficam em 0
            if (!eventStatus.isRunning) {
              newScoreData.push({
                bandId,
                timestamp,
                scoreX: 0,
                scoreY: 0,
                scoreZ: 0
              })
            } else {
              // Se o evento estiver ativo, busca os valores reais da API
              const scores = await getBandScores(bandId)
              
              newScoreData.push({
                bandId,
                timestamp,
                scoreX: scores.scoreX?.value || 0,
                scoreY: scores.scoreY?.value || 0,
                scoreZ: scores.scoreZ?.value || 0
              })
            }
          } catch (err) {
            console.error(`Erro ao buscar scores da pulseira ${bandId}:`, err)
          }
        }
      }
      
      // Mantém apenas os últimos 50 pontos para performance
      setScoreHistory(prev => {
        const combined = [...prev, ...newScoreData]
        return combined.slice(-50)
      })
      
    } catch (err) {
      console.error('Erro ao atualizar scores:', err)
    } finally {
      setRefreshing(false)
    }
  }

  const handleStartEvent = async () => {
    try {
      const bandIds = devices.map(device => extractBandId(device.entity_name)).filter(Boolean)
      
      if (bandIds.length === 0) {
        setEventMessage('Nenhuma pulseira disponível para iniciar evento.')
        return
      }
      
      let preset: MovementPreset | undefined
      let duration: number
      let axis: 'X' | 'Y' | 'Z'
      
      if (selectedPreset && selectedPreset !== 'manual') {
        preset = MOVEMENT_PRESETS.find(p => p.id === selectedPreset)
        if (!preset) {
          setEventMessage('Preset selecionado não encontrado.')
          return
        }
        duration = preset.duration
        axis = preset.axis
      } else {
        duration = parseInt(customDuration)
        axis = customAxis
        
        if (isNaN(duration) || duration <= 0) {
          setEventMessage('Duração deve ser um número válido maior que zero.')
          return
        }
      }
      
      setEventMessage('Iniciando evento...')
      
      const result = await startEventForAllBands(bandIds)
      
      if (result.failed.length > 0) {
        setEventMessage(`Evento iniciado parcialmente. Leitura iniciará em 1s. Falhas: ${result.failed.join(', ')}`)
      } else {
        setEventMessage(`Evento iniciado com sucesso! Aguardando 1s para início da leitura...`)
      }
      
      // Limpa histórico anterior
      setScoreHistory([])
      
      // Aguarda 1 segundo antes de começar a ler os valores
      setTimeout(() => {
        setEventStatus({
          isRunning: true,
          selectedPreset: preset,
          customDuration: (selectedPreset && selectedPreset !== 'manual') ? undefined : duration,
          customAxis: (selectedPreset && selectedPreset !== 'manual') ? undefined : axis,
          startTime: Date.now(),
          duration
        })
        
        // Atualiza mensagem para indicar que a leitura começou
        setEventMessage(`Evento ativo! Lendo dados das pulseiras...`)
      }, 1000)
      
      setTimeout(() => setEventMessage(''), 3000)
      
    } catch (err) {
      setEventMessage('Erro ao iniciar evento: ' + (err as Error).message)
      setTimeout(() => setEventMessage(''), 5000)
    }
  }

  const handleStopEvent = async () => {
    try {
      const bandIds = devices.map(device => extractBandId(device.entity_name)).filter(Boolean)
      
      setEventMessage('Parando evento...')
      
      const result = await stopEventForAllBands(bandIds)
      
      if (result.failed.length > 0) {
        setEventMessage(`Evento parado parcialmente. Falhas: ${result.failed.join(', ')}`)
      } else {
        setEventMessage(`Evento parado com sucesso em ${result.success.length} pulseira(s)!`)
      }
      
      setEventStatus({ isRunning: false })
      setTimeout(() => setEventMessage(''), 3000)
      
    } catch (err) {
      setEventMessage('Erro ao parar evento: ' + (err as Error).message)
      setTimeout(() => setEventMessage(''), 5000)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getRemainingTime = (): number => {
    if (!eventStatus.isRunning || !eventStatus.startTime || !eventStatus.duration) return 0
    
    const elapsed = Math.floor((Date.now() - eventStatus.startTime) / 1000)
    const remaining = Math.max(0, eventStatus.duration - elapsed)
    return remaining
  }

  const getChartData = () => {
    // Agrupa dados por timestamp e calcula médias
    const groupedData = scoreHistory.reduce((acc, data) => {
      const timeKey = new Date(data.timestamp).toLocaleTimeString()
      
      if (!acc[timeKey]) {
        acc[timeKey] = { time: timeKey, scoreX: 0, scoreY: 0, scoreZ: 0, count: 0 }
      }
      
      acc[timeKey].scoreX += data.scoreX
      acc[timeKey].scoreY += data.scoreY
      acc[timeKey].scoreZ += data.scoreZ
      acc[timeKey].count += 1
      
      return acc
    }, {} as Record<string, any>)
    
    return Object.values(groupedData).map((item: any) => ({
      time: item.time,
      'Eixo X': Number((item.scoreX / item.count).toFixed(2)),
      'Eixo Y': Number((item.scoreY / item.count).toFixed(2)),
      'Eixo Z': Number((item.scoreZ / item.count).toFixed(2))
    }))
  }

  const getScoresByBand = () => {
    // Se o evento não estiver ativo, retorna dados zerados para todas as pulseiras
    if (!eventStatus.isRunning) {
      return devices.map(device => {
        const bandId = extractBandId(device.entity_name)
        return {
          pulseira: formatBandId(bandId),
          pontos: 0,
          'Eixo X': 0,
          'Eixo Y': 0,
          'Eixo Z': 0
        }
      })
    }

    // Calcula pontuação total por pulseira (apenas quando evento ativo)
    const bandScores = scoreHistory.reduce((acc, data) => {
      if (!acc[data.bandId]) {
        acc[data.bandId] = {
          bandId: formatBandId(data.bandId),
          totalPoints: 0,
          xPoints: 0,
          yPoints: 0,
          zPoints: 0,
          count: 0
        }
      }
      
      acc[data.bandId].xPoints += Math.abs(data.scoreX)
      acc[data.bandId].yPoints += Math.abs(data.scoreY)
      acc[data.bandId].zPoints += Math.abs(data.scoreZ)
      acc[data.bandId].totalPoints += Math.abs(data.scoreX) + Math.abs(data.scoreY) + Math.abs(data.scoreZ)
      acc[data.bandId].count += 1
      
      return acc
    }, {} as Record<string, any>)
    
    return Object.values(bandScores).map((band: any) => ({
      pulseira: band.bandId,
      pontos: Number(band.totalPoints.toFixed(1)),
      'Eixo X': Number(band.xPoints.toFixed(1)),
      'Eixo Y': Number(band.yPoints.toFixed(1)),
      'Eixo Z': Number(band.zPoints.toFixed(1))
    }))
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#8e44ad] to-[#9b59b6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/admin/dashboard')}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
              <div className="relative h-8 w-8 sm:h-10 sm:w-10">
                <Image src="/logo.png" alt="Passa Bola Logo" fill className="object-contain" />
              </div>
              <div>
                <h1 className={`${bebasNeue.className} text-xl sm:text-2xl text-[#8e44ad] dark:text-primary tracking-wider`}>
                  DASHBOARD PULSEIRAS
                </h1>
                <Badge className="bg-[#c2ff28] text-[#8e44ad] mt-1 text-xs sm:text-sm">
                  {eventStatus.isRunning ? 'EVENTO ATIVO' : 'MONITORAMENTO'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {eventStatus.isRunning && (
                <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                  <Timer className="h-4 w-4" />
                  <span>{formatTime(getRemainingTime())}</span>
                </div>
              )}
              
              <Button 
                onClick={() => loadDevices()}
                variant="outline" 
                size="sm"
                disabled={loading || refreshing}
                className="w-full sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </div>
          
          {/* Status/Error Messages */}
          {eventMessage && (
            <div className="pb-4">
              <div className={`flex items-center gap-2 text-sm p-2 rounded-md ${
                eventMessage.includes('Erro') || eventMessage.includes('Falha') 
                  ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                  : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              }`}>
                {eventMessage.includes('Erro') || eventMessage.includes('Falha') 
                  ? <AlertCircle className="h-4 w-4" />
                  : <CheckCircle2 className="h-4 w-4" />
                }
                {eventMessage}
              </div>
            </div>
          )}
          
          {error && (
            <div className="pb-4">
              <div className="flex items-center gap-2 text-sm p-2 rounded-md bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 gap-1 h-auto p-1">
            <TabsTrigger value="overview" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1 sm:px-3">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1 sm:px-3">
              <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Gráfico</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1 sm:px-3">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Eventos</span>
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              {/* Status Cards */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pulseiras Conectadas</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{devices.length}</div>
                  <p className="text-xs text-muted-foreground">dispositivos ativos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status do Evento</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${eventStatus.isRunning ? 'text-green-600' : 'text-gray-500'}`}>
                    {eventStatus.isRunning ? 'ATIVO' : 'PARADO'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {eventStatus.isRunning ? `${formatTime(getRemainingTime())} restantes` : 'nenhum evento em andamento'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Movimento Atual</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {eventStatus.selectedPreset?.axis || eventStatus.customAxis || 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {eventStatus.selectedPreset?.name || 'movimento customizado'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Dados Coletados</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{scoreHistory.length}</div>
                  <p className="text-xs text-muted-foreground">pontos de dados</p>
                </CardContent>
              </Card>
            </div>

            {/* Device List */}
            <Card>
              <CardHeader>
                <CardTitle>Pulseiras Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                {devices.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma pulseira encontrada</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {devices.map((device) => {
                      const bandId = extractBandId(device.entity_name)
                      const latestData = scoreHistory
                        .filter(data => data.bandId === bandId)
                        .slice(-1)[0]
                      
                      return (
                        <Card key={device.device_id} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{formatBandId(bandId)}</h3>
                            <Badge variant={eventStatus.isRunning ? 'default' : 'secondary'}>
                              {eventStatus.isRunning ? 'Ativo' : 'Standby'}
                            </Badge>
                          </div>
                          
                          {/* Mini gráfico para cada pulseira */}
                          {(() => {
                            let bandData = scoreHistory
                              .filter(data => data.bandId === bandId)
                              .slice(-10) // Últimos 10 pontos
                              .map((data, index) => ({
                                point: index + 1,
                                X: !eventStatus.isRunning ? 0 : data.scoreX,
                                Y: !eventStatus.isRunning ? 0 : data.scoreY,
                                Z: !eventStatus.isRunning ? 0 : data.scoreZ
                              }))
                            
                            // Se não há dados ou evento parado, mostra linha plana
                            if (bandData.length === 0 || !eventStatus.isRunning) {
                              bandData = Array.from({length: 5}, (_, i) => ({
                                point: i + 1,
                                X: 0,
                                Y: 0,
                                Z: 0
                              }))
                            }
                            
                            return (
                              <div className="h-20 mb-3">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={bandData}>
                                    <Line type="monotone" dataKey="X" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                                    <Line type="monotone" dataKey="Y" stroke="#22c55e" strokeWidth={1.5} dot={false} />
                                    <Line type="monotone" dataKey="Z" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                                    <Tooltip 
                                      contentStyle={{ fontSize: '12px', padding: '4px 8px' }}
                                      formatter={(value: number, name: string) => [
                                        (!eventStatus.isRunning ? '0.00' : value.toFixed(2)), 
                                        `Eixo ${name}`
                                      ]}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            )
                          })()}
                          
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">X:</span>
                              <span className="ml-1 font-mono text-red-600">
                                {!eventStatus.isRunning ? '0.00' : (latestData?.scoreX.toFixed(2) || '0.00')}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Y:</span>
                              <span className="ml-1 font-mono text-green-600">
                                {!eventStatus.isRunning ? '0.00' : (latestData?.scoreY.toFixed(2) || '0.00')}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Z:</span>
                              <span className="ml-1 font-mono text-blue-600">
                                {!eventStatus.isRunning ? '0.00' : (latestData?.scoreZ.toFixed(2) || '0.00')}
                              </span>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gráfico */}
          <TabsContent value="charts" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pontuação por Pulseira</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Total de pontos gerados por cada pulseira baseado nos valores absolutos de X, Y e Z
                </p>
              </CardHeader>
              <CardContent>
                {scoreHistory.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum dado disponível para exibição</p>
                    <p className="text-sm">Inicie um evento ou aguarde a coleta de dados</p>
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getScoresByBand()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="pulseira" 
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          formatter={(value: number) => [value.toFixed(1), 'Pontos']}
                          labelFormatter={(label) => `Pulseira: ${label}`}
                        />
                        <Legend />
                        <Bar 
                          dataKey="pontos" 
                          fill="#8b5cf6" 
                          name="Total de Pontos"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                {/* Tabela detalhada de pontuação */}
                {scoreHistory.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Detalhamento por Eixo</h4>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {getScoresByBand().map((band) => (
                        <Card key={band.pulseira} className="p-4">
                          <h5 className="font-semibold mb-2">{band.pulseira}</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-red-600">Eixo X:</span>
                              <span className="font-mono">{band['Eixo X']} pts</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-600">Eixo Y:</span>
                              <span className="font-mono">{band['Eixo Y']} pts</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-600">Eixo Z:</span>
                              <span className="font-mono">{band['Eixo Z']} pts</span>
                            </div>
                            <div className="flex justify-between border-t pt-1 font-semibold">
                              <span>Total:</span>
                              <span className="font-mono text-purple-600">{band.pontos} pts</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Eventos */}
          <TabsContent value="events" className="space-y-4 sm:space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Controle de Eventos */}
              <Card>
                <CardHeader>
                  <CardTitle>Controle de Eventos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!eventStatus.isRunning ? (
                    <>
                      <div className="space-y-2">
                        <Label>Preset de Movimento</Label>
                        <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um preset ou configure manualmente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Configuração manual</SelectItem>
                            {MOVEMENT_PRESETS.map((preset) => (
                              <SelectItem key={preset.id} value={preset.id}>
                                {preset.name} ({preset.duration}s - Eixo {preset.axis})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {(!selectedPreset || selectedPreset === 'manual') && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Duração (segundos)</Label>
                              <Input
                                type="number"
                                value={customDuration}
                                onChange={(e) => setCustomDuration(e.target.value)}
                                min="1"
                                max="3600"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Eixo de Movimento</Label>
                              <Select value={customAxis} onValueChange={(value: 'X' | 'Y' | 'Z') => setCustomAxis(value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="X">Eixo X</SelectItem>
                                  <SelectItem value="Y">Eixo Y</SelectItem>
                                  <SelectItem value="Z">Eixo Z</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </>
                      )}

                      <Button 
                        onClick={handleStartEvent}
                        disabled={devices.length === 0}
                        className="w-full"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Iniciar Evento
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-orange-800 dark:text-orange-200">
                            Evento em Andamento
                          </span>
                          <Badge variant="default">{formatTime(getRemainingTime())}</Badge>
                        </div>
                        {eventStatus.selectedPreset ? (
                          <div>
                            <p className="text-sm text-orange-700 dark:text-orange-300">
                              <strong>{eventStatus.selectedPreset.name}</strong>
                            </p>
                            <p className="text-xs text-orange-600 dark:text-orange-400">
                              {eventStatus.selectedPreset.description}
                            </p>
                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                              Eixo: {eventStatus.selectedPreset.axis} | Duração: {eventStatus.selectedPreset.duration}s
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-orange-700 dark:text-orange-300">
                              Evento personalizado
                            </p>
                            <p className="text-xs text-orange-600 dark:text-orange-400">
                              Eixo: {eventStatus.customAxis} | Duração: {eventStatus.customDuration}s
                            </p>
                          </div>
                        )}
                      </div>

                      <Button 
                        onClick={handleStopEvent}
                        variant="destructive"
                        className="w-full"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Parar Evento
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Presets Disponíveis */}
              <Card>
                <CardHeader>
                  <CardTitle>Presets de Movimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {MOVEMENT_PRESETS.map((preset) => (
                      <Card key={preset.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{preset.name}</h3>
                          <Badge variant="outline">
                            Eixo {preset.axis} • {preset.duration}s
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {preset.description}
                        </p>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
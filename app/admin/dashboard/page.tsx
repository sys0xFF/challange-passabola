"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { Bebas_Neue } from "next/font/google"
import { useAdminAuth } from "@/contexts/admin-auth-context"
import { 
  getAdminStats, 
  getAllTeams, 
  getAllIndividuals, 
  getAllVolunteers, 
  getAllDonations, 
  getAllPurchases,
  AdminStats 
} from "@/lib/admin-service"
import { TeamRegistration, IndividualRegistration, VolunteerRegistration, DonationData, PurchaseData } from "@/lib/database-service"
import { DetailModal } from "@/components/admin/detail-modal"
import { StatsCards } from "@/components/admin/stats-cards"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Users, 
  UserCheck, 
  Heart, 
  ShoppingBag, 
  DollarSign, 
  LogOut, 
  Trophy, 
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Download,
  Loader2,
  Eye
} from "lucide-react"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

export default function AdminDashboardPage() {
  const { isAuthenticated, logout, loading } = useAdminAuth()
  const router = useRouter()

  const [stats, setStats] = useState<AdminStats | null>(null)
  const [teams, setTeams] = useState<Array<TeamRegistration & { id: string }>>([])
  const [individuals, setIndividuals] = useState<Array<IndividualRegistration & { id: string }>>([])
  const [volunteers, setVolunteers] = useState<Array<VolunteerRegistration & { id: string }>>([])
  const [donations, setDonations] = useState<Array<DonationData & { id: string }>>([])
  const [purchases, setPurchases] = useState<Array<PurchaseData & { id: string }>>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData()
    }
  }, [isAuthenticated])

  const loadDashboardData = async () => {
    try {
      setDataLoading(true)
      const [statsData, teamsData, individualsData, volunteersData, donationsData, purchasesData] = await Promise.all([
        getAdminStats(),
        getAllTeams(),
        getAllIndividuals(),
        getAllVolunteers(),
        getAllDonations(),
        getAllPurchases()
      ])

      setStats(statsData)
      setTeams(teamsData)
      setIndividuals(individualsData)
      setVolunteers(volunteersData)
      setDonations(donationsData)
      setPurchases(purchasesData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setDataLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/admin")
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  if (loading || !isAuthenticated) {
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
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="relative h-10 w-10">
                <Image src="/logo.png" alt="Passa Bola Logo" fill className="object-contain" />
              </div>
              <div>
                <h1 className={`${bebasNeue.className} text-2xl text-[#8e44ad] dark:text-primary tracking-wider`}>
                  PAINEL ADMINISTRATIVO
                </h1>
                <Badge className="bg-[#c2ff28] text-[#8e44ad] mt-1">COPA PASSA BOLA 2025</Badge>
              </div>
            </div>

            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Equipes</span>
            </TabsTrigger>
            <TabsTrigger value="individuals" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Individuais</span>
            </TabsTrigger>
            <TabsTrigger value="volunteers" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Voluntários</span>
            </TabsTrigger>
            <TabsTrigger value="donations" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Doações</span>
            </TabsTrigger>
            <TabsTrigger value="purchases" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Compras</span>
            </TabsTrigger>
          </TabsList>

          {dataLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Carregando dados...</span>
              </div>
            </div>
          ) : (
            <>
              <TabsContent value="overview" className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className={`${bebasNeue.className} text-3xl mb-6 tracking-wider`}>
                    VISÃO GERAL DO SISTEMA
                  </h2>

                  {stats && <StatsCards stats={stats} />}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5" />
                          Resumo de Participantes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Equipes registradas:</span>
                            <Badge variant="outline">{stats?.totalTeams || 0}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Jogadoras individuais:</span>
                            <Badge variant="outline">{stats?.totalIndividuals || 0}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Voluntárias cadastradas:</span>
                            <Badge variant="outline">{stats?.totalVolunteers || 0}</Badge>
                          </div>
                          <hr />
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold">Total de participantes:</span>
                            <Badge className="bg-[#8e44ad] text-white">
                              {(stats?.totalTeams || 0) + (stats?.totalIndividuals || 0) + (stats?.totalVolunteers || 0)}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Resumo Financeiro
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Vendas da loja:</span>
                            <span className="font-bold text-green-600">{formatCurrency(stats?.totalRevenue || 0)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Doações recebidas:</span>
                            <span className="font-bold text-blue-600">{formatCurrency(stats?.totalDonationAmount || 0)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Pedidos processados:</span>
                            <Badge variant="outline">{stats?.totalPurchases || 0}</Badge>
                          </div>
                          <hr />
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold">Receita total:</span>
                            <span className="text-lg font-bold text-[#8e44ad]">
                              {formatCurrency((stats?.totalRevenue || 0) + (stats?.totalDonationAmount || 0))}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="teams" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className={`${bebasNeue.className} text-3xl tracking-wider`}>
                    EQUIPES REGISTRADAS ({teams.length})
                  </h2>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome da Equipe</TableHead>
                          <TableHead>Capitão</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>Data de Registro</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teams.map((team) => (
                          <TableRow key={team.id}>
                            <TableCell className="font-medium">{team.teamData.nomeTime}</TableCell>
                            <TableCell>{team.captainData.nomeCompleto}</TableCell>
                            <TableCell className="flex items-center gap-1">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {team.captainData.email}
                            </TableCell>
                            <TableCell className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {team.captainData.telefone}
                            </TableCell>
                            <TableCell className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatDate(team.registrationDate)}
                            </TableCell>
                            <TableCell>
                              <DetailModal
                                trigger={
                                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    Ver Detalhes
                                  </Button>
                                }
                                title={`Equipe: ${team.teamData.nomeTime}`}
                                data={team}
                                type="team"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        {teams.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              Nenhuma equipe registrada ainda
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="individuals" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className={`${bebasNeue.className} text-3xl tracking-wider`}>
                    JOGADORAS INDIVIDUAIS ({individuals.length})
                  </h2>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Idade</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Posição</TableHead>
                          <TableHead>Cidade/Bairro</TableHead>
                          <TableHead>Data de Registro</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {individuals.map((individual) => (
                          <TableRow key={individual.id}>
                            <TableCell className="font-medium">{individual.captainData.nomeCompleto}</TableCell>
                            <TableCell>{individual.captainData.idade} anos</TableCell>
                            <TableCell className="flex items-center gap-1">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {individual.captainData.email}
                            </TableCell>
                            <TableCell>{individual.captainData.posicao}</TableCell>
                            <TableCell className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {individual.captainData.cidadeBairro}
                            </TableCell>
                            <TableCell className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatDate(individual.registrationDate)}
                            </TableCell>
                            <TableCell>
                              <DetailModal
                                trigger={
                                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    Ver Detalhes
                                  </Button>
                                }
                                title={`Jogadora: ${individual.captainData.nomeCompleto}`}
                                data={individual}
                                type="individual"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        {individuals.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                              Nenhuma jogadora individual registrada ainda
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="volunteers" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className={`${bebasNeue.className} text-3xl tracking-wider`}>
                    VOLUNTÁRIAS CADASTRADAS ({volunteers.length})
                  </h2>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Áreas de Interesse</TableHead>
                          <TableHead>Profissão</TableHead>
                          <TableHead>Data de Registro</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {volunteers.map((volunteer) => (
                          <TableRow key={volunteer.id}>
                            <TableCell className="font-medium">{volunteer.formData.nomeCompleto}</TableCell>
                            <TableCell className="flex items-center gap-1">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {volunteer.formData.email}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {volunteer.selectedAreas.map((area) => (
                                  <Badge key={area} variant="secondary" className="text-xs">
                                    {area}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{volunteer.formData.profissao}</TableCell>
                            <TableCell className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatDate(volunteer.registrationDate)}
                            </TableCell>
                            <TableCell>
                              <DetailModal
                                trigger={
                                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    Ver Detalhes
                                  </Button>
                                }
                                title={`Voluntária: ${volunteer.formData.nomeCompleto}`}
                                data={volunteer}
                                type="volunteer"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        {volunteers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              Nenhuma voluntária cadastrada ainda
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="donations" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className={`${bebasNeue.className} text-3xl tracking-wider`}>
                    DOAÇÕES RECEBIDAS ({donations.length})
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total arrecadado</p>
                      <p className="text-2xl font-bold text-[#8e44ad]">
                        {formatCurrency(stats?.totalDonationAmount || 0)}
                      </p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Exportar
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Doador</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Método de Pagamento</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {donations.map((donation) => (
                          <TableRow key={donation.id}>
                            <TableCell>
                              <Badge 
                                variant={donation.donationType === 'identified' ? 'default' : 'secondary'}
                              >
                                {donation.donationType === 'identified' ? 'Identificada' : 'Anônima'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {donation.donationType === 'identified' && donation.donorData 
                                ? donation.donorData.nomeCompleto 
                                : 'Anônimo'
                              }
                            </TableCell>
                            <TableCell className="font-medium text-green-600">
                              {formatCurrency(donation.amount)}
                            </TableCell>
                            <TableCell className="flex items-center gap-1">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              {donation.paymentMethod.toUpperCase()}
                            </TableCell>
                            <TableCell className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatDate(donation.donationDate)}
                            </TableCell>
                            <TableCell>
                              <DetailModal
                                trigger={
                                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    Ver Detalhes
                                  </Button>
                                }
                                title={`Doação: ${formatCurrency(donation.amount)}`}
                                data={donation}
                                type="donation"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        {donations.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              Nenhuma doação recebida ainda
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="purchases" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className={`${bebasNeue.className} text-3xl tracking-wider`}>
                    COMPRAS DA LOJA ({purchases.length})
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Receita total</p>
                      <p className="text-2xl font-bold text-[#8e44ad]">
                        {formatCurrency(stats?.totalRevenue || 0)}
                      </p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Exportar
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pedido</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Itens</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Pagamento</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {purchases.map((purchase) => (
                          <TableRow key={purchase.id}>
                            <TableCell className="font-mono text-sm">
                              #{purchase.orderId}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{purchase.customerData.nomeCompleto}</p>
                                <p className="text-sm text-muted-foreground">{purchase.customerData.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {purchase.items.length} {purchase.items.length === 1 ? 'item' : 'itens'}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-green-600">
                              {formatCurrency(purchase.pricing.total)}
                            </TableCell>
                            <TableCell className="flex items-center gap-1">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              {purchase.paymentMethod.toUpperCase()}
                            </TableCell>
                            <TableCell className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatDate(purchase.purchaseDate)}
                            </TableCell>
                            <TableCell>
                              <DetailModal
                                trigger={
                                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    Ver Detalhes
                                  </Button>
                                }
                                title={`Pedido: #${purchase.orderId}`}
                                data={purchase}
                                type="purchase"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        {purchases.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                              Nenhuma compra registrada ainda
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  )
}

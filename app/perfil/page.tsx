"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthButton } from '@/components/ui/auth-button'
import { 
  User, 
  Calendar,
  Mail,
  MapPin,
  Trophy,
  Heart,
  ShoppingBag,
  UserCheck,
  ArrowLeft,
  Edit,
  Save,
  Loader2,
  CheckCircle,
  Package,
  CreditCard
} from 'lucide-react'
import { Bebas_Neue } from 'next/font/google'
import { ref, get } from 'firebase/database'
import { database } from '@/lib/firebase'

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

interface UserActivity {
  teams: any[]
  individuals: any[]
  volunteers: any[]
  donations: any[]
  purchases: any[]
}

export default function PerfilPage() {
  const { user, loading, updateUserData } = useAuth()
  const router = useRouter()
  const [activities, setActivities] = useState<UserActivity>({
    teams: [],
    individuals: [],
    volunteers: [],
    donations: [],
    purchases: []
  })
  const [loadingActivities, setLoadingActivities] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    cidade: user?.cidade || '',
    estadoCivil: user?.estadoCivil || ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name,
        email: user.email,
        telefone: user.telefone || '',
        cidade: user.cidade || '',
        estadoCivil: user.estadoCivil || ''
      })
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadUserActivities()
    }
  }, [user])

  const loadUserActivities = async () => {
    if (!user) return

    try {
      setLoadingActivities(true)
      
      // Carregar todas as atividades do usuário em paralelo
      const [teamsSnapshot, individualsSnapshot, volunteersSnapshot, donationsSnapshot, purchasesSnapshot] = await Promise.all([
        get(ref(database, 'Teams')),
        get(ref(database, 'Individuals')),
        get(ref(database, 'volunteers')),
        get(ref(database, 'donors')),
        get(ref(database, 'purchases'))
      ])

      // Filtrar apenas as atividades do usuário atual
      const userId = user.id

      const userTeams = teamsSnapshot.exists() 
        ? Object.entries(teamsSnapshot.val()).filter(([_, team]: [string, any]) => 
            team.userId === userId
          ).map(([id, team]: [string, any]) => ({ id, ...team }))
        : []

      const userIndividuals = individualsSnapshot.exists()
        ? Object.entries(individualsSnapshot.val()).filter(([_, individual]: [string, any]) => 
            individual.userId === userId
          ).map(([id, individual]: [string, any]) => ({ id, ...individual }))
        : []

      const userVolunteers = volunteersSnapshot.exists()
        ? Object.entries(volunteersSnapshot.val()).filter(([_, volunteer]: [string, any]) => 
            volunteer.userId === userId
          ).map(([id, volunteer]: [string, any]) => ({ id, ...volunteer }))
        : []

      const userDonations = donationsSnapshot.exists()
        ? Object.entries(donationsSnapshot.val()).filter(([_, donation]: [string, any]) => 
            donation.userId === userId
          ).map(([id, donation]: [string, any]) => ({ id, ...donation }))
        : []

      const userPurchases = purchasesSnapshot.exists()
        ? Object.entries(purchasesSnapshot.val()).filter(([_, purchase]: [string, any]) => 
            purchase.userId === userId
          ).map(([id, purchase]: [string, any]) => ({ id, ...purchase }))
        : []

      setActivities({
        teams: userTeams,
        individuals: userIndividuals,
        volunteers: userVolunteers,
        donations: userDonations,
        purchases: userPurchases
      })
    } catch (error) {
      console.error('Error loading user activities:', error)
    } finally {
      setLoadingActivities(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    const success = await updateUserData({
      name: editData.name,
      email: editData.email,
      telefone: editData.telefone,
      cidade: editData.cidade,
      estadoCivil: editData.estadoCivil
    })
    
    if (success) {
      setEditMode(false)
    }
    setSaving(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#8e44ad] to-[#9b59b6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const initials = user.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const totalActivities = activities.teams.length + activities.individuals.length + 
                         activities.volunteers.length + activities.donations.length + 
                         activities.purchases.length

  const totalSpent = activities.purchases.reduce((sum, purchase) => sum + purchase.pricing.total, 0) +
                    activities.donations.reduce((sum, donation) => sum + donation.amount, 0)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800">
        <div className="container mx-auto px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-3 items-center">
            <div className="flex justify-start">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative h-10 w-10 md:h-12 md:w-12">
                  <Image src="/logo.png" alt="Passa Bola Logo" fill className="object-contain" />
                </div>
                <span className="font-bold text-xl text-primary dark:text-white">PASSA BOLA</span>
              </Link>
            </div>
            <div className="hidden md:flex justify-center">
              <Badge className="bg-[#8e44ad] text-white">MEU PERFIL</Badge>
            </div>
            <div className="flex justify-end items-center gap-2">
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-[#8e44ad] to-[#9b59b6] text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-white">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-white text-[#8e44ad] text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <h1 className={`${bebasNeue.className} text-4xl md:text-5xl mb-2 tracking-wider`}>
                {user.name}
              </h1>
              
              <p className="text-xl opacity-90 mb-4">{user.email}</p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Membro desde {formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>{totalActivities} atividades</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar - Informações do perfil */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Perfil
                      </span>
                      {!editMode && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditMode(true)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editMode ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nome</Label>
                          <Input
                            id="name"
                            value={editData.name}
                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input
                            id="telefone"
                            type="tel"
                            value={editData.telefone}
                            onChange={(e) => setEditData(prev => ({ ...prev, telefone: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cidade">Cidade</Label>
                          <Input
                            id="cidade"
                            value={editData.cidade}
                            onChange={(e) => setEditData(prev => ({ ...prev, cidade: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="estadoCivil">Estado Civil</Label>
                          <Input
                            id="estadoCivil"
                            value={editData.estadoCivil}
                            onChange={(e) => setEditData(prev => ({ ...prev, estadoCivil: e.target.value }))}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveProfile} disabled={saving} size="sm">
                            {saving ? (
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            ) : (
                              <Save className="mr-2 h-3 w-3" />
                            )}
                            Salvar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditMode(false)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Nome</div>
                          <div>{user.name}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Email</div>
                          <div>{user.email}</div>
                        </div>
                        {user.telefone && (
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Telefone</div>
                            <div>{user.telefone}</div>
                          </div>
                        )}
                        {user.cidade && (
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Cidade</div>
                            <div>{user.cidade}</div>
                          </div>
                        )}
                        {user.estadoCivil && (
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Estado Civil</div>
                            <div>{user.estadoCivil}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Membro desde</div>
                          <div>{formatDate(user.createdAt)}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Estatísticas rápidas */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-base">Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total gasto</span>
                      <span className="font-medium">{formatCurrency(totalSpent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Atividades</span>
                      <span className="font-medium">{totalActivities}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Compras</span>
                      <span className="font-medium">{activities.purchases.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Doações</span>
                      <span className="font-medium">{activities.donations.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Conteúdo principal - Atividades */}
              <div className="lg:col-span-3">
                <Tabs defaultValue="resumo" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="resumo">Resumo</TabsTrigger>
                    <TabsTrigger value="teams">Times</TabsTrigger>
                    <TabsTrigger value="individuals">Individual</TabsTrigger>
                    <TabsTrigger value="volunteers">Voluntário</TabsTrigger>
                    <TabsTrigger value="donations">Doações</TabsTrigger>
                    <TabsTrigger value="purchases">Compras</TabsTrigger>
                  </TabsList>

                  {loadingActivities ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <TabsContent value="resumo" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <Card>
                            <CardContent className="p-6 text-center">
                              <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
                              <div className="text-2xl font-bold">{activities.teams.length}</div>
                              <div className="text-sm text-muted-foreground">Times</div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-6 text-center">
                              <User className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                              <div className="text-2xl font-bold">{activities.individuals.length}</div>
                              <div className="text-sm text-muted-foreground">Individual</div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-6 text-center">
                              <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                              <div className="text-2xl font-bold">{activities.donations.length}</div>
                              <div className="text-sm text-muted-foreground">Doações</div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-6 text-center">
                              <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-green-500" />
                              <div className="text-2xl font-bold">{activities.purchases.length}</div>
                              <div className="text-sm text-muted-foreground">Compras</div>
                            </CardContent>
                          </Card>
                        </div>

                        {totalActivities === 0 ? (
                          <Card>
                            <CardContent className="p-12 text-center">
                              <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                              <h3 className="text-lg font-semibold mb-2">Nenhuma atividade ainda</h3>
                              <p className="text-muted-foreground mb-6">
                                Comece participando das atividades da Copa Passa Bola!
                              </p>
                              <div className="flex flex-wrap justify-center gap-4">
                                <Button asChild>
                                  <Link href="/cadastro">Inscrever Time</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                  <Link href="/doacao">Fazer Doação</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                  <Link href="/loja">Visitar Loja</Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card>
                            <CardHeader>
                              <CardTitle>Atividades Recentes</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {/* Mostrar últimas atividades de cada tipo */}
                                {activities.teams.length > 0 && (
                                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <Trophy className="h-5 w-5 text-primary" />
                                    <div className="flex-1">
                                      <div className="font-medium">Time registrado</div>
                                      <div className="text-sm text-muted-foreground">
                                        {activities.teams[activities.teams.length - 1].teamData.nomeTime}
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {formatDate(activities.teams[activities.teams.length - 1].registrationDate)}
                                    </div>
                                  </div>
                                )}
                                
                                {activities.individuals.length > 0 && (
                                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <UserCheck className="h-5 w-5 text-blue-500" />
                                    <div className="flex-1">
                                      <div className="font-medium">Cadastro individual</div>
                                      <div className="text-sm text-muted-foreground">
                                        {activities.individuals[activities.individuals.length - 1].captainData.nomeCompleto}
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {formatDate(activities.individuals[activities.individuals.length - 1].registrationDate)}
                                    </div>
                                  </div>
                                )}
                                
                                {activities.volunteers.length > 0 && (
                                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <Heart className="h-5 w-5 text-purple-500" />
                                    <div className="flex-1">
                                      <div className="font-medium">Voluntariado registrado</div>
                                      <div className="text-sm text-muted-foreground">
                                        {activities.volunteers[activities.volunteers.length - 1].formData.nomeCompleto}
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {formatDate(activities.volunteers[activities.volunteers.length - 1].registrationDate)}
                                    </div>
                                  </div>
                                )}
                                
                                {activities.purchases.length > 0 && (
                                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <ShoppingBag className="h-5 w-5 text-green-500" />
                                    <div className="flex-1">
                                      <div className="font-medium">Compra realizada</div>
                                      <div className="text-sm text-muted-foreground">
                                        {formatCurrency(activities.purchases[activities.purchases.length - 1].pricing.total)}
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {formatDate(activities.purchases[activities.purchases.length - 1].purchaseDate)}
                                    </div>
                                  </div>
                                )}
                                
                                {activities.donations.length > 0 && (
                                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <Heart className="h-5 w-5 text-red-500" />
                                    <div className="flex-1">
                                      <div className="font-medium">Doação feita</div>
                                      <div className="text-sm text-muted-foreground">
                                        {formatCurrency(activities.donations[activities.donations.length - 1].amount)}
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {formatDate(activities.donations[activities.donations.length - 1].donationDate)}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>

                      <TabsContent value="teams" className="space-y-6">
                        {activities.teams.length === 0 ? (
                          <Card>
                            <CardContent className="p-12 text-center">
                              <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                              <h3 className="text-lg font-semibold mb-2">Nenhum time registrado</h3>
                              <p className="text-muted-foreground mb-6">
                                Registre seu time para participar da Copa Passa Bola!
                              </p>
                              <Button asChild>
                                <Link href="/cadastro">Registrar Time</Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="space-y-4">
                            {activities.teams.map((team: any) => (
                              <Card key={team.id}>
                                <CardContent className="p-6">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-lg">{team.teamData.nomeTime}</h3>
                                      <p className="text-muted-foreground">
                                        Capitão: {team.captainData.nomeCompleto}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {team.players.length + 1} jogadores
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <Badge variant="outline">
                                        {formatDate(team.registrationDate)}
                                      </Badge>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="individuals" className="space-y-6">
                        {activities.individuals.length === 0 ? (
                          <Card>
                            <CardContent className="p-12 text-center">
                              <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                              <h3 className="text-lg font-semibold mb-2">Nenhuma inscrição individual</h3>
                              <p className="text-muted-foreground mb-6">
                                Registre-se como jogadora individual!
                              </p>
                              <Button asChild>
                                <Link href="/cadastro">Registrar-se</Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="space-y-4">
                            {activities.individuals.map((individual: any) => (
                              <Card key={individual.id}>
                                <CardContent className="p-6">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-lg">{individual.captainData.nomeCompleto}</h3>
                                      <p className="text-muted-foreground">
                                        Posição: {individual.captainData.posicao}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {individual.captainData.cidadeBairro}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <Badge variant="outline">
                                        {formatDate(individual.registrationDate)}
                                      </Badge>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="volunteers" className="space-y-6">
                        {activities.volunteers.length === 0 ? (
                          <Card>
                            <CardContent className="p-12 text-center">
                              <UserCheck className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                              <h3 className="text-lg font-semibold mb-2">Não é voluntária ainda</h3>
                              <p className="text-muted-foreground mb-6">
                                Torne-se uma voluntária da Copa Passa Bola!
                              </p>
                              <Button asChild>
                                <Link href="/voluntaria">Ser Voluntária</Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="space-y-4">
                            {activities.volunteers.map((volunteer: any) => (
                              <Card key={volunteer.id}>
                                <CardContent className="p-6">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-lg">Cadastro de Voluntária</h3>
                                      <p className="text-muted-foreground">
                                        Áreas: {volunteer.selectedAreas.join(', ')}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {volunteer.formData.cidadeBairro}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <Badge variant="outline">
                                        {formatDate(volunteer.registrationDate)}
                                      </Badge>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="donations" className="space-y-6">
                        {activities.donations.length === 0 ? (
                          <Card>
                            <CardContent className="p-12 text-center">
                              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                              <h3 className="text-lg font-semibold mb-2">Nenhuma doação feita</h3>
                              <p className="text-muted-foreground mb-6">
                                Ajude a Copa Passa Bola com sua doação!
                              </p>
                              <Button asChild>
                                <Link href="/doacao">Fazer Doação</Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="space-y-4">
                            {activities.donations.map((donation: any) => (
                              <Card key={donation.id}>
                                <CardContent className="p-6">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-lg">
                                        Doação de {formatCurrency(donation.amount)}
                                      </h3>
                                      <p className="text-muted-foreground">
                                        Método: {donation.paymentMethod.toUpperCase()}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        Tipo: {donation.donationType === 'identified' ? 'Identificada' : 'Anônima'}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <Badge variant="outline">
                                        {formatDate(donation.donationDate)}
                                      </Badge>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="purchases" className="space-y-6">
                        {activities.purchases.length === 0 ? (
                          <Card>
                            <CardContent className="p-12 text-center">
                              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                              <h3 className="text-lg font-semibold mb-2">Nenhuma compra feita</h3>
                              <p className="text-muted-foreground mb-6">
                                Visite nossa loja e adquira produtos oficiais!
                              </p>
                              <Button asChild>
                                <Link href="/loja">Visitar Loja</Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="space-y-4">
                            {activities.purchases.map((purchase: any) => (
                              <Card key={purchase.id}>
                                <CardContent className="p-6">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-lg">
                                        Pedido #{purchase.orderId}
                                      </h3>
                                      <p className="text-muted-foreground">
                                        {purchase.items.length} {purchase.items.length === 1 ? 'item' : 'itens'} - {formatCurrency(purchase.pricing.total)}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {purchase.paymentMethod.toUpperCase()}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <Badge variant="outline">
                                        {formatDate(purchase.purchaseDate)}
                                      </Badge>
                                    </div>
                                  </div>
                                  <Separator className="my-4" />
                                  <div className="space-y-2">
                                    {purchase.items.map((item: any, index: number) => (
                                      <div key={index} className="flex justify-between text-sm">
                                        <span>{item.name} {item.selectedSize && `(${item.selectedSize})`}</span>
                                        <span>
                                          {item.quantity}x {formatCurrency(item.price)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </>
                  )}
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

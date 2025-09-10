"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AdminStats } from "@/lib/admin-service"
import { 
  Users, 
  Trophy, 
  Heart, 
  ShoppingBag, 
  TrendingUp,
  Target,
  Calendar,
  DollarSign,
  UserCheck
} from "lucide-react"

interface StatsCardsProps {
  stats: AdminStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const totalParticipants = stats.totalTeams + stats.totalIndividuals
  const totalRevenue = stats.totalRevenue + stats.totalDonationAmount

  // Metas fictícias para demonstração
  const goalTeams = 50
  const goalVolunteers = 100
  const goalRevenue = 50000

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Usuários Cadastrados */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usuários</CardTitle>
          <UserCheck className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{stats.totalUsers}</div>
          <p className="text-xs text-blue-600 mt-1">
            usuários cadastrados
          </p>
        </CardContent>
      </Card>

      {/* Torneios */}
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Torneios</CardTitle>
          <Trophy className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-700">{stats.totalTournaments}</div>
          <p className="text-xs text-amber-600 mt-1">
            jogos criados
          </p>
        </CardContent>
      </Card>

      {/* Participantes */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Participantes</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{totalParticipants}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-blue-500 text-white">{stats.totalTeams} equipes</Badge>
            <Badge variant="outline" className="border-blue-300">{stats.totalIndividuals} individuais</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Meta de Equipes */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Meta de Equipes</CardTitle>
          <Target className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">{stats.totalTeams}/{goalTeams}</div>
          <Progress 
            value={(stats.totalTeams / goalTeams) * 100} 
            className="mt-3 h-2"
          />
          <p className="text-xs text-purple-600 mt-2">
            {((stats.totalTeams / goalTeams) * 100).toFixed(0)}% da meta
          </p>
        </CardContent>
      </Card>

      {/* Voluntárias */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Voluntárias</CardTitle>
          <Heart className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{stats.totalVolunteers}/{goalVolunteers}</div>
          <Progress 
            value={(stats.totalVolunteers / goalVolunteers) * 100} 
            className="mt-3 h-2"
          />
          <p className="text-xs text-green-600 mt-2">
            {((stats.totalVolunteers / goalVolunteers) * 100).toFixed(0)}% da meta
          </p>
        </CardContent>
      </Card>

      {/* Receita da Loja */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita da Loja</CardTitle>
          <ShoppingBag className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-orange-700">{formatCurrency(stats.totalRevenue)}</div>
          <p className="text-xs text-orange-600 mt-1">
            {stats.totalPurchases} {stats.totalPurchases === 1 ? 'pedido' : 'pedidos'}
          </p>
        </CardContent>
      </Card>

      {/* Total em Doações */}
      <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border-pink-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doações</CardTitle>
          <Heart className="h-4 w-4 text-pink-600" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-pink-700">{formatCurrency(stats.totalDonationAmount)}</div>
          <p className="text-xs text-pink-600 mt-1">
            {stats.totalDonations} {stats.totalDonations === 1 ? 'doação' : 'doações'}
          </p>
        </CardContent>
      </Card>

      {/* Meta de Receita */}
      <Card className="bg-gradient-to-br from-[#8e44ad]/10 to-[#9b59b6]/10 border-[#8e44ad]/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Meta de Receita</CardTitle>
          <TrendingUp className="h-4 w-4 text-[#8e44ad]" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-[#8e44ad]">{formatCurrency(totalRevenue)}/{formatCurrency(goalRevenue)}</div>
          <Progress 
            value={(totalRevenue / goalRevenue) * 100} 
            className="mt-3 h-2"
          />
          <p className="text-xs text-[#8e44ad] mt-2">
            {((totalRevenue / goalRevenue) * 100).toFixed(0)}% da meta
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

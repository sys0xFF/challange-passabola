"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Bebas_Neue } from "next/font/google"
import { useAdminAuth } from "@/contexts/admin-auth-context"
import { 
  getAdminStats, 
  getAllTeams, 
  getAllIndividuals, 
  getAllVolunteers, 
  getAllDonations, 
  getAllPurchases,
  getAllTournaments,
  getAllGames,
  getAllTickets,
  getAllUsers,
  deleteUser,
  deleteGame,
  getUserById,
  updateUserPoints,
  AdminStats 
} from "@/lib/admin-service"
import { TeamRegistration, IndividualRegistration, VolunteerRegistration, DonationData, PurchaseData, Tournament, Game, TicketPurchase } from "@/lib/database-service"
import { DetailModal } from "@/components/admin/detail-modal"
import { StatsCards } from "@/components/admin/stats-cards"
import { TournamentCreateModal } from "@/components/admin/tournament-create-modal"
import { TournamentDetailsModal } from "@/components/admin/tournament-details-modal"
import { GameCreateModal } from "@/components/admin/game-create-modal"
import { GameDetailsModal } from "@/components/admin/game-details-modal"
import { UserCreateModal } from "@/components/admin/user-create-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Eye,
  Play,
  Pause,
  Settings,
  Database,
  Trash2,
  User,
  UserPlus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Search,
  X,
  Check,
  Edit
} from "lucide-react"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

// Componente de controles de filtro e ordenação
const FilterAndSortControls = ({ 
  tab, 
  sortOptions, 
  filters, 
  sortConfig, 
  onFilter, 
  onSort 
}: { 
  tab: string
  sortOptions: { key: string, label: string, type?: 'text' | 'number' | 'date' }[]
  filters: { [key: string]: string }
  sortConfig: { key: string; direction: 'asc' | 'desc'; tab: string }
  onFilter: (value: string, tab: string) => void
  onSort: (key: string, direction: 'asc' | 'desc', tab: string) => void
}) => {
  const getSortText = (option: { key: string, label: string, type?: 'text' | 'number' | 'date' }, direction: 'asc' | 'desc') => {
    switch (option.type) {
      case 'date':
        return direction === 'asc' ? `${option.label} (Mais Antigo)` : `${option.label} (Mais Recente)`
      case 'number':
        return direction === 'asc' ? `${option.label} (Menor)` : `${option.label} (Maior)`
      default:
        return direction === 'asc' ? `${option.label} (A → Z)` : `${option.label} (Z → A)`
    }
  }

  return (
    <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 items-start xl:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center w-full xl:w-auto">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Input
            placeholder="Filtrar..."
            value={filters[tab] || ''}
            onChange={(e) => onFilter(e.target.value, tab)}
            className="w-full sm:w-64"
          />
          {filters[tab] && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilter('', tab)}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium whitespace-nowrap">Ordenar por:</span>
          </div>
          <Select 
            value={sortConfig.tab === tab ? `${sortConfig.key}-${sortConfig.direction}` : 'date-desc'} 
            onValueChange={(value) => {
              if (value) {
                const [key, direction] = value.split('-')
                onSort(key, direction as 'asc' | 'desc', tab)
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <div key={option.key}>
                  <SelectItem value={`${option.key}-asc`}>
                    {getSortText(option, 'asc')}
                  </SelectItem>
                  <SelectItem value={`${option.key}-desc`}>
                    {getSortText(option, 'desc')}
                  </SelectItem>
                </div>
              ))}
            </SelectContent>
          </Select>
          
          {sortConfig.tab === tab && sortConfig.key && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSort('', 'asc', '')}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const { isAuthenticated, logout, loading } = useAdminAuth()
  const router = useRouter()

  const [stats, setStats] = useState<AdminStats | null>(null)
  const [teams, setTeams] = useState<Array<TeamRegistration & { id: string }>>([])
  const [individuals, setIndividuals] = useState<Array<IndividualRegistration & { id: string }>>([])
  const [volunteers, setVolunteers] = useState<Array<VolunteerRegistration & { id: string }>>([])
  const [donations, setDonations] = useState<Array<DonationData & { id: string }>>([])
  const [purchases, setPurchases] = useState<Array<PurchaseData & { id: string }>>([])
  const [tournaments, setTournaments] = useState<Array<Tournament & { id: string }>>([])
  const [games, setGames] = useState<Array<Game & { id: string }>>([])
  const [tickets, setTickets] = useState<Array<TicketPurchase & { id: string }>>([])
  const [users, setUsers] = useState<Array<any & { id: string }>>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [tournamentView, setTournamentView] = useState<'tournaments' | 'games'>('tournaments')
  
  // Estados para modais e seleções
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<any | null>(null)
  const [editingPoints, setEditingPoints] = useState<{[key: string]: boolean}>({})
  const [tempPoints, setTempPoints] = useState<{[key: string]: string}>({})

  // Estados para ordenação e filtros
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
    tab: string
  }>({ key: 'date', direction: 'desc', tab: 'users' })
  
  const [filters, setFilters] = useState<{
    [key: string]: string
  }>({
    users: '',
    tournaments: '',
    teams: '',
    individuals: '',
    volunteers: '',
    donations: '',
    purchases: ''
  })

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
      const [statsData, teamsData, individualsData, volunteersData, donationsData, purchasesData, tournamentsData, gamesData, ticketsData, usersData] = await Promise.all([
        getAdminStats(),
        getAllTeams(),
        getAllIndividuals(),
        getAllVolunteers(),
        getAllDonations(),
        getAllPurchases(),
        getAllTournaments(),
        getAllGames(),
        getAllTickets(),
        getAllUsers()
      ])

      setStats(statsData)
      setTeams(teamsData)
      setIndividuals(individualsData)
      setVolunteers(volunteersData)
      setDonations(donationsData)
      setPurchases(purchasesData)
      setTournaments(tournamentsData)
      setGames(gamesData)
      setTickets(ticketsData)
      setUsers(usersData)
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

  // Funções para gerenciar usuários
  const handleViewUser = async (userId: string) => {
    try {
      const userData = await getUserById(userId)
      setSelectedUser(userData)
      setIsUserModalOpen(true)
    } catch (error) {
      console.error('Error fetching user details:', error)
      alert('Erro ao buscar detalhes do usuário')
    }
  }

  const handleDeleteUser = async (user: any) => {
    if (window.confirm(`Tem certeza que deseja deletar o usuário ${user.name}?`)) {
      try {
        const result = await deleteUser(user.id)
        if (result.success) {
          // Recarregar dados
          await loadDashboardData()
          alert('Usuário deletado com sucesso!')
        } else {
          alert('Erro ao deletar usuário')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Erro ao deletar usuário')
      }
    }
  }

  const handleEditPoints = (userId: string, currentPoints: number) => {
    setEditingPoints(prev => ({ ...prev, [userId]: true }))
    setTempPoints(prev => ({ ...prev, [userId]: currentPoints.toString() }))
  }

  const handleSavePoints = async (userId: string) => {
    const newPoints = parseInt(tempPoints[userId] || '0')
    if (isNaN(newPoints) || newPoints < 0) {
      alert('Por favor, insira um número válido de pontos')
      return
    }

    try {
      const result = await updateUserPoints(userId, newPoints)
      if (result.success) {
        setEditingPoints(prev => ({ ...prev, [userId]: false }))
        setTempPoints(prev => ({ ...prev, [userId]: '' }))
        await loadDashboardData() // Recarregar para ver as mudanças
        alert('Pontos atualizados com sucesso!')
      } else {
        alert('Erro ao atualizar pontos')
      }
    } catch (error) {
      console.error('Error updating points:', error)
      alert('Erro ao atualizar pontos')
    }
  }

  const handleCancelEditPoints = (userId: string) => {
    setEditingPoints(prev => ({ ...prev, [userId]: false }))
    setTempPoints(prev => ({ ...prev, [userId]: '' }))
  }

  // Função para encontrar usuário por ID (para exibir nos detalhes de outras abas)
  const findUserById = (userId: string) => {
    return users.find(user => user.id === userId) || { name: 'Usuário não encontrado', email: 'N/A' }
  }

  // Funções de ordenação e filtro
  const handleSort = useCallback((key: string, direction: 'asc' | 'desc', tab: string) => {
    setSortConfig({ key, direction, tab })
  }, [])

  const handleFilter = useCallback((value: string, tab: string) => {
    setFilters(prev => ({ ...prev, [tab]: value }))
  }, [])

  const getSortedAndFilteredData = (data: any[], tab: string) => {
    let filteredData = [...data]

    // Aplicar filtro
    const filterValue = filters[tab]?.toLowerCase() || ''
    if (filterValue) {
      filteredData = data.filter(item => {
        switch (tab) {
          case 'users':
            return (item.name?.toLowerCase().includes(filterValue) ||
                   item.email?.toLowerCase().includes(filterValue) ||
                   item.cidade?.toLowerCase().includes(filterValue))
          
          case 'tournaments':
            return (item.name?.toLowerCase().includes(filterValue) ||
                   item.status?.toLowerCase().includes(filterValue))
          
          case 'teams':
            return (item.teamData?.nomeTime?.toLowerCase().includes(filterValue) ||
                   item.captainData?.nomeCompleto?.toLowerCase().includes(filterValue) ||
                   item.captainData?.email?.toLowerCase().includes(filterValue))
          
          case 'individuals':
            return (item.captainData?.nomeCompleto?.toLowerCase().includes(filterValue) ||
                   item.captainData?.email?.toLowerCase().includes(filterValue) ||
                   item.captainData?.posicao?.toLowerCase().includes(filterValue))
          
          case 'volunteers':
            return (item.formData?.nomeCompleto?.toLowerCase().includes(filterValue) ||
                   item.formData?.email?.toLowerCase().includes(filterValue) ||
                   item.formData?.profissao?.toLowerCase().includes(filterValue))
          
          case 'donations':
            return (item.donorData?.nomeCompleto?.toLowerCase().includes(filterValue) ||
                   item.paymentMethod?.toLowerCase().includes(filterValue) ||
                   item.donationType?.toLowerCase().includes(filterValue))
          
          case 'purchases':
            return (item.customerData?.nomeCompleto?.toLowerCase().includes(filterValue) ||
                   item.customerData?.email?.toLowerCase().includes(filterValue) ||
                   item.orderId?.toLowerCase().includes(filterValue))
          
          default:
            return true
        }
      })
    }

    // Aplicar ordenação
    const currentSortConfig = sortConfig.tab === tab ? sortConfig : { key: 'date', direction: 'desc' as 'desc', tab }
    if (currentSortConfig.key) {
      filteredData.sort((a, b) => {
        let aValue, bValue

        switch (tab) {
          case 'users':
            switch (currentSortConfig.key) {
              case 'name':
                aValue = a.name || ''
                bValue = b.name || ''
                break
              case 'email':
                aValue = a.email || ''
                bValue = b.email || ''
                break
              case 'date':
                aValue = new Date(a.createdAt || 0)
                bValue = new Date(b.createdAt || 0)
                break
              default:
                return 0
            }
            break

          case 'tournaments':
            switch (currentSortConfig.key) {
              case 'name':
                aValue = a.name || ''
                bValue = b.name || ''
                break
              case 'status':
                aValue = a.status || ''
                bValue = b.status || ''
                break
              case 'date':
                aValue = new Date(a.startDate || 0)
                bValue = new Date(b.startDate || 0)
                break
              case 'teams':
                aValue = a.teams?.length || 0
                bValue = b.teams?.length || 0
                break
              default:
                return 0
            }
            break

          case 'teams':
            switch (currentSortConfig.key) {
              case 'name':
                aValue = a.teamData?.nomeTime || ''
                bValue = b.teamData?.nomeTime || ''
                break
              case 'captain':
                aValue = a.captainData?.nomeCompleto || ''
                bValue = b.captainData?.nomeCompleto || ''
                break
              case 'date':
                aValue = new Date(a.registrationDate || 0)
                bValue = new Date(b.registrationDate || 0)
                break
              default:
                return 0
            }
            break

          case 'individuals':
            switch (currentSortConfig.key) {
              case 'name':
                aValue = a.captainData?.nomeCompleto || ''
                bValue = b.captainData?.nomeCompleto || ''
                break
              case 'age':
                aValue = Number(a.captainData?.idade) || 0
                bValue = Number(b.captainData?.idade) || 0
                break
              case 'position':
                aValue = a.captainData?.posicao || ''
                bValue = b.captainData?.posicao || ''
                break
              case 'location':
                aValue = a.captainData?.bairro || ''
                bValue = b.captainData?.bairro || ''
                break
              case 'date':
                aValue = new Date(a.registrationDate || 0)
                bValue = new Date(b.registrationDate || 0)
                break
              default:
                return 0
            }
            break

          case 'volunteers':
            switch (currentSortConfig.key) {
              case 'name':
                aValue = a.formData?.nomeCompleto || ''
                bValue = b.formData?.nomeCompleto || ''
                break
              case 'email':
                aValue = a.formData?.email || ''
                bValue = b.formData?.email || ''
                break
              case 'areas':
                aValue = a.formData?.areasInteresse?.join(', ') || ''
                bValue = b.formData?.areasInteresse?.join(', ') || ''
                break
              case 'disponibilidade':
                aValue = a.formData?.disponibilidade || ''
                bValue = b.formData?.disponibilidade || ''
                break
              case 'date':
                aValue = new Date(a.registrationDate || 0)
                bValue = new Date(b.registrationDate || 0)
                break
              default:
                return 0
            }
            break

          case 'donations':
            switch (currentSortConfig.key) {
              case 'name':
                aValue = a.donationType === 'identified' && a.donorData?.nomeCompleto 
                  ? a.donorData.nomeCompleto 
                  : 'Anônimo'
                bValue = b.donationType === 'identified' && b.donorData?.nomeCompleto 
                  ? b.donorData.nomeCompleto 
                  : 'Anônimo'
                break
              case 'amount':
                aValue = a.amount || 0
                bValue = b.amount || 0
                break
              case 'type':
                aValue = a.donationType || ''
                bValue = b.donationType || ''
                break
              case 'date':
                aValue = new Date(a.donationDate || 0)
                bValue = new Date(b.donationDate || 0)
                break
              default:
                return 0
            }
            break

          case 'purchases':
            switch (currentSortConfig.key) {
              case 'customerName':
                aValue = a.customerData?.nomeCompleto || ''
                bValue = b.customerData?.nomeCompleto || ''
                break
              case 'total':
                aValue = a.pricing?.total || 0
                bValue = b.pricing?.total || 0
                break
              case 'status':
                aValue = a.status || ''
                bValue = b.status || ''
                break
              case 'items':
                aValue = a.items?.length || 0
                bValue = b.items?.length || 0
                break
              case 'date':
                aValue = new Date(a.purchaseDate || 0)
                bValue = new Date(b.purchaseDate || 0)
                break
              default:
                return 0
            }
            break

          default:
            return 0
        }

        if (aValue < bValue) {
          return currentSortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return currentSortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return filteredData
  }

  const getSortIcon = (key: string, tab: string) => {
    if (sortConfig.key === key && sortConfig.tab === tab) {
      return sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
    }
    return <ArrowUpDown className="h-4 w-4" />
  }

  const handleHeaderSort = useCallback((key: string, tab: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.key === key && sortConfig.tab === tab && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    handleSort(key, direction, tab)
  }, [sortConfig.key, sortConfig.tab, sortConfig.direction, handleSort])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const exportToCSV = (data: any[], filename: string, type: string) => {
    let csvContent = ""
    let headers: string[] = []
    
    if (data.length === 0) {
      alert('Não há dados para exportar')
      return
    }

    // Define headers based on type
    switch (type) {
      case 'tournaments':
        headers = ['Nome do Torneio', 'Status', 'Equipes', 'Tipo', 'Data de Início', 'Taxa de Inscrição']
        csvContent = headers.join(',') + '\n'
        data.forEach(item => {
          csvContent += [
            `"${item.name}"`,
            `"${item.status === 'draft' ? 'Rascunho' : 
                item.status === 'registration-open' ? 'Inscrições Abertas' :
                item.status === 'registration-closed' ? 'Inscrições Fechadas' :
                item.status === 'in-progress' ? 'Em Andamento' : 'Finalizado'}"`,
            `"${(item.teams?.length || 0)}/${item.maxTeams}"`,
            `"${item.isCopaPassaBola ? 'Copa PB' : 'Regular'}"`,
            `"${formatDate(item.startDate)}"`,
            `"${item.isPaid ? formatCurrency(item.entryFee || 0) : 'Gratuito'}"`
          ].join(',') + '\n'
        })
        break
      
      case 'teams':
        headers = ['Nome da Equipe', 'Capitão', 'Email', 'Telefone', 'Cidade/Bairro', 'Data de Registro']
        csvContent = headers.join(',') + '\n'
        data.forEach(item => {
          csvContent += [
            `"${item.teamData.nomeTime}"`,
            `"${item.captainData.nomeCompleto}"`,
            `"${item.captainData.email}"`,
            `"${item.captainData.telefone}"`,
            `"${item.captainData.cidadeBairro}"`,
            `"${formatDate(item.registrationDate)}"`
          ].join(',') + '\n'
        })
        break

      case 'individuals':
        headers = ['Nome', 'Idade', 'Email', 'Telefone', 'Posição', 'Cidade/Bairro', 'Data de Registro']
        csvContent = headers.join(',') + '\n'
        data.forEach(item => {
          csvContent += [
            `"${item.captainData.nomeCompleto}"`,
            `"${item.captainData.idade}"`,
            `"${item.captainData.email}"`,
            `"${item.captainData.telefone}"`,
            `"${item.captainData.posicao}"`,
            `"${item.captainData.cidadeBairro}"`,
            `"${formatDate(item.registrationDate)}"`
          ].join(',') + '\n'
        })
        break

      case 'volunteers':
        headers = ['Nome', 'Email', 'Telefone', 'Profissão', 'Áreas de Interesse', 'Data de Registro']
        csvContent = headers.join(',') + '\n'
        data.forEach(item => {
          csvContent += [
            `"${item.formData.nomeCompleto}"`,
            `"${item.formData.email}"`,
            `"${item.formData.telefone}"`,
            `"${item.formData.profissao}"`,
            `"${item.selectedAreas.join('; ')}"`,
            `"${formatDate(item.registrationDate)}"`
          ].join(',') + '\n'
        })
        break

      case 'donations':
        headers = ['Tipo', 'Doador', 'Email', 'Valor', 'Método de Pagamento', 'Data']
        csvContent = headers.join(',') + '\n'
        data.forEach(item => {
          csvContent += [
            `"${item.donationType === 'identified' ? 'Identificada' : 'Anônima'}"`,
            `"${item.donationType === 'identified' && item.donorData ? item.donorData.nomeCompleto : 'Anônimo'}"`,
            `"${item.donationType === 'identified' && item.donorData ? item.donorData.email : 'N/A'}"`,
            `"${formatCurrency(item.amount)}"`,
            `"${item.paymentMethod.toUpperCase()}"`,
            `"${formatDate(item.donationDate)}"`
          ].join(',') + '\n'
        })
        break

      case 'purchases':
        headers = ['Pedido', 'Cliente', 'Email', 'Itens', 'Total', 'Método de Pagamento', 'Data']
        csvContent = headers.join(',') + '\n'
        data.forEach(item => {
          csvContent += [
            `"#${item.orderId}"`,
            `"${item.customerData.nomeCompleto}"`,
            `"${item.customerData.email}"`,
            `"${item.items.length} ${item.items.length === 1 ? 'item' : 'itens'}"`,
            `"${formatCurrency(item.pricing.total)}"`,
            `"${item.paymentMethod.toUpperCase()}"`,
            `"${formatDate(item.purchaseDate)}"`
          ].join(',') + '\n'
        })
        break

      case 'users':
        headers = ['Nome', 'Email', 'Telefone', 'Cidade', 'Estado Civil', 'Data de Cadastro']
        csvContent = headers.join(',') + '\n'
        data.forEach(item => {
          csvContent += [
            `"${item.name || 'N/A'}"`,
            `"${item.email || 'N/A'}"`,
            `"${item.telefone || 'N/A'}"`,
            `"${item.cidade || 'N/A'}"`,
            `"${item.estadoCivil || 'N/A'}"`,
            `"${item.createdAt ? formatDate(item.createdAt) : 'N/A'}"`
          ].join(',') + '\n'
        })
        break
    }

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const deleteRecord = async (id: string, type: string, name?: string) => {
    const confirmMessage = `Tem certeza que deseja deletar ${name ? `"${name}"` : 'este registro'}? Esta ação não pode ser desfeita.`
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      let success = false;
      
      // Usar função específica do admin-service para jogos
      if (type === 'games') {
        const result = await deleteGame(id);
        success = result.success;
        if (!success) {
          console.error('Error deleting game:', result.error);
        }
      } else {
        // Usar método direto do Firebase para outros tipos
        const response = await fetch(`https://challange-passabola-default-rtdb.firebaseio.com/${getFirebasePath(type)}/${id}.json`, {
          method: 'DELETE'
        });
        success = response.ok;
      }

      if (success) {
        alert('Registro deletado com sucesso!')
        loadDashboardData() // Recarregar dados
      } else {
        alert('Erro ao deletar registro. Tente novamente.')
      }
    } catch (error) {
      console.error('Error deleting record:', error)
      alert('Erro ao deletar registro. Tente novamente.')
    }
  }

  const deleteAllRecords = async (type: string) => {
    const typeNames = {
      'tournaments': 'todos os torneios',
      'games': 'todos os jogos',
      'teams': 'todas as equipes',
      'individuals': 'todas as jogadoras individuais', 
      'volunteers': 'todas as voluntárias',
      'donations': 'todas as doações',
      'purchases': 'todas as compras'
    }

    const confirmMessage = `Tem certeza que deseja deletar ${typeNames[type as keyof typeof typeNames]}?\n\nEsta ação é IRREVERSÍVEL e todos os dados serão perdidos permanentemente.\n\nDigite "CONFIRMAR" para prosseguir:`
    
    const userInput = window.prompt(confirmMessage)
    
    if (userInput !== 'CONFIRMAR') {
      return
    }

    try {
      const response = await fetch(`https://challange-passabola-default-rtdb.firebaseio.com/${getFirebasePath(type)}.json`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert(`✅ Todos os registros de ${typeNames[type as keyof typeof typeNames]} foram deletados com sucesso!`)
        loadDashboardData() // Recarregar dados
      } else {
        alert('Erro ao deletar registros. Tente novamente.')
      }
    } catch (error) {
      console.error('Error deleting all records:', error)
      alert('Erro ao deletar registros. Tente novamente.')
    }
  }

  const getFirebasePath = (type: string) => {
    switch (type) {
      case 'tournaments': return 'tournaments'
      case 'games': return 'games'
      case 'teams': return 'Teams'
      case 'individuals': return 'Individuals'
      case 'volunteers': return 'volunteers'
      case 'donations': return 'donors'
      case 'purchases': return 'purchases'
      case 'users': return 'users'
      default: return ''
    }
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative h-8 w-8 sm:h-10 sm:w-10">
                <Image src="/logo.png" alt="Passa Bola Logo" fill className="object-contain" />
              </div>
              <div>
                <h1 className={`${bebasNeue.className} text-xl sm:text-2xl text-[#8e44ad] dark:text-primary tracking-wider`}>
                  PAINEL ADMINISTRATIVO
                </h1>
                <Badge className="bg-[#c2ff28] text-[#8e44ad] mt-1 text-xs sm:text-sm">COPA PASSA BOLA 2025</Badge>
              </div>
            </div>

            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1 h-auto p-1">
            <TabsTrigger value="overview" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1 sm:px-3">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1 sm:px-3">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="tournaments" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1 sm:px-3">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Torneios & Jogos</span>
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1 sm:px-3">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Equipes</span>
            </TabsTrigger>
            <TabsTrigger value="individuals" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1 sm:px-3">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Individuais</span>
            </TabsTrigger>
            <TabsTrigger value="volunteers" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1 sm:px-3">
              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Voluntários</span>
            </TabsTrigger>
            <TabsTrigger value="donations" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1 sm:px-3">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Doações</span>
            </TabsTrigger>
            <TabsTrigger value="purchases" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1 sm:px-3">
              <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Compras</span>
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
              <TabsContent value="overview" className="space-y-4 sm:space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className={`${bebasNeue.className} text-2xl sm:text-3xl mb-4 sm:mb-6 tracking-wider`}>
                    VISÃO GERAL DO SISTEMA
                  </h2>

                  {stats && <StatsCards stats={stats} />}

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                    <Card>
                      <CardHeader className="pb-3 sm:pb-6">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                          Resumo de Participantes
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm font-medium">Torneios criados:</span>
                            <Badge variant="outline">{stats?.totalTournaments || 0}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm font-medium">Equipes registradas:</span>
                            <Badge variant="outline">{stats?.totalTeams || 0}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm font-medium">Jogadoras individuais:</span>
                            <Badge variant="outline">{stats?.totalIndividuals || 0}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm font-medium">Voluntárias cadastradas:</span>
                            <Badge variant="outline">{stats?.totalVolunteers || 0}</Badge>
                          </div>
                          <hr />
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm font-bold">Total de participantes:</span>
                            <Badge className="bg-[#8e44ad] text-white">
                              {(stats?.totalTournaments || 0) + (stats?.totalTeams || 0) + (stats?.totalIndividuals || 0) + (stats?.totalVolunteers || 0)}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3 sm:pb-6">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                          Resumo Financeiro
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm font-medium">Vendas da loja:</span>
                            <span className="font-bold text-green-600 text-xs sm:text-sm">{formatCurrency(stats?.totalRevenue || 0)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm font-medium">Doações recebidas:</span>
                            <span className="font-bold text-blue-600 text-xs sm:text-sm">{formatCurrency(stats?.totalDonationAmount || 0)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm font-medium">Pedidos processados:</span>
                            <Badge variant="outline">{stats?.totalPurchases || 0}</Badge>
                          </div>
                          <hr />
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm font-bold">Receita total:</span>
                            <span className="text-sm sm:text-lg font-bold text-[#8e44ad]">
                              {formatCurrency((stats?.totalRevenue || 0) + (stats?.totalDonationAmount || 0))}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="tournaments" className="space-y-4 sm:space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h2 className={`${bebasNeue.className} text-2xl sm:text-3xl tracking-wider`}>
                      {tournamentView === 'tournaments' ? `TORNEIOS (${tournaments.length})` : `JOGOS (${games.length})`}
                    </h2>
                    
                    <div className="flex gap-2">
                      <Button
                        variant={tournamentView === 'tournaments' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTournamentView('tournaments')}
                        className="flex items-center gap-2"
                      >
                        <Trophy className="h-4 w-4" />
                        Torneios
                      </Button>
                      <Button
                        variant={tournamentView === 'games' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTournamentView('games')}
                        className="flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Jogos
                      </Button>
                    </div>
                  </div>

                  {tournamentView === 'tournaments' ? (
                    <>
                      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                        <FilterAndSortControls 
                          tab="tournaments"
                          sortOptions={[
                            { key: 'name', label: 'Nome', type: 'text' },
                            { key: 'status', label: 'Status', type: 'text' },
                            { key: 'teams', label: 'Número de Equipes', type: 'number' },
                            { key: 'date', label: 'Data de Início', type: 'date' }
                          ]}
                          filters={filters}
                          sortConfig={sortConfig}
                          onFilter={handleFilter}
                          onSort={handleSort}
                        />
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                          <TournamentCreateModal onTournamentCreated={loadDashboardData} />
                          <Button 
                            variant="outline" 
                            className="flex items-center justify-center gap-2 w-full sm:w-auto"
                            onClick={() => exportToCSV(tournaments, 'torneios', 'tournaments')}
                          >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Exportar</span>
                            <span className="sm:hidden">Export</span>
                          </Button>
                        </div>
                      </div>

                      <Card>
                        <CardContent className="p-0">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead 
                                    className="cursor-pointer hover:bg-muted/50 transition-colors min-w-[150px]"
                                    onClick={() => handleHeaderSort('name', 'tournaments')}
                                  >
                                    <div className="flex items-center gap-2">
                                      Nome do Torneio
                                      {getSortIcon('name', 'tournaments')}
                                    </div>
                                  </TableHead>
                                  <TableHead 
                                    className="cursor-pointer hover:bg-muted/50 transition-colors min-w-[120px]"
                                    onClick={() => handleHeaderSort('status', 'tournaments')}
                                  >
                                    <div className="flex items-center gap-2">
                                      Status
                                      {getSortIcon('status', 'tournaments')}
                                    </div>
                                  </TableHead>
                                  <TableHead 
                                    className="cursor-pointer hover:bg-muted/50 transition-colors min-w-[100px]"
                                    onClick={() => handleHeaderSort('teams', 'tournaments')}
                                  >
                                    <div className="flex items-center gap-2">
                                      Equipes
                                      {getSortIcon('teams', 'tournaments')}
                                    </div>
                                  </TableHead>
                                  <TableHead className="min-w-[80px]">Tipo</TableHead>
                                  <TableHead 
                                    className="cursor-pointer hover:bg-muted/50 transition-colors min-w-[130px]"
                                    onClick={() => handleHeaderSort('date', 'tournaments')}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="hidden sm:inline">Data de Início</span>
                                      <span className="sm:hidden">Data</span>
                                      {getSortIcon('date', 'tournaments')}
                                    </div>
                                  </TableHead>
                                  <TableHead className="min-w-[100px]">Inscrição</TableHead>
                                  <TableHead className="min-w-[200px]">Ações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {getSortedAndFilteredData(tournaments, 'tournaments').map((tournament) => (
                                  <TableRow key={tournament.id}>
                                    <TableCell className="font-medium">{tournament.name}</TableCell>
                                    <TableCell>
                                      <Badge 
                                        variant={
                                          tournament.status === 'in-progress' ? 'default' :
                                          tournament.status === 'completed' ? 'secondary' :
                                          tournament.status === 'registration-open' ? 'default' :
                                          'outline'
                                        }
                                      >
                                        {tournament.status === 'draft' && 'Rascunho'}
                                        {tournament.status === 'registration-open' && 'Inscrições Abertas'}
                                        {tournament.status === 'registration-closed' && 'Inscrições Fechadas'}
                                        {tournament.status === 'in-progress' && 'Em Andamento'}
                                        {tournament.status === 'completed' && 'Finalizado'}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <span className="font-bold">{tournament.teams?.length || 0}</span>
                                      <span className="text-muted-foreground"> / {tournament.maxTeams}</span>
                                    </TableCell>
                                    <TableCell>
                                      {tournament.isCopaPassaBola ? (
                                        <Badge className="bg-[#8e44ad] text-white">Copa PB</Badge>
                                      ) : (
                                        <Badge variant="outline">Regular</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        {formatDate(tournament.startDate)}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {tournament.isPaid ? (
                                        <span className="font-medium text-green-600">
                                          {formatCurrency(tournament.entryFee || 0)}
                                        </span>
                                      ) : (
                                        <Badge variant="secondary">Gratuito</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <TournamentDetailsModal
                                          tournament={tournament}
                                          onTournamentUpdated={loadDashboardData}
                                          trigger={
                                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                                              <Eye className="h-4 w-4" />
                                              Ver Detalhes
                                            </Button>
                                          }
                                        />
                                        <Button 
                                          variant="destructive" 
                                          size="sm" 
                                          className="flex items-center gap-1"
                                          onClick={() => deleteRecord(tournament.id, 'tournaments', tournament.name)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                          Deletar
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                                {getSortedAndFilteredData(tournaments, 'tournaments').length === 0 && (
                                  <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                      {filters.tournaments ? 'Nenhum torneio encontrado com os filtros aplicados' : 'Nenhum torneio criado ainda'}
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          Gerencie os jogos dos torneios criados
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                          <GameCreateModal tournaments={tournaments} onGameCreated={loadDashboardData} />
                          <Button 
                            variant="outline" 
                            className="flex items-center justify-center gap-2 w-full sm:w-auto"
                            onClick={() => exportToCSV(games, 'jogos', 'games')}
                          >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Exportar</span>
                            <span className="sm:hidden">Export</span>
                          </Button>
                        </div>
                      </div>

                      <Card>
                        <CardContent className="p-0">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="min-w-[150px]">Nome do Jogo</TableHead>
                                  <TableHead className="min-w-[120px]">Torneio</TableHead>
                                  <TableHead className="min-w-[130px]">Data/Hora</TableHead>
                                  <TableHead className="min-w-[120px]">Local</TableHead>
                                  <TableHead className="min-w-[180px]">Times</TableHead>
                                  <TableHead className="min-w-[100px]">Status</TableHead>
                                  <TableHead className="min-w-[100px]">Ingressos</TableHead>
                                  <TableHead className="min-w-[200px]">Ações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {games.map((game) => {
                                  const tournament = tournaments.find(t => t.id === game.tournamentId);
                                  return (
                                    <TableRow key={game.id}>
                                      <TableCell className="font-medium">{game.title}</TableCell>
                                      <TableCell>{tournament?.name || '-'}</TableCell>
                                      <TableCell>
                                        <div className="flex flex-col gap-1">
                                          <span className="text-sm">
                                            {new Date(game.date).toLocaleDateString('pt-BR')}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            {game.time}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell>{game.location}</TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">{game.team1}</span>
                                          <span className="text-muted-foreground">vs</span>
                                          <span className="font-medium">{game.team2}</span>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge 
                                          variant={
                                            game.status === 'scheduled' ? 'default' : 
                                            game.status === 'in-progress' ? 'destructive' : 
                                            'secondary'
                                          }
                                        >
                                          {game.status === 'scheduled' ? 'Agendado' : 
                                           game.status === 'in-progress' ? 'Em Andamento' : 
                                           game.status === 'completed' ? 'Finalizado' :
                                           'Cancelado'}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <span className="text-sm">{game.ticketTypes.length} tipos</span>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-2">
                                          <GameDetailsModal
                                            game={game}
                                            tournamentName={tournament?.name}
                                            onGameUpdated={loadDashboardData}
                                            trigger={
                                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                Ver Detalhes
                                              </Button>
                                            }
                                          />
                                          <Button 
                                            variant="destructive" 
                                            size="sm" 
                                            className="flex items-center gap-1"
                                            onClick={() => deleteRecord(game.id, 'games', game.title)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                            Deletar
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                                {games.length === 0 && (
                                  <TableRow>
                                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                      Nenhum jogo criado ainda
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="teams" className="space-y-4 sm:space-y-6">
                <div className="space-y-4">
                  <h2 className={`${bebasNeue.className} text-2xl sm:text-3xl tracking-wider`}>
                    EQUIPES REGISTRADAS ({teams.length})
                  </h2>
                  
                  <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                    <FilterAndSortControls 
                      tab="teams"
                      sortOptions={[
                        { key: 'name', label: 'Nome da Equipe', type: 'text' },
                        { key: 'captain', label: 'Capitão', type: 'text' },
                        { key: 'date', label: 'Data de Registro', type: 'date' }
                      ]}
                      filters={filters}
                      sortConfig={sortConfig}
                      onFilter={handleFilter}
                      onSort={handleSort}
                    />
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                      <Button 
                        variant="outline" 
                        className="flex items-center justify-center gap-2 w-full sm:w-auto"
                        onClick={() => exportToCSV(teams, 'equipes', 'teams')}
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Exportar</span>
                        <span className="sm:hidden">Export</span>
                      </Button>
                      {teams.length > 0 && (
                        <Button 
                          variant="destructive"
                          className="flex items-center justify-center gap-2 w-full sm:w-auto"
                          onClick={() => deleteAllRecords('teams')}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Deletar Todos</span>
                          <span className="sm:hidden">Del Todos</span>
                        </Button>
                      )}
                    </div>
                  </div>
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
                          <TableHead>Usuário</TableHead>
                          <TableHead>Data de Registro</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getSortedAndFilteredData(teams, 'teams').map((team) => (
                          <TableRow key={team.id}>
                            <TableCell className="font-medium">{team.teamData.nomeTime}</TableCell>
                            <TableCell>{team.captainData.nomeCompleto}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                {team.captainData.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                {team.captainData.telefone}
                              </div>
                            </TableCell>
                            <TableCell>
                              {team.userId ? (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                  onClick={() => team.userId && handleViewUser(team.userId)}
                                >
                                  <User className="h-4 w-4" />
                                  {findUserById(team.userId).name}
                                </Button>
                              ) : (
                                <span className="text-muted-foreground">N/A</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {formatDate(team.registrationDate)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
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
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="flex items-center gap-1"
                                  onClick={() => deleteRecord(team.id, 'teams', team.teamData.nomeTime)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Deletar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {getSortedAndFilteredData(teams, 'teams').length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
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
                <div className="space-y-4">
                  <h2 className={`${bebasNeue.className} text-3xl tracking-wider`}>
                    JOGADORAS INDIVIDUAIS ({individuals.length})
                  </h2>
                  
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <FilterAndSortControls 
                      tab="individuals"
                      sortOptions={[
                        { key: 'name', label: 'Nome', type: 'text' },
                        { key: 'age', label: 'Idade', type: 'number' },
                        { key: 'position', label: 'Posição', type: 'text' },
                        { key: 'location', label: 'Cidade/Bairro', type: 'text' },
                        { key: 'date', label: 'Data de Registro', type: 'date' }
                      ]}
                      filters={filters}
                      sortConfig={sortConfig}
                      onFilter={handleFilter}
                      onSort={handleSort}
                    />
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => exportToCSV(individuals, 'jogadoras_individuais', 'individuals')}
                      >
                        <Download className="h-4 w-4" />
                        Exportar
                      </Button>
                      {individuals.length > 0 && (
                        <Button 
                          variant="destructive"
                          className="flex items-center gap-2"
                          onClick={() => deleteAllRecords('individuals')}
                        >
                          <Trash2 className="h-4 w-4" />
                          Deletar Todos
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => handleHeaderSort('name', 'individuals')}
                          >
                            Nome {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => handleHeaderSort('age', 'individuals')}
                          >
                            Idade {sortConfig.key === 'age' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => handleHeaderSort('position', 'individuals')}
                          >
                            Posição {sortConfig.key === 'position' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => handleHeaderSort('location', 'individuals')}
                          >
                            Cidade/Bairro {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead>Usuário</TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => handleHeaderSort('date', 'individuals')}
                          >
                            Data de Registro {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getSortedAndFilteredData(individuals, 'individuals').map((individual) => (
                          <TableRow key={individual.id}>
                            <TableCell className="font-medium">{individual.captainData.nomeCompleto}</TableCell>
                            <TableCell>{individual.captainData.idade} anos</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                {individual.captainData.email}
                              </div>
                            </TableCell>
                            <TableCell>{individual.captainData.posicao}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {individual.captainData.cidadeBairro}
                              </div>
                            </TableCell>
                            <TableCell>
                              {individual.userId ? (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                  onClick={() => individual.userId && handleViewUser(individual.userId)}
                                >
                                  <User className="h-4 w-4" />
                                  {findUserById(individual.userId).name}
                                </Button>
                              ) : (
                                <span className="text-muted-foreground">N/A</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {formatDate(individual.registrationDate)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
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
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="flex items-center gap-1"
                                  onClick={() => deleteRecord(individual.id, 'individuals', individual.captainData.nomeCompleto)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Deletar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {getSortedAndFilteredData(individuals, 'individuals').length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
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
                <div className="space-y-4">
                  <h2 className={`${bebasNeue.className} text-3xl tracking-wider`}>
                    VOLUNTÁRIAS CADASTRADAS ({volunteers.length})
                  </h2>
                  
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <FilterAndSortControls 
                      tab="volunteers"
                      sortOptions={[
                        { key: 'name', label: 'Nome', type: 'text' },
                        { key: 'email', label: 'Email', type: 'text' },
                        { key: 'areas', label: 'Áreas de Interesse', type: 'text' },
                        { key: 'disponibilidade', label: 'Disponibilidade', type: 'text' },
                        { key: 'date', label: 'Data de Registro', type: 'date' }
                      ]}
                      filters={filters}
                      sortConfig={sortConfig}
                      onFilter={handleFilter}
                      onSort={handleSort}
                    />
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => exportToCSV(volunteers, 'voluntarias', 'volunteers')}
                      >
                        <Download className="h-4 w-4" />
                        Exportar
                      </Button>
                      {volunteers.length > 0 && (
                        <Button 
                          variant="destructive"
                          className="flex items-center gap-2"
                          onClick={() => deleteAllRecords('volunteers')}
                        >
                          <Trash2 className="h-4 w-4" />
                          Deletar Todos
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => handleHeaderSort('name', 'volunteers')}
                          >
                            Nome {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => handleHeaderSort('areas', 'volunteers')}
                          >
                            Áreas de Interesse {sortConfig.key === 'areas' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead>Profissão</TableHead>
                          <TableHead>Usuário</TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => handleHeaderSort('date', 'volunteers')}
                          >
                            Data de Registro {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getSortedAndFilteredData(volunteers, 'volunteers').map((volunteer) => (
                          <TableRow key={volunteer.id}>
                            <TableCell className="font-medium">{volunteer.formData.nomeCompleto}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                {volunteer.formData.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {volunteer.selectedAreas.map((area: string) => (
                                  <Badge key={area} variant="secondary" className="text-xs">
                                    {area}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{volunteer.formData.profissao}</TableCell>
                            <TableCell>
                              {volunteer.userId ? (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                  onClick={() => volunteer.userId && handleViewUser(volunteer.userId)}
                                >
                                  <User className="h-4 w-4" />
                                  {findUserById(volunteer.userId).name}
                                </Button>
                              ) : (
                                <span className="text-muted-foreground">N/A</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {formatDate(volunteer.registrationDate)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
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
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="flex items-center gap-1"
                                  onClick={() => deleteRecord(volunteer.id, 'volunteers', volunteer.formData.nomeCompleto)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Deletar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {getSortedAndFilteredData(volunteers, 'volunteers').length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
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
                <div className="space-y-4">
                  <h2 className={`${bebasNeue.className} text-3xl tracking-wider`}>
                    DOAÇÕES RECEBIDAS ({donations.length})
                  </h2>
                  
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <FilterAndSortControls 
                      tab="donations"
                      sortOptions={[
                        { key: 'name', label: 'Nome', type: 'text' },
                        { key: 'amount', label: 'Valor', type: 'number' },
                        { key: 'type', label: 'Tipo', type: 'text' },
                        { key: 'date', label: 'Data da Doação', type: 'date' }
                      ]}
                      filters={filters}
                      sortConfig={sortConfig}
                      onFilter={handleFilter}
                      onSort={handleSort}
                    />
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total arrecadado</p>
                        <p className="text-2xl font-bold text-[#8e44ad]">
                          {formatCurrency(stats?.totalDonationAmount || 0)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2"
                          onClick={() => exportToCSV(donations, 'doacoes', 'donations')}
                        >
                          <Download className="h-4 w-4" />
                          Exportar
                        </Button>
                        {donations.length > 0 && (
                          <Button 
                            variant="destructive"
                            className="flex items-center gap-2"
                            onClick={() => deleteAllRecords('donations')}
                          >
                            <Trash2 className="h-4 w-4" />
                            Deletar Todos
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => handleHeaderSort('type', 'donations')}
                          >
                            Tipo {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => handleHeaderSort('name', 'donations')}
                          >
                            Doador {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => handleHeaderSort('amount', 'donations')}
                          >
                            Valor {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead>Método de Pagamento</TableHead>
                          <TableHead>Usuário</TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => handleHeaderSort('date', 'donations')}
                          >
                            Data {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getSortedAndFilteredData(donations, 'donations').map((donation) => (
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
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                {donation.paymentMethod.toUpperCase()}
                              </div>
                            </TableCell>
                            <TableCell>
                              {donation.userId ? (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                  onClick={() => donation.userId && handleViewUser(donation.userId)}
                                >
                                  <User className="h-4 w-4" />
                                  {findUserById(donation.userId).name}
                                </Button>
                              ) : (
                                <span className="text-muted-foreground">N/A</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {formatDate(donation.donationDate)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
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
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="flex items-center gap-1"
                                  onClick={() => deleteRecord(donation.id, 'donations', `Doação de ${formatCurrency(donation.amount)}`)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Deletar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {getSortedAndFilteredData(donations, 'donations').length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
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
                <div className="space-y-4">
                  <h2 className={`${bebasNeue.className} text-3xl tracking-wider`}>
                    COMPRAS DA LOJA ({purchases.length})
                  </h2>
                  
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <FilterAndSortControls 
                      tab="purchases"
                      sortOptions={[
                        { key: 'customerName', label: 'Cliente', type: 'text' },
                        { key: 'total', label: 'Total', type: 'number' },
                        { key: 'status', label: 'Status', type: 'text' },
                        { key: 'items', label: 'Quantidade de Itens', type: 'number' },
                        { key: 'date', label: 'Data da Compra', type: 'date' }
                      ]}
                      filters={filters}
                      sortConfig={sortConfig}
                      onFilter={handleFilter}
                      onSort={handleSort}
                    />
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Receita total</p>
                        <p className="text-2xl font-bold text-[#8e44ad]">
                          {formatCurrency(stats?.totalRevenue || 0)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2"
                          onClick={() => exportToCSV(purchases, 'compras', 'purchases')}
                        >
                          <Download className="h-4 w-4" />
                          Exportar
                        </Button>
                        {purchases.length > 0 && (
                          <Button 
                            variant="destructive"
                            className="flex items-center gap-2"
                            onClick={() => deleteAllRecords('purchases')}
                          >
                            <Trash2 className="h-4 w-4" />
                            Deletar Todos
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pedido</TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => handleHeaderSort('customerName', 'purchases')}
                          >
                            Cliente {sortConfig.key === 'customerName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => handleHeaderSort('items', 'purchases')}
                          >
                            Itens {sortConfig.key === 'items' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => handleHeaderSort('total', 'purchases')}
                          >
                            Total {sortConfig.key === 'total' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead>Pagamento</TableHead>
                          <TableHead>Usuário</TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => handleHeaderSort('date', 'purchases')}
                          >
                            Data {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getSortedAndFilteredData(purchases, 'purchases').map((purchase) => (
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
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                {purchase.paymentMethod.toUpperCase()}
                              </div>
                            </TableCell>
                            <TableCell>
                              {purchase.userId ? (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                  onClick={() => purchase.userId && handleViewUser(purchase.userId)}
                                >
                                  <User className="h-4 w-4" />
                                  {findUserById(purchase.userId).name}
                                </Button>
                              ) : (
                                <span className="text-muted-foreground">N/A</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {formatDate(purchase.purchaseDate)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
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
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="flex items-center gap-1"
                                  onClick={() => deleteRecord(purchase.id, 'purchases', `Pedido #${purchase.orderId}`)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Deletar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {getSortedAndFilteredData(purchases, 'purchases').length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                              Nenhuma compra registrada ainda
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Aba Usuários */}
              <TabsContent value="users" className="space-y-6">
                <div className="space-y-4">
                  <h2 className={`${bebasNeue.className} text-3xl tracking-wider`}>
                    USUÁRIOS CADASTRADOS ({users.length})
                  </h2>
                  
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <FilterAndSortControls 
                      tab="users"
                      sortOptions={[
                        { key: 'name', label: 'Nome', type: 'text' },
                        { key: 'email', label: 'Email', type: 'text' },
                        { key: 'points', label: 'Pontos', type: 'number' },
                        { key: 'date', label: 'Data de Cadastro', type: 'date' }
                      ]}
                      filters={filters}
                      sortConfig={sortConfig}
                      onFilter={handleFilter}
                      onSort={handleSort}
                    />
                    
                    <div className="flex items-center gap-2">
                      <UserCreateModal onUserCreated={loadDashboardData} />
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => exportToCSV(users, 'usuarios', 'users')}
                      >
                        <Download className="h-4 w-4" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead 
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleHeaderSort('name', 'users')}
                          >
                            <div className="flex items-center gap-2">
                              Nome
                              {getSortIcon('name', 'users')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleHeaderSort('email', 'users')}
                          >
                            <div className="flex items-center gap-2">
                              Email
                              {getSortIcon('email', 'users')}
                            </div>
                          </TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>Cidade</TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleHeaderSort('points', 'users')}
                          >
                            <div className="flex items-center gap-2">
                              Pontos
                              {getSortIcon('points', 'users')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleHeaderSort('date', 'users')}
                          >
                            <div className="flex items-center gap-2">
                              Data de Cadastro
                              {getSortIcon('date', 'users')}
                            </div>
                          </TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getSortedAndFilteredData(users, 'users').map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                            <TableCell>{user.email || 'N/A'}</TableCell>
                            <TableCell>{user.telefone || 'N/A'}</TableCell>
                            <TableCell>{user.cidade || 'N/A'}</TableCell>
                            <TableCell>
                              {editingPoints[user.id] ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min="0"
                                    value={tempPoints[user.id] || ''}
                                    onChange={(e) => setTempPoints(prev => ({ 
                                      ...prev, 
                                      [user.id]: e.target.value 
                                    }))}
                                    className="w-20"
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSavePoints(user.id)}
                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCancelEditPoints(user.id)}
                                    className="text-gray-600 border-gray-600 hover:bg-gray-50"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{user.points || 0}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditPoints(user.id, user.points || 0)}
                                    className="h-6 w-6 p-0 text-purple-600 hover:bg-purple-50"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex items-center gap-1"
                                  onClick={() => handleViewUser(user.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                  Ver Detalhes
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="flex items-center gap-1"
                                  onClick={() => handleDeleteUser(user)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Deletar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {getSortedAndFilteredData(users, 'users').length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              {filters.users ? 'Nenhum usuário encontrado com os filtros aplicados' : 'Nenhum usuário cadastrado ainda'}
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

        {/* Modal para exibir detalhes do usuário */}
        {selectedUser && (
          <DetailModal
            isOpen={isUserModalOpen}
            onClose={() => {
              setIsUserModalOpen(false)
              setSelectedUser(null)
            }}
            title={`Usuário: ${selectedUser.name}`}
            data={selectedUser}
            type="user"
          />
        )}
      </main>
    </div>
  )
}

"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User as UserIcon, 
  LogIn, 
  LogOut, 
  UserPlus, 
  Settings,
  Loader2,
  Mail,
  Lock,
  UserCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import type { User } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function AuthButton() {
  const { user, loading, login, register, logout, updateUserData, isLoginModalOpen, setIsLoginModalOpen } = useAuth()
  const router = useRouter()
  const [authLoading, setAuthLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('login')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(false)

  // Estados do formulário de login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  // Estados do formulário de registro
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Estados das configurações
  const [settingsData, setSettingsData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    
    const success = await login(loginData.email, loginData.password)
    
    if (success) {
      setIsLoginModalOpen(false)
      setLoginData({ email: '', password: '' })
    }
    
    setAuthLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(registerData.email)) {
      toast.error('Por favor, insira um email válido')
      setAuthLoading(false)
      return
    }

    // Validações
    if (registerData.password !== registerData.confirmPassword) {
      setAuthLoading(false)
      return // O toast já é mostrado no contexto
    }

    if (registerData.password.length < 6) {
      setAuthLoading(false)
      return // O toast já é mostrado no contexto
    }

    const success = await register(registerData.email, registerData.password, registerData.name)
    
    if (success) {
      setIsLoginModalOpen(false)
      setRegisterData({ name: '', email: '', password: '', confirmPassword: '' })
    }
    
    setAuthLoading(false)
  }

  const handleLogout = async () => {
    await logout()
  }

  const goToProfile = () => {
    router.push('/perfil')
  }

  const openSettings = () => {
    if (user) {
      setSettingsData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setSettingsOpen(true)
    }
  }

  const updateProfile = async (field: 'name' | 'email' | 'password') => {
    if (!user) return

    setSettingsLoading(true)

    try {
      let updateData: Partial<User> = {}
      let shouldClose = false

      if (field === 'name') {
        if (!settingsData.name.trim()) {
          toast.error('Nome não pode estar vazio')
          setSettingsLoading(false)
          return
        }
        updateData.name = settingsData.name.trim()
        shouldClose = true
      }

      if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!settingsData.email.trim()) {
          toast.error('Email não pode estar vazio')
          setSettingsLoading(false)
          return
        }
        if (!emailRegex.test(settingsData.email.trim())) {
          toast.error('Por favor, insira um email válido')
          setSettingsLoading(false)
          return
        }
        updateData.email = settingsData.email.trim()
        shouldClose = true
      }

      if (field === 'password') {
        if (!settingsData.currentPassword) {
          toast.error('Senha atual é obrigatória')
          setSettingsLoading(false)
          return
        }
        if (settingsData.currentPassword !== user.password) {
          toast.error('Senha atual incorreta')
          setSettingsLoading(false)
          return
        }
        if (settingsData.newPassword.length < 6) {
          toast.error('Nova senha deve ter pelo menos 6 caracteres')
          setSettingsLoading(false)
          return
        }
        if (settingsData.newPassword !== settingsData.confirmPassword) {
          toast.error('Confirmação de senha não confere')
          setSettingsLoading(false)
          return
        }
        updateData.password = settingsData.newPassword
        
        // Limpar campos de senha após atualização
        setSettingsData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
      }

      // Usar a função do contexto para atualizar
      const success = await updateUserData(updateData)
      
      if (success && shouldClose) {
        setSettingsOpen(false)
      }

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast.error('Erro ao atualizar perfil. Tente novamente.')
    }

    setSettingsLoading(false)
  }

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  // Se o usuário está logado, mostrar dropdown com avatar
  if (user) {
    const initials = user.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={goToProfile}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Meu Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openSettings}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Modal de Configurações */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações da Conta
              </DialogTitle>
              <DialogDescription>
                Atualize suas informações pessoais e de segurança
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Alterar Nome */}
              <div className="space-y-3">
                <Label htmlFor="settings-name">Nome</Label>
                <div className="flex gap-2">
                  <Input
                    id="settings-name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={settingsData.name}
                    onChange={(e) => setSettingsData(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Button 
                    onClick={() => updateProfile('name')} 
                    disabled={settingsLoading}
                    size="sm"
                  >
                    {settingsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
                  </Button>
                </div>
              </div>

              {/* Alterar Email */}
              <div className="space-y-3">
                <Label htmlFor="settings-email">Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="settings-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={settingsData.email}
                    onChange={(e) => setSettingsData(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <Button 
                    onClick={() => updateProfile('email')} 
                    disabled={settingsLoading}
                    size="sm"
                  >
                    {settingsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
                  </Button>
                </div>
              </div>

              {/* Alterar Senha */}
              <div className="space-y-3">
                <Label>Alterar Senha</Label>
                <div className="space-y-3">
                  <Input
                    type="password"
                    placeholder="Senha atual"
                    value={settingsData.currentPassword}
                    onChange={(e) => setSettingsData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                  <Input
                    type="password"
                    placeholder="Nova senha"
                    value={settingsData.newPassword}
                    onChange={(e) => setSettingsData(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                  <Input
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={settingsData.confirmPassword}
                    onChange={(e) => setSettingsData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                  <Button 
                    onClick={() => updateProfile('password')} 
                    disabled={settingsLoading}
                    size="sm"
                    className="w-full"
                  >
                    {settingsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Alterar Senha'}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Se não está logado, mostrar botão de login
  return (
    <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
      <DialogTrigger asChild>
        <button className="hidden md:flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-md px-3 py-1.5">
          <LogIn className="h-4 w-4" />
          <span className="text-sm font-medium">Entrar</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Acesse sua conta
          </DialogTitle>
          <DialogDescription>
            Entre ou crie uma conta para acessar todas as funcionalidades
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Criar conta</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={authLoading}>
                {authLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Nome completo</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Seu nome completo"
                    className="pl-10"
                    value={registerData.name}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={authLoading}>
                {authLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Criar conta
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

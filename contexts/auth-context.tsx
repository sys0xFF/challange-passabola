'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { ref, push, onValue, query, orderByChild, equalTo, get, set } from 'firebase/database'
import { database } from '@/lib/firebase'
import { toast } from 'sonner'

// Interface para o usuário
export interface User {
  id: string
  email: string
  name: string
  password: string
  avatar?: string
  telefone?: string
  cidade?: string
  estadoCivil?: string
  createdAt: string
}

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateUserData: (data: Partial<User>) => Promise<boolean>
  openLoginModal: () => void
  isLoginModalOpen: boolean
  setIsLoginModalOpen: (open: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const openLoginModal = () => {
    setIsLoginModalOpen(true)
  }

  useEffect(() => {
    // Verificar se há um usuário salvo no localStorage (apenas no cliente)
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          setUser(userData)
        } catch (error) {
          console.error('Erro ao recuperar dados do usuário:', error)
          localStorage.removeItem('currentUser')
        }
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Por enquanto, vamos buscar todos os usuários e filtrar no cliente
      const usersRef = ref(database, 'users')
      const snapshot = await get(usersRef)
      
      if (!snapshot.exists()) {
        toast.error('Nenhum usuário encontrado')
        return false
      }
      
      // Buscar usuário por email
      const users = snapshot.val()
      const userEntry = Object.entries(users).find(([_, userData]: [string, any]) => 
        userData.email === email
      )
      
      if (!userEntry) {
        toast.error('Email não encontrado')
        return false
      }
      
      const [userId, userData] = userEntry
      
      // Verificar senha (em um ambiente real, você usaria hash)
      if ((userData as any).password !== password) {
        toast.error('Senha incorreta')
        return false
      }
      
      // Fazer login
      const loggedUser = {
        id: userId,
        ...(userData as any)
      }
      
      setUser(loggedUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(loggedUser))
      }
      toast.success('Login realizado com sucesso!')
      return true
      
    } catch (error) {
      console.error('Erro no login:', error)
      toast.error('Erro ao fazer login')
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Gerar um ID único para o usuário sem verificar duplicatas por enquanto
      const usersRef = ref(database, 'users')
      const newUserRef = push(usersRef)
      
      // Criar novo usuário
      const newUserData = {
        email,
        password, // Em um ambiente real, você faria hash da senha
        name,
        createdAt: new Date().toISOString()
      }
      
      await set(newUserRef, newUserData)
      
      // Fazer login automático após registro
      const newUser = {
        id: newUserRef.key!,
        ...newUserData
      }
      
      setUser(newUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(newUser))
      }
      toast.success('Conta criada com sucesso!')
      return true
      
    } catch (error) {
      console.error('Erro no registro:', error)
      toast.error('Erro ao criar conta')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser')
    }
    toast.success('Logout realizado com sucesso!')
  }

  const updateUserData = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false
    
    try {
      const userRef = ref(database, `users/${user.id}`)
      const updates = {
        ...data,
        updatedAt: new Date().toISOString()
      }
      
      await set(userRef, { ...user, ...updates })
      
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      }
      
      toast.success('Dados atualizados com sucesso!')
      return true
    } catch (error) {
      console.error('Erro ao atualizar dados:', error)
      toast.error('Erro ao atualizar dados')
      return false
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserData,
    openLoginModal,
    isLoginModalOpen,
    setIsLoginModalOpen
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

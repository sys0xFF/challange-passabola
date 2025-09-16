"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { Bebas_Neue } from "next/font/google"
import { useAdminAuth } from "@/contexts/admin-auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, EyeOff, Lock } from "lucide-react"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, isAuthenticated, loading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push("/admin/dashboard")
    }
  }, [isAuthenticated, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 800))

    const success = login(username, password)
    
    if (success) {
      router.push("/admin/dashboard")
    } else {
      setLoginError("Credenciais inválidas. Tente novamente.")
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#8e44ad] to-[#9b59b6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#8e44ad] to-[#9b59b6]">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm sm:max-w-md"
        >
          <Card className="shadow-2xl">
            <CardHeader className="text-center space-y-3 sm:space-y-4">
              <div className="flex justify-center">
                <div className="relative h-12 w-12 sm:h-16 sm:w-16">
                  <Image src="/logo.png" alt="Passa Bola Logo" fill className="object-contain" />
                </div>
              </div>
              
              <div>
                <Badge className="bg-[#c2ff28] text-[#8e44ad] mb-3 sm:mb-4 text-xs sm:text-sm">ÁREA RESTRITA</Badge>
                <CardTitle className={`${bebasNeue.className} text-2xl sm:text-3xl text-[#8e44ad] tracking-wider`}>
                  PAINEL ADMINISTRATIVO
                </CardTitle>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Faça login para acessar o dashboard
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="flex items-center gap-2 text-sm sm:text-base">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                      Usuário
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Digite seu usuário"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-[#8e44ad] text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2 text-sm sm:text-base">
                      <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite sua senha"
                        required
                        className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-[#8e44ad] text-sm sm:text-base"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm"
                  >
                    {loginError}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !username || !password}
                  className="w-full bg-[#8e44ad] hover:bg-[#9b59b6] text-white transition-all duration-200 disabled:opacity-50 text-sm sm:text-base py-2 sm:py-3"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                      <span className="hidden sm:inline">Autenticando...</span>
                      <span className="sm:hidden">Entrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                      Fazer Login
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t text-center">
                <p className="text-xs text-muted-foreground">
                  Sistema de administração Copa Passa Bola 2025
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

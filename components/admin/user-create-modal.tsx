"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Loader2 } from "lucide-react"
import { ref, push, set } from "firebase/database"
import { database } from "@/lib/firebase"

interface UserCreateModalProps {
  onUserCreated?: () => void
}

export function UserCreateModal({ onUserCreated }: UserCreateModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telefone: "",
    cidade: "",
    estadoCivil: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreateUser = async () => {
    if (!formData.name || !formData.email) {
      alert('Nome e email são obrigatórios!')
      return
    }

    setIsLoading(true)

    try {
      const usersRef = ref(database, 'users')
      const newUserRef = push(usersRef)
      
      const userData = {
        ...formData,
        createdAt: new Date().toISOString(),
        // Senha padrão será definida como o email do usuário (pode ser alterada depois)
        password: formData.email
      }

      await set(newUserRef, userData)
      
      alert('✅ Usuário criado com sucesso!')
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        telefone: "",
        cidade: "",
        estadoCivil: ""
      })
      
      setIsOpen(false)
      
      // Callback para recarregar dados no dashboard
      if (onUserCreated) {
        onUserCreated()
      }
      
    } catch (error) {
      console.error('Error creating user:', error)
      alert('❌ Erro ao criar usuário. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Criar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Criar Novo Usuário
          </DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Digite o email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                placeholder="Digite a cidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estadoCivil">Estado Civil</Label>
              <Input
                id="estadoCivil"
                value={formData.estadoCivil}
                onChange={(e) => handleInputChange('estadoCivil', e.target.value)}
                placeholder="Solteiro(a), Casado(a), etc."
              />
            </div>

            <div className="pt-4 space-y-2">
              <Button 
                onClick={handleCreateUser}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando usuário...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Criar Usuário
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

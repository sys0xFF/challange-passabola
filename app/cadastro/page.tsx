"use client"
import Link from "next/link"
import type React from "react"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { useDevAutoFill } from "@/hooks/use-dev-autofill"
import { saveTeamRegistration, saveIndividualRegistration } from "@/lib/database-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button"
import { MobileMenu } from "@/components/ui/mobile-menu"
import { ChevronRight, Upload, X, User, Users, FileText, CheckCircle, ArrowLeft, ShoppingBag } from "lucide-react"
import { Bebas_Neue } from "next/font/google"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

type RegistrationType = "individual" | "team" | null
type Player = {
  id: number
  nomeCompleto: string
  idade: string
  email: string
  telefone: string
  cidadeBairro: string
  posicao: string
  jaParticipou: string
}

export default function CadastroPage() {
  const [registrationType, setRegistrationType] = useState<RegistrationType>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [wantNotifications, setWantNotifications] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hook de autofill para desenvolvimento
  useDevAutoFill()

  // Team form data
  const [teamData, setTeamData] = useState({
    nomeTime: "",
    nomeCapitao: "",
  })

  // Individual/Captain data
  const [captainData, setCaptainData] = useState({
    nomeCompleto: "",
    idade: "",
    email: "",
    telefone: "",
    cidadeBairro: "",
    posicao: "",
    jaParticipou: "",
  })

  // Players data (for team registration)
  const [players, setPlayers] = useState<Player[]>(
    Array.from({ length: 7 }, (_, i) => ({
      id: i + 1,
      nomeCompleto: "",
      idade: "",
      email: "",
      telefone: "",
      cidadeBairro: "",
      posicao: "",
      jaParticipou: "",
    })),
  )

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const targetId = e.currentTarget.href.split("#")[1]
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files)
      setUploadedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setUploadedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const updatePlayer = (playerId: number, field: keyof Player, value: string) => {
    setPlayers((prev) => prev.map((player) => (player.id === playerId ? { ...player, [field]: value } : player)))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (registrationType === "team") {
        const teamRegistrationData = {
          type: "team" as const,
          teamData,
          captainData,
          players,
          preferences: {
            acceptTerms,
            wantNotifications,
          },
        };

        const result = await saveTeamRegistration(teamRegistrationData);
        
        if (result.success) {
          console.log("Team registration saved with ID:", result.id);
          setIsSubmitted(true);
        } else {
          console.error("Failed to save team registration:", result.error);
          alert("Erro ao salvar cadastro. Tente novamente.");
        }
      } else if (registrationType === "individual") {
        const individualRegistrationData = {
          type: "individual" as const,
          captainData,
          preferences: {
            acceptTerms,
            wantNotifications,
          },
        };

        const result = await saveIndividualRegistration(individualRegistrationData);
        
        if (result.success) {
          console.log("Individual registration saved with ID:", result.id);
          setIsSubmitted(true);
        } else {
          console.error("Failed to save individual registration:", result.error);
          alert("Erro ao salvar cadastro. Tente novamente.");
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Erro ao salvar cadastro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const canProceedToStep2 = () => {
    if (registrationType === "individual") {
      return captainData.nomeCompleto && captainData.email && captainData.telefone
    } else if (registrationType === "team") {
      return (
        teamData.nomeTime &&
        teamData.nomeCapitao &&
        captainData.nomeCompleto &&
        captainData.email &&
        captainData.telefone
      )
    }
    return false
  }

  const canProceedToStep3 = () => {
    if (registrationType === "individual") {
      return captainData.idade && captainData.cidadeBairro && captainData.posicao && captainData.jaParticipou
    } else if (registrationType === "team") {
      return players.every(
        (player) =>
          player.nomeCompleto &&
          player.email &&
          player.telefone &&
          player.idade &&
          player.cidadeBairro &&
          player.posicao &&
          player.jaParticipou,
      )
    }
    return false
  }

  const canSubmit = () => {
    return uploadedFiles.length > 0 && acceptTerms
  }

  if (isSubmitted) {
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
                <Badge className="bg-green-500 text-white">CADASTRO REALIZADO</Badge>
              </div>
              <div className="flex justify-end items-center gap-2">
                <ThemeToggleButton />
                <div className="md:hidden">
                  <MobileMenu />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 pt-20">
          <section className="py-20 bg-gradient-to-b from-green-50 to-white dark:from-green-900/20 dark:to-slate-900">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
              >
                <div className="mb-8">
                  <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
                  <h1
                    className={`${bebasNeue.className} text-4xl md:text-6xl font-bold text-[#8e44ad] dark:text-primary mb-6 tracking-wider`}
                  >
                    CADASTRO REALIZADO COM SUCESSO!
                  </h1>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                    {registrationType === "team"
                      ? `O time "${teamData.nomeTime}" foi cadastrado com sucesso! Em breve entraremos em contato com mais informações sobre a Copa Passa Bola 2025.`
                      : "Seu cadastro individual foi realizado com sucesso! Em breve entraremos em contato com mais informações sobre a Copa Passa Bola 2025."}
                  </p>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg mb-8">
                    <h3 className="font-bold text-[#8e44ad] dark:text-primary mb-4">Próximos passos:</h3>
                    <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300">
                      <li>• Análise da documentação enviada</li>
                      <li>• Confirmação da inscrição por e-mail</li>
                      <li>• Envio do regulamento completo</li>
                      <li>• Informações sobre datas e locais dos jogos</li>
                    </ul>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white">
                      <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        VOLTAR AO INÍCIO
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-[#8e44ad] text-[#8e44ad] hover:bg-[#8e44ad] hover:text-white"
                    >
                      <Link href="/#contato">FALAR CONOSCO</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    )
  }

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
              <Badge className="bg-pink-500 text-white">CADASTRO COPA 2025</Badge>
            </div>
            <div className="flex justify-end items-center gap-2">
              <Link
                onClick={handleSmoothScroll}
                href="/#loja"
                className="hidden md:flex items-center gap-1 text-primary dark:text-primary-foreground hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="text-sm font-medium">Loja</span>
              </Link>
              <ThemeToggleButton />
              <div className="md:hidden">
                <MobileMenu />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#8e44ad] to-[#9b59b6] text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="bg-[#c2ff28] text-[#8e44ad] mb-4 hover:bg-[#c2ff28]">INSCRIÇÕES ABERTAS</Badge>
              <h1 className={`${bebasNeue.className} text-4xl md:text-6xl font-bold mb-6 tracking-wider`}>
                CADASTRE-SE NA COPA PASSA BOLA 2025
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto">
                Faça parte da maior revolução do futebol feminino. Cadastre seu time ou participe individualmente.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-4xl">
            {!registrationType ? (
              // Step 0: Choose registration type
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="text-center mb-12">
                  <h2
                    className={`${bebasNeue.className} text-3xl md:text-4xl font-bold text-[#8e44ad] dark:text-primary mb-6 tracking-wider`}
                  >
                    COMO VOCÊ QUER PARTICIPAR?
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Escolha a modalidade de inscrição que melhor se adequa à sua situação.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card
                    className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 hover:border-[#8e44ad] dark:bg-slate-800"
                    onClick={() => setRegistrationType("team")}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className="h-16 w-16 rounded-full bg-[#8e44ad]/10 dark:bg-[#8e44ad]/20 flex items-center justify-center text-[#8e44ad] mx-auto mb-4">
                        <Users className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-2xl text-[#8e44ad] dark:text-primary">CADASTRAR TIME</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Já tem um time formado? Cadastre sua equipe completa com capitã e 7 jogadoras.
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                        <li>• Cadastro do time e capitã</li>
                        <li>• Dados de 7 jogadoras</li>
                        <li>• Documentação da equipe</li>
                      </ul>
                      <Button className="w-full bg-[#8e44ad] hover:bg-[#9b59b6] text-white">
                        ESCOLHER ESTA OPÇÃO
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 hover:border-[#8e44ad] dark:bg-slate-800"
                    onClick={() => setRegistrationType("individual")}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className="h-16 w-16 rounded-full bg-[#8e44ad]/10 dark:bg-[#8e44ad]/20 flex items-center justify-center text-[#8e44ad] mx-auto mb-4">
                        <User className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-2xl text-[#8e44ad] dark:text-primary">CADASTRO INDIVIDUAL</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Não tem time ainda? Cadastre-se individualmente e nós te ajudamos a encontrar uma equipe.
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                        <li>• Cadastro individual</li>
                        <li>• Matching com outras jogadoras</li>
                        <li>• Formação de novos times</li>
                      </ul>
                      <Button className="w-full bg-[#8e44ad] hover:bg-[#9b59b6] text-white">
                        ESCOLHER ESTA OPÇÃO
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ) : (
              // Steps 1-3: Registration form
              <div>
                {/* Progress indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            currentStep >= step
                              ? "bg-[#8e44ad] text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {step}
                        </div>
                        {step < 3 && (
                          <div
                            className={`h-1 w-16 mx-2 ${
                              currentStep > step ? "bg-[#8e44ad]" : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Etapa {currentStep} de 3</p>
                  </div>
                </div>

                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="dark:bg-slate-800">
                      <CardHeader>
                        <CardTitle className="text-2xl text-[#8e44ad] dark:text-primary">
                          {registrationType === "team" ? "DADOS DO TIME E CAPITÃ" : "SEUS DADOS BÁSICOS"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {registrationType === "team" && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="nomeTime">Nome do Time *</Label>
                              <Input
                                id="nomeTime"
                                value={teamData.nomeTime}
                                onChange={(e) => setTeamData((prev) => ({ ...prev, nomeTime: e.target.value }))}
                                placeholder="Digite o nome do seu time"
                                className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="nomeCapitao">Nome da Capitã *</Label>
                              <Input
                                id="nomeCapitao"
                                value={teamData.nomeCapitao}
                                onChange={(e) => setTeamData((prev) => ({ ...prev, nomeCapitao: e.target.value }))}
                                placeholder="Digite o nome da capitã"
                                className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                              />
                            </div>
                            <div className="border-t pt-6">
                              <h3 className="text-lg font-semibold text-[#8e44ad] dark:text-primary mb-4">
                                Dados da Capitã
                              </h3>
                            </div>
                          </>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                            <Input
                              id="nomeCompleto"
                              value={captainData.nomeCompleto}
                              onChange={(e) => setCaptainData((prev) => ({ ...prev, nomeCompleto: e.target.value }))}
                              placeholder="Seu nome completo"
                              className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">E-mail *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={captainData.email}
                              onChange={(e) => setCaptainData((prev) => ({ ...prev, email: e.target.value }))}
                              placeholder="seu@email.com"
                              className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="telefone">Telefone / WhatsApp *</Label>
                          <Input
                            id="telefone"
                            value={captainData.telefone}
                            onChange={(e) => setCaptainData((prev) => ({ ...prev, telefone: e.target.value }))}
                            placeholder="(11) 99999-9999"
                            className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                          />
                        </div>

                        <div className="flex justify-between pt-6">
                          <Button
                            variant="outline"
                            onClick={() => setRegistrationType(null)}
                            className="border-[#8e44ad] text-[#8e44ad] hover:bg-[#8e44ad] hover:text-white"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            VOLTAR
                          </Button>
                          <Button
                            onClick={() => setCurrentStep(2)}
                            disabled={!canProceedToStep2()}
                            className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white disabled:opacity-50"
                          >
                            CONTINUAR
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="dark:bg-slate-800">
                      <CardHeader>
                        <CardTitle className="text-2xl text-[#8e44ad] dark:text-primary">
                          {registrationType === "team" ? "DADOS DAS JOGADORAS" : "INFORMAÇÕES COMPLEMENTARES"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {registrationType === "individual" ? (
                          // Individual form - additional captain data
                          <>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="idade">Idade *</Label>
                                <Input
                                  id="idade"
                                  value={captainData.idade}
                                  onChange={(e) => setCaptainData((prev) => ({ ...prev, idade: e.target.value }))}
                                  placeholder="Sua idade"
                                  className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cidadeBairro">Cidade / Bairro *</Label>
                                <Input
                                  id="cidadeBairro"
                                  value={captainData.cidadeBairro}
                                  onChange={(e) =>
                                    setCaptainData((prev) => ({ ...prev, cidadeBairro: e.target.value }))
                                  }
                                  placeholder="Sua cidade/bairro"
                                  className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="posicao">Posição em Campo *</Label>
                              <Select
                                value={captainData.posicao}
                                onValueChange={(value) => setCaptainData((prev) => ({ ...prev, posicao: value }))}
                              >
                                <SelectTrigger className="focus:ring-[#8e44ad] focus:border-[#8e44ad]">
                                  <SelectValue placeholder="Selecione sua posição" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="goleira">Goleira</SelectItem>
                                  <SelectItem value="zagueira">Zagueira</SelectItem>
                                  <SelectItem value="lateral">Lateral</SelectItem>
                                  <SelectItem value="volante">Volante</SelectItem>
                                  <SelectItem value="meia">Meia</SelectItem>
                                  <SelectItem value="atacante">Atacante</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Já participou de campeonatos antes? *</Label>
                              <RadioGroup
                                value={captainData.jaParticipou}
                                onValueChange={(value) => setCaptainData((prev) => ({ ...prev, jaParticipou: value }))}
                                className="flex space-x-6"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="sim" />
                                  <Label htmlFor="sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="nao" />
                                  <Label htmlFor="nao">Não</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </>
                        ) : (
                          // Team form - players data
                          <div className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="captainIdade">Idade da Capitã *</Label>
                                <Input
                                  id="captainIdade"
                                  value={captainData.idade}
                                  onChange={(e) => setCaptainData((prev) => ({ ...prev, idade: e.target.value }))}
                                  placeholder="Idade da capitã"
                                  className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="captainCidadeBairro">Cidade / Bairro da Capitã *</Label>
                                <Input
                                  id="captainCidadeBairro"
                                  value={captainData.cidadeBairro}
                                  onChange={(e) =>
                                    setCaptainData((prev) => ({ ...prev, cidadeBairro: e.target.value }))
                                  }
                                  placeholder="Cidade/bairro da capitã"
                                  className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                                />
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="captainPosicao">Posição da Capitã *</Label>
                                <Select
                                  value={captainData.posicao}
                                  onValueChange={(value) => setCaptainData((prev) => ({ ...prev, posicao: value }))}
                                >
                                  <SelectTrigger className="focus:ring-[#8e44ad] focus:border-[#8e44ad]">
                                    <SelectValue placeholder="Posição da capitã" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="goleira">Goleira</SelectItem>
                                    <SelectItem value="zagueira">Zagueira</SelectItem>
                                    <SelectItem value="lateral">Lateral</SelectItem>
                                    <SelectItem value="volante">Volante</SelectItem>
                                    <SelectItem value="meia">Meia</SelectItem>
                                    <SelectItem value="atacante">Atacante</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Capitã já participou de campeonatos? *</Label>
                                <RadioGroup
                                  value={captainData.jaParticipou}
                                  onValueChange={(value) =>
                                    setCaptainData((prev) => ({ ...prev, jaParticipou: value }))
                                  }
                                  className="flex space-x-6"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sim" id="captain-sim" />
                                    <Label htmlFor="captain-sim">Sim</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="nao" id="captain-nao" />
                                    <Label htmlFor="captain-nao">Não</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>

                            <div className="border-t pt-6">
                              <h3 className="text-lg font-semibold text-[#8e44ad] dark:text-primary mb-6">
                                Dados das 7 Jogadoras
                              </h3>

                              <div className="space-y-8">
                                {players.map((player, index) => (
                                  <div
                                    key={player.id}
                                    className="border rounded-lg p-6 bg-gray-50 dark:bg-slate-700/50"
                                  >
                                    <h4 className="font-semibold text-[#8e44ad] dark:text-primary mb-4">
                                      Jogadora {index + 1}
                                    </h4>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                      <div className="space-y-2">
                                        <Label>Nome Completo *</Label>
                                        <Input
                                          value={player.nomeCompleto}
                                          onChange={(e) => updatePlayer(player.id, "nomeCompleto", e.target.value)}
                                          placeholder="Nome completo da jogadora"
                                          className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Idade *</Label>
                                        <Input
                                          value={player.idade}
                                          onChange={(e) => updatePlayer(player.id, "idade", e.target.value)}
                                          placeholder="Idade"
                                          className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                      <div className="space-y-2">
                                        <Label>E-mail *</Label>
                                        <Input
                                          type="email"
                                          value={player.email}
                                          onChange={(e) => updatePlayer(player.id, "email", e.target.value)}
                                          placeholder="email@exemplo.com"
                                          className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Telefone / WhatsApp *</Label>
                                        <Input
                                          value={player.telefone}
                                          onChange={(e) => updatePlayer(player.id, "telefone", e.target.value)}
                                          placeholder="(11) 99999-9999"
                                          className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                      <div className="space-y-2">
                                        <Label>Cidade / Bairro *</Label>
                                        <Input
                                          value={player.cidadeBairro}
                                          onChange={(e) => updatePlayer(player.id, "cidadeBairro", e.target.value)}
                                          placeholder="Cidade/bairro"
                                          className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Posição em Campo *</Label>
                                        <Select
                                          value={player.posicao}
                                          onValueChange={(value) => updatePlayer(player.id, "posicao", value)}
                                        >
                                          <SelectTrigger className="focus:ring-[#8e44ad] focus:border-[#8e44ad]">
                                            <SelectValue placeholder="Selecione a posição" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="goleira">Goleira</SelectItem>
                                            <SelectItem value="zagueira">Zagueira</SelectItem>
                                            <SelectItem value="lateral">Lateral</SelectItem>
                                            <SelectItem value="volante">Volante</SelectItem>
                                            <SelectItem value="meia">Meia</SelectItem>
                                            <SelectItem value="atacante">Atacante</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label>Já participou de campeonatos antes? *</Label>
                                      <RadioGroup
                                        value={player.jaParticipou}
                                        onValueChange={(value) => updatePlayer(player.id, "jaParticipou", value)}
                                        className="flex space-x-6"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="sim" id={`player-${player.id}-sim`} />
                                          <Label htmlFor={`player-${player.id}-sim`}>Sim</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="nao" id={`player-${player.id}-nao`} />
                                          <Label htmlFor={`player-${player.id}-nao`}>Não</Label>
                                        </div>
                                      </RadioGroup>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between pt-6">
                          <Button
                            variant="outline"
                            onClick={() => setCurrentStep(1)}
                            className="border-[#8e44ad] text-[#8e44ad] hover:bg-[#8e44ad] hover:text-white"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            VOLTAR
                          </Button>
                          <Button
                            onClick={() => setCurrentStep(3)}
                            disabled={!canProceedToStep3()}
                            className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white disabled:opacity-50"
                          >
                            CONTINUAR
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="dark:bg-slate-800">
                      <CardHeader>
                        <CardTitle className="text-2xl text-[#8e44ad] dark:text-primary">
                          DOCUMENTAÇÃO E TERMOS
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* File Upload */}
                        <div className="space-y-4">
                          <Label>Envio de Documentos *</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Envie os documentos (frente e verso) de{" "}
                            {registrationType === "team" ? "todas as jogadoras" : "identificação"}. Formatos aceitos:
                            JPG, PNG, PDF
                          </p>

                          <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                              dragActive
                                ? "border-[#8e44ad] bg-[#8e44ad]/5"
                                : "border-gray-300 dark:border-gray-600 hover:border-[#8e44ad]"
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                          >
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Arraste e solte os arquivos aqui
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">ou clique para selecionar</p>
                            <input
                              type="file"
                              multiple
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={handleFileInput}
                              className="hidden"
                              id="file-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("file-upload")?.click()}
                              className="border-[#8e44ad] text-[#8e44ad] hover:bg-[#8e44ad] hover:text-white"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              SELECIONAR ARQUIVOS
                            </Button>
                          </div>

                          {uploadedFiles.length > 0 && (
                            <div className="space-y-2">
                              <Label>Arquivos selecionados:</Label>
                              <div className="space-y-2">
                                {uploadedFiles.map((file, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 p-3 rounded-lg"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <FileText className="h-5 w-5 text-[#8e44ad]" />
                                      <span className="text-sm font-medium">{file.name}</span>
                                      <span className="text-xs text-gray-500">
                                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                      </span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFile(index)}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Terms and Notifications */}
                        <div className="space-y-4 border-t pt-6">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id="notifications"
                              checked={wantNotifications}
                              onCheckedChange={(checked) => setWantNotifications(checked as boolean)}
                              className="data-[state=checked]:bg-[#8e44ad] data-[state=checked]:border-[#8e44ad]"
                            />
                            <Label htmlFor="notifications" className="text-sm leading-relaxed">
                              Quero ser notificada quando estiver perto do jogo e receber atualizações sobre a Copa
                              Passa Bola
                            </Label>
                          </div>

                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id="terms"
                              checked={acceptTerms}
                              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                              className="data-[state=checked]:bg-[#8e44ad] data-[state=checked]:border-[#8e44ad]"
                            />
                            <Label htmlFor="terms" className="text-sm leading-relaxed">
                              Aceito os{" "}
                              <Link href="#" className="text-[#8e44ad] hover:underline">
                                termos e condições
                              </Link>{" "}
                              da Copa Passa Bola e concordo com o{" "}
                              <Link href="#" className="text-[#8e44ad] hover:underline">
                                regulamento do torneio
                              </Link>
                              . *
                            </Label>
                          </div>
                        </div>

                        <div className="flex justify-between pt-6">
                          <Button
                            variant="outline"
                            onClick={() => setCurrentStep(2)}
                            className="border-[#8e44ad] text-[#8e44ad] hover:bg-[#8e44ad] hover:text-white"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            VOLTAR
                          </Button>
                          <Button
                            onClick={handleSubmit}
                            disabled={!canSubmit() || isSubmitting}
                            className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white disabled:opacity-50"
                          >
                            {isSubmitting ? "SALVANDO..." : "FINALIZAR CADASTRO"}
                            {!isSubmitting && <CheckCircle className="ml-2 h-4 w-4" />}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

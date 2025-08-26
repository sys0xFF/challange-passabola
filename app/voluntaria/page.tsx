"use client"
import Link from "next/link"
import type React from "react"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { useDevAutoFill } from "@/hooks/use-dev-autofill"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button"
import { MobileMenu } from "@/components/ui/mobile-menu"
import {
  ChevronRight,
  Upload,
  X,
  Heart,
  Users,
  FileText,
  CheckCircle,
  ArrowLeft,
  ShoppingBag,
  Megaphone,
  Stethoscope,
  Camera,
  Clipboard,
  Coffee,
  Shield,
  Clock,
} from "lucide-react"
import { Bebas_Neue } from "next/font/google"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

type VolunteerArea = {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  requirements: string[]
}

const volunteerAreas: VolunteerArea[] = [
  {
    id: "organizacao",
    name: "Organização",
    description: "Ajude na coordenação geral dos eventos, logística e planejamento",
    icon: <Clipboard className="h-6 w-6" />,
    requirements: ["Experiência em organização de eventos", "Disponibilidade nos finais de semana", "Boa comunicação"],
  },
  {
    id: "comunicacao",
    name: "Comunicação",
    description: "Redes sociais, marketing, assessoria de imprensa e cobertura dos jogos",
    icon: <Megaphone className="h-6 w-6" />,
    requirements: ["Conhecimento em redes sociais", "Habilidades de comunicação", "Criatividade"],
  },
  {
    id: "saude",
    name: "Saúde",
    description: "Primeiros socorros, acompanhamento médico e cuidados com as atletas",
    icon: <Stethoscope className="h-6 w-6" />,
    requirements: ["Formação na área da saúde", "Certificação em primeiros socorros", "Experiência com esportes"],
  },
  {
    id: "audiovisual",
    name: "Audiovisual",
    description: "Fotografia, filmagem, edição e documentação dos eventos",
    icon: <Camera className="h-6 w-6" />,
    requirements: ["Equipamentos próprios", "Conhecimento em edição", "Portfolio de trabalhos"],
  },
  {
    id: "recepcao",
    name: "Recepção",
    description: "Atendimento ao público, credenciamento e informações gerais",
    icon: <Coffee className="h-6 w-6" />,
    requirements: ["Boa comunicação", "Paciência", "Disponibilidade para trabalhar com público"],
  },
  {
    id: "seguranca",
    name: "Segurança",
    description: "Controle de acesso, organização do público e segurança geral",
    icon: <Shield className="h-6 w-6" />,
    requirements: ["Experiência em segurança", "Porte físico adequado", "Curso de segurança (desejável)"],
  },
]

export default function VoluntariaPage() {
  // Hook de desenvolvimento
  useDevAutoFill();
  
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [wantNotifications, setWantNotifications] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    idade: "",
    email: "",
    telefone: "",
    cidadeBairro: "",
    profissao: "",
    experienciaAnterior: "",
    motivacao: "",
    disponibilidadeDias: [] as string[],
    disponibilidadeHorarios: [] as string[],
    temTransporte: "",
    referencias: "",
    antecedentes: "",
    observacoes: "",
  })

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

  const toggleArea = (areaId: string) => {
    setSelectedAreas((prev) => (prev.includes(areaId) ? prev.filter((id) => id !== areaId) : [...prev, areaId]))
  }

  const toggleAvailability = (type: "dias" | "horarios", value: string) => {
    const field = type === "dias" ? "disponibilidadeDias" : "disponibilidadeHorarios"
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((item) => item !== value) : [...prev[field], value],
    }))
  }

  const handleSubmit = () => {
    console.log("Volunteer registration data:", {
      formData,
      selectedAreas,
      files: uploadedFiles,
      acceptTerms,
      wantNotifications,
    })
    setIsSubmitted(true)
  }

  const canProceedToStep2 = () => {
    return selectedAreas.length > 0
  }

  const canProceedToStep3 = () => {
    return (
      formData.nomeCompleto &&
      formData.idade &&
      formData.email &&
      formData.telefone &&
      formData.cidadeBairro &&
      formData.profissao &&
      formData.motivacao &&
      formData.disponibilidadeDias.length > 0 &&
      formData.disponibilidadeHorarios.length > 0 &&
      formData.temTransporte &&
      formData.antecedentes
    )
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
                    CADASTRO DE VOLUNTÁRIA REALIZADO!
                  </h1>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                    Obrigada por se voluntariar para ajudar a Copa Passa Bola! Sua contribuição é fundamental para o
                    sucesso do nosso movimento. Em breve entraremos em contato.
                  </p>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg mb-8">
                    <h3 className="font-bold text-[#8e44ad] dark:text-primary mb-4">Próximos passos:</h3>
                    <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300">
                      <li>• Análise do seu perfil e documentação</li>
                      <li>• Verificação de referências</li>
                      <li>• Convite para reunião de orientação</li>
                      <li>• Definição de cronograma de atividades</li>
                      <li>• Entrega do kit de voluntária</li>
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
              <Badge className="bg-pink-500 text-white">SEJA VOLUNTÁRIA</Badge>
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
              <Badge className="bg-[#c2ff28] text-[#8e44ad] mb-4 hover:bg-[#c2ff28]">VOLUNTARIADO</Badge>
              <h1 className={`${bebasNeue.className} text-4xl md:text-6xl font-bold mb-6 tracking-wider`}>
                SEJA VOLUNTÁRIA DA COPA PASSA BOLA
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto">
                Quer ajudar mas não joga? Temos vagas para voluntárias em diversas áreas: organização, comunicação,
                saúde e muito mais. Faça parte dessa revolução!
              </p>
              <div className="flex items-center justify-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-[#c2ff28]" />
                  <span>Impacto Social</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#c2ff28]" />
                  <span>Networking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#c2ff28]" />
                  <span>Flexibilidade</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-4xl">
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
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <Card className="dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#8e44ad] dark:text-primary">
                      ESCOLHA SUA ÁREA DE ATUAÇÃO
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                      Selecione uma ou mais áreas onde você gostaria de contribuir como voluntária.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {volunteerAreas.map((area) => (
                        <Card
                          key={area.id}
                          className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                            selectedAreas.includes(area.id)
                              ? "border-[#8e44ad] bg-[#8e44ad]/5 dark:bg-[#8e44ad]/10"
                              : "border-gray-200 dark:border-gray-700 hover:border-[#8e44ad]/50"
                          }`}
                          onClick={() => toggleArea(area.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3 mb-3">
                              <div
                                className={`p-2 rounded-full ${
                                  selectedAreas.includes(area.id)
                                    ? "bg-[#8e44ad] text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-[#8e44ad]"
                                }`}
                              >
                                {area.icon}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-[#8e44ad] dark:text-primary mb-1">{area.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{area.description}</p>
                              </div>
                              {selectedAreas.includes(area.id) && (
                                <CheckCircle className="h-5 w-5 text-[#8e44ad] flex-shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              <strong>Requisitos:</strong> {area.requirements.join(", ")}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {selectedAreas.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <p className="text-green-700 dark:text-green-300 text-sm">
                          <strong>Áreas selecionadas:</strong>{" "}
                          {selectedAreas.map((id) => volunteerAreas.find((area) => area.id === id)?.name).join(", ")}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end pt-6">
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
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <Card className="dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#8e44ad] dark:text-primary">
                      SEUS DADOS E DISPONIBILIDADE
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Dados Pessoais */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#8e44ad] dark:text-primary">Dados Pessoais</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                          <Input
                            id="nomeCompleto"
                            value={formData.nomeCompleto}
                            onChange={(e) => setFormData((prev) => ({ ...prev, nomeCompleto: e.target.value }))}
                            placeholder="Seu nome completo"
                            className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="idade">Idade *</Label>
                          <Input
                            id="idade"
                            value={formData.idade}
                            onChange={(e) => setFormData((prev) => ({ ...prev, idade: e.target.value }))}
                            placeholder="Sua idade"
                            className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="seu@email.com"
                            className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefone">Telefone / WhatsApp *</Label>
                          <Input
                            id="telefone"
                            value={formData.telefone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, telefone: e.target.value }))}
                            placeholder="(11) 99999-9999"
                            className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cidadeBairro">Cidade / Bairro *</Label>
                          <Input
                            id="cidadeBairro"
                            value={formData.cidadeBairro}
                            onChange={(e) => setFormData((prev) => ({ ...prev, cidadeBairro: e.target.value }))}
                            placeholder="Sua cidade/bairro"
                            className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="profissao">Profissão *</Label>
                          <Input
                            id="profissao"
                            value={formData.profissao}
                            onChange={(e) => setFormData((prev) => ({ ...prev, profissao: e.target.value }))}
                            placeholder="Sua profissão"
                            className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Experiência e Motivação */}
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="text-lg font-semibold text-[#8e44ad] dark:text-primary">
                        Experiência e Motivação
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="experienciaAnterior">Experiência Anterior em Voluntariado</Label>
                        <Textarea
                          id="experienciaAnterior"
                          value={formData.experienciaAnterior}
                          onChange={(e) => setFormData((prev) => ({ ...prev, experienciaAnterior: e.target.value }))}
                          placeholder="Descreva suas experiências anteriores como voluntária (se houver)"
                          className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="motivacao">Por que quer ser voluntária da Copa Passa Bola? *</Label>
                        <Textarea
                          id="motivacao"
                          value={formData.motivacao}
                          onChange={(e) => setFormData((prev) => ({ ...prev, motivacao: e.target.value }))}
                          placeholder="Conte-nos sua motivação para participar como voluntária"
                          className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Disponibilidade */}
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="text-lg font-semibold text-[#8e44ad] dark:text-primary">Disponibilidade</h3>

                      <div className="space-y-3">
                        <Label>Dias da semana disponíveis *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((dia) => (
                            <div key={dia} className="flex items-center space-x-2">
                              <Checkbox
                                id={`dia-${dia}`}
                                checked={formData.disponibilidadeDias.includes(dia)}
                                onCheckedChange={() => toggleAvailability("dias", dia)}
                                className="data-[state=checked]:bg-[#8e44ad] data-[state=checked]:border-[#8e44ad]"
                              />
                              <Label htmlFor={`dia-${dia}`} className="text-sm">
                                {dia}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Horários disponíveis *</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {["Manhã (8h-12h)", "Tarde (12h-18h)", "Noite (18h-22h)"].map((horario) => (
                            <div key={horario} className="flex items-center space-x-2">
                              <Checkbox
                                id={`horario-${horario}`}
                                checked={formData.disponibilidadeHorarios.includes(horario)}
                                onCheckedChange={() => toggleAvailability("horarios", horario)}
                                className="data-[state=checked]:bg-[#8e44ad] data-[state=checked]:border-[#8e44ad]"
                              />
                              <Label htmlFor={`horario-${horario}`} className="text-sm">
                                {horario}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Tem transporte próprio? *</Label>
                        <RadioGroup
                          value={formData.temTransporte}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, temTransporte: value }))}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sim" id="transporte-sim" />
                            <Label htmlFor="transporte-sim">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="nao" id="transporte-nao" />
                            <Label htmlFor="transporte-nao">Não</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {/* Verificação de Integridade */}
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="text-lg font-semibold text-[#8e44ad] dark:text-primary">
                        Verificação de Integridade
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="referencias">Referências Pessoais</Label>
                        <Textarea
                          id="referencias"
                          value={formData.referencias}
                          onChange={(e) => setFormData((prev) => ({ ...prev, referencias: e.target.value }))}
                          placeholder="Nome, telefone e relação de 2 pessoas que possam dar referências sobre você"
                          className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Possui antecedentes criminais? *</Label>
                        <RadioGroup
                          value={formData.antecedentes}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, antecedentes: value }))}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="nao" id="antecedentes-nao" />
                            <Label htmlFor="antecedentes-nao">Não</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sim" id="antecedentes-sim" />
                            <Label htmlFor="antecedentes-sim">Sim</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="observacoes">Observações Adicionais</Label>
                        <Textarea
                          id="observacoes"
                          value={formData.observacoes}
                          onChange={(e) => setFormData((prev) => ({ ...prev, observacoes: e.target.value }))}
                          placeholder="Alguma informação adicional que considera importante"
                          className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                          rows={2}
                        />
                      </div>
                    </div>

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
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <Card className="dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#8e44ad] dark:text-primary">DOCUMENTAÇÃO E TERMOS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* File Upload */}
                    <div className="space-y-4">
                      <Label>Envio de Documentos *</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Envie seus documentos de identificação (RG/CNH frente e verso), comprovante de residência e
                        currículo. Formatos aceitos: JPG, PNG, PDF
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
                          onCheckedChange={(checked) => setWantNotifications(checked === true)}
                          className="data-[state=checked]:bg-[#8e44ad] data-[state=checked]:border-[#8e44ad]"
                        />
                        <Label htmlFor="notifications" className="text-sm leading-relaxed">
                          Quero receber informações sobre oportunidades de voluntariado e atualizações da Copa Passa
                          Bola
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="terms"
                          checked={acceptTerms}
                          onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                          className="data-[state=checked]:bg-[#8e44ad] data-[state=checked]:border-[#8e44ad]"
                        />
                        <Label htmlFor="terms" className="text-sm leading-relaxed">
                          Aceito os{" "}
                          <Link href="#" className="text-[#8e44ad] hover:underline">
                            termos e condições
                          </Link>{" "}
                          para voluntárias da Copa Passa Bola e autorizo a verificação das informações fornecidas. *
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
                        disabled={!canSubmit()}
                        className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white disabled:opacity-50"
                      >
                        FINALIZAR CADASTRO
                        <CheckCircle className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

"use client"
import Link from "next/link"
import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

import Image from "next/image"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDevAutoFill } from "@/hooks/use-dev-autofill"
import { saveDonation } from "@/lib/database-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { AuthButton } from "@/components/ui/auth-button"
import { MobileMenu } from "@/components/ui/mobile-menu"
import {
  ChevronRight,
  Heart,
  CreditCard,
  Smartphone,
  ArrowLeft,
  ShoppingBag,
  CheckCircle,
  Clock,
  Copy,
  Sparkles,
  Gift,
  Users,
  Target,
} from "lucide-react"
import { Bebas_Neue } from "next/font/google"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

type DonationType = "anonymous" | "identified" | null
type PaymentMethod = "pix" | "card" | null

const donationAmounts = [
  { value: 25, label: "R$ 25", description: "Ajuda com material esportivo" },
  { value: 50, label: "R$ 50", description: "Contribui com arbitragem" },
  { value: 100, label: "R$ 100", description: "Apoia uma atleta por um mês" },
  { value: 250, label: "R$ 250", description: "Patrocina um time por um jogo" },
]

export default function DoacaoPage() {
  const { user, loading, openLoginModal } = useAuth()
  const router = useRouter()
  
  // Hook de desenvolvimento
  useDevAutoFill();
  
  const [currentStep, setCurrentStep] = useState(1)
  const [donationType, setDonationType] = useState<DonationType>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [pixTimer, setPixTimer] = useState(600) // 10 minutes in seconds
  const [pixExpired, setPixExpired] = useState(false)

  // Verificar se o usuário está logado
  useEffect(() => {
    // Removido o redirecionamento automático
    // if (!loading && !user) {
    //   router.push('/')
    // }
  }, [user, loading, router])

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Mostrar mensagem de login necessário se não estiver logado
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-xl border">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8e44ad] to-[#9b59b6] rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className={`${bebasNeue.className} text-3xl font-bold mb-3 text-gray-800`}>
              Login Necessário
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Você precisa estar logado para fazer uma doação. 
              Crie sua conta ou faça login para apoiar o futebol feminino.
            </p>
          </div>
          <div className="space-y-3">
            <Button 
              onClick={() => {
                router.push('/')
                setTimeout(() => openLoginModal(), 100)
              }} 
              className="w-full bg-[#8e44ad] hover:bg-[#9b59b6] text-white"
            >
              Fazer Login / Criar Conta
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.back()} 
              className="w-full border-[#8e44ad] text-[#8e44ad] hover:bg-[#8e44ad] hover:text-white"
            >
              Voltar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Donor information (for identified donations)
  const [donorData, setDonorData] = useState({
    nomeCompleto: "",
    email: "",
    telefone: "",
    cpf: "",
    receberRecibo: true,
    receberNoticias: false,
  })

  // Card information
  const [cardData, setCardData] = useState({
    numero: "",
    nome: "",
    validade: "",
    cvv: "",
  })

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const targetId = e.currentTarget.href.split("#")[1]
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  // PIX Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (paymentMethod === "pix" && currentStep === 3 && pixTimer > 0 && !isSuccess) {
      interval = setInterval(() => {
        setPixTimer((prev) => {
          if (prev <= 1) {
            setPixExpired(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [paymentMethod, currentStep, pixTimer, isSuccess])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getDonationAmount = () => {
    return selectedAmount || Number.parseFloat(customAmount) || 0
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    try {
      const donationData = {
        userId: user?.id, // Incluindo o ID do usuário
        type: "donation" as const,
        donationType: donationType!,
        amount: getDonationAmount(),
        paymentMethod: paymentMethod!,
        ...(donationType === "identified" && { donorData }),
        ...(paymentMethod === "card" && { cardData }),
      };

      const result = await saveDonation(donationData);
      
      if (result.success) {
        console.log("Donation saved with ID:", result.id);
        setIsSuccess(true);
      } else {
        console.error("Failed to save donation:", result.error);
        alert("Erro ao processar doação. Tente novamente.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error during donation processing:", error);
      alert("Erro ao processar doação. Tente novamente.");
      setIsProcessing(false);
    }
  }

  const generatePixCode = () => {
    // Fictional PIX code
    return "00020126580014BR.GOV.BCB.PIX013636c4b8c4-4c4c-4c4c-4c4c-4c4c4c4c4c4c5204000053039865802BR5925COPA PASSA BOLA DOACOES6009SAO PAULO62070503***6304"
  }

  const canProceedToStep2 = () => {
    return donationType !== null && getDonationAmount() > 0
  }

  const canProceedToStep3 = () => {
    if (donationType === "identified") {
      return donorData.nomeCompleto && donorData.email && paymentMethod
    }
    return paymentMethod !== null
  }

  const canProcessPayment = () => {
    if (paymentMethod === "pix") {
      return true
    }
    if (paymentMethod === "card") {
      return cardData.numero && cardData.nome && cardData.validade && cardData.cvv
    }
    return false
  }

  if (isSuccess) {
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
                <Badge className="bg-green-500 text-white">DOAÇÃO REALIZADA</Badge>
              </div>
              <div className="flex justify-end items-center gap-2">
                <AuthButton />
                <div className="md:hidden">
                  <MobileMenu />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 pt-20">
          <section className="py-20 bg-gradient-to-b from-green-50 to-white dark:from-green-900/20 dark:to-slate-900 min-h-screen flex items-center">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl mx-auto"
              >
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative mb-8"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#c2ff28] w-32 h-32 mx-auto"
                    />
                    <div className="w-32 h-32 bg-gradient-to-br from-[#8e44ad] to-[#9b59b6] rounded-full flex items-center justify-center mx-auto relative">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        <Heart className="h-16 w-16 text-white fill-current" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Floating sparkles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        x: [0, Math.random() * 200 - 100],
                        y: [0, Math.random() * 200 - 100],
                      }}
                      transition={{
                        delay: 0.8 + i * 0.2,
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 3,
                      }}
                      className="absolute"
                      style={{
                        left: "50%",
                        top: "50%",
                      }}
                    >
                      <Sparkles className="h-6 w-6 text-[#c2ff28]" />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className={`${bebasNeue.className} text-4xl md:text-6xl font-bold text-[#8e44ad] dark:text-primary mb-6 tracking-wider`}
                >
                  DOAÇÃO REALIZADA COM SUCESSO!
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mb-8"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg mb-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <Gift className="h-8 w-8 text-[#8e44ad]" />
                      <div>
                        <p className="text-2xl font-bold text-[#8e44ad] dark:text-primary">
                          R$ {getDonationAmount().toFixed(2).replace(".", ",")}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {donationType === "anonymous" ? "Doação Anônima" : "Doação Identificada"}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Sua generosidade faz toda a diferença! Com sua doação, conseguimos fortalecer ainda mais o futebol
                      feminino e criar oportunidades para mais mulheres no esporte.
                    </p>

                    {donationType === "identified" && donorData.receberRecibo && (
                      <div className="bg-[#8e44ad]/10 dark:bg-[#8e44ad]/20 p-4 rounded-lg">
                        <p className="text-sm text-[#8e44ad] dark:text-primary">
                          📧 Seu recibo de doação será enviado para: {donorData.email}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                      <Users className="h-8 w-8 text-[#8e44ad] mx-auto mb-2" />
                      <p className="font-semibold text-[#8e44ad] dark:text-primary">Impacto Direto</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Sua doação beneficia diretamente as atletas
                      </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                      <Target className="h-8 w-8 text-[#8e44ad] mx-auto mb-2" />
                      <p className="font-semibold text-[#8e44ad] dark:text-primary">Transparência</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Acompanhe como sua doação é utilizada</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                      <Heart className="h-8 w-8 text-[#8e44ad] mx-auto mb-2" />
                      <p className="font-semibold text-[#8e44ad] dark:text-primary">Transformação</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ajuda a transformar vidas através do esporte
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button asChild className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white">
                    <Link href="/">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      VOLTAR AO INÍCIO
                    </Link>
                  </Button>
                </motion.div>
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
              <Badge className="bg-pink-500 text-white">FAÇA SUA DOAÇÃO</Badge>
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
              <AuthButton />
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
              <Badge className="bg-[#c2ff28] text-[#8e44ad] mb-4 hover:bg-[#c2ff28]">DOAÇÃO</Badge>
              <h1 className={`${bebasNeue.className} text-4xl md:text-6xl font-bold mb-6 tracking-wider`}>
                AJUDE A TRANSFORMAR VIDAS
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto">
                Ajude a transformar vidas por meio do esporte. Contribua com qualquer valor e fortaleça o futebol
                feminino de base.
              </p>
              <div className="flex items-center justify-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-[#c2ff28]" />
                  <span>100% Transparente</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#c2ff28]" />
                  <span>Impacto Direto</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#c2ff28]" />
                  <span>Recibo Fiscal</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Donation Form */}
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentStep === 1 && "Escolha o valor e tipo de doação"}
                  {currentStep === 2 && "Seus dados e método de pagamento"}
                  {currentStep === 3 && "Finalizar pagamento"}
                </p>
              </div>
            </div>

            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <Card className="dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#8e44ad] dark:text-primary">VALOR DA DOAÇÃO</CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                      Escolha um valor sugerido ou digite o valor que deseja doar.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Suggested amounts */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {donationAmounts.map((amount) => (
                        <Card
                          key={amount.value}
                          className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                            selectedAmount === amount.value
                              ? "border-[#8e44ad] bg-[#8e44ad]/5 dark:bg-[#8e44ad]/10"
                              : "border-gray-200 dark:border-gray-700 hover:border-[#8e44ad]/50"
                          }`}
                          onClick={() => {
                            setSelectedAmount(amount.value)
                            setCustomAmount("")
                          }}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-[#8e44ad] dark:text-primary mb-1">
                              {amount.label}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{amount.description}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Custom amount */}
                    <div className="space-y-2">
                      <Label htmlFor="customAmount">Ou digite outro valor:</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                        <Input
                          id="customAmount"
                          type="number"
                          min="1"
                          step="0.01"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value)
                            setSelectedAmount(null)
                          }}
                          placeholder="0,00"
                          className="pl-10 focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                        />
                      </div>
                    </div>

                    {/* Donation type */}
                    <div className="space-y-4 border-t pt-6">
                      <Label>Tipo de doação:</Label>
                      <RadioGroup
                        value={donationType || ""}
                        onValueChange={(value) => setDonationType(value as DonationType)}
                        className="space-y-3"
                      >
                        <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50">
                          <RadioGroupItem value="identified" id="identified" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="identified" className="font-medium">
                              Doação Identificada
                            </Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Receba recibo fiscal e acompanhe o impacto da sua doação. Seus dados serão utilizados
                              apenas para emissão do recibo.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50">
                          <RadioGroupItem value="anonymous" id="anonymous" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="anonymous" className="font-medium">
                              Doação Anônima
                            </Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Sua identidade será mantida em sigilo. Não será possível emitir recibo fiscal.
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

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
                      {donationType === "identified" ? "SEUS DADOS E PAGAMENTO" : "MÉTODO DE PAGAMENTO"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Donor information for identified donations */}
                    {donationType === "identified" && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#8e44ad] dark:text-primary">Seus Dados</h3>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                            <Input
                              id="nomeCompleto"
                              value={donorData.nomeCompleto}
                              onChange={(e) => setDonorData((prev) => ({ ...prev, nomeCompleto: e.target.value }))}
                              placeholder="Seu nome completo"
                              className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">E-mail *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={donorData.email}
                              onChange={(e) => setDonorData((prev) => ({ ...prev, email: e.target.value }))}
                              placeholder="seu@email.com"
                              className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                              id="telefone"
                              value={donorData.telefone}
                              onChange={(e) => setDonorData((prev) => ({ ...prev, telefone: e.target.value }))}
                              placeholder="(11) 99999-9999"
                              className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                              id="cpf"
                              value={donorData.cpf}
                              onChange={(e) => setDonorData((prev) => ({ ...prev, cpf: e.target.value }))}
                              placeholder="000.000.000-00"
                              className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="receberRecibo"
                              checked={donorData.receberRecibo}
                              onCheckedChange={(checked) =>
                                setDonorData((prev) => ({ ...prev, receberRecibo: checked as boolean }))
                              }
                              className="data-[state=checked]:bg-[#8e44ad] data-[state=checked]:border-[#8e44ad]"
                            />
                            <Label htmlFor="receberRecibo" className="text-sm">
                              Quero receber o recibo fiscal por e-mail
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="receberNoticias"
                              checked={donorData.receberNoticias}
                              onCheckedChange={(checked) =>
                                setDonorData((prev) => ({ ...prev, receberNoticias: checked as boolean }))
                              }
                              className="data-[state=checked]:bg-[#8e44ad] data-[state=checked]:border-[#8e44ad]"
                            />
                            <Label htmlFor="receberNoticias" className="text-sm">
                              Quero receber novidades sobre os projetos da Copa Passa Bola
                            </Label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment method */}
                    <div className={`space-y-4 ${donationType === "identified" ? "border-t pt-6" : ""}`}>
                      <h3 className="text-lg font-semibold text-[#8e44ad] dark:text-primary">Método de Pagamento</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <Card
                          className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                            paymentMethod === "pix"
                              ? "border-[#8e44ad] bg-[#8e44ad]/5 dark:bg-[#8e44ad]/10"
                              : "border-gray-200 dark:border-gray-700 hover:border-[#8e44ad]/50"
                          }`}
                          onClick={() => setPaymentMethod("pix")}
                        >
                          <CardContent className="p-4 text-center">
                            <Smartphone className="h-8 w-8 text-[#8e44ad] mx-auto mb-2" />
                            <h4 className="font-semibold text-[#8e44ad] dark:text-primary">PIX</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pagamento instantâneo</p>
                          </CardContent>
                        </Card>

                        <Card
                          className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                            paymentMethod === "card"
                              ? "border-[#8e44ad] bg-[#8e44ad]/5 dark:bg-[#8e44ad]/10"
                              : "border-gray-200 dark:border-gray-700 hover:border-[#8e44ad]/50"
                          }`}
                          onClick={() => setPaymentMethod("card")}
                        >
                          <CardContent className="p-4 text-center">
                            <CreditCard className="h-8 w-8 text-[#8e44ad] mx-auto mb-2" />
                            <h4 className="font-semibold text-[#8e44ad] dark:text-primary">Cartão de Crédito</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Visa, Mastercard, Elo</p>
                          </CardContent>
                        </Card>
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
                    <CardTitle className="text-2xl text-[#8e44ad] dark:text-primary">FINALIZAR PAGAMENTO</CardTitle>
                    <div className="bg-[#8e44ad]/10 dark:bg-[#8e44ad]/20 p-4 rounded-lg">
                      <p className="text-[#8e44ad] dark:text-primary font-semibold">
                        Valor: R$ {getDonationAmount().toFixed(2).replace(".", ",")}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {donationType === "anonymous" ? "Doação Anônima" : "Doação Identificada"}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {paymentMethod === "pix" && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#8e44ad] dark:text-primary">Pagamento via PIX</h3>

                        {!pixExpired ? (
                          <>
                            <div className="text-center">
                              <div className="bg-white p-4 rounded-lg inline-block shadow-lg">
                                <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                  {/* Fictional QR Code */}
                                  <div className="grid grid-cols-8 gap-1">
                                    {Array.from({ length: 64 }, (_, i) => (
                                      <div
                                        key={i}
                                        className={`w-2 h-2 ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">QR Code PIX</p>
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <Clock className="h-5 w-5 text-[#8e44ad]" />
                                <span className="font-semibold text-[#8e44ad] dark:text-primary">
                                  Tempo restante: {formatTime(pixTimer)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">O QR Code expira em 10 minutos</p>
                            </div>

                            <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                              <Label className="text-sm font-medium">Código PIX (Copia e Cola):</Label>
                              <div className="flex items-center gap-2 mt-2">
                                <Input value={generatePixCode()} readOnly className="text-xs font-mono" />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigator.clipboard.writeText(generatePixCode())}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="text-center">
                              <Button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white"
                              >
                                {isProcessing ? "PROCESSANDO..." : "JÁ FIZ O PAGAMENTO"}
                                <CheckCircle className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <div className="text-red-500 mb-4">
                              <Clock className="h-16 w-16 mx-auto mb-2" />
                              <h3 className="text-xl font-semibold">QR Code Expirado</h3>
                              <p className="text-gray-600 dark:text-gray-400">
                                O tempo limite para pagamento foi atingido.
                              </p>
                            </div>
                            <Button
                              onClick={() => {
                                setPixTimer(600)
                                setPixExpired(false)
                              }}
                              className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white"
                            >
                              GERAR NOVO QR CODE
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#8e44ad] dark:text-primary">
                          Dados do Cartão de Crédito
                        </h3>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Número do Cartão *</Label>
                            <Input
                              id="cardNumber"
                              value={cardData.numero}
                              onChange={(e) => setCardData((prev) => ({ ...prev, numero: e.target.value }))}
                              placeholder="0000 0000 0000 0000"
                              className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cardName">Nome no Cartão *</Label>
                            <Input
                              id="cardName"
                              value={cardData.nome}
                              onChange={(e) => setCardData((prev) => ({ ...prev, nome: e.target.value }))}
                              placeholder="Nome como está no cartão"
                              className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardExpiry">Validade *</Label>
                              <Input
                                id="cardExpiry"
                                value={cardData.validade}
                                onChange={(e) => setCardData((prev) => ({ ...prev, validade: e.target.value }))}
                                placeholder="MM/AA"
                                className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cardCvv">CVV *</Label>
                              <Input
                                id="cardCvv"
                                value={cardData.cvv}
                                onChange={(e) => setCardData((prev) => ({ ...prev, cvv: e.target.value }))}
                                placeholder="000"
                                className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="text-center pt-4">
                          <Button
                            onClick={handlePayment}
                            disabled={!canProcessPayment() || isProcessing}
                            className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white disabled:opacity-50"
                          >
                            {isProcessing ? "PROCESSANDO PAGAMENTO..." : "FINALIZAR DOAÇÃO"}
                            <CheckCircle className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Processing animation */}
                    <AnimatePresence>
                      {isProcessing && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        >
                          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg text-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="w-16 h-16 border-4 border-[#8e44ad] border-t-transparent rounded-full mx-auto mb-4"
                            />
                            <p className="text-lg font-semibold text-[#8e44ad] dark:text-primary">
                              Processando pagamento...
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Aguarde enquanto confirmamos sua doação
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex justify-between pt-6">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                        disabled={isProcessing}
                        className="border-[#8e44ad] text-[#8e44ad] hover:bg-[#8e44ad] hover:text-white"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        VOLTAR
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

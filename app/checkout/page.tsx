"use client"
import Link from "next/link"
import { Shield } from "lucide-react" // Import Shield component

import Image from "next/image"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDevAutoFill } from "@/hooks/use-dev-autofill"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button"
import { MobileMenu } from "@/components/ui/mobile-menu"
import { useCart } from "@/contexts/cart-context"
import {
  CreditCard,
  Smartphone,
  ArrowLeft,
  CheckCircle,
  Clock,
  Copy,
  Sparkles,
  Gift,
  Users,
  Target,
  Heart,
  ShoppingBag,
  Package,
  Truck,
  User,
} from "lucide-react"
import { Bebas_Neue } from "next/font/google"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

type PaymentMethod = "pix" | "card" | null

export default function CheckoutPage() {
  // Hook de desenvolvimento
  useDevAutoFill();
  
  const { state, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [pixTimer, setPixTimer] = useState(600) // 10 minutes
  const [pixExpired, setPixExpired] = useState(false)

  // Customer data
  const [customerData, setCustomerData] = useState({
    nomeCompleto: "",
    email: "",
    telefone: "",
    cpf: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    receberNoticias: false,
  })

  // Card data
  const [cardData, setCardData] = useState({
    numero: "",
    nome: "",
    validade: "",
    cvv: "",
  })

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

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      clearCart()
    }, 3000)
  }

  const generatePixCode = () => {
    return "00020126580014BR.GOV.BCB.PIX013636c4b8c4-4c4c-4c4c-4c4c-4c4c4c4c4c4c5204000053039865802BR5925COPA PASSA BOLA LOJA6009SAO PAULO62070503***6304"
  }

  const canProceedToStep2 = () => {
    return (
      customerData.nomeCompleto &&
      customerData.email &&
      customerData.telefone &&
      customerData.cpf &&
      customerData.cep &&
      customerData.endereco &&
      customerData.numero &&
      customerData.bairro &&
      customerData.cidade &&
      customerData.estado
    )
  }

  const canProceedToStep3 = () => {
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

  const subtotal = state.total
  const shipping = subtotal >= 100 ? 0 : 15.9
  const total = subtotal + shipping

  // Redirect if cart is empty
  if (state.items.length === 0 && !isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Carrinho vazio</h1>
          <Button asChild>
            <Link href="/loja">Ir às compras</Link>
          </Button>
        </div>
      </div>
    )
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
                <Badge className="bg-green-500 text-white">COMPRA REALIZADA</Badge>
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
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#c2ff28] w-32 h-32 mx-auto"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#8e44ad] w-28 h-28 mx-auto"
                    />
                    <div className="w-32 h-32 bg-gradient-to-br from-[#8e44ad] to-[#9b59b6] rounded-full flex items-center justify-center mx-auto relative">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                      >
                        <CheckCircle className="h-16 w-16 text-white" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        x: [0, Math.cos((i * Math.PI) / 6) * 200],
                        y: [0, Math.sin((i * Math.PI) / 6) * 200],
                      }}
                      transition={{
                        delay: 0.8 + i * 0.1,
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 2,
                      }}
                      className="absolute"
                      style={{
                        left: "50%",
                        top: "50%",
                      }}
                    >
                      {i % 4 === 0 && <Sparkles className="h-4 w-4 text-[#c2ff28]" />}
                      {i % 4 === 1 && <Heart className="h-4 w-4 text-pink-400" />}
                      {i % 4 === 2 && <Gift className="h-4 w-4 text-[#8e44ad]" />}
                      {i % 4 === 3 && <ShoppingBag className="h-4 w-4 text-[#c2ff28]" />}
                    </motion.div>
                  ))}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className={`${bebasNeue.className} text-4xl md:text-6xl font-bold text-[#8e44ad] dark:text-primary mb-6 tracking-wider`}
                >
                  COMPRA REALIZADA COM SUCESSO!
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mb-8"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg mb-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <Package className="h-8 w-8 text-[#8e44ad]" />
                      <div>
                        <p className="text-2xl font-bold text-[#8e44ad] dark:text-primary">
                          R$ {total.toFixed(2).replace(".", ",")}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Pedido #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Obrigada por apoiar o futebol feminino! Seu pedido foi confirmado e em breve você receberá os
                      detalhes no seu e-mail.
                    </p>

                    <div className="bg-[#8e44ad]/10 dark:bg-[#8e44ad]/20 p-4 rounded-lg">
                      <p className="text-sm text-[#8e44ad] dark:text-primary">
                        📱 Acompanhe seu pedido pelo WhatsApp: {customerData.telefone}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                    >
                      <Truck className="h-8 w-8 text-[#8e44ad] mx-auto mb-2" />
                      <p className="font-semibold text-[#8e44ad] dark:text-primary">Entrega</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {shipping === 0 ? "Frete grátis" : "5-7 dias úteis"}
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                    >
                      <Users className="h-8 w-8 text-[#8e44ad] mx-auto mb-2" />
                      <p className="font-semibold text-[#8e44ad] dark:text-primary">Suporte</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Atendimento personalizado</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.5 }}
                      className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                    >
                      <Target className="h-8 w-8 text-[#8e44ad] mx-auto mb-2" />
                      <p className="font-semibold text-[#8e44ad] dark:text-primary">Qualidade</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Produtos oficiais</p>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
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
                    <Link href="/loja">CONTINUAR COMPRANDO</Link>
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
              <Badge className="bg-[#8e44ad] text-white">FINALIZAR COMPRA</Badge>
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
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-[#8e44ad] to-[#9b59b6] text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className={`${bebasNeue.className} text-4xl md:text-5xl font-bold mb-4 tracking-wider`}>
                FINALIZAR COMPRA
              </h1>
              <p className="text-lg text-white/90">Etapa {currentStep} de 3 - Estamos quase lá!</p>
            </motion.div>
          </div>
        </section>

        {/* Checkout Content */}
        <section className="py-12 bg-gray-50 dark:bg-slate-800">
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
                  {currentStep === 1 && "Dados pessoais e endereço"}
                  {currentStep === 2 && "Método de pagamento"}
                  {currentStep === 3 && "Confirmar pagamento"}
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="dark:bg-slate-900">
                      <CardHeader>
                        <CardTitle className="text-2xl text-[#8e44ad] dark:text-primary flex items-center gap-2">
                          <User className="h-6 w-6" />
                          DADOS PESSOAIS
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                            <Input
                              id="nomeCompleto"
                              value={customerData.nomeCompleto}
                              onChange={(e) => setCustomerData((prev) => ({ ...prev, nomeCompleto: e.target.value }))}
                              placeholder="Seu nome completo"
                              className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">E-mail *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={customerData.email}
                              onChange={(e) => setCustomerData((prev) => ({ ...prev, email: e.target.value }))}
                              placeholder="seu@email.com"
                              className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone / WhatsApp *</Label>
                            <Input
                              id="telefone"
                              value={customerData.telefone}
                              onChange={(e) => setCustomerData((prev) => ({ ...prev, telefone: e.target.value }))}
                              placeholder="(11) 99999-9999"
                              className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cpf">CPF *</Label>
                            <Input
                              id="cpf"
                              value={customerData.cpf}
                              onChange={(e) => setCustomerData((prev) => ({ ...prev, cpf: e.target.value }))}
                              placeholder="000.000.000-00"
                              className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                            />
                          </div>
                        </div>

                        <div className="border-t pt-6">
                          <h3 className="text-lg font-semibold text-[#8e44ad] dark:text-primary mb-4">
                            Endereço de Entrega
                          </h3>

                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label htmlFor="cep">CEP *</Label>
                              <Input
                                id="cep"
                                value={customerData.cep}
                                onChange={(e) => setCustomerData((prev) => ({ ...prev, cep: e.target.value }))}
                                placeholder="00000-000"
                                className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                              />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <Label htmlFor="endereco">Endereço *</Label>
                              <Input
                                id="endereco"
                                value={customerData.endereco}
                                onChange={(e) => setCustomerData((prev) => ({ ...prev, endereco: e.target.value }))}
                                placeholder="Rua, avenida, etc."
                                className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label htmlFor="numero">Número *</Label>
                              <Input
                                id="numero"
                                value={customerData.numero}
                                onChange={(e) => setCustomerData((prev) => ({ ...prev, numero: e.target.value }))}
                                placeholder="123"
                                className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                              />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <Label htmlFor="complemento">Complemento</Label>
                              <Input
                                id="complemento"
                                value={customerData.complemento}
                                onChange={(e) => setCustomerData((prev) => ({ ...prev, complemento: e.target.value }))}
                                placeholder="Apto, bloco, etc."
                                className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="bairro">Bairro *</Label>
                              <Input
                                id="bairro"
                                value={customerData.bairro}
                                onChange={(e) => setCustomerData((prev) => ({ ...prev, bairro: e.target.value }))}
                                placeholder="Seu bairro"
                                className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cidade">Cidade *</Label>
                              <Input
                                id="cidade"
                                value={customerData.cidade}
                                onChange={(e) => setCustomerData((prev) => ({ ...prev, cidade: e.target.value }))}
                                placeholder="Sua cidade"
                                className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="estado">Estado *</Label>
                              <Input
                                id="estado"
                                value={customerData.estado}
                                onChange={(e) => setCustomerData((prev) => ({ ...prev, estado: e.target.value }))}
                                placeholder="SP"
                                className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-6">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="receberNoticias"
                              checked={customerData.receberNoticias}
                              onCheckedChange={(checked) =>
                                setCustomerData((prev) => ({ ...prev, receberNoticias: checked as boolean }))
                              }
                              className="data-[state=checked]:bg-[#8e44ad] data-[state=checked]:border-[#8e44ad]"
                            />
                            <Label htmlFor="receberNoticias" className="text-sm">
                              Quero receber novidades e promoções da Copa Passa Bola
                            </Label>
                          </div>
                        </div>

                        <div className="flex justify-end pt-6">
                          <Button
                            onClick={() => setCurrentStep(2)}
                            disabled={!canProceedToStep2()}
                            className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white disabled:opacity-50"
                          >
                            CONTINUAR
                            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
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
                    <Card className="dark:bg-slate-900">
                      <CardHeader>
                        <CardTitle className="text-2xl text-[#8e44ad] dark:text-primary">MÉTODO DE PAGAMENTO</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
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
                              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Aprovação imediata</p>
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
                              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Parcelamento disponível</p>
                            </CardContent>
                          </Card>
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
                            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
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
                    <Card className="dark:bg-slate-900">
                      <CardHeader>
                        <CardTitle className="text-2xl text-[#8e44ad] dark:text-primary">FINALIZAR PAGAMENTO</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {paymentMethod === "pix" && (
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#8e44ad] dark:text-primary">
                              Pagamento via PIX
                            </h3>

                            {!pixExpired ? (
                              <>
                                <div className="text-center">
                                  <div className="bg-white p-4 rounded-lg inline-block shadow-lg">
                                    <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
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
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    O QR Code expira em 10 minutos
                                  </p>
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
                          </div>
                        )}

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
                          {paymentMethod === "pix" && !pixExpired && (
                            <Button
                              onClick={handlePayment}
                              disabled={isProcessing}
                              className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white"
                            >
                              {isProcessing ? "PROCESSANDO..." : "JÁ FIZ O PAGAMENTO"}
                              <CheckCircle className="ml-2 h-4 w-4" />
                            </Button>
                          )}
                          {paymentMethod === "card" && (
                            <Button
                              onClick={handlePayment}
                              disabled={!canProcessPayment() || isProcessing}
                              className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white disabled:opacity-50"
                            >
                              {isProcessing ? "PROCESSANDO PAGAMENTO..." : "FINALIZAR COMPRA"}
                              <CheckCircle className="ml-2 h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="space-y-6">
                <Card className="dark:bg-slate-900">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#8e44ad] dark:text-primary">RESUMO DO PEDIDO</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {state.items.map((item) => (
                        <div key={`${item.id}-${item.selectedSize || "default"}`} className="flex items-center gap-3">
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            {item.selectedSize && <p className="text-xs text-gray-500">Tamanho: {item.selectedSize}</p>}
                            <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold">
                            R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frete</span>
                        <span>{shipping === 0 ? "GRÁTIS" : `R$ ${shipping.toFixed(2).replace(".", ",")}`}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className="text-[#8e44ad]">R$ {total.toFixed(2).replace(".", ",")}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="dark:bg-slate-900">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Compra 100% Segura
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Seus dados estão protegidos com criptografia SSL
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Processing Animation Overlay */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-lg text-center max-w-sm mx-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-16 h-16 border-4 border-[#8e44ad] border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-lg font-semibold text-[#8e44ad] dark:text-primary mb-2">Processando pagamento...</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Aguarde enquanto confirmamos sua compra</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

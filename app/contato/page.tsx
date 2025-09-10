"use client"
import Link from "next/link"
import type React from "react"

import Image from "next/image"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDevAutoFill } from "@/hooks/use-dev-autofill"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthButton } from "@/components/ui/auth-button"
import { MobileMenu } from "@/components/ui/mobile-menu"
import {
  Send,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Heart,
  Users,
  Clock,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react"
import { Bebas_Neue } from "next/font/google"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

const contactReasons = [
  { value: "duvidas-gerais", label: "Dúvidas Gerais" },
  { value: "inscricoes", label: "Inscrições e Cadastros" },
  { value: "voluntariado", label: "Voluntariado" },
  { value: "patrocinio", label: "Patrocínio e Parcerias" },
  { value: "imprensa", label: "Imprensa" },
  { value: "sugestoes", label: "Sugestões" },
  { value: "reclamacoes", label: "Reclamações" },
  { value: "outros", label: "Outros" },
]

export default function ContatoPage() {
  // Hook de desenvolvimento
  useDevAutoFill();
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  })

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const targetId = e.currentTarget.href.split("#")[1]
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 2500)
  }

  const canSubmit = () => {
    return formData.nome && formData.email && formData.assunto && formData.mensagem
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
                <Badge className="bg-green-500 text-white">MENSAGEM ENVIADA</Badge>
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
                        <MessageCircle className="h-16 w-16 text-white fill-current" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        x: [0, Math.cos((i * Math.PI) / 4) * 150],
                        y: [0, Math.sin((i * Math.PI) / 4) * 150],
                      }}
                      transition={{
                        delay: 0.8 + i * 0.1,
                        duration: 2.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 2,
                      }}
                      className="absolute"
                      style={{
                        left: "50%",
                        top: "50%",
                      }}
                    >
                      {i % 3 === 0 && <Sparkles className="h-4 w-4 text-[#c2ff28]" />}
                      {i % 3 === 1 && <Heart className="h-4 w-4 text-pink-400" />}
                      {i % 3 === 2 && <MessageCircle className="h-4 w-4 text-[#8e44ad]" />}
                    </motion.div>
                  ))}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className={`${bebasNeue.className} text-4xl md:text-6xl font-bold text-[#8e44ad] dark:text-primary mb-6 tracking-wider`}
                >
                  MENSAGEM ENVIADA COM SUCESSO!
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mb-8"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg mb-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <Send className="h-8 w-8 text-[#8e44ad]" />
                      <div>
                        <p className="text-xl font-bold text-[#8e44ad] dark:text-primary">Obrigada pelo contato!</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Assunto: {contactReasons.find((r) => r.value === formData.assunto)?.label}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Recebemos sua mensagem e nossa equipe entrará em contato em breve. Agradecemos seu interesse na
                      Copa Passa Bola!
                    </p>

                    <div className="bg-[#8e44ad]/10 dark:bg-[#8e44ad]/20 p-4 rounded-lg">
                      <p className="text-sm text-[#8e44ad] dark:text-primary">
                        📧 Responderemos no e-mail: {formData.email}
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
                      <Clock className="h-8 w-8 text-[#8e44ad] mx-auto mb-2" />
                      <p className="font-semibold text-[#8e44ad] dark:text-primary">Tempo de Resposta</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Até 24 horas em dias úteis</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                    >
                      <Users className="h-8 w-8 text-[#8e44ad] mx-auto mb-2" />
                      <p className="font-semibold text-[#8e44ad] dark:text-primary">Equipe Dedicada</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Atendimento personalizado</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.5 }}
                      className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                    >
                      <Heart className="h-8 w-8 text-[#8e44ad] mx-auto mb-2" />
                      <p className="font-semibold text-[#8e44ad] dark:text-primary">Compromisso</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sua opinião é importante</p>
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
                    <Link href="/cadastro">FAZER CADASTRO</Link>
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
              <Badge className="bg-pink-500 text-white">FALE CONOSCO</Badge>
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
        <section className="py-20 bg-gradient-to-b from-[#8e44ad] to-[#9b59b6] text-white overflow-hidden">
          <div className="container mx-auto px-4 text-center relative">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="bg-[#c2ff28] text-[#8e44ad] mb-4 hover:bg-[#c2ff28]">CONTATO</Badge>
              <h1 className={`${bebasNeue.className} text-4xl md:text-6xl font-bold mb-6 tracking-wider`}>
                FALE CONOSCO
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto">
                Tem dúvidas, sugestões ou quer fazer parte da nossa revolução? Entre em contato conosco! Estamos aqui
                para ouvir você.
              </p>
              <div className="flex items-center justify-center gap-6 text-white/80">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5 text-[#c2ff28]" />
                  <span>Resposta Rápida</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <Users className="h-5 w-5 text-[#c2ff28]" />
                  <span>Equipe Dedicada</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <Heart className="h-5 w-5 text-[#c2ff28]" />
                  <span>Atendimento Humanizado</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute top-20 left-10 opacity-20"
            >
              <MessageCircle className="h-16 w-16 text-[#c2ff28]" />
            </motion.div>
            <motion.div
              animate={{
                y: [0, 15, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute top-32 right-16 opacity-20"
            >
              <Heart className="h-12 w-12 text-pink-300" />
            </motion.div>
            <motion.div
              animate={{
                y: [0, -10, 0],
                x: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute bottom-20 left-20 opacity-20"
            >
              <Send className="h-14 w-14 text-[#c2ff28]" />
            </motion.div>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="dark:bg-slate-800 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#8e44ad] dark:text-primary flex items-center gap-2">
                      <Send className="h-6 w-6" />
                      ENVIE SUA MENSAGEM
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                      Preencha o formulário abaixo e entraremos em contato em breve.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome Completo *</Label>
                          <Input
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                            placeholder="Seu nome completo"
                            className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="seu@email.com"
                            className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="telefone">Telefone / WhatsApp</Label>
                          <Input
                            id="telefone"
                            value={formData.telefone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, telefone: e.target.value }))}
                            placeholder="(11) 99999-9999"
                            className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assunto">Assunto *</Label>
                          <Select
                            value={formData.assunto}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, assunto: value }))}
                          >
                            <SelectTrigger className="focus:ring-[#8e44ad] focus:border-[#8e44ad]">
                              <SelectValue placeholder="Selecione o assunto" />
                            </SelectTrigger>
                            <SelectContent>
                              {contactReasons.map((reason) => (
                                <SelectItem key={reason.value} value={reason.value}>
                                  {reason.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mensagem">Mensagem *</Label>
                        <Textarea
                          id="mensagem"
                          value={formData.mensagem}
                          onChange={(e) => setFormData((prev) => ({ ...prev, mensagem: e.target.value }))}
                          placeholder="Digite sua mensagem aqui..."
                          className="focus:ring-[#8e44ad] focus:border-[#8e44ad] min-h-[120px]"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={!canSubmit() || isSubmitting}
                        className="w-full bg-[#8e44ad] hover:bg-[#9b59b6] text-white disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                            ENVIANDO...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            ENVIAR MENSAGEM
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h2 className={`${bebasNeue.className} text-3xl font-bold text-[#8e44ad] dark:text-primary mb-6`}>
                    OUTRAS FORMAS DE CONTATO
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Escolha a forma que for mais conveniente para você entrar em contato conosco.
                  </p>
                </div>

                <div className="space-y-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border-l-4 border-[#8e44ad]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-[#8e44ad]/10 dark:bg-[#8e44ad]/20 rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-[#8e44ad]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#8e44ad] dark:text-primary">E-mail</h3>
                        <p className="text-gray-600 dark:text-gray-400">contato@copapassabola.com.br</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Resposta em até 24h</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border-l-4 border-[#8e44ad]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-[#8e44ad]/10 dark:bg-[#8e44ad]/20 rounded-full flex items-center justify-center">
                        <Phone className="h-6 w-6 text-[#8e44ad]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#8e44ad] dark:text-primary">WhatsApp</h3>
                        <p className="text-gray-600 dark:text-gray-400">(11) 99999-9999</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Seg a Sex, 9h às 18h</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border-l-4 border-[#8e44ad]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-[#8e44ad]/10 dark:bg-[#8e44ad]/20 rounded-full flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-[#8e44ad]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#8e44ad] dark:text-primary">Endereço</h3>
                        <p className="text-gray-600 dark:text-gray-400">São Paulo - SP</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Atendimento presencial com agendamento
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Social Media */}
                <div className="bg-gradient-to-r from-[#8e44ad] to-[#9b59b6] p-6 rounded-lg text-white">
                  <h3 className="font-semibold mb-4">Siga-nos nas redes sociais</h3>
                  <div className="flex gap-4">
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      href="#"
                      className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      href="#"
                      className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      href="#"
                      className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Processing Animation Overlay */}
        <AnimatePresence>
          {isSubmitting && (
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
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Send className="h-8 w-8 text-[#8e44ad] mx-auto mb-4" />
                </motion.div>
                <p className="text-lg font-semibold text-[#8e44ad] dark:text-primary mb-2">Enviando mensagem...</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Aguarde enquanto processamos sua mensagem</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

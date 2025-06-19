"use client"
import Link from "next/link"
import type React from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { useRef, useEffect } from "react"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollAnimation } from "@/components/animations/ScrollAnimation"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { MobileMenu } from "@/components/ui/mobile-menu"
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  ChevronRight,
  ShoppingBag,
  Heart,
  Users,
  MessageCircle,
  Mail,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react"
import { Bebas_Neue } from "next/font/google"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

export default function Home() {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const targetId = e.currentTarget.href.split("#")[1]
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800">
        <div className="container mx-auto px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-3 items-center">
            {/* Left: Logo */}
            <div className="flex justify-start">
              <Link href="#home" className="flex items-center gap-2">
                <div className="relative h-10 w-10 md:h-12 md:w-12">
                  <Image src="/logo.png" alt="Passa Bola Logo" fill className="object-contain" />
                </div>
                <span className="font-bold text-xl text-primary dark:text-white">PASSA BOLA</span>
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center justify-center space-x-8">
              <Link
                onClick={handleSmoothScroll}
                href="#home"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors relative group whitespace-nowrap"
              >
                Home
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                onClick={handleSmoothScroll}
                href="#jogue"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors relative group whitespace-nowrap"
              >
                Jogue com a gente
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                onClick={handleSmoothScroll}
                href="#duvidas"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors relative group whitespace-nowrap"
              >
                Dúvidas
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                onClick={handleSmoothScroll}
                href="#contato"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors relative group whitespace-nowrap"
              >
                Contato
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                onClick={handleSmoothScroll}
                href="#quem-somos"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors relative group whitespace-nowrap"
              >
                Quem somos
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Right: Actions (Loja on Desktop, Menu on Mobile) */}
            <div className="flex justify-end items-center gap-2">
              {/* Desktop Store Link */}
              <Link
                href="/loja"
                className="hidden md:flex items-center gap-1 text-primary dark:text-primary-foreground hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="text-sm font-medium">Loja</span>
              </Link>

              {/* Theme Toggle Button */}
              <ThemeToggleButton />

              {/* Mobile Menu Trigger - positioned at the far right */}
              <div className="md:hidden flex items-center">
                <MobileMenu />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Video Background */}
        <section id="home" className="relative h-screen flex items-center overflow-hidden w-full">
          {/* Video Background */}
          <div className="absolute inset-0 z-0 overflow-hidden w-full h-full left-0 right-0">
            <video
              className="absolute inset-0 object-cover w-[100vw] h-full left-0 right-0"
              style={{ width: "100vw", maxWidth: "100vw", objectFit: "cover" }}
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/futebol.mp4" type="video/mp4" />
              Seu navegador não suporta vídeo em background.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent dark:from-primary/70 dark:via-primary/40"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl text-white">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="bg-[#c2ff28] text-[#8e44ad] mb-4 hover:bg-[#c2ff28]">COPA PASSA BOLA 2025</Badge>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`${bebasNeue.className} text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight tracking-wide`}
              >
                QUEBRANDO BARREIRAS NO CAMPO E NA VIDA
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl mb-8 text-white/90"
              >
                Um torneio que celebra a força, a resistência e o talento das mulheres no futebol. Venha fazer parte
                dessa revolução esportiva.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/cadastro">
                  <Button className="bg-white text-primary hover:bg-white/90 dark:bg-slate-100 dark:text-primary dark:hover:bg-slate-200 text-base px-8 py-6 transition-transform hover:scale-105">
                    INSCREVA SEU TIME
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <span className="text-white text-sm mb-2">Role para descobrir mais</span>
              <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-scroll"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre o Torneio */}
        <section id="quem-somos" className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollAnimation>
                <div>
                  <Badge className="bg-pink-500 text-white mb-4 hover:bg-pink-600">QUEM SOMOS</Badge>
                  <h2
                    className={`${bebasNeue.className} text-3xl md:text-4xl font-bold text-[#8e44ad] dark:text-primary mb-6 tracking-wider`}
                  >
                    UM MOVIMENTO PELA IGUALDADE NO ESPORTE
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    A Copa Passa Bola nasceu da necessidade de criar um espaço seguro e inclusivo para mulheres no
                    futebol. Fundada em 2020 por um grupo de atletas e ativistas, nosso torneio vai além da competição –
                    é um movimento de resistência e celebração.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Acreditamos que o esporte é uma poderosa ferramenta de transformação social. Por isso, trabalhamos
                    para quebrar estereótipos, combater o preconceito e abrir portas para todas as mulheres que desejam
                    jogar futebol, independente de sua orientação sexual, identidade de gênero, raça ou classe social.
                  </p>
                  <div className="flex flex-wrap gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold text-xl text-primary">500+</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Atletas participantes</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                        >
                          <path d="M12 2v8"></path>
                          <path d="m4.93 10.93 1.41 1.41"></path>
                          <path d="M2 18h2"></path>
                          <path d="M20 18h2"></path>
                          <path d="m19.07 10.93-1.41 1.41"></path>
                          <path d="M22 22H2"></path>
                          <path d="m16 6-4 4-4-4"></path>
                          <path d="M16 18a4 4 0 0 0-8 0"></path>
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-xl text-primary">5</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Edições realizadas</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                        >
                          <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                          <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
                          <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                          <path d="M17 10h2a2 2 0 0 1 2 2v1" />
                          <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                          <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-xl text-primary">32</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Times participantes</div>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white">
                    CONHEÇA NOSSA HISTÓRIA
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </ScrollAnimation>
              <ScrollAnimation delay={0.2}>
                <div className="relative">
                  <div className="relative h-[500px] rounded-lg overflow-hidden">
                    <Image src="/image_1.png" alt="Jogadoras da Copa Passa Bola" fill className="object-cover" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg max-w-xs">
                    <div className="flex items-start gap-3">
                      <div className="text-[#c2ff28] mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                        >
                          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                          "A Copa Passa Bola mudou minha vida. Aqui encontrei não só um espaço para jogar, mas uma
                          comunidade que me acolheu e me fortaleceu."
                        </p>
                        <p className="text-[#8e44ad] dark:text-primary font-medium mt-2">
                          Mariana Silva, Capitã do Fúria FC
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Jogue com a gente */}
        <section
          id="jogue"
          className="py-20 bg-gradient-to-b from-white to-transparent dark:from-slate-900 dark:to-transparent aurora"
        >
          <div className="container mx-auto px-4">
            <ScrollAnimation className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="bg-pink-500 text-white mb-4 hover:bg-pink-600">JOGUE COM A GENTE</Badge>
              <h2
                className={`${bebasNeue.className} text-3xl md:text-5xl font-bold text-[#8e44ad] dark:text-primary mb-6 tracking-wider`}
              >
                FAÇA PARTE DESSE MOVIMENTO
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Inscreva seu time na Copa Passa Bola e faça parte de um movimento que está transformando o futebol
                feminino no Brasil. Não importa se você é iniciante ou experiente, aqui tem espaço para todas.
              </p>
            </ScrollAnimation>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "INSCREVA SEU TIME",
                  description:
                    "Reúna sua equipe e inscreva-se para participar da próxima edição da Copa Passa Bola. Vagas limitadas!",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  ),
                  buttonText: "INSCREVER AGORA",
                  link: "/cadastro",
                },
                {
                  title: "SEJA VOLUNTÁRIA",
                  description:
                    "Quer ajudar mas não joga? Temos vagas para voluntárias em diversas áreas: organização, comunicação, saúde e mais.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
                      />
                    </svg>
                  ),
                  buttonText: "QUERO AJUDAR",
                  link: "/voluntaria",
                },
                {
                  title: "DOAÇÃO",
                  description:
                    "Ajude a transformar vidas por meio do esporte. Contribua com qualquer valor e fortaleça o futebol feminino de base.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                    </svg>
                  ),
                  buttonText: "FAZER DOAÇÃO",
                  link: "/doacao",
                },
              ].map((card, index) => (
                <ScrollAnimation key={index} delay={index * 0.1}>
                  <Card className="overflow-hidden border-none shadow-lg h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 dark:bg-slate-800/80 dark:hover:bg-slate-800">
                    <div className="h-2 bg-accent"></div>
                    <CardContent className="pt-6 px-6 flex-grow">
                      <div className="h-14 w-14 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-6">
                        {card.icon}
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-3">{card.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">{card.description}</p>
                    </CardContent>
                    <CardFooter className="px-6 pb-6 mt-auto">
                      <Link href={card.link} className="w-full">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105">
                          {card.buttonText}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Merchandise/Loja */}
        <section id="loja" className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <ScrollAnimation className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="bg-pink-500 text-white mb-4 hover:bg-pink-600">LOJA OFICIAL</Badge>
              <h2
                className={`${bebasNeue.className} text-3xl md:text-5xl font-bold text-[#8e44ad] dark:text-primary mb-6 tracking-wider`}
              >
                VISTA A NOSSA CAUSA
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Cada produto adquirido na nossa loja ajuda a financiar os projetos da Copa Passa Bola e a promover o
                futebol feminino. Além disso, você leva para casa peças exclusivas e cheias de significado.
              </p>
            </ScrollAnimation>
            <ProductCarousel />
            <ScrollAnimation className="flex justify-center mt-12" delay={0.4}>
              <Link href="/loja">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 transition-transform hover:scale-105">
                  VER TODOS OS PRODUTOS
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </ScrollAnimation>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="py-20 aurora">
          <div className="container mx-auto px-4">
            <ScrollAnimation className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="bg-pink-500 text-white mb-4 hover:bg-pink-600">DEPOIMENTOS</Badge>
              <h2
                className={`${bebasNeue.className} text-3xl md:text-5xl font-bold text-[#8e44ad] dark:text-primary mb-6 tracking-wider`}
              >
                O QUE DIZEM SOBRE NÓS
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Conheça as histórias de quem já faz parte da nossa comunidade e como a Copa Passa Bola tem transformado
                vidas através do esporte.
              </p>
            </ScrollAnimation>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "A Copa Passa Bola me deu a oportunidade de jogar em um ambiente seguro e acolhedor, onde posso ser quem eu sou sem medo de julgamentos. Encontrei não só um time, mas uma família.",
                  name: "Juliana Martins",
                  role: "Atacante do Leoas FC",
                  image: "/placeholder.svg?height=100&width=100",
                },
                {
                  quote:
                    "Como mulher lésbica, sempre enfrentei preconceito nos campos. Na Copa Passa Bola, pela primeira vez, me senti completamente aceita e valorizada como atleta e como pessoa.",
                  name: "Fernanda Oliveira",
                  role: "Goleira do Fênix Futebol Clube",
                  image: "/placeholder.svg?height=100&width=100",
                },
                {
                  quote:
                    "O que mais me impressiona na Copa Passa Bola é como ela vai além do esporte. É um movimento político, social e cultural que está realmente mudando a forma como o futebol feminino é visto.",
                  name: "Camila Santos",
                  role: "Treinadora do Guerreiras FC",
                  image: "/placeholder.svg?height=100&width=100",
                },
              ].map((testimonial, index) => (
                <ScrollAnimation key={index} delay={index * 0.1}>
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-none shadow-md p-6 h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <CardContent className="p-0 mb-6 flex-grow">
                      <div className="text-accent mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-8 w-8"
                        >
                          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                        </svg>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 italic">{testimonial.quote}</p>
                    </CardContent>
                    <CardFooter className="p-0 flex items-center gap-4 mt-auto">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#8e44ad] dark:text-primary">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </CardFooter>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Dúvidas Frequentes */}
        <section id="duvidas" className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <ScrollAnimation className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="bg-pink-500 text-white mb-4 hover:bg-pink-600">DÚVIDAS FREQUENTES</Badge>
              <h2
                className={`${bebasNeue.className} text-3xl md:text-5xl font-bold text-[#8e44ad] dark:text-primary mb-6 tracking-wider`}
              >
                TUDO O QUE VOCÊ PRECISA SABER
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Encontre respostas para as perguntas mais comuns sobre a Copa Passa Bola, inscrições, regras e muito
                mais.
              </p>
            </ScrollAnimation>

            <div className="max-w-3xl mx-auto">
              <ScrollAnimation delay={0.2}>
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      question: "Quem pode participar da Copa Passa Bola?",
                      answer:
                        "A Copa Passa Bola é aberta a todas as mulheres cis e trans, não-binárias e pessoas de gênero fluido que se identificam com o futebol feminino. Não há restrições de idade ou nível técnico, pois acreditamos na inclusão e na diversidade.",
                    },
                    {
                      question: "Como funciona o formato do torneio?",
                      answer:
                        "O torneio é dividido em fase de grupos e eliminatórias. Os times são divididos em grupos de 4, onde jogam entre si. Os dois melhores de cada grupo avançam para as quartas de final, seguindo em formato eliminatório até a grande final.",
                    },
                    {
                      question: "Quando acontecem os jogos?",
                      answer:
                        "Os jogos acontecem aos finais de semana (sábados e domingos) durante um período de aproximadamente 2 meses. A programação completa é divulgada após o encerramento das inscrições.",
                    },
                    {
                      question: "Existe algum custo para participar?",
                      answer:
                        "Sim, há uma taxa de inscrição por equipe que ajuda a cobrir os custos de organização, arbitragem, premiação e estrutura. Oferecemos opções de pagamento facilitado e bolsas para times de comunidades em situação de vulnerabilidade.",
                    },
                    {
                      question: "Como posso apoiar o projeto mesmo sem jogar?",
                      answer:
                        "Existem diversas formas de apoiar: sendo voluntária na organização, comprando produtos da nossa loja oficial, fazendo doações, compartilhando nosso conteúdo nas redes sociais ou simplesmente vindo assistir aos jogos e torcendo pelas atletas!",
                    },
                  ].map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left text-lg font-bold text-[#8e44ad] dark:text-primary hover:text-[#9b59b6] dark:hover:text-primary/80">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 dark:text-gray-300">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollAnimation>
            </div>

            <ScrollAnimation className="text-center mt-12" delay={0.5}>
              <p className="text-gray-700 dark:text-gray-300 mb-4">Não encontrou o que procurava?</p>
              <Link href="/contato">
                <Button className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white">
                  ENTRE EM CONTATO
                  <MessageCircle className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </ScrollAnimation>
          </div>
        </section>

        {/* Contato */}
        <section id="contato" className="py-20 bg-[#8e44ad] text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollAnimation>
                <div>
                  <Badge className="bg-[#c2ff28] text-[#8e44ad] mb-4 hover:bg-[#c2ff28]">CONTATO</Badge>
                  <h2
                    className={`${bebasNeue.className} text-3xl md:text-4xl font-bold mb-6 tracking-wider text-white`}
                  >
                    FALE COM A GENTE
                  </h2>
                  <p className="mb-8">
                    Tem alguma dúvida, sugestão ou quer saber mais sobre a Copa Passa Bola? Entre em contato conosco e
                    teremos prazer em ajudar.
                  </p>

                  <div className="space-y-6 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="bg-white/10 p-3 rounded-full">
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Email</h3>
                        <p className="text-white/80">contato@copapassabola.com.br</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-white/10 p-3 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Telefone</h3>
                        <p className="text-white/80">(11) 99999-9999</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-white/10 p-3 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Endereço</h3>
                        <p className="text-white/80">Av. Paulista, 1000 - Bela Vista, São Paulo - SP</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Link
                      href="#"
                      className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </Link>
                    <Link
                      href="#"
                      className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-5 w-5" />
                    </Link>
                    <Link
                      href="#"
                      className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation delay={0.2}>
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-[#8e44ad] mb-6">Envie sua mensagem</h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nome
                        </label>
                        <input
                          id="name"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-50 dark:bg-slate-800"
                          placeholder="Seu nome"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-50 dark:bg-slate-800"
                          placeholder="Seu email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Assunto
                      </label>
                      <input
                        id="subject"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-50 dark:bg-slate-800"
                        placeholder="Assunto da mensagem"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Mensagem
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-50 dark:bg-slate-800"
                        placeholder="Sua mensagem"
                      ></textarea>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105">
                      ENVIAR MENSAGEM
                    </Button>
                  </form>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 bg-accent dark:bg-slate-800">
          <div className="container mx-auto px-4 text-center">
            <ScrollAnimation>
              <h2
                className={`${bebasNeue.className} text-3xl md:text-5xl font-bold text-primary dark:text-white mb-6 tracking-wider`}
              >
                PRONTA PARA FAZER HISTÓRIA NO CAMPO?
              </h2>
              <p className="text-primary/80 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                Inscreva seu time agora e faça parte da maior revolução do futebol feminino. Juntas somos mais fortes!
              </p>
              <Link href="/cadastro">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 transition-transform hover:scale-105">
                  INSCREVA-SE NA COPA PASSA BOLA 2025
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </ScrollAnimation>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary dark:bg-slate-900 text-primary-foreground dark:text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative h-12 w-12">
                  <Image src="/logo.png" alt="Passa Bola Logo" fill className="object-contain" />
                </div>
                <span className="font-bold text-xl text-white">PASSA BOLA</span>
              </div>
              <p className="text-primary-foreground/80 dark:text-gray-300 mb-6">
                Um movimento pela igualdade no esporte. Promovendo o futebol feminino e criando espaços seguros e
                inclusivos para todas.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="bg-white/10 dark:bg-white/20 p-2 rounded-full hover:bg-white/20 dark:hover:bg-white/30 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="bg-white/10 dark:bg-white/20 p-2 rounded-full hover:bg-white/20 dark:hover:bg-white/30 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="bg-white/10 dark:bg-white/20 p-2 rounded-full hover:bg-white/20 dark:hover:bg-white/30 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 tracking-wider text-white">Links Rápidos</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#home"
                    className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors hover:pl-1"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#jogue"
                    className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors hover:pl-1"
                  >
                    Jogue com a gente
                  </Link>
                </li>
                <li>
                  <Link
                    href="#duvidas"
                    className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors hover:pl-1"
                  >
                    Dúvidas
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contato"
                    className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors hover:pl-1"
                  >
                    Contato
                  </Link>
                </li>
                <li>
                  <Link
                    href="#quem-somos"
                    className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors hover:pl-1"
                  >
                    Quem somos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/loja"
                    className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors hover:pl-1"
                  >
                    Loja
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 tracking-wider text-white">Informações</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors hover:pl-1"
                  >
                    Regulamento
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors hover:pl-1"
                  >
                    Código de Conduta
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors hover:pl-1"
                  >
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors hover:pl-1"
                  >
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors hover:pl-1"
                  >
                    Trabalhe Conosco
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors hover:pl-1"
                  >
                    Imprensa
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 tracking-wider text-white">Newsletter</h3>
              <p className="text-primary-foreground/80 dark:text-gray-300 mb-4">
                Inscreva-se para receber novidades, datas de jogos e conteúdos exclusivos.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="flex-1 px-3 py-2 text-black dark:text-white dark:bg-slate-700 dark:border-slate-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Button className="rounded-l-none bg-accent hover:bg-accent/90 text-primary dark:text-white">
                  Assinar
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/80 dark:text-gray-300 text-sm">
              &copy; {new Date().getFullYear()} Copa Passa Bola. Todos os direitos reservados.
            </p>
            <p className="text-primary-foreground/80 dark:text-gray-300 text-sm mt-4 md:mt-0">
              Feito com 💜 por mulheres, para mulheres.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProductCarousel() {
  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true, stopOnMouseEnter: true }))
  const carouselRef = useRef(null)
  const isInView = useInView(carouselRef, { once: true, amount: 0.4 })

  useEffect(() => {
    if (isInView) {
      plugin.current.play()
    }
  }, [isInView])

  return (
    <Carousel
      ref={carouselRef}
      plugins={[plugin.current]}
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-6xl mx-auto"
    >
      <CarouselContent className="-ml-4 py-4">
        {[
          {
            name: "Camiseta Oficial Copa Passa Bola",
            price: "R$ 89,90",
            image: "/products/camisa.jpg",
            badge: "Mais vendido",
          },
          {
            name: "Moletom Resistência Feminina",
            price: "R$ 149,90",
            image: "/products/moletom.jpg",
            badge: null,
          },
          {
            name: "Boné Passa Bola Edição Especial",
            price: "R$ 59,90",
            image: "/products/bone.jpg",
            badge: "Novo",
          },
          {
            name: "Caneca Quebra Barreiras",
            price: "R$ 39,90",
            image: "/products/caneca.jpg",
            badge: null,
          },
          {
            name: "Garrafa Térmica 'Juntas em Campo'",
            price: "R$ 79,90",
            image: "/products/garrafa.jpg",
            badge: null,
          },
          {
            name: "Meião de Jogo Profissional",
            price: "R$ 49,90",
            image: "/products/meia.jpg",
            badge: null,
          },
          {
            name: "Sacola Ecológica 'Futebol & Luta'",
            price: "R$ 29,90",
            image: "/products/sacola.jpg",
            badge: "Sustentável",
          },
          {
            name: "Chaveiro Bola e Chuteira",
            price: "R$ 19,90",
            image: "/products/chaveiro.jpg",
            badge: null,
          },
        ].map((product, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4 p-4">
            <ScrollAnimation delay={index * 0.1} className="h-full">
              <Card className="group border-none shadow-md h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 dark:bg-slate-800">
                <div className="relative aspect-square bg-primary/5 dark:bg-slate-700/50">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain p-4 transition-transform group-hover:scale-105"
                    unoptimized
                  />
                  {product.badge && (
                    <Badge className="absolute top-3 left-3 bg-primary hover:bg-primary/90">{product.badge}</Badge>
                  )}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white text-primary rounded-full h-8 w-8 dark:bg-slate-700/80 dark:hover:bg-slate-700"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Adicionar aos favoritos</span>
                  </Button>
                </div>
                <CardContent className="p-4 flex-grow">
                  <h3 className="font-medium text-gray-900 dark:text-gray-50 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-primary">{product.price}</span>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-8 w-8 p-0 transition-transform hover:scale-110"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span className="sr-only">Adicionar ao carrinho</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 hidden md:flex" />
      <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 hidden md:flex" />
    </Carousel>
  )
}

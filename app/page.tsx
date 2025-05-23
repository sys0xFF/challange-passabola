import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronRight,
  ShoppingBag,
  Play,
  Heart,
  Users,
  MessageCircle,
  Mail,
  Menu,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10 md:h-12 md:w-12">
                <div className="absolute inset-0 bg-[#8e44ad] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  PB
                </div>
              </div>
              <span className="font-bold text-xl text-[#8e44ad]">PASSA BOLA</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#home"
                className="text-sm font-medium text-gray-700 hover:text-[#8e44ad] transition-colors relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#c2ff28] transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="#jogue"
                className="text-sm font-medium text-gray-700 hover:text-[#8e44ad] transition-colors relative group"
              >
                Jogue com a gente
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#c2ff28] transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="#duvidas"
                className="text-sm font-medium text-gray-700 hover:text-[#8e44ad] transition-colors relative group"
              >
                Dúvidas
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#c2ff28] transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="#contato"
                className="text-sm font-medium text-gray-700 hover:text-[#8e44ad] transition-colors relative group"
              >
                Contato
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#c2ff28] transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="#quem-somos"
                className="text-sm font-medium text-gray-700 hover:text-[#8e44ad] transition-colors relative group"
              >
                Quem somos
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#c2ff28] transition-all group-hover:w-full"></span>
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="#loja" className="hidden md:flex items-center gap-1 text-[#8e44ad]">
                <ShoppingBag className="h-5 w-5" />
                <span className="text-sm font-medium">Loja</span>
              </Link>
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Video Background */}
        <section id="home" className="relative h-screen flex items-center">
          {/* Video Background (using image as placeholder) */}

<div className="absolute inset-0 z-0 overflow-hidden">
  <video
    className="object-cover w-full h-full"
    autoPlay
    muted
    loop
    playsInline
  >
    <source src="/futebol.mp4" type="video/mp4" />
    Seu navegador não suporta vídeo em background.
  </video>
  <div className="absolute inset-0 bg-gradient-to-r from-[#8e44ad]/90 via-[#8e44ad]/70 to-transparent"></div>
</div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl text-white">
              <Badge className="bg-[#c2ff28] text-[#8e44ad] mb-4 hover:bg-[#c2ff28]">COPA PASSA BOLA 2025</Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                QUEBRANDO BARREIRAS NO CAMPO E NA VIDA
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Um torneio que celebra a força, a resistência e o talento das mulheres no futebol. Venha fazer parte
                dessa revolução esportiva.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-[#8e44ad] hover:bg-white/90 text-base px-8 py-6">
                  INSCREVA SEU TIME
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <span className="text-white text-sm mb-2">Role para descobrir mais</span>
              <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce mt-1"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre o Torneio */}
        <section id="quem-somos" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-[#ffcce6] text-[#8e44ad] mb-4 hover:bg-[#ffcce6]">QUEM SOMOS</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-[#8e44ad] mb-6">
                  UM MOVIMENTO PELA IGUALDADE NO ESPORTE
                </h2>
                <p className="text-gray-700 mb-6">
                  A Copa Passa Bola nasceu da necessidade de criar um espaço seguro e inclusivo para mulheres no
                  futebol. Fundada em 2020 por um grupo de atletas e ativistas, nosso torneio vai além da competição – é
                  um movimento de resistência e celebração.
                </p>
                <p className="text-gray-700 mb-6">
                  Acreditamos que o esporte é uma poderosa ferramenta de transformação social. Por isso, trabalhamos
                  para quebrar estereótipos, combater o preconceito e abrir portas para todas as mulheres que desejam
                  jogar futebol, independente de sua orientação sexual, identidade de gênero, raça ou classe social.
                </p>
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-[#f3e5f5] flex items-center justify-center text-[#8e44ad]">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold text-xl text-[#8e44ad]">500+</div>
                      <div className="text-sm text-gray-600">Atletas participantes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-[#f3e5f5] flex items-center justify-center text-[#8e44ad]">
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
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m8 14 2.5-2.5c.83-.83 2.17-.83 3 0L16 14"></path>
                        <path d="M16 10c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1Z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-xl text-[#8e44ad]">32</div>
                      <div className="text-sm text-gray-600">Times participantes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-[#f3e5f5] flex items-center justify-center text-[#8e44ad]">
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
                      <div className="font-bold text-xl text-[#8e44ad]">5</div>
                      <div className="text-sm text-gray-600">Edições realizadas</div>
                    </div>
                  </div>
                </div>
                <Button className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white">
                  CONHEÇA NOSSA HISTÓRIA
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <div className="relative h-[500px] rounded-lg overflow-hidden">
                  <Image
                    src="/image_1.png?height=500&width=400"
                    alt="Jogadoras da Copa Passa Bola"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg max-w-xs">
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
                      <p className="text-gray-700 text-sm italic">
                        "A Copa Passa Bola mudou minha vida. Aqui encontrei não só um espaço para jogar, mas uma
                        comunidade que me acolheu e me fortaleceu."
                      </p>
                      <p className="text-[#8e44ad] font-medium mt-2">Mariana Silva, Capitã do Fúria FC</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jogue com a gente */}
        <section id="jogue" className="py-20 bg-gradient-to-b from-[#f9f0ff] to-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="bg-[#ffcce6] text-[#8e44ad] mb-4 hover:bg-[#ffcce6]">JOGUE COM A GENTE</Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-[#8e44ad] mb-6">FAÇA PARTE DESSE MOVIMENTO</h2>
              <p className="text-gray-700">
                Inscreva seu time na Copa Passa Bola e faça parte de um movimento que está transformando o futebol
                feminino no Brasil. Não importa se você é iniciante ou experiente, aqui tem espaço para todas.
              </p>
            </div>

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
                },
                {
                  title: "SEJA VOLUNTÁRIA",
                  description:
                    "Quer ajudar mas não joga? Temos vagas para voluntárias em diversas áreas: organização, comunicação, saúde e mais.",
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
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                    </svg>
                  ),
                  buttonText: "QUERO AJUDAR",
                },
                {
                  title: "PATROCINE",
                  description:
                    "Sua marca pode fazer parte dessa revolução. Apoie o futebol feminino e conecte-se com um público engajado e diverso.",
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
                  buttonText: "SEJA PARCEIRA",
                },
              ].map((card, index) => (
                <Card key={index} className="overflow-hidden border-none shadow-lg">
                  <div className="h-2 bg-[#c2ff28]"></div>
                  <CardContent className="pt-6 px-6">
                    <div className="h-14 w-14 rounded-full bg-[#f3e5f5] flex items-center justify-center text-[#8e44ad] mb-6">
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#8e44ad] mb-3">{card.title}</h3>
                    <p className="text-gray-600 mb-6">{card.description}</p>
                  </CardContent>
                  <CardFooter className="px-6 pb-6">
                    <Button className="w-full bg-[#8e44ad] hover:bg-[#9b59b6] text-white">
                      {card.buttonText}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Merchandise/Loja */}
        <section id="loja" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="bg-[#ffcce6] text-[#8e44ad] mb-4 hover:bg-[#ffcce6]">LOJA OFICIAL</Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-[#8e44ad] mb-6">VISTA A NOSSA CAUSA</h2>
              <p className="text-gray-700">
                Cada produto adquirido na nossa loja ajuda a financiar os projetos da Copa Passa Bola e a promover o
                futebol feminino. Além disso, você leva para casa peças exclusivas e cheias de significado.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Camiseta Oficial Copa Passa Bola",
                  price: "R$ 89,90",
                  image: "/placeholder.svg?height=300&width=300",
                  badge: "Mais vendido",
                },
                {
                  name: "Moletom Resistência Feminina",
                  price: "R$ 149,90",
                  image: "/placeholder.svg?height=300&width=300",
                  badge: null,
                },
                {
                  name: "Boné Passa Bola Edição Especial",
                  price: "R$ 59,90",
                  image: "/placeholder.svg?height=300&width=300",
                  badge: "Novo",
                },
                {
                  name: "Caneca Quebra Barreiras",
                  price: "R$ 39,90",
                  image: "/placeholder.svg?height=300&width=300",
                  badge: null,
                },
              ].map((product, index) => (
                <Card key={index} className="overflow-hidden group border-none shadow-md">
                  <div className="relative aspect-square bg-[#f9f0ff]">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition-transform group-hover:scale-105"
                    />
                    {product.badge && (
                      <Badge className="absolute top-3 left-3 bg-[#8e44ad] hover:bg-[#8e44ad]">{product.badge}</Badge>
                    )}
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white text-[#8e44ad] rounded-full h-8 w-8"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="sr-only">Adicionar aos favoritos</span>
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-900 group-hover:text-[#8e44ad] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-[#8e44ad]">{product.price}</span>
                      <Button size="sm" className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white rounded-full h-8 w-8 p-0">
                        <ShoppingBag className="h-4 w-4" />
                        <span className="sr-only">Adicionar ao carrinho</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Button className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white px-8">
                VER TODOS OS PRODUTOS
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="py-20 bg-[#f9f0ff]">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="bg-[#ffcce6] text-[#8e44ad] mb-4 hover:bg-[#ffcce6]">DEPOIMENTOS</Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-[#8e44ad] mb-6">O QUE DIZEM SOBRE NÓS</h2>
              <p className="text-gray-700">
                Conheça as histórias de quem já faz parte da nossa comunidade e como a Copa Passa Bola tem transformado
                vidas através do esporte.
              </p>
            </div>

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
                <Card key={index} className="bg-white border-none shadow-md p-6">
                  <CardContent className="p-0 mb-6">
                    <div className="text-[#c2ff28] mb-4">
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
                    <p className="text-gray-700 italic">{testimonial.quote}</p>
                  </CardContent>
                  <CardFooter className="p-0 flex items-center gap-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#8e44ad]">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Dúvidas Frequentes */}
        <section id="duvidas" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="bg-[#ffcce6] text-[#8e44ad] mb-4 hover:bg-[#ffcce6]">DÚVIDAS FREQUENTES</Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-[#8e44ad] mb-6">TUDO O QUE VOCÊ PRECISA SABER</h2>
              <p className="text-gray-700">
                Encontre respostas para as perguntas mais comuns sobre a Copa Passa Bola, inscrições, regras e muito
                mais.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
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
                <div key={index} className="mb-6 border-b border-gray-200 pb-6 last:border-0">
                  <h3 className="text-xl font-bold text-[#8e44ad] mb-3 flex items-center">
                    <span className="mr-3 text-[#c2ff28]">Q.</span>
                    {faq.question}
                  </h3>
                  <p className="text-gray-700 pl-7">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-700 mb-4">Não encontrou o que procurava?</p>
              <Button className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white">
                ENTRE EM CONTATO
                <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Contato */}
        <section id="contato" className="py-20 bg-[#8e44ad] text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-[#c2ff28] text-[#8e44ad] mb-4 hover:bg-[#c2ff28]">CONTATO</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">FALE COM A GENTE</h2>
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

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold text-[#8e44ad] mb-6">Envie sua mensagem</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Nome
                      </label>
                      <input
                        id="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8e44ad]"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8e44ad]"
                        placeholder="Seu email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                      Assunto
                    </label>
                    <input
                      id="subject"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8e44ad]"
                      placeholder="Assunto da mensagem"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8e44ad]"
                      placeholder="Sua mensagem"
                    ></textarea>
                  </div>
                  <Button className="w-full bg-[#8e44ad] hover:bg-[#9b59b6] text-white">ENVIAR MENSAGEM</Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 bg-[#c2ff28]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-[#8e44ad] mb-6">PRONTA PARA FAZER HISTÓRIA NO CAMPO?</h2>
            <p className="text-[#8e44ad] max-w-2xl mx-auto mb-8">
              Inscreva seu time agora e faça parte da maior revolução do futebol feminino. Juntas somos mais fortes!
            </p>
            <Button className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white text-lg px-8 py-6">
              INSCREVA-SE NA COPA PASSA BOLA 2025
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#8e44ad] text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="relative h-10 w-10 bg-white rounded-full flex items-center justify-center text-[#8e44ad] font-bold text-lg">
                  PB
                </div>
                <span className="font-bold text-xl">PASSA BOLA</span>
              </div>
              <p className="text-white/80 mb-6">
                Um movimento pela igualdade no esporte. Promovendo o futebol feminino e criando espaços seguros e
                inclusivos para todas.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#home" className="text-white/80 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#jogue" className="text-white/80 hover:text-white transition-colors">
                    Jogue com a gente
                  </Link>
                </li>
                <li>
                  <Link href="#duvidas" className="text-white/80 hover:text-white transition-colors">
                    Dúvidas
                  </Link>
                </li>
                <li>
                  <Link href="#contato" className="text-white/80 hover:text-white transition-colors">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href="#quem-somos" className="text-white/80 hover:text-white transition-colors">
                    Quem somos
                  </Link>
                </li>
                <li>
                  <Link href="#loja" className="text-white/80 hover:text-white transition-colors">
                    Loja
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Informações</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-white/80 hover:text-white transition-colors">
                    Regulamento
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white transition-colors">
                    Código de Conduta
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white transition-colors">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white transition-colors">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white transition-colors">
                    Trabalhe Conosco
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white transition-colors">
                    Imprensa
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Newsletter</h3>
              <p className="text-white/80 mb-4">
                Inscreva-se para receber novidades, datas de jogos e conteúdos exclusivos.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="flex-1 px-3 py-2 text-black rounded-l-md focus:outline-none"
                />
                <Button className="rounded-l-none bg-[#c2ff28] hover:bg-[#d4ff5c] text-[#8e44ad]">Assinar</Button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80 text-sm">
              &copy; {new Date().getFullYear()} Copa Passa Bola. Todos os direitos reservados.
            </p>
            <p className="text-white/80 text-sm mt-2 md:mt-0">Feito com 💜 por mulheres, para mulheres.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Mobile Menu Component
function MobileMenu() {
  return (
    <div className="md:hidden">
      <Button variant="ghost" size="sm" className="text-[#8e44ad]">
        <Menu className="h-6 w-6" />
      </Button>
    </div>
  )
}

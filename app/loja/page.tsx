"use client"
import Link from "next/link"
import { Label } from "@/components/ui/label"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button"
import { MobileMenu } from "@/components/ui/mobile-menu"
import { useCart, type Product } from "@/contexts/cart-context"
import { ShoppingCart, Plus, Search, Filter, ArrowLeft, Star, Heart, Truck, Shield, RotateCcw } from "lucide-react"
import { Bebas_Neue } from "next/font/google"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

const products: Product[] = [
  {
    id: "moletom-resistencia",
    name: "Moletom Resistência Feminina",
    price: 89.9,
    image: "/products/moletom.jpg",
    description: "Moletom confortável com estampa 'Resistência Feminina' e símbolo de empoderamento.",
    category: "roupas",
    sizes: ["P", "M", "G", "GG"],
  },
  {
    id: "ecobag-futebol-luta",
    name: "Ecobag Futebol é Luta",
    price: 25.9,
    image: "/products/sacola.jpg",
    description: "Ecobag sustentável com a mensagem 'Futebol é Luta' e símbolo feminista.",
    category: "acessorios",
  },
  {
    id: "caneca-quebra-barreiras",
    name: "Caneca Quebra Barreiras",
    price: 32.9,
    image: "/products/caneca.jpg",
    description: "Caneca de porcelana com ilustração de jogadora e frase motivacional.",
    category: "casa",
  },
  {
    id: "camiseta-copa-passa-bola",
    name: "Camiseta Copa Passa Bola",
    price: 45.9,
    image: "/products/camisa.jpg",
    description: "Camiseta oficial da Copa Passa Bola com logo bordado e símbolo feminista.",
    category: "roupas",
    sizes: ["P", "M", "G", "GG"],
  },
  {
    id: "bone-edicao-especial",
    name: "Boné Edição Especial",
    price: 39.9,
    image: "/products/bone.jpg",
    description: "Boné preto bordado com logo da Copa Passa Bola - Edição Especial.",
    category: "acessorios",
  },
  {
    id: "garrafa-juntas-em-campo",
    name: "Garrafa Térmica Juntas em Campo",
    price: 55.9,
    image: "/products/garrafa.jpg",
    description: "Garrafa térmica roxa com isolamento térmico e estampa 'Juntas em Campo'.",
    category: "casa",
  },
  {
    id: "meia-copa-passa-bola",
    name: "Meia Copa Passa Bola",
    price: 18.9,
    image: "/products/meia.jpg",
    description: "Meia esportiva preta com logo bordado da Copa Passa Bola.",
    category: "roupas",
    sizes: ["34-36", "37-39", "40-42"],
  },
  {
    id: "chaveiro-copa-passa-bola",
    name: "Chaveiro Copa Passa Bola",
    price: 15.9,
    image: "/products/chaveiro.jpg",
    description: "Chaveiro em metal com logo da Copa Passa Bola e pingente de chuteira.",
    category: "acessorios",
  },
]

const categories = [
  { value: "todos", label: "Todos os Produtos" },
  { value: "roupas", label: "Roupas" },
  { value: "acessorios", label: "Acessórios" },
  { value: "casa", label: "Casa & Decoração" },
]

export default function LojaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [sortBy, setSortBy] = useState("name")
  const { state, addItem } = useCart()

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const targetId = e.currentTarget.href.split("#")[1]
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "todos" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const handleAddToCart = (product: Product, size?: string) => {
    addItem(product, size)
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
              <Badge className="bg-pink-500 text-white">LOJA OFICIAL</Badge>
            </div>
            <div className="flex justify-end items-center gap-2">
              <Link href="/carrinho" className="relative">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <ShoppingCart className="h-5 w-5" />
                  {state.itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[#8e44ad] text-white text-xs flex items-center justify-center">
                      {state.itemCount}
                    </Badge>
                  )}
                </Button>
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
              <Badge className="bg-[#c2ff28] text-[#8e44ad] mb-4 hover:bg-[#c2ff28]">LOJA OFICIAL</Badge>
              <h1 className={`${bebasNeue.className} text-4xl md:text-6xl font-bold mb-6 tracking-wider`}>
                LOJA COPA PASSA BOLA
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto">
                Vista a camisa da revolução! Produtos oficiais da Copa Passa Bola para você mostrar seu apoio ao futebol
                feminino.
              </p>
              <div className="flex items-center justify-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[#c2ff28]" />
                  <span>Frete Grátis*</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#c2ff28]" />
                  <span>Compra Segura</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-[#c2ff28]" />
                  <span>Troca Grátis</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 bg-white dark:bg-slate-900 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                  <SelectItem value="price-low">Menor Preço</SelectItem>
                  <SelectItem value="price-high">Maior Preço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 bg-gray-50 dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""} encontrado
                {filteredProducts.length !== 1 ? "s" : ""}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedCategory !== "todos" &&
                  `Categoria: ${categories.find((c) => c.value === selectedCategory)?.label}`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Tente ajustar os filtros ou termo de busca</p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("todos")
                  }}
                  variant="outline"
                  className="border-[#8e44ad] text-[#8e44ad] hover:bg-[#8e44ad] hover:text-white"
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Back to Home */}
        <section className="py-8 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 text-center">
            <Button
              asChild
              variant="outline"
              className="border-[#8e44ad] text-[#8e44ad] hover:bg-[#8e44ad] hover:text-white"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                VOLTAR AO INÍCIO
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product
  onAddToCart: (product: Product, size?: string) => void
}) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [isLiked, setIsLiked] = useState(false)

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0) {
      if (!selectedSize) {
        alert("Por favor, selecione um tamanho")
        return
      }
      onAddToCart(product, selectedSize)
    } else {
      onAddToCart(product)
    }
  }

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 dark:bg-slate-900">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/80 hover:bg-white"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </Button>
          </div>
          <div className="absolute top-4 left-4">
            <Badge className="bg-[#8e44ad] text-white">
              {product.category === "roupas" && "Roupas"}
              {product.category === "acessorios" && "Acessórios"}
              {product.category === "casa" && "Casa"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.8)</span>
        </div>

        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-3">
            <Label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">Tamanho:</Label>
            <div className="flex gap-1 flex-wrap">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  className={`h-8 px-3 text-xs ${
                    selectedSize === size
                      ? "bg-[#8e44ad] text-white"
                      : "border-gray-300 text-gray-700 hover:border-[#8e44ad] hover:text-[#8e44ad]"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-[#8e44ad]">R$ {product.price.toFixed(2).replace(".", ",")}</span>
            <p className="text-xs text-gray-500">ou 3x sem juros</p>
          </div>
          <Button onClick={handleAddToCart} className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

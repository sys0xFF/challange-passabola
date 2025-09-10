"use client"
import Link from "next/link"
import type React from "react"
import { useRouter } from "next/navigation"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { useDevAutoFill } from "@/hooks/use-dev-autofill"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthButton } from "@/components/ui/auth-button"
import { MobileMenu } from "@/components/ui/mobile-menu"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Truck,
  Calculator,
  ShoppingBag,
  Package,
} from "lucide-react"
import { Bebas_Neue } from "next/font/google"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

export default function CarrinhoPage() {
  const { user, openLoginModal } = useAuth()
  const router = useRouter()
  
  // Hook de desenvolvimento
  useDevAutoFill();
  
  const { state, updateQuantity, removeItem } = useCart()
  const [cep, setCep] = useState("")
  const [shippingInfo, setShippingInfo] = useState<{
    price: number
    days: number
    type: string
  } | null>(null)

  const handleGoToLogin = () => {
    openLoginModal()
  }

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const targetId = e.currentTarget.href.split("#")[1]
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  const calculateShipping = () => {
    // Remove any non-numeric characters to get only the digits
    const numericCep = cep.replace(/\D/g, "")
    
    if (numericCep.length !== 8) {
      alert("Por favor, digite um CEP válido com 8 dígitos")
      return
    }

    // Simulate shipping calculation
    const shippingOptions = [
      { price: 0, days: 7, type: "Frete Grátis" }, // Free shipping for orders over R$ 100
      { price: 15.9, days: 5, type: "PAC" },
      { price: 25.9, days: 2, type: "SEDEX" },
    ]

    const selectedShipping = state.total >= 100 ? shippingOptions[0] : shippingOptions[1]
    setShippingInfo(selectedShipping)
  }

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 5) {
      return numbers
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value)
    setCep(formatted)
  }

  const subtotal = state.total
  const shipping = shippingInfo?.price || 0
  const total = subtotal + shipping

  if (state.items.length === 0) {
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
                <Badge className="bg-gray-500 text-white">CARRINHO VAZIO</Badge>
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

        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
              <h1 className={`${bebasNeue.className} text-4xl font-bold text-gray-900 dark:text-white mb-4`}>
                SEU CARRINHO ESTÁ VAZIO
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Que tal dar uma olhada nos nossos produtos incríveis? Temos itens perfeitos para você mostrar seu apoio
                ao futebol feminino!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white">
                  <Link href="/loja">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    IR ÀS COMPRAS
                  </Link>
                </Button>
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
            </motion.div>
          </div>
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
              <Badge className="bg-[#8e44ad] text-white">
                {state.itemCount} ITEM{state.itemCount !== 1 ? "S" : ""} NO CARRINHO
              </Badge>
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
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-[#8e44ad] to-[#9b59b6] text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className={`${bebasNeue.className} text-4xl md:text-5xl font-bold mb-4 tracking-wider`}>
                SEU CARRINHO
              </h1>
              <p className="text-lg text-white/90">Revise seus itens e finalize sua compra</p>
            </motion.div>
          </div>
        </section>

        {/* Cart Content */}
        <section className="py-12 bg-gray-50 dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card className="dark:bg-slate-900">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#8e44ad] dark:text-primary flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      ITENS DO CARRINHO
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {state.items.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.selectedSize || "default"}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-4 p-4 border rounded-lg bg-white dark:bg-slate-800"
                      >
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.selectedSize && `Tamanho: ${item.selectedSize}`}
                          </p>
                          <p className="text-lg font-bold text-[#8e44ad]">
                            R$ {item.price.toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id, item.selectedSize)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                {/* Shipping Calculator */}
                <Card className="dark:bg-slate-900">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#8e44ad] dark:text-primary flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      CALCULAR FRETE
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP de entrega</Label>
                      <div className="flex gap-2">
                        <Input
                          id="cep"
                          value={cep}
                          onChange={handleCepChange}
                          placeholder="00000-000"
                          maxLength={9}
                          className="focus:ring-[#8e44ad] focus:border-[#8e44ad]"
                        />
                        <Button onClick={calculateShipping} className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white">
                          <Truck className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {shippingInfo && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-green-700 dark:text-green-300">{shippingInfo.type}</p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              Entrega em {shippingInfo.days} dias úteis
                            </p>
                          </div>
                          <p className="font-bold text-green-700 dark:text-green-300">
                            {shippingInfo.price === 0
                              ? "GRÁTIS"
                              : `R$ ${shippingInfo.price.toFixed(2).replace(".", ",")}`}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {state.total < 100 && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          💡 Frete GRÁTIS em compras acima de R$ 100,00
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          Faltam apenas R$ {(100 - state.total).toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card className="dark:bg-slate-900">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#8e44ad] dark:text-primary">RESUMO DO PEDIDO</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal ({state.itemCount} itens)</span>
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

                    {user ? (
                      <Button asChild className="w-full bg-[#8e44ad] hover:bg-[#9b59b6] text-white">
                        <Link href="/checkout">
                          FINALIZAR COMPRA
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => openLoginModal()}
                        className="w-full bg-[#8e44ad] hover:bg-[#9b59b6] text-white"
                      >
                        FINALIZAR COMPRA
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-[#8e44ad] text-[#8e44ad] hover:bg-[#8e44ad] hover:text-white"
                    >
                      <Link href="/loja">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        CONTINUAR COMPRANDO
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Ticket, ShoppingCart, Loader2, CreditCard, Smartphone, Check, Copy, Calendar, MapPin } from 'lucide-react'
import { Game, TicketType } from '@/lib/database-service'
import { toast } from 'sonner'

interface PurchaseModalProps {
  game: Game & { id: string }
  open: boolean
  onOpenChange: (open: boolean) => void
  onPurchase: (ticketType: TicketType, quantity: number) => void
  loading: boolean
  onClose?: () => void // Nova prop opcional para limpeza quando o modal fechar
}

export default function PurchaseModal({ 
  game, 
  open, 
  onOpenChange, 
  onPurchase, 
  loading,
  onClose 
}: PurchaseModalProps) {
  const [selectedTickets, setSelectedTickets] = useState<{[key: string]: number}>({})
  const [step, setStep] = useState<'selection' | 'payment' | 'success'>('selection')
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix')
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  })
  const [pixCode, setPixCode] = useState('')

  // Usar os tipos de ingresso do jogo
  const ticketTypes = game.ticketTypes || []

  const handleQuantityChange = (ticketId: string, change: number) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: Math.max(0, (prev[ticketId] || 0) + change)
    }))
  }

  const getTotalAmount = () => {
    return ticketTypes.reduce((total, ticket) => {
      const quantity = selectedTickets[ticket.id] || 0
      return total + (ticket.price * quantity)
    }, 0)
  }

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0)
  }

  const handleContinueToPayment = () => {
    if (getTotalTickets() === 0) {
      toast.error('Selecione pelo menos um ingresso')
      return
    }
    setStep('payment')
    
    // Gerar código PIX simulado
    if (paymentMethod === 'pix') {
      const code = `00020126580014BR.GOV.BCB.PIX013638b3ea4e-ae9e-4e3b-9e3b-${Date.now()}520400005303986540${getTotalAmount().toFixed(2)}5802BR5925Copa Passa Bola6009SAO PAULO62070503***6304`
      setPixCode(code)
    }
  }

  const handleProcessPayment = async () => {
    if (paymentMethod === 'card') {
      // Validar dados do cartão
      if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
        toast.error('Preencha todos os dados do cartão')
        return
      }
    }

    // Processar compra para cada tipo de ingresso selecionado
    const selectedTicketTypes = ticketTypes.filter(ticket => 
      selectedTickets[ticket.id] > 0
    )

    try {
      for (const ticket of selectedTicketTypes) {
        await onPurchase(ticket, selectedTickets[ticket.id])
      }
      setStep('success')
    } catch (error) {
      console.error('Erro no pagamento:', error)
    }
  }

  const handleClose = () => {
    setStep('selection')
    setSelectedTickets({})
    setCardData({ number: '', name: '', expiry: '', cvv: '' })
    setPixCode('')
    onOpenChange(false)
    // Chama a função de limpeza se fornecida
    if (onClose) {
      onClose()
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', { 
      weekday: 'short',
      day: '2-digit', 
      month: 'short' 
    })
  }

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode)
    toast.success('Código PIX copiado!')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#8e44ad]">
            {step === 'selection' && 'Comprar Ingressos'}
            {step === 'payment' && 'Finalizar Pagamento'}
            {step === 'success' && 'Compra Realizada!'}
          </DialogTitle>
        </DialogHeader>

        {step === 'selection' && (
          <>
            {/* Info do Jogo */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold">{game.team1} vs {game.team2}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>{formatarData(game.date)} às {game.time}</div>
                    <div>{game.location}</div>
                    <Badge className="bg-[#8e44ad] text-white">{game.phase}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tipos de Ingresso */}
            <div className="space-y-4 mb-6">
              {ticketTypes.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-6 text-center text-gray-500">
                    <Ticket className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Nenhum tipo de ingresso disponível para este jogo.</p>
                  </CardContent>
                </Card>
              ) : (
                ticketTypes.map((ticket) => (
                  <Card key={ticket.id} className="border hover:border-[#8e44ad]/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{ticket.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                          <div className="text-lg font-bold text-[#8e44ad]">
                            {formatCurrency(ticket.price)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Disponível: {ticket.maxQuantity - ticket.soldQuantity} ingressos
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(ticket.id, -1)}
                            disabled={!selectedTickets[ticket.id]}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="min-w-[2rem] text-center font-semibold">
                            {selectedTickets[ticket.id] || 0}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(ticket.id, 1)}
                            disabled={(selectedTickets[ticket.id] || 0) >= (ticket.maxQuantity - ticket.soldQuantity)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Resumo da Compra */}
            {getTotalTickets() > 0 && (
              <Card className="bg-gray-50 mb-6">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Resumo da Compra</h4>
                  <div className="space-y-2">
                    {ticketTypes.map((ticket) => {
                      const quantity = selectedTickets[ticket.id]
                      if (!quantity) return null
                      
                      return (
                        <div key={ticket.id} className="flex justify-between text-sm">
                          <span>{quantity}x {ticket.name}</span>
                          <span>{formatCurrency(ticket.price * quantity)}</span>
                        </div>
                      )
                    })}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-[#8e44ad]">{formatCurrency(getTotalAmount())}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botões de Ação */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
              
              <Button
                onClick={handleContinueToPayment}
                disabled={getTotalTickets() === 0}
                className="flex-1 bg-[#c2ff28] text-[#8e44ad] hover:bg-[#c2ff28]/90"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Continuar ({getTotalTickets()} ingresso{getTotalTickets() !== 1 ? 's' : ''})
              </Button>
            </div>
          </>
        )}

        {step === 'payment' && (
          <>
            {/* Info da Compra */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Resumo do Pedido</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>{game.team1} vs {game.team2}</span>
                    <span>{formatarData(game.date)}</span>
                  </div>
                  {ticketTypes.map((ticket) => {
                    const quantity = selectedTickets[ticket.id]
                    if (!quantity) return null
                    return (
                      <div key={ticket.id} className="flex justify-between">
                        <span>{quantity}x {ticket.name}</span>
                        <span>{formatCurrency(ticket.price * quantity)}</span>
                      </div>
                    )
                  })}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#8e44ad]">{formatCurrency(getTotalAmount())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Método de Pagamento */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-4">Método de Pagamento</h4>
                <RadioGroup value={paymentMethod} onValueChange={(value: 'pix' | 'card') => setPaymentMethod(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      PIX (Aprovação instantânea)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Cartão de Crédito
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <Input
                        placeholder="Número do Cartão"
                        value={cardData.number}
                        onChange={(e) => setCardData({...cardData, number: e.target.value})}
                        maxLength={19}
                      />
                      <Input
                        placeholder="Nome no Cartão"
                        value={cardData.name}
                        onChange={(e) => setCardData({...cardData, name: e.target.value})}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="MM/AA"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                          maxLength={5}
                        />
                        <Input
                          placeholder="CVV"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'pix' && pixCode && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Código PIX:</p>
                    <div className="bg-gray-100 p-3 rounded border text-xs font-mono break-all">
                      {pixCode}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyPixCode}
                      className="mt-2"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Código
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Botões */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('selection')}
                className="flex-1"
                disabled={loading}
              >
                Voltar
              </Button>
              
              <Button
                onClick={handleProcessPayment}
                disabled={loading}
                className="flex-1 bg-[#c2ff28] text-[#8e44ad] hover:bg-[#c2ff28]/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {paymentMethod === 'pix' ? <Smartphone className="w-4 h-4 mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                    Finalizar Pagamento
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <div className="text-center py-8">
              {/* Ícone de Sucesso Animado */}
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Check className="w-10 h-10 text-white" />
              </div>
              
              {/* Título Principal */}
              <h3 className="text-3xl font-bold text-green-600 mb-3">
                🎉 Pagamento Concluído!
              </h3>
              
              {/* Subtítulo */}
              <p className="text-lg text-gray-700 mb-2">
                Sua compra foi processada com sucesso
              </p>
              <p className="text-gray-600 mb-8">
                Os ingressos foram enviados para <span className="font-semibold">{game.team1} vs {game.team2}</span>
              </p>
              
              {/* Card de Detalhes da Compra */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-300 mb-6 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <Ticket className="w-6 h-6 text-green-600 mr-2" />
                    <h4 className="text-lg font-bold text-green-800">Seus Ingressos</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Informações do Jogo */}
                    <div className="bg-white/50 rounded-lg p-4">
                      <div className="text-center mb-3">
                        <h5 className="font-bold text-lg text-gray-800">{game.team1} vs {game.team2}</h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center justify-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatarData(game.date)} às {game.time}
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {game.location}
                          </div>
                        </div>
                        <Badge className="bg-[#8e44ad] text-white mt-2">{game.phase}</Badge>
                      </div>
                    </div>

                    {/* Lista de Ingressos Comprados */}
                    <div className="bg-white/50 rounded-lg p-4">
                      <h6 className="font-semibold text-gray-800 mb-2">Ingressos Adquiridos:</h6>
                      <div className="space-y-2">
                        {ticketTypes.map((ticket) => {
                          const quantity = selectedTickets[ticket.id]
                          if (!quantity) return null
                          
                          return (
                            <div key={ticket.id} className="flex justify-between items-center bg-white rounded p-2">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="font-medium">{quantity}x {ticket.name}</span>
                              </div>
                              <span className="font-bold text-green-600">{formatCurrency(ticket.price * quantity)}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="bg-green-600 text-white rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total Pago:</span>
                        <span className="text-2xl font-bold">{formatCurrency(getTotalAmount())}</span>
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-green-200 text-sm">
                          Método: {paymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informações Importantes */}
              <Card className="bg-blue-50 border-blue-200 mb-6">
                <CardContent className="p-4">
                  <h5 className="font-semibold text-blue-800 mb-3 flex items-center justify-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Próximos Passos
                  </h5>
                  <div className="text-sm text-blue-700 space-y-2 text-left">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>Seus ingressos foram enviados por email com QR Code único</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>Acesse seu perfil para visualizar e gerenciar seus ingressos</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>Apresente o QR Code na entrada do estádio</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>Chegue com pelo menos 30 minutos de antecedência</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Número de Confirmação */}
              <div className="bg-gray-100 rounded-lg p-3 mb-6">
                <p className="text-sm text-gray-600 mb-1">Número de Confirmação:</p>
                <p className="font-mono font-bold text-lg text-gray-800">
                  CPB-{Date.now().toString().slice(-8)}
                </p>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <Button
                onClick={handleClose}
                className="w-full bg-[#8e44ad] hover:bg-[#8e44ad]/90 text-white font-semibold py-3"
              >
                <Check className="w-4 h-4 mr-2" />
                Concluir Compra
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Navegar para o perfil na aba de ingressos
                    window.location.href = '/perfil?tab=tickets'
                    handleClose()
                  }}
                  className="border-[#8e44ad] text-[#8e44ad] hover:bg-[#8e44ad]/10"
                >
                  Ver Meus Ingressos
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    // Aqui você poderia implementar compartilhamento
                    if (navigator.share) {
                      navigator.share({
                        title: 'Ingressos Copa Passa Bola',
                        text: `Comprei ingressos para ${game.team1} vs ${game.team2}!`,
                        url: window.location.href
                      })
                    } else {
                      toast.success('Link copiado para a área de transferência!')
                    }
                  }}
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  Compartilhar
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

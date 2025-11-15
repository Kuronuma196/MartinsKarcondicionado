
import React, { useState, useEffect } from 'react'
import {Trash2, Plus, Minus, ShoppingCart, CreditCard} from 'lucide-react'
import toast from 'react-hot-toast'
import { lumi } from '../lib/lumi'
import { useAuth } from '../hooks/useAuth'

interface CartItem {
  _id: string
  productId: string
  productName: string
  productPrice: number
  quantity: number
  imageUrl: string
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadCartItems()
    }
  }, [user])

  const loadCartItems = async () => {
    try {
      setLoading(true)
      const response = await lumi.entities.cart_items.list()
      setCartItems(response.data || [])
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
      toast.error('Erro ao carregar carrinho')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      await lumi.entities.cart_items.update(itemId, { quantity: newQuantity })
      setCartItems(items =>
        items.map(item =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      )
      toast.success('Quantidade atualizada')
    } catch (error) {
      toast.error('Erro ao atualizar quantidade')
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await lumi.entities.cart_items.delete(itemId)
      setCartItems(items => items.filter(item => item._id !== itemId))
      toast.success('Produto removido do carrinho')
    } catch (error) {
      toast.error('Erro ao remover produto')
    }
  }

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0)
  }

  const getTotal = () => {
    const subtotal = getSubtotal()
    const shipping = subtotal > 500 ? 0 : 50 // Frete grátis acima de R$ 500
    return subtotal + shipping
  }

  const getShipping = () => {
    return getSubtotal() > 500 ? 0 : 50
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Carrinho vazio')
      return
    }
    
    // Aqui você implementaria a integração com gateway de pagamento
    toast.success('Redirecionando para pagamento...')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Faça login para ver seu carrinho</h2>
            <p className="text-gray-600">Você precisa estar logado para acessar seu carrinho de compras.</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando carrinho...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Carrinho de Compras</h1>
          <p className="text-gray-600 mt-2">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'} no carrinho
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">Adicione produtos ao carrinho para continuar comprando.</p>
            <a
              href="/produtos"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Ver Produtos
            </a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Produtos</h2>
                  
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                          <p className="text-green-600 font-semibold">
                            R$ {item.productPrice.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            R$ {(item.productPrice * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeItem(item._id)}
                            className="text-red-500 hover:text-red-700 transition-colors mt-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">R$ {getSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete</span>
                    <span className="font-semibold">
                      {getShipping() === 0 ? 'Grátis' : `R$ ${getShipping().toFixed(2)}`}
                    </span>
                  </div>
                  
                  {getSubtotal() < 500 && (
                    <p className="text-sm text-blue-600">
                      Frete grátis para compras acima de R$ 500,00
                    </p>
                  )}
                  
                  <hr className="my-4" />
                  
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-green-600">R$ {getTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Finalizar Compra
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  Pagamento seguro via cartão de crédito ou PIX
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart


import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {Package, Eye, Truck, CreditCard, Calendar, Filter} from 'lucide-react'
import { lumi } from '../lib/lumi'
import { useAuth } from '../hooks/useAuth'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Order {
  _id: string
  order_number: string
  items: Array<{
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
  }>
  total_amount: number
  shipping_fee: number
  status: string
  payment_status: string
  payment_method: string
  created_at: string
  tracking_code?: string
}

const UserOrders: React.FC = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadUserOrders()
  }, [])

  const loadUserOrders = async () => {
    try {
      setLoading(true)
      const { list } = await lumi.entities.orders.list({
        filter: { user_id: user?.userId },
        sort: { created_at: -1 }
      })
      setOrders(list || [])
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendente',
      paid: 'Pago',
      failed: 'Falhou',
      refunded: 'Reembolsado',
      partially_refunded: 'Parcialmente Reembolsado'
    }
    return statusMap[status] || status
  }

  const getPaymentMethodLabel = (method: string) => {
    const methodMap: Record<string, string> = {
      pix: 'PIX',
      credit_card: 'Cartão de Crédito',
      bank_transfer: 'Transferência Bancária',
      cash: 'Dinheiro'
    }
    return methodMap[method] || method
  }

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true
    return order.status === statusFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Meus Pedidos</h1>
          <p className="text-gray-600">
            Acompanhe o status dos seus pedidos e veja o histórico de compras
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-4 mb-6"
        >
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="confirmed">Confirmado</option>
              <option value="processing">Processando</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhum pedido encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              {statusFilter === 'all' 
                ? 'Você ainda não fez nenhum pedido.'
                : `Nenhum pedido com status "${getStatusLabel(statusFilter)}" encontrado.`
              }
            </p>
            <button
              onClick={() => window.location.href = '/produtos'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Produtos
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Pedido #{order.order_number}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(order.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-1" />
                            {getPaymentMethodLabel(order.payment_method)}
                          </div>
                          {order.tracking_code && (
                            <div className="flex items-center">
                              <Truck className="h-4 w-4 mr-1" />
                              {order.tracking_code}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        R$ {order.total_amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                        className="text-blue-600 hover:text-blue-700 p-2"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</span>
                      <span>Status do pagamento: {getPaymentStatusLabel(order.payment_status)}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map((item, itemIndex) => (
                        <span key={itemIndex} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {item.quantity}x {item.product_name}
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-gray-500 text-sm">
                          +{order.items.length - 3} mais
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {selectedOrder?._id === order._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t mt-4 pt-4"
                    >
                      <h4 className="font-semibold text-gray-900 mb-3">Detalhes do Pedido</h4>
                      
                      <div className="space-y-3 mb-4">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between items-center py-2 border-b last:border-b-0">
                            <div>
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-sm text-gray-600">
                                Quantidade: {item.quantity} × R$ {item.unit_price.toFixed(2)}
                              </p>
                            </div>
                            <p className="font-semibold">
                              R$ {item.total_price.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>R$ {(order.total_amount - order.shipping_fee).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Frete:</span>
                            <span>{order.shipping_fee === 0 ? 'Grátis' : `R$ ${order.shipping_fee.toFixed(2)}`}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span className="text-green-600">R$ {order.total_amount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserOrders

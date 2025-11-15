
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {Search, Filter, Eye, Edit, Package, Truck, CheckCircle, XCircle, DollarSign, Calendar} from 'lucide-react'
import { lumi } from '../../lib/lumi'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'

interface Order {
  _id: string
  user_id: string
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
  shipping_address: any
  tracking_code?: string
  notes: string
  created_at: string
  updated_at: string
}

interface Payment {
  _id: string
  order_id: string
  amount: number
  status: string
  payment_method: string
  refund_amount?: number
  refund_reason?: string
  created_at: string
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [trackingCode, setTrackingCode] = useState('')
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')

  useEffect(() => {
    loadOrders()
    loadPayments()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const { list } = await lumi.entities.orders.list({
        sort: { created_at: -1 }
      })
      setOrders(list || [])
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
      toast.error('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const loadPayments = async () => {
    try {
      const { list } = await lumi.entities.payments.list()
      setPayments(list || [])
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error)
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

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return

    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      }

      if (trackingCode) {
        updateData.tracking_code = trackingCode
      }

      await lumi.entities.orders.update(selectedOrder._id, updateData)
      toast.success('Status do pedido atualizado!')
      setShowStatusModal(false)
      setNewStatus('')
      setTrackingCode('')
      loadOrders()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status')
    }
  }

  const handleRefund = async () => {
    if (!selectedOrder) return

    try {
      const orderPayment = payments.find(p => p.order_id === selectedOrder._id)
      if (!orderPayment) {
        toast.error('Pagamento não encontrado')
        return
      }

      const refundAmountNum = parseFloat(refundAmount)
      if (refundAmountNum <= 0 || refundAmountNum > orderPayment.amount) {
        toast.error('Valor de reembolso inválido')
        return
      }

      // Atualizar pagamento com dados do reembolso
      await lumi.entities.payments.update(orderPayment._id, {
        status: refundAmountNum >= orderPayment.amount ? 'refunded' : 'partially_refunded',
        refund_amount: refundAmountNum,
        refund_reason: refundReason,
        refund_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      // Atualizar status do pedido
      await lumi.entities.orders.update(selectedOrder._id, {
        payment_status: refundAmountNum >= orderPayment.amount ? 'refunded' : 'partially_refunded',
        updated_at: new Date().toISOString()
      })

      toast.success('Reembolso processado com sucesso!')
      setShowRefundModal(false)
      setRefundAmount('')
      setRefundReason('')
      loadOrders()
      loadPayments()
    } catch (error) {
      console.error('Erro ao processar reembolso:', error)
      toast.error('Erro ao processar reembolso')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user_id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Pedidos</h1>
          <p className="text-gray-600">Acompanhe e gerencie todos os pedidos do sistema</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por número do pedido ou usuário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          </div>
          <p className="text-gray-600 mt-4">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
          </p>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{order.order_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                        </div>
                        {order.tracking_code && (
                          <div className="text-sm text-blue-600">
                            📦 {order.tracking_code}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.user_id}</div>
                      <div className="text-sm text-gray-500">{getPaymentMethodLabel(order.payment_method)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        R$ {order.total_amount.toFixed(2)}
                      </div>
                      {order.shipping_fee > 0 && (
                        <div className="text-sm text-gray-500">
                          + R$ {order.shipping_fee.toFixed(2)} frete
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                        order.payment_status === 'refunded' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getPaymentStatusLabel(order.payment_status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(order.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(order.created_at), 'HH:mm', { locale: ptBR })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setNewStatus(order.status)
                            setTrackingCode(order.tracking_code || '')
                            setShowStatusModal(true)
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Atualizar status"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {order.payment_status === 'paid' && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order)
                              setRefundAmount(order.total_amount.toString())
                              setShowRefundModal(true)
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Processar reembolso"
                          >
                            <DollarSign className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Order Details Modal */}
        {selectedOrder && !showStatusModal && !showRefundModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Pedido #{selectedOrder.order_number}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Informações do Pedido</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                            {getStatusLabel(selectedOrder.status)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pagamento:</span>
                          <span>{getPaymentStatusLabel(selectedOrder.payment_status)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Método:</span>
                          <span>{getPaymentMethodLabel(selectedOrder.payment_method)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Data:</span>
                          <span>{format(new Date(selectedOrder.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                        </div>
                        {selectedOrder.tracking_code && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rastreamento:</span>
                            <span className="font-mono">{selectedOrder.tracking_code}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {selectedOrder.shipping_address && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Endereço de Entrega</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700">
                            {selectedOrder.shipping_address.street}<br />
                            {selectedOrder.shipping_address.complement && `${selectedOrder.shipping_address.complement}<br />`}
                            {selectedOrder.shipping_address.neighborhood}<br />
                            {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}<br />
                            CEP: {selectedOrder.shipping_address.zip_code}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Itens do Pedido</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-gray-600">
                              {item.quantity}x R$ {item.unit_price.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-semibold">
                            R$ {item.total_price.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>R$ {(selectedOrder.total_amount - selectedOrder.shipping_fee).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frete:</span>
                          <span>{selectedOrder.shipping_fee === 0 ? 'Grátis' : `R$ ${selectedOrder.shipping_fee.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                          <span>Total:</span>
                          <span className="text-green-600">R$ {selectedOrder.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Observações</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-md w-full"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Atualizar Status - #{selectedOrder.order_number}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Novo Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">Pendente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="processing">Processando</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregue</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>

                  {(newStatus === 'shipped' || newStatus === 'delivered') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código de Rastreamento
                      </label>
                      <input
                        type="text"
                        value={trackingCode}
                        onChange={(e) => setTrackingCode(e.target.value)}
                        placeholder="Ex: BR123456789"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Atualizar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Refund Modal */}
        {showRefundModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-md w-full"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Processar Reembolso - #{selectedOrder.order_number}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor do Reembolso
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      max={selectedOrder.total_amount}
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Máximo: R$ {selectedOrder.total_amount.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Motivo do Reembolso
                    </label>
                    <textarea
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descreva o motivo do reembolso..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowRefundModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleRefund}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Processar Reembolso
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders

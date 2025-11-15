
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, Link } from 'react-router-dom'
import {CheckCircle, Package, Clock, Phone, MessageCircleDashed as MessageCircle, Mail, Calendar, CreditCard, MapPin, User, ArrowRight, Star, Shield} from 'lucide-react'
import { lumi } from '../lib/lumi'

interface Order {
  _id: string
  customer_info: {
    full_name: string
    email: string
    phone: string
  }
  total_amount: number
  payment_method: string
  status: string
  created_at: string
  items: Array<{
    name: string
    price: number
    quantity: number
  }>
}

const OrderSuccess: React.FC = () => {
  const location = useLocation()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  
  const orderId = location.state?.orderId

  useEffect(() => {
    if (orderId) {
      loadOrder()
    } else {
      setLoading(false)
    }
  }, [orderId])

  const loadOrder = async () => {
    try {
      const orderData = await lumi.entities.orders.get(orderId)
      setOrder(orderData)
    } catch (error) {
      console.error('Erro ao carregar pedido:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      'presencial_pix': 'PIX Presencial',
      'presencial_cartao': 'Cartão Presencial',
      'presencial_dinheiro': 'Dinheiro Presencial'
    }
    return methods[method] || method
  }

  const nextSteps = [
    {
      icon: Phone,
      title: 'Confirmação por Telefone',
      description: 'Nossa equipe entrará em contato em até 2 horas para confirmar os detalhes',
      time: 'Em até 2 horas'
    },
    {
      icon: Calendar,
      title: 'Agendamento da Entrega',
      description: 'Combinaremos o melhor horário para entrega e instalação (se aplicável)',
      time: 'Após confirmação'
    },
    {
      icon: Package,
      title: 'Entrega e Pagamento',
      description: 'Entrega do produto no local combinado com pagamento presencial',
      time: 'Data agendada'
    },
    {
      icon: Star,
      title: 'Pós-Venda',
      description: 'Acompanhamento e suporte técnico para garantir sua satisfação',
      time: 'Sempre disponível'
    }
  ]

  const contactMethods = [
    {
      icon: Phone,
      title: 'Telefone',
      value: '(43) 98837-9365',
      action: 'tel:(43)98837-9365',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: '(43) 98837-9365',
      action: 'https://wa.me/5543988379365',
      color: 'from-green-600 to-green-700'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'martinskarcondicionado@gmail.com',
      action: 'mailto:martinskarcondicionado@gmail.com',
      color: 'from-blue-500 to-blue-600'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <CheckCircle className="h-20 w-20 text-white" />
            </motion.div>
            
            {/* Confetti Animation */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 1, 
                    y: 0, 
                    x: Math.random() * 400 - 200,
                    rotate: 0 
                  }}
                  animate={{ 
                    opacity: 0, 
                    y: -200, 
                    rotate: 360 
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: Math.random() * 0.5,
                    ease: "easeOut"
                  }}
                  className="absolute top-16 left-1/2 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                />
              ))}
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Pedido Realizado com Sucesso! 🎉
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-6"
          >
            Obrigado por escolher a Martins Refrigeração!
          </motion.p>

          {order && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block"
            >
              <p className="text-green-800 font-medium">
                Número do Pedido: <span className="font-bold">#{order._id.slice(-8).toUpperCase()}</span>
              </p>
              <p className="text-green-700 text-sm">
                Criado em {new Date(order.created_at).toLocaleString('pt-BR')}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Package className="h-6 w-6 mr-2" />
              Detalhes do Pedido
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Itens do Pedido</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-gray-900">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">R$ {order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Customer & Payment Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Dados do Cliente
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><span className="font-medium">Nome:</span> {order.customer_info.full_name}</p>
                    <p><span className="font-medium">Email:</span> {order.customer_info.email}</p>
                    <p><span className="font-medium">Telefone:</span> {order.customer_info.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Forma de Pagamento
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-medium text-blue-900">{getPaymentMethodName(order.payment_method)}</p>
                    <p className="text-blue-700 text-sm mt-1">
                      Pagamento será realizado no momento da entrega
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Important Information */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 mb-8"
        >
          <div className="flex items-start space-x-4">
            <Clock className="h-8 w-8 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-4">Informações Importantes</h3>
              <div className="space-y-3 text-blue-100">
                <p className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Nossa equipe entrará em contato em até 2 horas
                </p>
                <p className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Agendaremos a entrega conforme sua disponibilidade
                </p>
                <p className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Pagamento realizado presencialmente na entrega
                </p>
                <p className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Instalação incluída (quando aplicável)
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Próximos Passos</h2>
          
          <div className="space-y-6">
            {nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <step.icon className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600 mb-2">{step.description}</p>
                  <span className="text-sm text-green-600 font-medium">{step.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Precisa Falar Conosco?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.action}
                target={method.action.startsWith('http') ? '_blank' : undefined}
                rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="text-center p-6 border-2 border-gray-200 rounded-xl hover:shadow-lg transition-all group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <method.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600">{method.value}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/meus-pedidos"
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-medium flex items-center justify-center"
          >
            <Package className="h-5 w-5 mr-2" />
            Ver Meus Pedidos
          </Link>
          
          <Link
            to="/produtos"
            className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg hover:bg-green-600 hover:text-white transition-all font-medium flex items-center justify-center"
          >
            Continuar Comprando
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </motion.div>

        {/* Guarantee Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.7 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-full px-6 py-3">
            <Shield className="h-6 w-6 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              Compra 100% Garantida - Martins Refrigeração
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default OrderSuccess

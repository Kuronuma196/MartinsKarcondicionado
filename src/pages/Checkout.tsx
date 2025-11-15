
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {CreditCard, MapPin, User, Phone, Mail, ShoppingCart, AlertCircle, CheckCircle, Clock, Store, Banknote, Smartphone} from 'lucide-react'
import { lumi } from '../lib/lumi'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

interface CheckoutForm {
  full_name: string
  email: string
  phone: string
  cpf: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  payment_method: 'presencial_dinheiro' | 'presencial_cartao' | 'presencial_pix'
  notes: string
}

interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  image_url: string
}

const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: {
      payment_method: 'presencial_pix'
    }
  })

  const selectedPaymentMethod = watch('payment_method')

  useEffect(() => {
    loadUserData()
    loadCartItems()
  }, [])

  const loadUserData = async () => {
    try {
      const { list } = await lumi.entities.user_profiles.list({
        filter: { user_id: user?.userId }
      })
      
      if (list && list.length > 0) {
        const profile = list[0]
        setValue('full_name', profile.full_name || user?.userName || '')
        setValue('email', user?.email || '')
        setValue('phone', profile.phone || '')
        setValue('cpf', profile.cpf || '')
        
        if (profile.address) {
          setValue('street', profile.address.street || '')
          setValue('number', profile.address.number || '')
          setValue('complement', profile.address.complement || '')
          setValue('neighborhood', profile.address.neighborhood || '')
          setValue('city', profile.address.city || '')
          setValue('state', profile.address.state || '')
          setValue('zip_code', profile.address.zip_code || '')
        }
      } else {
        setValue('full_name', user?.userName || '')
        setValue('email', user?.email || '')
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
    }
  }

  const loadCartItems = async () => {
    try {
      // Simular itens do carrinho - em uma implementação real, 
      // isso viria do estado global ou localStorage
      const mockItems: CartItem[] = [
        {
          _id: '1',
          name: 'Ar-Condicionado Split 12.000 BTUs',
          price: 1299.99,
          quantity: 1,
          image_url: 'https://images.pexels.com/photos/4112236/pexels-photo-4112236.jpeg'
        }
      ]
      
      setCartItems(mockItems)
      const calculatedTotal = mockItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      setTotal(calculatedTotal)
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
    }
  }

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true)
    try {
      // Criar o pedido
      const orderData = {
        user_id: user?.userId,
        customer_info: {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          cpf: data.cpf
        },
        shipping_address: {
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code
        },
        items: cartItems.map(item => ({
          product_id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total_amount: total,
        payment_method: data.payment_method,
        payment_status: 'pending',
        status: 'pending',
        notes: data.notes,
        created_at: new Date().toISOString()
      }

      const order = await lumi.entities.orders.create(orderData)

      // Criar registro de pagamento
      await lumi.entities.payments.create({
        order_id: order._id,
        user_id: user?.userId,
        amount: total,
        payment_method: data.payment_method,
        status: 'pending',
        payment_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      })

      toast.success('Pedido criado com sucesso!')
      navigate('/pedido-sucesso', { state: { orderId: order._id } })
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      toast.error('Erro ao processar pedido')
    } finally {
      setLoading(false)
    }
  }

  const paymentMethods = [
    {
      id: 'presencial_pix',
      name: 'PIX Presencial',
      description: 'Pagamento via PIX no momento da entrega/retirada',
      icon: Smartphone,
      popular: true
    },
    {
      id: 'presencial_cartao',
      name: 'Cartão Presencial',
      description: 'Pagamento com cartão no momento da entrega/retirada',
      icon: CreditCard,
      popular: false
    },
    {
      id: 'presencial_dinheiro',
      name: 'Dinheiro Presencial',
      description: 'Pagamento em dinheiro no momento da entrega/retirada',
      icon: Banknote,
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Pedido</h1>
          <p className="text-gray-600">Confirme seus dados e escolha a forma de pagamento</p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Dados Pessoais
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    {...register('full_name', { required: 'Nome é obrigatório' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.full_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('email', { required: 'Email é obrigatório' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <input
                    {...register('phone', { required: 'Telefone é obrigatório' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <input
                    {...register('cpf')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Endereço de Entrega
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP *
                  </label>
                  <input
                    {...register('zip_code', { required: 'CEP é obrigatório' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.zip_code && (
                    <p className="text-red-500 text-sm mt-1">{errors.zip_code.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rua *
                  </label>
                  <input
                    {...register('street', { required: 'Rua é obrigatória' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número *
                  </label>
                  <input
                    {...register('number', { required: 'Número é obrigatório' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.number && (
                    <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    {...register('complement')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro *
                  </label>
                  <input
                    {...register('neighborhood', { required: 'Bairro é obrigatório' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.neighborhood && (
                    <p className="text-red-500 text-sm mt-1">{errors.neighborhood.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade *
                  </label>
                  <input
                    {...register('city', { required: 'Cidade é obrigatória' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado *
                  </label>
                  <select
                    {...register('state', { required: 'Estado é obrigatório' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    <option value="PR">Paraná</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Forma de Pagamento
              </h2>

              {/* Important Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Store className="h-6 w-6 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">Pagamento Presencial</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      Todos os pagamentos são realizados presencialmente no momento da entrega ou retirada do produto. 
                      Nossa equipe entrará em contato para agendar e confirmar os detalhes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedPaymentMethod === method.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={method.id}
                      {...register('payment_method')}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-4 flex-1">
                      <method.icon className={`h-6 w-6 ${
                        selectedPaymentMethod === method.id ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{method.name}</span>
                          {method.popular && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Recomendado
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    {selectedPaymentMethod === method.id && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </label>
                ))}
              </div>

              {/* Additional Notes */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="Instruções especiais para entrega, horário preferido, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6 sticky top-8"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Resumo do Pedido
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Entrega</span>
                  <span>A combinar</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Process Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-900">Próximos Passos</h3>
                    <p className="text-yellow-700 text-sm mt-1">
                      Após confirmar o pedido, nossa equipe entrará em contato em até 2 horas 
                      para agendar a entrega e confirmar a forma de pagamento.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
              >
                {loading ? 'Processando...' : 'Confirmar Pedido'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Ao confirmar o pedido, você concorda com nossos termos de serviço
              </p>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout

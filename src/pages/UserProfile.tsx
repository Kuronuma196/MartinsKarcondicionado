
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {User, MapPin, Bell, Save, Camera, Edit3, Lock, CreditCard, Package, Star, Calendar, Phone, Mail, Shield, Settings, Eye, EyeOff} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { lumi } from '../lib/lumi'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

interface ProfileForm {
  full_name: string
  phone: string
  cpf: string
  birth_date: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  newsletter: boolean
  sms_notifications: boolean
  email_notifications: boolean
}

interface UserStats {
  totalOrders: number
  totalSpent: number
  favoriteCategory: string
  memberSince: string
}

const UserProfile: React.FC = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [profileId, setProfileId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'orders' | 'preferences'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [userStats, setUserStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    favoriteCategory: 'Ar-Condicionado',
    memberSince: ''
  })
  const [showSensitiveData, setShowSensitiveData] = useState(false)
  
  const { register, handleSubmit, setValue, watch, formState: { errors, isDirty } } = useForm<ProfileForm>()

  useEffect(() => {
    loadUserProfile()
    loadUserStats()
  }, [])

  const loadUserProfile = async () => {
    try {
      const { list } = await lumi.entities.user_profiles.list({
        filter: { user_id: user?.userId }
      })
      
      if (list && list.length > 0) {
        const profile = list[0]
        setProfileId(profile._id)
        
        setValue('full_name', profile.full_name || '')
        setValue('phone', profile.phone || '')
        setValue('cpf', profile.cpf || '')
        setValue('birth_date', profile.birth_date ? profile.birth_date.split('T')[0] : '')
        
        if (profile.address) {
          setValue('street', profile.address.street || '')
          setValue('number', profile.address.number || '')
          setValue('complement', profile.address.complement || '')
          setValue('neighborhood', profile.address.neighborhood || '')
          setValue('city', profile.address.city || '')
          setValue('state', profile.address.state || '')
          setValue('zip_code', profile.address.zip_code || '')
        }
        
        if (profile.preferences) {
          setValue('newsletter', profile.preferences.newsletter || false)
          setValue('sms_notifications', profile.preferences.sms_notifications || false)
          setValue('email_notifications', profile.preferences.email_notifications || false)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }

  const loadUserStats = async () => {
    try {
      const { list: orders } = await lumi.entities.orders.list({
        filter: { user_id: user?.userId }
      })

      if (orders && orders.length > 0) {
        const totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
        setUserStats({
          totalOrders: orders.length,
          totalSpent,
          favoriteCategory: 'Ar-Condicionado',
          memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'
        })
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true)
    try {
      const profileData = {
        user_id: user?.userId,
        full_name: data.full_name,
        phone: data.phone,
        cpf: data.cpf,
        birth_date: data.birth_date ? `${data.birth_date}T00:00:00.000Z` : '',
        address: {
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code
        },
        preferences: {
          newsletter: data.newsletter,
          sms_notifications: data.sms_notifications,
          email_notifications: data.email_notifications
        },
        updated_at: new Date().toISOString()
      }

      if (profileId) {
        await lumi.entities.user_profiles.update(profileId, profileData)
        toast.success('Perfil atualizado com sucesso!')
      } else {
        const newProfile = await lumi.entities.user_profiles.create({
          ...profileData,
          role: 'client',
          creator: 'user',
          created_at: new Date().toISOString()
        })
        setProfileId(newProfile._id)
        toast.success('Perfil criado com sucesso!')
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      toast.error('Erro ao salvar perfil')
    } finally {
      setLoading(false)
    }
  }

  const formatCPF = (cpf: string) => {
    if (!showSensitiveData) {
      return cpf ? `***.***.***-${cpf.slice(-2)}` : 'Não informado'
    }
    return cpf || 'Não informado'
  }

  const formatPhone = (phone: string) => {
    if (!showSensitiveData) {
      return phone ? `(**) ****-${phone.slice(-4)}` : 'Não informado'
    }
    return phone || 'Não informado'
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'orders', label: 'Pedidos', icon: Package },
    { id: 'preferences', label: 'Preferências', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border hover:shadow-xl transition-shadow">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user?.userName}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <p className="text-gray-600">{user?.email}</p>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {user?.userRole === 'ADMIN' ? 'Administrador' : 'Cliente'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Membro desde {userStats.memberSince}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mt-6 md:mt-0">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{userStats.totalOrders}</div>
                <div className="text-sm text-green-700">Pedidos</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">R$ {userStats.totalSpent.toFixed(2)}</div>
                <div className="text-sm text-blue-700">Total Gasto</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Informações Pessoais</h2>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowSensitiveData(!showSensitiveData)}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="text-sm">{showSensitiveData ? 'Ocultar' : 'Mostrar'} dados</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo
                      </label>
                      <input
                        {...register('full_name')}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        {...register('birth_date')}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      {isEditing ? (
                        <input
                          {...register('phone')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{formatPhone(watch('phone'))}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CPF
                      </label>
                      {isEditing ? (
                        <input
                          {...register('cpf')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                          <span>{formatCPF(watch('cpf'))}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Endereço
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                        <input
                          {...register('zip_code')}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                        <input
                          {...register('street')}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                        <input
                          {...register('number')}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                        <input
                          {...register('complement')}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                        <input
                          {...register('neighborhood')}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                        <input
                          {...register('city')}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <select
                          {...register('state')}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        >
                          <option value="">Selecione</option>
                          <option value="PR">Paraná</option>
                          <option value="SP">São Paulo</option>
                          <option value="RJ">Rio de Janeiro</option>
                          <option value="MG">Minas Gerais</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !isDirty}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>{loading ? 'Salvando...' : 'Salvar Alterações'}</span>
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">Segurança</h2>
                
                <div className="grid gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Autenticação</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Sua conta está protegida pela autenticação do Google
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-green-600">
                        <Shield className="h-5 w-5" />
                        <span className="text-sm font-medium">Protegido</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Sessões Ativas</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Gerencie onde você está conectado
                        </p>
                      </div>
                      <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        Ver Sessões
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Histórico de Pedidos</h2>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Ver Todos os Pedidos
                  </button>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {userStats.totalOrders === 0 ? 'Nenhum pedido ainda' : `${userStats.totalOrders} pedidos realizados`}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {userStats.totalOrders === 0 
                      ? 'Explore nossos produtos e faça seu primeiro pedido'
                      : 'Acesse seu histórico completo de pedidos'
                    }
                  </p>
                  <button 
                    onClick={() => window.location.href = userStats.totalOrders === 0 ? '/produtos' : '/meus-pedidos'}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {userStats.totalOrders === 0 ? 'Ver Produtos' : 'Ver Pedidos'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Preferências de Notificação
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">Newsletter</span>
                      <p className="text-sm text-gray-600">Receba novidades e promoções por email</p>
                    </div>
                    <input
                      type="checkbox"
                      {...register('newsletter')}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">Notificações por SMS</span>
                      <p className="text-sm text-gray-600">Receba atualizações de pedidos por SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      {...register('sms_notifications')}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">Notificações por Email</span>
                      <p className="text-sm text-gray-600">Receba confirmações e atualizações por email</p>
                    </div>
                    <input
                      type="checkbox"
                      {...register('email_notifications')}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </label>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Salvando...' : 'Salvar Preferências'}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile

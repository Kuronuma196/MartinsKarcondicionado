
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {Search, Filter, Eye, Mail, Phone, MapPin, Calendar, User} from 'lucide-react'
import { lumi } from '../../lib/lumi'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface UserProfile {
  _id: string
  user_id: string
  full_name: string
  phone: string
  cpf: string
  birth_date: string
  address: {
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
    zip_code: string
  }
  preferences: {
    newsletter: boolean
    sms_notifications: boolean
    email_notifications: boolean
  }
  avatar_url: string
  created_at: string
  updated_at: string
}

interface UserOrder {
  _id: string
  user_id: string
  order_number: string
  total_amount: number
  status: string
  created_at: string
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [orders, setOrders] = useState<UserOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showUserModal, setShowUserModal] = useState(false)

  useEffect(() => {
    loadUsers()
    loadOrders()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const { list } = await lumi.entities.user_profiles.list({
        sort: { created_at: -1 }
      })
      setUsers(list || [])
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadOrders = async () => {
    try {
      const { list } = await lumi.entities.orders.list()
      setOrders(list || [])
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
    }
  }

  const getUserOrders = (userId: string) => {
    return orders.filter(order => order.user_id === userId)
  }

  const getUserTotalSpent = (userId: string) => {
    const userOrders = getUserOrders(userId)
    return userOrders.reduce((total, order) => total + order.total_amount, 0)
  }

  const getLastOrderDate = (userId: string) => {
    const userOrders = getUserOrders(userId).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    return userOrders.length > 0 ? userOrders[0].created_at : null
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase()
    return (
      user.full_name?.toLowerCase().includes(searchLower) ||
      user.phone?.toLowerCase().includes(searchLower) ||
      user.cpf?.toLowerCase().includes(searchLower) ||
      user.user_id.toLowerCase().includes(searchLower)
    )
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Usuários</h1>
          <p className="text-gray-600">Visualize e gerencie informações dos usuários</p>
        </motion.div>

        {/* Search */}
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
                  placeholder="Pesquisar por nome, telefone, CPF ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-4">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'usuário encontrado' : 'usuários encontrados'}
          </p>
        </motion.div>

        {/* Users Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredUsers.map((user) => {
            const userOrders = getUserOrders(user.user_id)
            const totalSpent = getUserTotalSpent(user.user_id)
            const lastOrderDate = getLastOrderDate(user.user_id)

            return (
              <div key={user._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  {/* User Avatar and Basic Info */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {user.full_name || 'Nome não informado'}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {user.user_id}</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    {user.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {user.phone}
                      </div>
                    )}
                    {user.address && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {user.address.city}, {user.address.state}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Cadastro: {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                  </div>

                  {/* Order Stats */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{userOrders.length}</p>
                        <p className="text-sm text-gray-600">Pedidos</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          R$ {totalSpent.toFixed(0)}
                        </p>
                        <p className="text-sm text-gray-600">Total Gasto</p>
                      </div>
                    </div>
                    {lastOrderDate && (
                      <div className="text-center mt-2">
                        <p className="text-sm text-gray-600">
                          Último pedido: {format(new Date(lastOrderDate), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Preferences */}
                  {user.preferences && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preferências:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.preferences.newsletter && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Newsletter
                          </span>
                        )}
                        {user.preferences.sms_notifications && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            SMS
                          </span>
                        )}
                        {user.preferences.email_notifications && (
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            Email
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      setSelectedUser(user)
                      setShowUserModal(true)
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </button>
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Detalhes do Usuário
                  </h2>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                          {selectedUser.avatar_url ? (
                            <img
                              src={selectedUser.avatar_url}
                              alt={selectedUser.full_name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-8 w-8 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{selectedUser.full_name || 'Nome não informado'}</h4>
                          <p className="text-gray-600">ID: {selectedUser.user_id}</p>
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">CPF:</span>
                        <span className="ml-2 text-gray-600">{selectedUser.cpf || 'Não informado'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Telefone:</span>
                        <span className="ml-2 text-gray-600">{selectedUser.phone || 'Não informado'}</span>
                      </div>
                      {selectedUser.birth_date && (
                        <div>
                          <span className="font-medium text-gray-700">Data de Nascimento:</span>
                          <span className="ml-2 text-gray-600">
                            {format(new Date(selectedUser.birth_date), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-700">Cadastro:</span>
                        <span className="ml-2 text-gray-600">
                          {format(new Date(selectedUser.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                    </div>

                    {/* Address */}
                    {selectedUser.address && (
                      <div className="mt-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Endereço</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700">
                            {selectedUser.address.street}, {selectedUser.address.number}<br />
                            {selectedUser.address.complement && `${selectedUser.address.complement}<br />`}
                            {selectedUser.address.neighborhood}<br />
                            {selectedUser.address.city}, {selectedUser.address.state}<br />
                            CEP: {selectedUser.address.zip_code}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Orders and Preferences */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Histórico de Pedidos</h3>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="grid grid-cols-2 gap-4 text-center mb-4">
                        <div>
                          <p className="text-3xl font-bold text-blue-600">{getUserOrders(selectedUser.user_id).length}</p>
                          <p className="text-sm text-gray-600">Total de Pedidos</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-green-600">
                            R$ {getUserTotalSpent(selectedUser.user_id).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">Total Gasto</p>
                        </div>
                      </div>

                      {/* Recent Orders */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700">Pedidos Recentes:</h4>
                        {getUserOrders(selectedUser.user_id).slice(0, 5).map((order) => (
                          <div key={order._id} className="flex justify-between items-center py-1 border-b last:border-b-0">
                            <span className="text-sm font-mono">#{order.order_number}</span>
                            <span className="text-sm text-gray-600">R$ {order.total_amount.toFixed(2)}</span>
                            <span className="text-sm text-gray-500">
                              {format(new Date(order.created_at), 'dd/MM', { locale: ptBR })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preferences */}
                    {selectedUser.preferences && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Preferências de Comunicação</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Newsletter</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedUser.preferences.newsletter 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {selectedUser.preferences.newsletter ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Notificações SMS</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedUser.preferences.sms_notifications 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {selectedUser.preferences.sms_notifications ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Notificações Email</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedUser.preferences.email_notifications 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {selectedUser.preferences.email_notifications ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers

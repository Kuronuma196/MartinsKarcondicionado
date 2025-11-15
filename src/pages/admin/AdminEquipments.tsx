
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {Plus, Edit, Trash2, Search, Filter, Settings, DollarSign, Clock, AlertTriangle, CheckCircle, X, Save} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { lumi } from '../../lib/lumi'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'

interface Equipment {
  _id: string
  name: string
  description: string
  category: string
  purchase_price: number
  current_value: number
  depreciation_rate: number
  maintenance_cost: number
  usage_hours: number
  cost_per_hour: number
  status: string
  purchase_date: string
  last_maintenance?: string
  next_maintenance?: string
  supplier: string
  serial_number: string
  warranty_expiry?: string
  location: string
  responsible_admin: string
  notes: string
  created_at: string
  updated_at: string
}

interface EquipmentForm {
  name: string
  description: string
  category: string
  purchase_price: number
  current_value: number
  depreciation_rate: number
  maintenance_cost: number
  usage_hours: number
  cost_per_hour: number
  status: string
  purchase_date: string
  last_maintenance?: string
  next_maintenance?: string
  supplier: string
  serial_number: string
  warranty_expiry?: string
  location: string
  responsible_admin: string
  notes: string
}

const AdminEquipments: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EquipmentForm>()

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'ferramentas', label: 'Ferramentas' },
    { value: 'equipamentos', label: 'Equipamentos' },
    { value: 'materiais', label: 'Materiais' },
    { value: 'consumiveis', label: 'Consumíveis' }
  ]

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'disponivel', label: 'Disponível' },
    { value: 'em_uso', label: 'Em Uso' },
    { value: 'manutencao', label: 'Em Manutenção' },
    { value: 'inativo', label: 'Inativo' }
  ]

  useEffect(() => {
    loadEquipments()
  }, [])

  const loadEquipments = async () => {
    try {
      setLoading(true)
      const { list } = await lumi.entities.service_equipment.list({
        sort: { created_at: -1 }
      })
      setEquipments(list || [])
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error)
      toast.error('Erro ao carregar equipamentos')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: EquipmentForm) => {
    try {
      const equipmentData = {
        ...data,
        purchase_price: Number(data.purchase_price),
        current_value: Number(data.current_value),
        depreciation_rate: Number(data.depreciation_rate),
        maintenance_cost: Number(data.maintenance_cost),
        usage_hours: Number(data.usage_hours),
        cost_per_hour: Number(data.cost_per_hour),
        updated_at: new Date().toISOString()
      }

      if (editingEquipment) {
        await lumi.entities.service_equipment.update(editingEquipment._id, equipmentData)
        toast.success('Equipamento atualizado com sucesso!')
      } else {
        await lumi.entities.service_equipment.create({
          ...equipmentData,
          created_at: new Date().toISOString()
        })
        toast.success('Equipamento criado com sucesso!')
      }

      setShowForm(false)
      setEditingEquipment(null)
      reset()
      loadEquipments()
    } catch (error) {
      console.error('Erro ao salvar equipamento:', error)
      toast.error('Erro ao salvar equipamento')
    }
  }

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipment(equipment)
    Object.keys(equipment).forEach(key => {
      if (key !== '_id' && key !== 'created_at' && key !== 'updated_at') {
        setValue(key as keyof EquipmentForm, equipment[key as keyof Equipment] as any)
      }
    })
    setShowForm(true)
  }

  const handleDelete = async (equipmentId: string, equipmentName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o equipamento "${equipmentName}"?`)) {
      return
    }

    try {
      await lumi.entities.service_equipment.delete(equipmentId)
      toast.success('Equipamento excluído com sucesso!')
      loadEquipments()
    } catch (error) {
      console.error('Erro ao excluir equipamento:', error)
      toast.error('Erro ao excluir equipamento')
    }
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      disponivel: 'bg-green-100 text-green-800',
      em_uso: 'bg-blue-100 text-blue-800',
      manutencao: 'bg-yellow-100 text-yellow-800',
      inativo: 'bg-gray-100 text-gray-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labelMap: Record<string, string> = {
      disponivel: 'Disponível',
      em_uso: 'Em Uso',
      manutencao: 'Em Manutenção',
      inativo: 'Inativo'
    }
    return labelMap[status] || status
  }

  const getCategoryLabel = (category: string) => {
    const labelMap: Record<string, string> = {
      ferramentas: 'Ferramentas',
      equipamentos: 'Equipamentos',
      materiais: 'Materiais',
      consumiveis: 'Consumíveis'
    }
    return labelMap[category] || category
  }

  const calculateDepreciation = (equipment: Equipment) => {
    const purchaseDate = new Date(equipment.purchase_date)
    const now = new Date()
    const yearsOld = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
    const depreciatedValue = equipment.purchase_price * (1 - (equipment.depreciation_rate / 100) * yearsOld)
    return Math.max(depreciatedValue, 0)
  }

  const filteredEquipments = equipments.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || equipment.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || equipment.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalEquipmentValue = equipments.reduce((sum, eq) => sum + eq.current_value, 0)
  const totalMaintenanceCost = equipments.reduce((sum, eq) => sum + eq.maintenance_cost, 0)
  const totalUsageHours = equipments.reduce((sum, eq) => sum + eq.usage_hours, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Equipamentos</h1>
            <p className="text-gray-600">Controle de equipamentos e custos operacionais</p>
          </div>
          <button
            onClick={() => {
              setEditingEquipment(null)
              reset()
              setShowForm(true)
            }}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Equipamento
          </button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Equipamentos</p>
                <p className="text-2xl font-bold text-gray-900">{equipments.length}</p>
              </div>
              <Settings className="h-8 w-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-green-600">R$ {totalEquipmentValue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Custo Manutenção</p>
                <p className="text-2xl font-bold text-orange-600">R$ {totalMaintenanceCost.toFixed(2)}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Horas de Uso</p>
                <p className="text-2xl font-bold text-purple-600">{totalUsageHours.toFixed(0)}h</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar equipamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-gray-600 mt-4">
            {filteredEquipments.length} {filteredEquipments.length === 1 ? 'equipamento encontrado' : 'equipamentos encontrados'}
          </p>
        </motion.div>

        {/* Equipment Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uso/Custo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEquipments.map((equipment) => (
                  <tr key={equipment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {equipment.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          S/N: {equipment.serial_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {equipment.supplier}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {getCategoryLabel(equipment.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        R$ {equipment.current_value.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Compra: R$ {equipment.purchase_price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Depreciação: {equipment.depreciation_rate}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(equipment.status)}`}>
                        {getStatusLabel(equipment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {equipment.usage_hours}h de uso
                      </div>
                      <div className="text-sm text-gray-500">
                        R$ {equipment.cost_per_hour.toFixed(2)}/h
                      </div>
                      <div className="text-sm text-gray-500">
                        Manutenção: R$ {equipment.maintenance_cost.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(equipment)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(equipment._id, equipment.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Equipment Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingEquipment ? 'Editar Equipamento' : 'Novo Equipamento'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setEditingEquipment(null)
                      reset()
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Equipamento *
                      </label>
                      <input
                        {...register('name', { required: 'Nome é obrigatório' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria *
                      </label>
                      <select
                        {...register('category', { required: 'Categoria é obrigatória' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Selecione</option>
                        {categories.slice(1).map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço de Compra *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('purchase_price', { required: 'Preço de compra é obrigatório', min: 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      {errors.purchase_price && (
                        <p className="text-red-500 text-sm mt-1">{errors.purchase_price.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor Atual *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('current_value', { required: 'Valor atual é obrigatório', min: 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      {errors.current_value && (
                        <p className="text-red-500 text-sm mt-1">{errors.current_value.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Taxa de Depreciação (% ao ano)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('depreciation_rate', { min: 0, max: 100 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Custo de Manutenção
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('maintenance_cost', { min: 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Horas de Uso
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        {...register('usage_hours', { min: 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Custo por Hora
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('cost_per_hour', { min: 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status *
                      </label>
                      <select
                        {...register('status', { required: 'Status é obrigatório' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Selecione</option>
                        {statusOptions.slice(1).map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      {errors.status && (
                        <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Compra
                      </label>
                      <input
                        type="date"
                        {...register('purchase_date')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fornecedor
                      </label>
                      <input
                        {...register('supplier')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Série
                      </label>
                      <input
                        {...register('serial_number')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Localização
                      </label>
                      <input
                        {...register('location')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Administrador Responsável
                      </label>
                      <select
                        {...register('responsible_admin')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Selecione</option>
                        <option value="kuronumadeal@gmail.com">kuronumadeal@gmail.com</option>
                        <option value="martinskarcondicionado@gmail.com">martinskarcondicionado@gmail.com</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Última Manutenção
                      </label>
                      <input
                        type="date"
                        {...register('last_maintenance')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Próxima Manutenção
                      </label>
                      <input
                        type="date"
                        {...register('next_maintenance')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vencimento da Garantia
                      </label>
                      <input
                        type="date"
                        {...register('warranty_expiry')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observações
                    </label>
                    <textarea
                      {...register('notes')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setEditingEquipment(null)
                        reset()
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingEquipment ? 'Atualizar' : 'Criar'} Equipamento
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminEquipments

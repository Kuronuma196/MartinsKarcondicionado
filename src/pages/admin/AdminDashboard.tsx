
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  ComposedChart,
  Legend
} from 'recharts'
import {Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown, Calendar, Eye, Settings, AlertTriangle, CheckCircle, Clock, Target, Activity, Award} from 'lucide-react'
import { lumi } from '../../lib/lumi'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalUsers: number
  totalEquipments: number
  totalEquipmentCosts: number
  monthlyGrowth: number
  orderGrowth: number
  netProfit: number
  averageOrderValue: number
  conversionRate: number
  customerRetention: number
}

interface ChartData {
  name: string
  value: number
  revenue?: number
  expenses?: number
  profit?: number
  orders?: number
  customers?: number
}

interface MetricCard {
  title: string
  value: string | number
  change: number
  icon: any
  color: string
  format: 'currency' | 'number' | 'percentage'
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalEquipments: 0,
    totalEquipmentCosts: 0,
    monthlyGrowth: 0,
    orderGrowth: 0,
    netProfit: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    customerRetention: 0
  })
  
  const [revenueData, setRevenueData] = useState<ChartData[]>([])
  const [profitAnalysis, setProfitAnalysis] = useState<ChartData[]>([])
  const [orderStatusData, setOrderStatusData] = useState<ChartData[]>([])
  const [productPerformance, setProductPerformance] = useState<ChartData[]>([])
  const [customerGrowth, setCustomerGrowth] = useState<ChartData[]>([])
  const [equipmentEfficiency, setEquipmentEfficiency] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const [ordersResponse, productsResponse, usersResponse, equipmentsResponse] = await Promise.all([
        lumi.entities.orders.list(),
        lumi.entities.products.list(),
        lumi.entities.user_profiles.list(),
        lumi.entities.service_equipment.list()
      ])

      const orders = ordersResponse.list || []
      const products = productsResponse.list || []
      const users = usersResponse.list || []
      const equipments = equipmentsResponse.list || []

      // Calcular métricas avançadas
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
      const totalEquipmentCosts = equipments.reduce((sum, eq) => 
        sum + (eq.maintenance_cost || 0) + (eq.usage_hours || 0) * (eq.cost_per_hour || 0), 0
      )
      const netProfit = totalRevenue - totalEquipmentCosts
      const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

      // Calcular crescimento mensal
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      
      const currentMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at)
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
      })
      
      const lastMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at)
        return orderDate.getMonth() === currentMonth - 1 && orderDate.getFullYear() === currentYear
      })

      const monthlyGrowth = lastMonthOrders.length > 0 
        ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
        : 0

      // Calcular taxa de conversão simulada
      const conversionRate = users.length > 0 ? (orders.length / users.length) * 100 : 0
      
      // Calcular retenção de clientes simulada
      const customerRetention = orders.length > 10 ? 75 : 50 // Simulado

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: products.length,
        totalUsers: users.length,
        totalEquipments: equipments.length,
        totalEquipmentCosts,
        monthlyGrowth,
        orderGrowth: monthlyGrowth,
        netProfit,
        averageOrderValue,
        conversionRate,
        customerRetention
      })

      // Gerar dados para gráficos dos últimos 12 meses
      const monthlyData = []
      for (let i = 11; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthName = date.toLocaleDateString('pt-BR', { month: 'short' })
        
        const monthOrders = orders.filter(order => {
          const orderDate = new Date(order.created_at)
          return orderDate.getMonth() === date.getMonth() && 
                 orderDate.getFullYear() === date.getFullYear()
        })
        
        const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total_amount, 0)
        const monthExpenses = totalEquipmentCosts / 12 // Distribuir custos
        const monthProfit = monthRevenue - monthExpenses
        
        monthlyData.push({
          name: monthName,
          revenue: monthRevenue,
          expenses: monthExpenses,
          profit: monthProfit,
          orders: monthOrders.length,
          customers: Math.floor(monthOrders.length * 0.8) // Simular clientes únicos
        })
      }
      
      setRevenueData(monthlyData)
      setProfitAnalysis(monthlyData)
      setCustomerGrowth(monthlyData)

      // Status dos pedidos
      const statusCounts = orders.reduce((acc, order) => {
        const status = order.status || 'pending'
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const statusLabels: Record<string, string> = {
        pending: 'Pendente',
        confirmed: 'Confirmado',
        processing: 'Processando',
        shipped: 'Enviado',
        delivered: 'Entregue',
        cancelled: 'Cancelado'
      }

      const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        name: statusLabels[status] || status,
        value: count
      }))
      setOrderStatusData(statusData)

      // Performance de produtos por categoria
      const categoryRevenue = orders.reduce((acc, order) => {
        if (order.items && order.items.length > 0) {
          order.items.forEach(item => {
            // Simular categoria baseada no nome do produto
            let category = 'outros'
            if (item.name.toLowerCase().includes('ar-condicionado')) category = 'ar-condicionado'
            else if (item.name.toLowerCase().includes('peça')) category = 'pecas'
            else if (item.name.toLowerCase().includes('ferramenta')) category = 'ferramentas'
            
            acc[category] = (acc[category] || 0) + (item.price * item.quantity)
          })
        }
        return acc
      }, {} as Record<string, number>)

      const categoryLabels: Record<string, string> = {
        'ar-condicionado': 'Ar-Condicionado',
        'pecas': 'Peças',
        'ferramentas': 'Ferramentas',
        'outros': 'Outros'
      }

      const performanceData = Object.entries(categoryRevenue).map(([category, revenue]) => ({
        name: categoryLabels[category] || category,
        value: revenue
      }))
      setProductPerformance(performanceData)

      // Eficiência de equipamentos
      const efficiencyData = equipments.map((eq, index) => ({
        name: eq.name || `Equipamento ${index + 1}`,
        value: eq.usage_hours || 0,
        efficiency: Math.max(0, 100 - ((eq.maintenance_cost || 0) / 100)) // Simular eficiência
      }))
      setEquipmentEfficiency(efficiencyData.slice(0, 5)) // Top 5

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const MetricCard: React.FC<{ metric: MetricCard }> = ({ metric }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {metric.format === 'currency' && 'R$ '}
            {typeof metric.value === 'number' ? metric.value.toFixed(metric.format === 'currency' ? 2 : 0) : metric.value}
            {metric.format === 'percentage' && '%'}
          </p>
          <div className="flex items-center mt-2">
            {metric.change >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(metric.change).toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${metric.color}`}>
          <metric.icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  )

  const metrics: MetricCard[] = [
    {
      title: 'Receita Total',
      value: stats.totalRevenue,
      change: stats.monthlyGrowth,
      icon: DollarSign,
      color: 'bg-green-500',
      format: 'currency'
    },
    {
      title: 'Lucro Líquido',
      value: stats.netProfit,
      change: stats.monthlyGrowth * 0.8,
      icon: TrendingUp,
      color: stats.netProfit >= 0 ? 'bg-emerald-500' : 'bg-red-500',
      format: 'currency'
    },
    {
      title: 'Pedidos',
      value: stats.totalOrders,
      change: stats.orderGrowth,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      format: 'number'
    },
    {
      title: 'Ticket Médio',
      value: stats.averageOrderValue,
      change: 5.2,
      icon: Target,
      color: 'bg-purple-500',
      format: 'currency'
    },
    {
      title: 'Taxa de Conversão',
      value: stats.conversionRate,
      change: 2.1,
      icon: Activity,
      color: 'bg-orange-500',
      format: 'percentage'
    },
    {
      title: 'Retenção de Clientes',
      value: stats.customerRetention,
      change: 1.8,
      icon: Award,
      color: 'bg-pink-500',
      format: 'percentage'
    },
    {
      title: 'Produtos Ativos',
      value: stats.totalProducts,
      change: 0,
      icon: Package,
      color: 'bg-indigo-500',
      format: 'number'
    },
    {
      title: 'Clientes Cadastrados',
      value: stats.totalUsers,
      change: 12.5,
      icon: Users,
      color: 'bg-teal-500',
      format: 'number'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Executivo</h1>
          <p className="text-gray-600">Visão completa do desempenho da Martins Refrigeração</p>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Última atualização: {new Date().toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue vs Profit Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Análise Financeira (12 meses)
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={profitAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `R$ ${Number(value).toFixed(2)}`,
                    name === 'revenue' ? 'Receita' : name === 'expenses' ? 'Despesas' : 'Lucro'
                  ]}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#10B981" name="Receita" />
                <Bar dataKey="expenses" fill="#EF4444" name="Despesas" />
                <Line type="monotone" dataKey="profit" stroke="#8B5CF6" strokeWidth={3} name="Lucro" />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Customer Growth */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Crescimento de Pedidos e Clientes
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                  name="Pedidos"
                />
                <Area 
                  type="monotone" 
                  dataKey="customers" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                  name="Clientes"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Status dos Pedidos
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Product Performance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Performance por Categoria
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={productPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Receita']} />
                <Bar dataKey="value" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Equipment Efficiency */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Top 5 Equipamentos
            </h2>
            <div className="space-y-4">
              {equipmentEfficiency.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {item.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {item.value}h
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (item.efficiency || 0))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => window.location.href = '/admin/produtos'}
              className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
            >
              <div className="text-center">
                <Package className="h-8 w-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
                <span className="text-gray-700 group-hover:text-green-700 font-medium">Gerenciar Produtos</span>
              </div>
            </button>
            
            <button
              onClick={() => window.location.href = '/admin/pedidos'}
              className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="text-center">
                <ShoppingCart className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
                <span className="text-gray-700 group-hover:text-blue-700 font-medium">Ver Pedidos</span>
              </div>
            </button>
            
            <button
              onClick={() => window.location.href = '/admin/usuarios'}
              className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <div className="text-center">
                <Users className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
                <span className="text-gray-700 group-hover:text-purple-700 font-medium">Gerenciar Usuários</span>
              </div>
            </button>

            <button
              onClick={() => window.location.href = '/admin/equipamentos'}
              className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
            >
              <div className="text-center">
                <Settings className="h-8 w-8 text-gray-400 group-hover:text-orange-500 mx-auto mb-2" />
                <span className="text-gray-700 group-hover:text-orange-700 font-medium">Equipamentos</span>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard

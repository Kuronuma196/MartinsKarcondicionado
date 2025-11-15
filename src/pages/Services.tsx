
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {Wrench, Clock, Star, Filter, Calendar, Phone, CheckCircle, ArrowRight, Snowflake, Settings, Zap, Shield, Award, Users} from 'lucide-react'
import { lumi } from '../lib/lumi'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

interface Service {
  _id: string
  name: string
  description: string
  price: number
  category: string
  duration: number
  is_active: boolean
  features?: string[]
  included?: string[]
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    loadServices()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [services, selectedCategory, priceRange])

  const loadServices = async () => {
    try {
      const { list } = await lumi.entities.services.list()
      const activeServices = (list || []).filter((service: Service) => service.is_active)
      setServices(activeServices)
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
      toast.error('Erro ao carregar serviços')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...services]

    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory)
    }

    filtered = filtered.filter(service => 
      service.price >= priceRange[0] && service.price <= priceRange[1]
    )

    setFilteredServices(filtered)
  }

  const categories = [...new Set(services.map(service => service.category))]

  const serviceFeatures = {
    'instalacao': ['Instalação completa', 'Teste de funcionamento', 'Garantia de 1 ano', 'Suporte técnico'],
    'manutencao': ['Limpeza completa', 'Verificação de gás', 'Teste de performance', 'Relatório técnico'],
    'reparo': ['Diagnóstico gratuito', 'Peças originais', 'Garantia do serviço', 'Atendimento emergencial']
  }

  const heroServices = [
    {
      icon: Snowflake,
      title: 'Instalação Completa',
      description: 'Instalação profissional com garantia',
      price: 'A partir de R$ 150',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Settings,
      title: 'Manutenção Preventiva',
      description: 'Mantenha seu equipamento sempre eficiente',
      price: 'A partir de R$ 80',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Reparo Emergencial',
      description: 'Atendimento rápido quando você mais precisa',
      price: 'A partir de R$ 120',
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Serviços Profissionais
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Instalação, manutenção e reparo de ar-condicionado com excelência técnica
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/agendamento"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
              >
                Agendar Serviço
              </Link>
              <a
                href="tel:(43)98837-9365"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                Emergência 24h
              </a>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <Snowflake className="h-16 w-16 animate-spin" style={{ animationDuration: '10s' }} />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <Settings className="h-20 w-20 animate-pulse" />
        </div>
      </section>

      {/* Quick Services Cards */}
      <section className="py-16 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {heroServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center mb-6`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-2xl font-bold text-green-600 mb-6">{service.price}</div>
                <Link
                  to="/agendamento"
                  className="flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                >
                  Agendar Agora
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">15+</div>
                <div className="text-gray-600">Anos de Experiência</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">5000+</div>
                <div className="text-gray-600">Clientes Satisfeitos</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">100%</div>
                <div className="text-gray-600">Garantia</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">24h</div>
                <div className="text-gray-600">Atendimento</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Catalog */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Serviços</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos uma gama completa de serviços para manter seu ambiente sempre confortável
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === ''
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-green-600'
              }`}
            >
              Todos os Serviços
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-green-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Wrench className="h-6 w-6 text-white" />
                    </div>
                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.name}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {(serviceFeatures[service.category as keyof typeof serviceFeatures] || []).map((feature, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-green-600">
                        R$ {service.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration} min
                      </div>
                    </div>
                    <Link
                      to="/agendamento"
                      className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-medium"
                    >
                      Agendar
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4">Emergência 24 Horas</h2>
            <p className="text-xl mb-8 text-red-100">
              Seu ar-condicionado parou de funcionar? Nossa equipe está pronta para atender você a qualquer hora!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:(43)98837-9365"
                className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold hover:bg-red-50 transition-all flex items-center justify-center"
              >
                <Phone className="h-5 w-5 mr-2" />
                (43) 98837-9365
              </a>
              <a
                href="https://wa.me/5543988379365"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-red-600 transition-all"
              >
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Services

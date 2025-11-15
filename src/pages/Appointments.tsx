
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {Calendar, Clock, User, Phone, Mail, MapPin, Wrench, CheckCircle, AlertTriangle, Star, Shield, Award} from 'lucide-react'
import { lumi } from '../lib/lumi'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { MessageCircle } from "lucide-react";


interface AppointmentForm {
  customer_name: string
  customer_email: string
  customer_phone: string
  service_type: string
  appointment_date: string
  appointment_time: string
  address: string
  description: string
  urgency: string
  equipment_brand?: string
  equipment_model?: string
  problem_description?: string
}

const Appointments: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const { user, isAuthenticated } = useAuth()

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AppointmentForm>()

  const selectedServiceType = watch('service_type')
  const selectedUrgency = watch('urgency')

  useEffect(() => {
    if (user && isAuthenticated) {
      setValue('customer_name', user.userName || '')
      setValue('customer_email', user.email || '')
    }
  }, [user, isAuthenticated, setValue])

  useEffect(() => {
    if (selectedDate) {
      generateAvailableSlots(selectedDate)
    }
  }, [selectedDate])

  const generateAvailableSlots = (date: string) => {
    const slots = []
    const startHour = 8
    const endHour = 18
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      if (hour < endHour - 1) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`)
      }
    }
    
    setAvailableSlots(slots)
  }

  const onSubmit = async (data: AppointmentForm) => {
    setLoading(true)
    try {
      const appointmentData = {
        ...data,
        user_id: user?.userId || null,
        status: 'pending',
        created_at: new Date().toISOString(),
        appointment_datetime: `${data.appointment_date}T${data.appointment_time}:00.000Z`
      }

      await lumi.entities.appointments.create(appointmentData)
      
      setSubmitted(true)
      toast.success('Agendamento realizado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      toast.error('Erro ao realizar agendamento')
    } finally {
      setLoading(false)
    }
  }

  const serviceTypes = [
    {
      id: 'instalacao',
      name: 'Instalação de Ar-Condicionado',
      description: 'Instalação completa com garantia',
      duration: '2-4 horas',
      price: 'A partir de R$ 150',
      icon: '🔧'
    },
    {
      id: 'manutencao',
      name: 'Manutenção Preventiva',
      description: 'Limpeza e verificação completa',
      duration: '1-2 horas',
      price: 'A partir de R$ 80',
      icon: '🛠️'
    },
    {
      id: 'reparo',
      name: 'Reparo e Conserto',
      description: 'Diagnóstico e correção de problemas',
      duration: '1-3 horas',
      price: 'A partir de R$ 120',
      icon: '⚡'
    },
    {
      id: 'limpeza',
      name: 'Limpeza Técnica',
      description: 'Higienização profunda',
      duration: '1-2 horas',
      price: 'A partir de R$ 100',
      icon: '🧽'
    },
    {
      id: 'orcamento',
      name: 'Orçamento/Avaliação',
      description: 'Visita técnica gratuita',
      duration: '30-60 min',
      price: 'Gratuito',
      icon: '📋'
    }
  ]

  const urgencyLevels = [
    {
      id: 'normal',
      name: 'Normal',
      description: 'Agendamento em até 3 dias',
      color: 'text-green-600'
    },
    {
      id: 'urgent',
      name: 'Urgente',
      description: 'Agendamento em até 24 horas',
      color: 'text-yellow-600'
    },
    {
      id: 'emergency',
      name: 'Emergência',
      description: 'Atendimento em até 2 horas',
      color: 'text-red-600'
    }
  ]

  const benefits = [
    {
      icon: Shield,
      title: 'Garantia Total',
      description: 'Todos os serviços com garantia estendida'
    },
    {
      icon: Star,
      title: 'Técnicos Certificados',
      description: 'Profissionais qualificados e experientes'
    },
    {
      icon: Award,
      title: 'Atendimento 24h',
      description: 'Emergências atendidas a qualquer hora'
    }
  ]

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

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
              Agende seu Serviço
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Técnicos especializados prontos para atender suas necessidades
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <benefit.icon className="h-12 w-12 mx-auto mb-3 text-blue-200" />
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-blue-200 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Agendamento Confirmado!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Recebemos seu agendamento e nossa equipe entrará em contato em breve para confirmar os detalhes.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-medium">
                  ⏰ Tempo de resposta: até 2 horas
                </p>
                <p className="text-green-700 text-sm mt-1">
                  Você receberá uma ligação ou mensagem de WhatsApp
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Fazer Novo Agendamento
              </button>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Service Selection */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Escolha o Serviço</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {serviceTypes.map((service) => (
                      <label
                        key={service.id}
                        className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedServiceType === service.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          value={service.id}
                          {...register('service_type', { required: 'Selecione um serviço' })}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{service.icon}</span>
                            <h3 className="font-bold text-gray-900">{service.name}</h3>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">⏱️ {service.duration}</span>
                            <span className="font-semibold text-green-600">{service.price}</span>
                          </div>
                        </div>
                        {selectedServiceType === service.id && (
                          <CheckCircle className="h-6 w-6 text-green-600 absolute top-4 right-4" />
                        )}
                      </label>
                    ))}
                  </div>
                  {errors.service_type && (
                    <p className="text-red-500 text-sm mt-2">{errors.service_type.message}</p>
                  )}
                </motion.div>

                {/* Appointment Form */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados do Agendamento</h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Customer Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome Completo *
                        </label>
                        <input
                          {...register('customer_name', { required: 'Nome é obrigatório' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Seu nome completo"
                        />
                        {errors.customer_name && (
                          <p className="text-red-500 text-sm mt-1">{errors.customer_name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone *
                        </label>
                        <input
                          {...register('customer_phone', { required: 'Telefone é obrigatório' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="(43) 99999-9999"
                        />
                        {errors.customer_phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.customer_phone.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          {...register('customer_email')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data Preferida *
                        </label>
                        <input
                          type="date"
                          min={today}
                          {...register('appointment_date', { required: 'Data é obrigatória' })}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {errors.appointment_date && (
                          <p className="text-red-500 text-sm mt-1">{errors.appointment_date.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Horário Preferido *
                        </label>
                        <select
                          {...register('appointment_time', { required: 'Horário é obrigatório' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Selecione um horário</option>
                          {availableSlots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                        {errors.appointment_time && (
                          <p className="text-red-500 text-sm mt-1">{errors.appointment_time.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Urgency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Urgência do Atendimento
                      </label>
                      <div className="grid md:grid-cols-3 gap-4">
                        {urgencyLevels.map((level) => (
                          <label
                            key={level.id}
                            className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedUrgency === level.id
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              value={level.id}
                              {...register('urgency')}
                              className="sr-only"
                            />
                            <div className="text-center w-full">
                              <h4 className={`font-bold ${level.color}`}>{level.name}</h4>
                              <p className="text-gray-600 text-sm mt-1">{level.description}</p>
                            </div>
                            {selectedUrgency === level.id && (
                              <CheckCircle className="h-5 w-5 text-green-600 absolute top-2 right-2" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço Completo *
                      </label>
                      <textarea
                        {...register('address', { required: 'Endereço é obrigatório' })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Rua, número, bairro, cidade..."
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    {/* Equipment Info (conditional) */}
                    {(selectedServiceType === 'reparo' || selectedServiceType === 'manutencao') && (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Marca do Equipamento
                          </label>
                          <input
                            {...register('equipment_brand')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Ex: Samsung, LG, Electrolux..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Modelo (se souber)
                          </label>
                          <input
                            {...register('equipment_model')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Modelo do equipamento"
                          />
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {selectedServiceType === 'reparo' ? 'Descrição do Problema' : 'Observações'}
                      </label>
                      <textarea
                        {...register(selectedServiceType === 'reparo' ? 'problem_description' : 'description')}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={
                          selectedServiceType === 'reparo'
                            ? 'Descreva o problema: não liga, não gela, ruído estranho, etc.'
                            : 'Informações adicionais que possam ajudar nossa equipe...'
                        }
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 font-semibold"
                    >
                      {loading ? 'Agendando...' : 'Confirmar Agendamento'}
                    </button>
                  </form>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Contato Direto</h3>
                  <div className="space-y-4">
                    <a
                      href="tel:(43)98837-9365"
                      className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Phone className="h-6 w-6 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium text-green-800">(43) 98837-9365</div>
                        <div className="text-green-600 text-sm">Ligue agora</div>
                      </div>
                    </a>
                    
                    <a
                      href="https://wa.me/5543988379365"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <MessageCircle className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium text-blue-800">WhatsApp</div>
                        <div className="text-blue-600 text-sm">Mensagem rápida</div>
                      </div>
                    </a>
                  </div>
                </motion.div>

                {/* Emergency Notice */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-6"
                >
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="h-8 w-8 mr-3" />
                    <h3 className="text-xl font-bold">Emergência?</h3>
                  </div>
                  <p className="mb-4">
                    Para emergências, ligue diretamente. Atendemos 24 horas!
                  </p>
                  <a
                    href="tel:(43)98837-9365"
                    className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors inline-block"
                  >
                    Ligar Emergência
                  </a>
                </motion.div>

                {/* Process Info */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Como Funciona</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Agendamento</h4>
                        <p className="text-gray-600 text-sm">Preencha o formulário com seus dados</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Confirmação</h4>
                        <p className="text-gray-600 text-sm">Nossa equipe entra em contato em até 2h</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Atendimento</h4>
                        <p className="text-gray-600 text-sm">Técnico especializado no local</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Appointments

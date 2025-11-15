
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {Phone, Mail, MapPin, Clock, Send, MessageCircleDashed as MessageCircle, CheckCircle, AlertCircle, User, Calendar, Wrench} from 'lucide-react'
import { lumi } from '../lib/lumi'
import toast from 'react-hot-toast'

interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  service_type: string
  preferred_contact: string
  urgency: string
}

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>()

  const onSubmit = async (data: ContactForm) => {
    setLoading(true)
    try {
      await lumi.entities.contacts.create({
        ...data,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      
      setSubmitted(true)
      toast.success('Mensagem enviada com sucesso!')
      reset()
    } catch (error) {
      console.error('Erro ao enviar contato:', error)
      toast.error('Erro ao enviar mensagem')
    } finally {
      setLoading(false)
    }
  }

  const contactMethods = [
    {
      icon: Phone,
      title: 'Telefone',
      value: '(43) 98837-9365',
      description: 'Atendimento 24 horas',
      action: 'tel:(43)98837-9365',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: '(43) 98837-9365',
      description: 'Resposta rápida',
      action: 'https://wa.me/5543988379365',
      color: 'from-green-600 to-green-700'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'martinskarcondicionado@gmail.com',
      description: 'Suporte técnico',
      action: 'mailto:martinskarcondicionado@gmail.com',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MapPin,
      title: 'Localização',
      value: 'Londrina, PR',
      description: 'Atendemos toda a região',
      action: '#location',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  const businessHours = [
    { day: 'Segunda a Sexta', hours: '08:00 - 18:00' },
    { day: 'Sábado', hours: '08:00 - 12:00' },
    { day: 'Domingo', hours: 'Emergências 24h' }
  ]

  const serviceTypes = [
    'Instalação de Ar-Condicionado',
    'Manutenção Preventiva',
    'Reparo e Conserto',
    'Limpeza Técnica',
    'Venda de Equipamentos',
    'Consultoria Técnica',
    'Emergência',
    'Orçamento'
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
              Entre em Contato
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Estamos prontos para atender suas necessidades de climatização
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:(43)98837-9365"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <Phone className="h-5 w-5 mr-2" />
                Ligar Agora
              </a>
              <a
                href="https://wa.me/5543988379365"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.action}
                target={method.action.startsWith('http') ? '_blank' : undefined}
                rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 text-center group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <method.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-lg text-gray-700 font-medium mb-1">{method.value}</p>
                <p className="text-gray-600 text-sm">{method.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Envie sua Mensagem</h2>
                
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Mensagem Enviada!</h3>
                    <p className="text-gray-600 mb-6">
                      Recebemos sua mensagem e entraremos em contato em breve.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Enviar Nova Mensagem
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome Completo *
                        </label>
                        <input
                          {...register('name', { required: 'Nome é obrigatório' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Seu nome completo"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          {...register('email', { required: 'Email é obrigatório' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="seu@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone *
                        </label>
                        <input
                          {...register('phone', { required: 'Telefone é obrigatório' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="(43) 99999-9999"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Serviço
                        </label>
                        <select
                          {...register('service_type')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Selecione um serviço</option>
                          {serviceTypes.map(service => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Urgência
                        </label>
                        <select
                          {...register('urgency')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="normal">Normal</option>
                          <option value="urgent">Urgente</option>
                          <option value="emergency">Emergência</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Forma Preferida de Contato
                        </label>
                        <select
                          {...register('preferred_contact')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="phone">Telefone</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="email">Email</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assunto *
                      </label>
                      <input
                        {...register('subject', { required: 'Assunto é obrigatório' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Assunto da sua mensagem"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mensagem *
                      </label>
                      <textarea
                        {...register('message', { required: 'Mensagem é obrigatória' })}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Descreva sua necessidade, dúvida ou problema..."
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 font-semibold flex items-center justify-center"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Send className="h-5 w-5 mr-2" />
                      )}
                      {loading ? 'Enviando...' : 'Enviar Mensagem'}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Business Hours */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Clock className="h-6 w-6 mr-2 text-green-600" />
                  Horário de Atendimento
                </h3>
                <div className="space-y-4">
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{schedule.day}</span>
                      <span className="text-gray-600">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center text-red-800">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Emergências 24h</span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">
                    Atendemos emergências a qualquer hora, todos os dias
                  </p>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h3>
                <div className="space-y-4">
                  <a
                    href="/agendamento"
                    className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Calendar className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium text-green-800">Agendar Serviço</div>
                      <div className="text-green-600 text-sm">Marque sua visita técnica</div>
                    </div>
                  </a>
                  
                  <a
                    href="/produtos"
                    className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Wrench className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-blue-800">Ver Produtos</div>
                      <div className="text-blue-600 text-sm">Equipamentos disponíveis</div>
                    </div>
                  </a>
                </div>
              </motion.div>

              {/* Location Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="h-6 w-6 mr-2 text-purple-600" />
                  Área de Atendimento
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Atendemos toda a região metropolitana de Londrina e cidades vizinhas:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-700">• Londrina</span>
                    <span className="text-gray-700">• Cambé</span>
                    <span className="text-gray-700">• Ibiporã</span>
                    <span className="text-gray-700">• Rolândia</span>
                    <span className="text-gray-700">• Arapongas</span>
                    <span className="text-gray-700">• Apucarana</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Para outras localidades, consulte disponibilidade
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Encontre respostas para as dúvidas mais comuns sobre nossos serviços
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">Qual o prazo para atendimento?</h3>
                <p className="text-gray-600">
                  Atendemos emergências em até 2 horas. Para serviços programados, 
                  agendamos conforme sua disponibilidade.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">Vocês trabalham com que marcas?</h3>
                <p className="text-gray-600">
                  Trabalhamos com todas as principais marcas: Samsung, LG, Electrolux, 
                  Midea, Gree, Springer, Consul e outras.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">Oferecem garantia nos serviços?</h3>
                <p className="text-gray-600">
                  Sim! Todos os nossos serviços têm garantia. Instalações têm 1 ano 
                  de garantia e reparos 90 dias.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">Como funciona o orçamento?</h3>
                <p className="text-gray-600">
                  O orçamento é gratuito! Nossa equipe visita o local, avalia a necessidade 
                  e apresenta a melhor solução.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact

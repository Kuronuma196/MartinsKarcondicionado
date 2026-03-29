
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {ArrowRight, Phone, Star, Shield, Award, Users, Clock, CheckCircle, Snowflake, Settings, Zap, MessageCircleDashed as MessageCircle, Calendar, Wrench, ThermometerSun, Wind, Droplets} from 'lucide-react'
import { lumi } from '../lib/lumi'

interface Product {
  _id: string
  name: string
  price: number
  image_url: string
  category: string
}

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      const { list } = await lumi.entities.products.list({
        limit: 4
      })
      setFeaturedProducts(list || [])
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const heroFeatures = [
    {
      icon: Shield,
      title: '4 Anos de Experiência',
      description: 'Especialistas em climatização'
    },
    {
      icon: Award,
      title: 'Garantia Total',
      description: 'Todos os serviços garantidos'
    },
    {
      icon: Clock,
      title: 'Atendimento 24h',
      description: 'Emergências a qualquer hora'
    }
  ]

  const services = [
    {
      icon: Snowflake,
      title: 'Instalação Completa',
      description: 'Instalação profissional com garantia de 1 ano',
      price: 'A partir de R$ 150',
      features: ['Instalação completa', 'Teste de funcionamento', 'Garantia inclusa'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Settings,
      title: 'Manutenção Preventiva',
      description: 'Mantenha seu equipamento sempre eficiente',
      price: 'A partir de R$ 80',
      features: ['Limpeza completa', 'Verificação de gás', 'Relatório técnico'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Reparo Emergencial',
      description: 'Atendimento rápido quando você mais precisa',
      price: 'A partir de R$ 120',
      features: ['Diagnóstico gratuito', 'Peças originais', 'Atendimento 24h'],
      color: 'from-orange-500 to-red-500'
    }
  ]

  const stats = [
    { number: '450+', label: 'Clientes Satisfeitos', icon: Users },
    { number: '4+', label: 'Anos de Experiência', icon: Award },
    { number: '100%', label: 'Garantia nos Serviços', icon: Shield },
    { number: '24h', label: 'Suporte Disponível', icon: Clock }
  ]

  const testimonials = [
    {
      name: 'Maria Silva',
      location: 'Londrina, PR',
      rating: 5,
      comment: 'Excelente atendimento! Instalaram meu ar-condicionado rapidamente e com muita qualidade. Recomendo!',
      service: 'Instalação'
    },
    {
      name: 'João Santos',
      location: 'Cambé, PR',
      rating: 5,
      comment: 'Profissionais muito competentes. Resolveram o problema do meu ar-condicionado no mesmo dia. Preço justo!',
      service: 'Reparo'
    },
    {
      name: 'Ana Costa',
      location: 'Ibiporã, PR',
      rating: 5,
      comment: 'Sempre faço a manutenção com eles. Muito confiáveis e pontuais. Meu ar-condicionado nunca deu problema!',
      service: 'Manutenção'
    }
  ]

  const whyChooseUs = [
    {
      icon: ThermometerSun,
      title: 'Economia de Energia',
      description: 'Instalações eficientes que reduzem até 30% no consumo'
    },
    {
      icon: Wind,
      title: 'Ar Mais Puro',
      description: 'Sistemas de filtragem que melhoram a qualidade do ar'
    },
    {
      icon: Droplets,
      title: 'Controle de Umidade',
      description: 'Ambientes com umidade ideal para seu conforto'
    },
    {
      icon: Shield,
      title: 'Proteção Total',
      description: 'Garantia estendida em todos os nossos serviços'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <Snowflake className="h-24 w-24 animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        <div className="absolute bottom-20 right-20 opacity-20">
          <Settings className="h-32 w-32 animate-pulse" />
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-10">
          <Wind className="h-40 w-40 animate-bounce" style={{ animationDuration: '3s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Conforto <span className="text-blue-300">Térmico</span> Para Sua Vida
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                Especialistas em climatização há mais de 4 anos. Instalação, manutenção e reparo 
                de ar-condicionado com garantia e qualidade incomparáveis.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/agendamento"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Agendar Serviço
                </Link>
                <a
                  href="tel:(43)98837-9365"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  (43) 98837-9365
                </a>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/15 border border-white/20 rounded-lg px-3 py-2 text-sm text-center">
                  Resposta em até 15 min
                </div>
                <div className="bg-white/15 border border-white/20 rounded-lg px-3 py-2 text-sm text-center">
                  Atendimento em Londrina e região
                </div>
                <div className="bg-white/15 border border-white/20 rounded-lg px-3 py-2 text-sm text-center">
                  Parcelamento facilitado
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                {heroFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <feature.icon className="h-8 w-8 mx-auto mb-2 text-blue-200" />
                    <h3 className="font-bold text-sm">{feature.title}</h3>
                    <p className="text-blue-200 text-xs">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">Orçamento Gratuito</h3>
                <div className="space-y-4 text-blue-100">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-400" />
                    <span>Visita técnica sem custo</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-400" />
                    <span>Orçamento detalhado</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-400" />
                    <span>Consultoria especializada</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-400" />
                    <span>Sem compromisso</span>
                  </div>
                </div>
                <Link
                  to="/contato"
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors mt-6 inline-block text-center font-medium"
                >
                  Solicitar Orçamento
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <stat.icon className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nossos Serviços
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluções completas em climatização para residências e empresas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="text-2xl font-bold text-green-600 mb-6">{service.price}</div>
                
                <Link
                  to="/agendamento"
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-medium flex items-center justify-center group"
                >
                  Agendar Agora
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Por Que Escolher a Martins?
                </h2>
                <p className="text-xl text-gray-600">
                  Mais de 3 anos proporcionando conforto térmico e qualidade de vida 
                  para famílias e empresas em Londrina e região.
                </p>
              </div>

              <div className="space-y-6">
                {whyChooseUs.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Garantia de Satisfação</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Shield className="h-6 w-6 mr-3" />
                    <span>Garantia de 1 ano em instalações</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-6 w-6 mr-3" />
                    <span>Técnicos certificados e experientes</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-6 w-6 mr-3" />
                    <span>Atendimento emergencial 24h</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-6 w-6 mr-3" />
                    <span>Mais de 450 clientes satisfeitos</span>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-white/20 rounded-lg">
                  <p className="text-center font-medium">
                    "Sua satisfação é nossa prioridade"
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {!loading && featuredProducts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Produtos em Destaque</h2>
              <p className="text-xl text-gray-600">
                Equipamentos de qualidade das melhores marcas
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6"
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.category}</p>
                  <div className="text-2xl font-bold text-green-600 mb-4">
                    R$ {product.price.toFixed(2)}
                  </div>
                  <Link
                    to="/produtos"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center inline-block"
                  >
                    Ver Detalhes
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/produtos"
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-medium inline-flex items-center"
              >
                Ver Todos os Produtos
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">O Que Nossos Clientes Dizem</h2>
            <p className="text-xl text-gray-600">
              Depoimentos reais de quem confia na Martins Refrigeração
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-50 rounded-2xl p-8 relative"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                    {testimonial.service}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto Para Ter o Melhor em Climatização?
            </h2>
            <p className="text-xl mb-8 text-green-100">
              Entre em contato agora e descubra como podemos tornar seu ambiente mais confortável
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/agendamento"
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Agendar Visita Gratuita
              </Link>
              
              <a
                href="https://wa.me/5543988379365"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-green-600 transition-all flex items-center justify-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp
              </a>
              
              <a
                href="tel:(43)98837-9365"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-green-600 transition-all flex items-center justify-center"
              >
                <Phone className="h-5 w-5 mr-2" />
                Ligar Agora
              </a>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Clock className="h-8 w-8 mx-auto mb-3 text-green-200" />
                <h3 className="font-bold mb-2">Atendimento 24h</h3>
                <p className="text-green-200">Emergências atendidas a qualquer hora</p>
              </div>
              <div>
                <Shield className="h-8 w-8 mx-auto mb-3 text-green-200" />
                <h3 className="font-bold mb-2">Garantia Total</h3>
                <p className="text-green-200">Todos os serviços com garantia</p>
              </div>
              <div>
                <Award className="h-8 w-8 mx-auto mb-3 text-green-200" />
                <h3 className="font-bold mb-2">Qualidade Certificada</h3>
                <p className="text-green-200">Técnicos especializados</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home

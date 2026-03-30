
import React from 'react'
import { motion } from 'framer-motion'
import {Award, Users, Shield, Clock, Heart, Target, Zap, CheckCircle, Star, Phone, Mail, MapPin} from 'lucide-react'

const About: React.FC = () => {
  const values = [
    {
      icon: Shield,
      title: 'Confiança',
      description: 'Transparência e honestidade em todos os nossos serviços',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      title: 'Excelência',
      description: 'Qualidade técnica superior em cada projeto realizado',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Heart,
      title: 'Cuidado',
      description: 'Atendimento humanizado e personalizado para cada cliente',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Agilidade',
      description: 'Soluções rápidas e eficientes para suas necessidades',
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  const achievements = [
    { number: '3+', label: 'Anos de Experiência' },
    { number: 'Familiar', label: 'Equipe Técnica' },
    { number: '93%', label: 'Satisfação Garantida' },
    { number: '24h', label: 'Suporte Disponível' }
  ]

  const services = [
    'Instalação de Ar-Condicionado',
    'Manutenção Preventiva',
    'Reparo e Conserto',
    'Limpeza Técnica',
    'Venda de Equipamentos',
    'Consultoria Técnica'
  ]

  const teamMembers = [
    {
      name: 'Carlos Kuronuma',
      role: 'Fundador & Técnico Especialista',
      experience: '3 anos',
      specialties: ['Instalação', 'Diagnóstico', 'Sistemas Comerciais']
    },
    {
      name: 'Equipe Técnica Familiar',
      role: 'Atendimento Familiar',
      experience: '3 anos',
      specialties: ['Manutenção', 'Reparo', 'Suporte próximo']
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
              Sobre a Martins
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              3 anos de experiência proporcionando conforto térmico e qualidade de vida
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-white">{achievement.number}</div>
                  <div className="text-blue-200">{achievement.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-900">Nossa História</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                A Martins Refrigeração nasceu com o sonho de proporcionar conforto térmico 
                e qualidade de vida para famílias e empresas em Londrina e região. Fundada pelo 
                técnico especialista Carlos Kuronuma, a empresa começou como um pequeno negócio familiar 
                focado em excelência técnica e atendimento personalizado.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Ao longo de 3 anos, evoluímos para nos tornar uma referência em 
                climatização, sempre mantendo nossos valores fundamentais: qualidade, 
                confiança e compromisso com a satisfação do cliente.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Atualmente, seguimos com equipe técnica familiar, oferecendo desde 
                instalações residenciais até suporte de manutenção com proximidade, sempre com 
                dedicação total para manter 93% de satisfação garantida.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Nossa Missão</h3>
                <p className="text-lg mb-6">
                  Proporcionar soluções completas em climatização com excelência técnica, 
                  garantindo conforto, economia e satisfação para nossos clientes.
                </p>
                <div className="flex items-center space-x-4">
                  <Target className="h-8 w-8" />
                  <span className="font-semibold">Foco no Cliente</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Valores</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Os princípios que guiam nosso trabalho e relacionamento com clientes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-900">O Que Fazemos</h2>
              <p className="text-lg text-gray-600">
                Oferecemos soluções completas em climatização, desde a consultoria inicial 
                até a manutenção contínua dos seus equipamentos.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{service}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Diferenciais</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Star className="h-6 w-6 text-yellow-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Atendimento 24h</h4>
                    <p className="text-gray-600">Emergências atendidas a qualquer hora</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Star className="h-6 w-6 text-yellow-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Garantia Estendida</h4>
                    <p className="text-gray-600">Cobertura completa em todos os serviços</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Star className="h-6 w-6 text-yellow-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Técnicos Certificados</h4>
                    <p className="text-gray-600">Equipe especializada e experiente</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Star className="h-6 w-6 text-yellow-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Preços Justos</h4>
                    <p className="text-gray-600">Orçamentos transparentes e competitivos</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossa Equipe</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profissionais qualificados e comprometidos com sua satisfação
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-green-600 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600 mb-4">{member.experience} de experiência</p>
                <div className="space-y-2">
                  {member.specialties.map((specialty, i) => (
                    <span
                      key={i}
                      className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-2 mb-2"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">Pronto para Conhecer Nosso Trabalho?</h2>
            <p className="text-xl mb-8 text-green-100">
              Entre em contato conosco e descubra por que somos a escolha certa para suas necessidades de climatização
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="tel:(43)98837-9365"
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold hover:bg-green-50 transition-all flex items-center justify-center"
              >
                <Phone className="h-5 w-5 mr-2" />
                (43) 98837-9365
              </a>
              <a
                href="mailto:martinskarcondicionado@gmail.com"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-green-600 transition-all flex items-center justify-center"
              >
                <Mail className="h-5 w-5 mr-2" />
                Enviar Email
              </a>
            </div>
            <div className="mt-8 flex items-center justify-center text-green-100">
              <MapPin className="h-5 w-5 mr-2" />
              <span>Atendemos Londrina e Região</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About

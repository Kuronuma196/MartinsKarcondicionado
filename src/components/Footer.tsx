
    
import React from 'react'
import { Link } from 'react-router-dom'
import {Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube} from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <div className="text-white font-bold">M</div>
              </div>
              <div>
                <h3 className="text-xl font-bold">MARTINS</h3>
                <p className="text-sm text-gray-400">Ar-Condicionado</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Especialistas em ar-condicionado com mais de 10 anos de experiência. 
              Oferecemos serviços de qualidade com garantia e atendimento personalizado.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/_martinsarcondicionado" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Nossos Serviços</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/servicos" className="text-gray-400 hover:text-white transition-colors">
                  Instalação de Ar-Condicionado
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="text-gray-400 hover:text-white transition-colors">
                  Manutenção Preventiva
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="text-gray-400 hover:text-white transition-colors">
                  Limpeza Profunda
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="text-gray-400 hover:text-white transition-colors">
                  Reparo e Conserto
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="text-gray-400 hover:text-white transition-colors">
                  Consultoria Técnica
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-gray-400 hover:text-white transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/agendamento" className="text-gray-400 hover:text-white transition-colors">
                  Agendamento
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-400 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-400 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Phone size={18} className="text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">(43) 98837-9365</p>
                  <p className="text-sm text-gray-500">WhatsApp disponível</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail size={18} className="text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">martinsarcondicionado@email.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Região de Londrina/PR</p>
                  <p className="text-sm text-gray-500">Atendemos toda a região</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock size={18} className="text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Seg - Sex: 8h às 18h</p>
                  <p className="text-gray-400">Sáb: 8h às 12h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Martins Ar-Condicionado. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/politica-privacidade" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos-uso" className="text-gray-400 hover:text-white text-sm transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

const Home: React.FC = () => {
  const features = [
    {
      icon: <Snowflake className="h-8 w-8 text-blue-500" />,
      title: "Temperatura Ideal",
      description: "Nossos especialistas garantem o clima perfeito para seu ambiente"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Garantia Completa",
      description: "Todos os serviços com garantia de até 1 ano"
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: "Atendimento Rápido",
      description: "Agendamento flexível e atendimento pontual"
    },
    {
      icon: <Star className="h-8 w-8 text-green-500" />,
      title: "Qualidade Premium",
      description: "Produtos e serviços de alta qualidade com excelência"
    }
  ]

  const services = [
    {
      name: "Instalação",
      description: "Instalação completa de ar-condicionado com garantia",
      price: "A partir de R$ 350",
      image: "https://images.pexels.com/photos/5824584/pexels-photo-5824584.jpeg"
    },
    {
      name: "Manutenção",
      description: "Manutenção preventiva para maior durabilidade",
      price: "A partir de R$ 120",
      image: "https://images.pexels.com/photos/5824588/pexels-photo-5824588.jpeg"
    },
    {
      name: "Limpeza",
      description: "Limpeza profunda com produtos especializados",
      price: "A partir de R$ 80",
      image: "https://images.pexels.com/photos/5824589/pexels-photo-5824589.jpeg"
    }
  ]

  const stats = [
    { number: "450+", label: "Clientes Satisfeitos" },
    { number: "5+", label: "Anos de Experiência" },
    { number: "24h", label: "Suporte Técnico" },
    { number: "100%", label: "Garantia de Qualidade" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/6899260/pexels-photo-6899260.jpeg')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Snowflake className="h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                TEMPERATURA IDEAL
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                  O ANO INTEIRO?
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Nossos especialistas em ar-condicionado cuidam disso para você
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link
                to="/agendamento"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                Agendar Serviço
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="https://wa.me/5543988379365"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-600 transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Phone className="mr-2 h-5 w-5" />
                (43) 98837-9365
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-blue-200 text-sm"
            >
              @MartinsArCondicionado
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <div className="absolute top-40 right-20 opacity-20">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
        <div className="absolute bottom-20 left-20 opacity-20">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Por que escolher a Martins?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mais de 10 anos de experiência garantindo o melhor em climatização
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white rounded-xl shadow-md">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Soluções completas para todas as suas necessidades de climatização
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-green-500 relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white">{service.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">{service.price}</span>
                    <Link
                      to="/agendamento"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Agendar
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/servicos"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Ver Todos os Serviços
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Pronto para ter o clima ideal em casa?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Entre em contato conosco e descubra como podemos tornar seu ambiente mais confortável
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/agendamento"
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  Agendar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/contato"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                >
                  Falar Conosco
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export { Home }

    

import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {Menu, X, MapPin, ShoppingCart, User, Settings, Package, ClipboardList, LogOut, UserCheck, Search, Clock3, Cloud} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import SearchResults from './SearchResults'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState('')
  const [weatherLabel, setWeatherLabel] = useState('Nublado')
  const [temperature, setTemperature] = useState<number | null>(null)
  const location = useLocation()
  const { user, isAuthenticated, signIn, signOut } = useAuth()

  const isActive = (path: string) => location.pathname === path

  const userMenuItems = [
    { path: '/perfil', label: 'Meu Perfil', icon: User },
    { path: '/meus-pedidos', label: 'Meus Pedidos', icon: Package },
    { path: '/carrinho', label: 'Carrinho', icon: ShoppingCart },
  ]

  const adminMenuItems = [
    { path: '/admin', label: 'Dashboard', icon: Settings },
    { path: '/admin/produtos', label: 'Produtos', icon: Package },
    { path: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList },
    { path: '/admin/usuarios', label: 'Usuários', icon: UserCheck },
    { path: '/admin/equipamentos', label: 'Equipamentos', icon: Settings },
  ]

  const isAdmin = user?.email === 'kuronumadeal@gmail.com' || user?.email === 'martinskarcondicionado@gmail.com'

  const publicQuickLinks = [
    { label: 'Sobre', path: '/sobre' },
    { label: 'Serviços', path: '/servicos' },
    { label: 'Produtos', path: '/produtos' },
    { label: 'Agendar', path: '/agendamento' },
    { label: 'Contato', path: '/contato' },
  ]

  const userQuickLinks = [
    { label: 'Meu Perfil', path: '/perfil' },
    { label: 'Meus Pedidos', path: '/meus-pedidos' },
    { label: 'Carrinho', path: '/carrinho' },
  ]

  const adminQuickLinks = [
    { label: 'Painel', path: '/admin' },
    { label: 'Pedidos', path: '/admin/pedidos' },
    { label: 'Produtos', path: '/admin/produtos' },
    { label: 'Usuários', path: '/admin/usuarios' },
    { label: 'Equipamentos', path: '/admin/equipamentos' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setShowSearchResults(true)
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Pesquisa em tempo real para termos com mais de 2 caracteres
    if (value.length > 2) {
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    })

    const updateDateTime = () => setCurrentDateTime(formatter.format(new Date()))
    updateDateTime()
    const timer = setInterval(updateDateTime, 60000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const weatherCodeMap: Record<number, string> = {
      0: 'Céu limpo',
      1: 'Principalmente limpo',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Neblina',
      48: 'Neblina com geada',
      51: 'Garoa fraca',
      53: 'Garoa moderada',
      55: 'Garoa intensa',
      61: 'Chuva fraca',
      63: 'Chuva moderada',
      65: 'Chuva forte',
      71: 'Neve fraca',
      73: 'Neve moderada',
      75: 'Neve forte',
      80: 'Pancadas fracas',
      81: 'Pancadas moderadas',
      82: 'Pancadas fortes',
      95: 'Trovoadas',
    }

    const loadWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-23.3045&longitude=-51.1696&current=weather_code,temperature_2m&timezone=America%2FSao_Paulo'
        )
        const data = await response.json()
        const code = data?.current?.weather_code as number | undefined
        const temp = data?.current?.temperature_2m as number | undefined

        if (typeof code === 'number' && weatherCodeMap[code]) {
          setWeatherLabel(weatherCodeMap[code])
        }
        if (typeof temp === 'number') {
          setTemperature(Math.round(temp))
        }
      } catch (error) {
        console.error('Não foi possível carregar o clima atual:', error)
      }
    }

    loadWeather()
    const weatherTimer = setInterval(loadWeather, 30 * 60 * 1000)
    return () => clearInterval(weatherTimer)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-white/30 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 text-white border-b border-indigo-300/40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1.5 py-1.5 text-xs sm:text-sm">
              <div className="inline-flex items-center gap-2 min-w-0">
                <Clock3 className="h-3.5 w-3.5 text-blue-100 shrink-0" />
                <span className="capitalize">{currentDateTime} BRT</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <div className="inline-flex items-center gap-1.5 min-w-0">
                  <MapPin className="h-3.5 w-3.5 text-indigo-100 shrink-0" />
                  <span>Londrina, Paraná, Brasil</span>
                </div>
                <div className="inline-flex items-center gap-1.5 min-w-0">
                  <Cloud className="h-3.5 w-3.5 text-violet-100 shrink-0" />
                  <span>
                    Clima: {weatherLabel}
                    {temperature !== null ? `, ${temperature}°C` : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-3">
              <div className="rounded-2xl p-2 bg-gradient-to-br from-emerald-100 to-blue-100 group-hover:from-emerald-200 group-hover:to-blue-200 transition">
                <img
                  src="/Logo2.png"
                  alt="Martins Refrigeração Logo"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-lg font-extrabold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Martins Refrigeração
                </p>
                <p className="text-xs text-gray-500 font-medium tracking-wide">Climatização com garantia</p>
              </div>
            </Link>

            {/* Enhanced Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar produtos e serviços..."
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    autoComplete="off"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('')
                        setShowSearchResults(false)
                      }}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                to="/"
                className={`font-medium transition-colors ${
                  isActive('/') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Início
              </Link>
              <Link
                to="/servicos"
                className={`font-medium transition-colors ${
                  isActive('/servicos') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Serviços
              </Link>
              <Link
                to="/produtos"
                className={`font-medium transition-colors ${
                  isActive('/produtos') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Produtos
              </Link>
              <Link
                to="/agendamento"
                className={`font-medium transition-colors ${
                  isActive('/agendamento') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Agendamento
              </Link>
              <Link
                to="/contato"
                className={`font-medium transition-colors ${
                  isActive('/contato') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Contato
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              {isAuthenticated && (
                <Link
                  to="/carrinho"
                  className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden sm:block font-medium text-gray-700">
                      {user?.userName || 'Usuário'}
                    </span>
                    {(user?.email === 'kuronumadeal@gmail.com' || user?.email === 'martinskarcondicionado@gmail.com') && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="font-medium text-gray-900">{user?.userName}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>

                      <div className="py-2">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <item.icon className="h-4 w-4 mr-3" />
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      {(user?.email === 'kuronumadeal@gmail.com' || user?.email === 'martinskarcondicionado@gmail.com') && (
                        <div className="border-t py-2">
                          <div className="px-4 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Administração
                          </div>
                          {adminMenuItems.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <item.icon className="h-4 w-4 mr-3" />
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}

                      <div className="border-t pt-2">
                        <button
                          onClick={() => {
                            signOut()
                            setIsUserMenuOpen(false)
                          }}
                          className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={signIn}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all"
                >
                  Entrar
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar produtos e serviços..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  autoComplete="off"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('')
                      setShowSearchResults(false)
                    }}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 py-4 border-t"
            >
              <div className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className={`font-medium transition-colors ${
                    isActive('/') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Início
                </Link>
                <Link
                  to="/servicos"
                  className={`font-medium transition-colors ${
                    isActive('/servicos') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Serviços
                </Link>
                <Link
                  to="/produtos"
                  className={`font-medium transition-colors ${
                    isActive('/produtos') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Produtos
                </Link>
                <Link
                  to="/agendamento"
                  className={`font-medium transition-colors ${
                    isActive('/agendamento') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Agendamento
                </Link>
                <Link
                  to="/contato"
                  className={`font-medium transition-colors ${
                    isActive('/contato') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contato
                </Link>
              </div>
            </motion.nav>
          )}
        </div>
      </header>

      {/* Third Bar - Role-based Navigation */}
      <div className="hidden md:block bg-gradient-to-r from-blue-800 via-indigo-800 to-violet-800 text-white border-y border-indigo-300/40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 gap-3">
            <div className="flex items-center gap-4 lg:gap-5 text-xs lg:text-sm uppercase tracking-wide overflow-x-auto whitespace-nowrap pr-2">
              {publicQuickLinks.map((item) => (
                <Link key={item.label} to={item.path} className="text-white/85 hover:text-white transition-colors">
                  {item.label}
                </Link>
              ))}

              {isAuthenticated && userQuickLinks.map((item) => (
                <Link key={item.label} to={item.path} className="text-blue-100 hover:text-white transition-colors">
                  {item.label}
                </Link>
              ))}

              {isAdmin && adminQuickLinks.map((item) => (
                <Link key={item.label} to={item.path} className="text-violet-100 hover:text-white transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="hidden xl:flex items-center gap-5 text-sm text-white/85 shrink-0">
              <a href="tel:+5543988379365" className="hover:text-white transition-colors">Contato</a>
              <Link to="/contato" className="hover:text-white transition-colors">Ajuda</Link>
              <Link to="/carrinho" className="hover:text-white transition-colors">Carrinho</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Modal */}
      {showSearchResults && searchTerm.trim() && (
        <SearchResults
          searchTerm={searchTerm}
          onClose={() => setShowSearchResults(false)}
        />
      )}
    </>
  )
}

export default Header

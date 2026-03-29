
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

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-white/30 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]">
        {/* Top Bar */}
        <div className="bg-zinc-800 text-zinc-100 border-b border-zinc-700/70">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 py-1.5 text-xs sm:text-sm">
              <div className="inline-flex items-center gap-2">
                <Clock3 className="h-3.5 w-3.5 text-emerald-300" />
                <span className="capitalize">{currentDateTime} BRT</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-300" />
                  <span>Londrina, Paraná, Brasil</span>
                </div>
                <div className="inline-flex items-center gap-1.5">
                  <Cloud className="h-3.5 w-3.5 text-sky-300" />
                  <span>Clima: Nublado</span>
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
                        <>
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
                        </>
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

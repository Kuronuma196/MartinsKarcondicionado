
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {Search, Filter, SortAsc, SortDesc, Grid, List, Star, ShoppingCart, Eye, X} from 'lucide-react'
import { Link } from 'react-router-dom'
import { lumi } from '../lib/lumi'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  brand: string
  model: string
  power: string
  image_url: string
  stock_quantity: number
  is_active: boolean
}

interface Service {
  _id: string
  name: string
  description: string
  price: number
  category: string
  duration: number
  is_active: boolean
}

interface SearchResultsProps {
  searchTerm: string
  onClose: () => void
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchTerm, onClose }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [showFilters, setShowFilters] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (searchTerm.trim()) {
      performSearch()
    }
  }, [searchTerm])

  useEffect(() => {
    applyFilters()
  }, [products, services, categoryFilter, priceRange, sortBy, sortOrder])

  const performSearch = async () => {
    setLoading(true)
    try {
      const [productsResponse, servicesResponse] = await Promise.all([
        lumi.entities.products.list(),
        lumi.entities.services.list()
      ])

      const allProducts = productsResponse.list || []
      const allServices = servicesResponse.list || []

      // Filtrar produtos por termo de pesquisa
      const searchedProducts = allProducts.filter((product: Product) =>
        product.is_active &&
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
         product.model.toLowerCase().includes(searchTerm.toLowerCase()))
      )

      // Filtrar serviços por termo de pesquisa
      const searchedServices = allServices.filter((service: Service) =>
        service.is_active &&
        (service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
         service.category.toLowerCase().includes(searchTerm.toLowerCase()))
      )

      setProducts(searchedProducts)
      setServices(searchedServices)
    } catch (error) {
      console.error('Erro na pesquisa:', error)
      toast.error('Erro ao realizar pesquisa')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Filtro por categoria
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }

    // Filtro por faixa de preço
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Ordenação
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'price':
          comparison = a.price - b.price
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    setFilteredProducts(filtered)

    // Aplicar mesma lógica para serviços
    let filteredSvcs = [...services]
    if (categoryFilter) {
      filteredSvcs = filteredSvcs.filter(service => service.category === categoryFilter)
    }
    filteredSvcs = filteredSvcs.filter(service => 
      service.price >= priceRange[0] && service.price <= priceRange[1]
    )

    setFilteredServices(filteredSvcs)
  }

  const addToCart = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error('Faça login para adicionar ao carrinho')
      return
    }

    try {
      // Implementar lógica do carrinho
      toast.success('Produto adicionado ao carrinho!')
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
      toast.error('Erro ao adicionar produto ao carrinho')
    }
  }

  const categories = [...new Set([...products.map(p => p.category), ...services.map(s => s.category)])]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="bg-white rounded-lg shadow-2xl w-full max-w-6xl mx-4 mb-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Search className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Resultados para "{searchTerm}"
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {filteredProducts.length + filteredServices.length} resultados encontrados
                </span>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filtros</span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-')
                    setSortBy(field as any)
                    setSortOrder(order as any)
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="name-asc">Nome A-Z</option>
                  <option value="name-desc">Nome Z-A</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="category-asc">Categoria A-Z</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Todas as categorias</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Mínimo
                    </label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Máximo
                    </label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Products Section */}
                {filteredProducts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Produtos ({filteredProducts.length})
                    </h3>
                    <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                      {filteredProducts.map((product) => (
                        <motion.div
                          key={product._id}
                          layout
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                        >
                          {viewMode === 'grid' ? (
                            <div className="space-y-3">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <div>
                                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-lg font-bold text-green-600">
                                    R$ {product.price.toFixed(2)}
                                  </span>
                                  <div className="flex space-x-2">
                                    <Link
                                      to={`/produtos/${product._id}`}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Link>
                                    <button
                                      onClick={() => addToCart(product._id)}
                                      className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                    >
                                      <ShoppingCart className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex space-x-4">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                <p className="text-sm text-gray-600">{product.description}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-lg font-bold text-green-600">
                                    R$ {product.price.toFixed(2)}
                                  </span>
                                  <div className="flex space-x-2">
                                    <Link
                                      to={`/produtos/${product._id}`}
                                      className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                                    >
                                      Ver
                                    </Link>
                                    <button
                                      onClick={() => addToCart(product._id)}
                                      className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                                    >
                                      Carrinho
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services Section */}
                {filteredServices.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Serviços ({filteredServices.length})
                    </h3>
                    <div className="grid gap-4 grid-cols-1">
                      {filteredServices.map((service) => (
                        <motion.div
                          key={service._id}
                          layout
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{service.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-lg font-bold text-green-600">
                                  R$ {service.price.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {service.duration} min
                                </span>
                              </div>
                            </div>
                            <Link
                              to="/agendamento"
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Agendar
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {filteredProducts.length === 0 && filteredServices.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhum resultado encontrado
                    </h3>
                    <p className="text-gray-600">
                      Tente ajustar os filtros ou usar termos diferentes
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SearchResults

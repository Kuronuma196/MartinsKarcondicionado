import React from 'react'
import { Link } from 'react-router-dom'

const SupplierPortal: React.FC = () => {
  return (
    <section className="min-h-[70vh] bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-100 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Portal do Fornecedor</h1>
        <p className="text-gray-700 mb-8">
          Acesso para parceiros consultarem demandas, pedidos e contato operacional.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/admin/produtos" className="bg-white rounded-xl p-5 shadow hover:shadow-md transition">Catálogo e Itens</Link>
          <Link to="/admin/pedidos" className="bg-white rounded-xl p-5 shadow hover:shadow-md transition">Pedidos em Aberto</Link>
          <Link to="/contato" className="bg-white rounded-xl p-5 shadow hover:shadow-md transition">Canal de Suporte</Link>
        </div>
      </div>
    </section>
  )
}

export default SupplierPortal

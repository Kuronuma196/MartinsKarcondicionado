import React from 'react'
import { Link } from 'react-router-dom'

const TechnicianPanel: React.FC = () => {
  return (
    <section className="min-h-[70vh] bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-100 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Painel Técnico</h1>
        <p className="text-gray-700 mb-8">
          Área operacional para equipe técnica: agenda, atendimentos e execução de serviços.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/agendamento" className="bg-white rounded-xl p-5 shadow hover:shadow-md transition">Agenda de Serviços</Link>
          <Link to="/admin/equipamentos" className="bg-white rounded-xl p-5 shadow hover:shadow-md transition">Equipamentos</Link>
          <Link to="/admin/pedidos" className="bg-white rounded-xl p-5 shadow hover:shadow-md transition">Histórico Operacional</Link>
        </div>
      </div>
    </section>
  )
}

export default TechnicianPanel

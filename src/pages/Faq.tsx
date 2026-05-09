import React from 'react'

const Faq: React.FC = () => {
  return (
    <section className="min-h-[70vh] bg-gradient-to-br from-violet-50 to-blue-100 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Dúvidas Frequentes</h1>
        <div className="space-y-4 text-gray-700">
          <p><strong>Vocês atendem urgência?</strong> Sim, temos suporte em horários estendidos.</p>
          <p><strong>Fazem orçamento?</strong> Sim, orçamento técnico com orientação completa.</p>
          <p><strong>Atendem só Londrina?</strong> Atendemos Londrina e cidades próximas.</p>
        </div>
      </div>
    </section>
  )
}

export default Faq

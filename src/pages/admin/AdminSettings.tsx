
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {Settings, Save, Truck, DollarSign, Bell, Shield, Info} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { lumi } from '../../lib/lumi'
import toast from 'react-hot-toast'

interface AdminSetting {
  _id: string
  setting_key: string
  setting_value: string
  category: string
  description: string
  is_active: boolean
}

interface SettingsForm {
  free_shipping_threshold: number
  standard_shipping_fee: number
  max_refund_days: number
  email_notifications: boolean
  sms_notifications: boolean
  maintenance_mode: boolean
}

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<AdminSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SettingsForm>()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const { list } = await lumi.entities.admin_settings.list()
      setSettings(list || [])
      
      // Populate form with current settings
      list?.forEach((setting) => {
        if (setting.setting_key === 'free_shipping_threshold') {
          setValue('free_shipping_threshold', parseFloat(setting.setting_value))
        } else if (setting.setting_key === 'standard_shipping_fee') {
          setValue('standard_shipping_fee', parseFloat(setting.setting_value))
        } else if (setting.setting_key === 'max_refund_days') {
          setValue('max_refund_days', parseInt(setting.setting_value))
        } else if (setting.setting_key === 'email_notifications') {
          setValue('email_notifications', setting.setting_value === 'true')
        } else if (setting.setting_key === 'sms_notifications') {
          setValue('sms_notifications', setting.setting_value === 'true')
        } else if (setting.setting_key === 'maintenance_mode') {
          setValue('maintenance_mode', setting.setting_value === 'true')
        }
      })
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      toast.error('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (key: string, value: string, category: string, description: string) => {
    const existingSetting = settings.find(s => s.setting_key === key)
    
    if (existingSetting) {
      await lumi.entities.admin_settings.update(existingSetting._id, {
        setting_value: value,
        updated_at: new Date().toISOString()
      })
    } else {
      await lumi.entities.admin_settings.create({
        setting_key: key,
        setting_value: value,
        category,
        description,
        is_active: true,
        creator: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
  }

  const onSubmit = async (data: SettingsForm) => {
    setSaving(true)
    try {
      await Promise.all([
        updateSetting(
          'free_shipping_threshold',
          data.free_shipping_threshold.toString(),
          'shipping',
          'Valor mínimo para frete grátis'
        ),
        updateSetting(
          'standard_shipping_fee',
          data.standard_shipping_fee.toString(),
          'shipping',
          'Taxa padrão de frete'
        ),
        updateSetting(
          'max_refund_days',
          data.max_refund_days.toString(),
          'payment',
          'Prazo máximo para reembolso em dias'
        ),
        updateSetting(
          'email_notifications',
          data.email_notifications.toString(),
          'notifications',
          'Habilitar notificações por email'
        ),
        updateSetting(
          'sms_notifications',
          data.sms_notifications.toString(),
          'notifications',
          'Habilitar notificações por SMS'
        ),
        updateSetting(
          'maintenance_mode',
          data.maintenance_mode.toString(),
          'general',
          'Modo de manutenção do sistema'
        )
      ])

      toast.success('Configurações salvas com sucesso!')
      loadSettings()
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações do Sistema</h1>
          <p className="text-gray-600">Gerencie as configurações globais da plataforma</p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-8">
            {/* Shipping Settings */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Configurações de Frete
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Mínimo para Frete Grátis (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('free_shipping_threshold', { 
                      required: 'Valor é obrigatório',
                      min: { value: 0, message: 'Valor deve ser positivo' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.free_shipping_threshold && (
                    <p className="text-red-500 text-sm mt-1">{errors.free_shipping_threshold.message}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Pedidos acima deste valor terão frete gratuito
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taxa Padrão de Frete (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('standard_shipping_fee', { 
                      required: 'Taxa é obrigatória',
                      min: { value: 0, message: 'Taxa deve ser positiva' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.standard_shipping_fee && (
                    <p className="text-red-500 text-sm mt-1">{errors.standard_shipping_fee.message}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Taxa cobrada para pedidos abaixo do valor mínimo
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Payment Settings */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Configurações de Pagamento
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prazo Máximo para Reembolso (dias)
                </label>
                <input
                  type="number"
                  {...register('max_refund_days', { 
                    required: 'Prazo é obrigatório',
                    min: { value: 1, message: 'Prazo deve ser de pelo menos 1 dia' },
                    max: { value: 365, message: 'Prazo não pode exceder 365 dias' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-xs"
                />
                {errors.max_refund_days && (
                  <p className="text-red-500 text-sm mt-1">{errors.max_refund_days.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Clientes podem solicitar reembolso dentro deste prazo
                </p>
              </div>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Configurações de Notificações
              </h2>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('email_notifications')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3">
                    <span className="text-sm font-medium text-gray-700">Notificações por Email</span>
                    <p className="text-sm text-gray-500">Enviar emails de confirmação, status de pedidos, etc.</p>
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('sms_notifications')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3">
                    <span className="text-sm font-medium text-gray-700">Notificações por SMS</span>
                    <p className="text-sm text-gray-500">Enviar SMS para atualizações importantes</p>
                  </span>
                </label>
              </div>
            </motion.div>

            {/* System Settings */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Configurações do Sistema
              </h2>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('maintenance_mode')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3">
                    <span className="text-sm font-medium text-gray-700">Modo de Manutenção</span>
                    <p className="text-sm text-gray-500">Ativar para realizar manutenções no sistema</p>
                  </span>
                </label>

                {watch('maintenance_mode') && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">Atenção!</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          O modo de manutenção impedirá que usuários acessem a loja. 
                          Use apenas durante atualizações importantes.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Current Settings Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-blue-50 rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Resumo das Configurações Atuais
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {settings.map((setting) => (
                  <div key={setting._id} className="bg-white rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 text-sm">{setting.description}</h3>
                    <p className="text-lg font-bold text-blue-600 mt-1">
                      {setting.category === 'shipping' || setting.category === 'payment' 
                        ? `${setting.setting_value}${setting.setting_key.includes('days') ? ' dias' : setting.setting_key.includes('threshold') || setting.setting_key.includes('fee') ? ' R$' : ''}`
                        : setting.setting_value === 'true' ? 'Ativo' : 'Inativo'
                      }
                    </p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{setting.category}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-end"
            >
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminSettings

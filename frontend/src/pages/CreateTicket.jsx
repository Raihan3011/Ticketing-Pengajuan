import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { ticketService } from '../services/ticketService'
import api from '../services/authService'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  TicketIcon, 
  UserIcon, 
  DocumentTextIcon, 
  TagIcon, 
  ExclamationTriangleIcon,
  PaperClipIcon,
  XMarkIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  LightBulbIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { SparklesIcon } from '@heroicons/react/24/solid'

function CreateTicket() {
  const navigate = useNavigate()
  const [attachments, setAttachments] = useState([])
  const [currentStep, setCurrentStep] = useState(1)
  const { register, handleSubmit, formState: { errors }, watch } = useForm()

  // Check authentication
  React.useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Silakan login terlebih dahulu')
      navigate('/login')
    }
  }, [])

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery('categories', async () => {
    const response = await api.get('/categories')
    console.log('Categories response:', response.data)
    return response.data.categories || []
  }, {
    staleTime: 5 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error('Error fetching categories:', error)
      toast.error('Gagal memuat kategori')
    }
  })

  console.log('Categories state:', { categories, categoriesLoading, categoriesError })

  const { data: priorities, isLoading: prioritiesLoading } = useQuery('priorities', async () => {
    const response = await api.get('/priorities')
    return response.data.priorities
  }, {
    staleTime: 5 * 60 * 1000
  })

  const { data: pimpinanList, isLoading: pimpinanLoading, error: pimpinanError } = useQuery('pimpinan', async () => {
    const response = await api.get('/users/pimpinan')
    console.log('Pimpinan response:', response.data)
    return response.data.data || []
  }, {
    retry: 1,
    refetchOnMount: true,
    onError: (error) => {
      console.error('Error fetching pimpinan:', error.response?.data || error.message)
      toast.error(`Gagal memuat data pimpinan: ${error.response?.data?.message || error.message}`)
    }
  })

  console.log('Pimpinan state:', { pimpinanList, pimpinanLoading, pimpinanError })

  const createTicketMutation = useMutation(ticketService.createTicket, {
    onSuccess: (data) => {
      toast.success('🎉 Tiket berhasil dibuat! Kami akan segera menindaklanjuti.')
      navigate(`/app/tickets/${data.ticket.id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal membuat tiket')
    }
  })

  const onSubmit = (data) => {
    if (!data.title || !data.assigned_to_pimpinan_id) {
      toast.error('Mohon lengkapi informasi dasar (Step 1)')
      setCurrentStep(1)
      return
    }
    if (!data.problem_detail) {
      toast.error('Mohon isi detail masalah (Step 2)')
      setCurrentStep(2)
      return
    }
    if (!data.category_id || !data.priority_id) {
      toast.error('Mohon lengkapi klasifikasi tiket (Step 3)')
      setCurrentStep(3)
      return
    }

    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.problem_detail)
    formData.append('problem_detail', data.problem_detail)
    formData.append('assigned_to_pimpinan_id', data.assigned_to_pimpinan_id)
    formData.append('category_id', data.category_id)
    formData.append('priority_id', data.priority_id)

    attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file)
    })

    createTicketMutation.mutate(formData)
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    if (currentStep === 1) {
      const title = watch('title')
      const pimpinan = watch('assigned_to_pimpinan_id')
      if (!title || !pimpinan) {
        toast.error('Mohon lengkapi semua field yang wajib diisi')
        return
      }
    } else if (currentStep === 2) {
      const problemDetail = watch('problem_detail')
      if (!problemDetail) {
        toast.error('Mohon isi detail masalah')
        return
      }
    } else if (currentStep === 3) {
      const category = watch('category_id')
      const priority = watch('priority_id')
      if (!category || !priority) {
        toast.error('Mohon pilih kategori dan prioritas')
        return
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  if (categoriesLoading || prioritiesLoading || pimpinanLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  console.log('Rendering with categories:', categories)
  console.log('Categories length:', categories?.length)

  const steps = [
    { id: 1, name: 'Informasi Dasar', icon: DocumentTextIcon },
    { id: 2, name: 'Detail Masalah', icon: DocumentTextIcon },
    { id: 3, name: 'Klasifikasi', icon: TagIcon },
    { id: 4, name: 'Lampiran', icon: PaperClipIcon },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/app/tickets')}
          className="flex items-center text-gray-600 hover:text-blue-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Kembali ke Daftar Tiket
        </button>
        <div className="mb-8 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative z-10">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <TicketIcon className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">Buat Tiket Baru</h1>
                  <p className="text-blue-100 opacity-90 max-w-2xl">
                    Kirim permintaan dukungan baru dan tim kami akan segera menghubungi Anda
                  </p>
                </div>
              </div>
              
              {/* Tips card */}
              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-md">
                <div className="flex items-start space-x-3">
                  <LightBulbIcon className="w-6 h-6 text-yellow-300 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white mb-1">Tips untuk respons cepat:</p>
                    <p className="text-blue-100 text-sm opacity-90">
                      Jelaskan masalah secara jelas, sertakan langkah reproduksi, dan unggah screenshot jika ada.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <SparklesIcon className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">Rata-rata respon: 2 jam</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id 
                    ? 'bg-blue-900 text-white shadow-lg' 
                    : 'bg-white text-gray-400 border-2 border-gray-200'
                } transition-all duration-300`}>
                  {currentStep > step.id ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-3 text-sm font-medium hidden md:block ${
                  currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-16 md:w-24 mx-4 ${
                    currentStep > step.id ? 'bg-blue-900' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-blue-900">
              Step {currentStep} dari {steps.length}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
              <div className="flex items-center space-x-3 mb-8 pb-6 border-b">
                <div className="bg-blue-900 bg-opacity-10 p-3 rounded-xl">
                  <DocumentTextIcon className="w-8 h-8 text-blue-900" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Informasi Dasar</h2>
                  <p className="text-gray-500 mt-1">Berikan informasi dasar tentang tiket Anda</p>
                </div>
              </div>
              
              <div className="space-y-8 max-w-3xl">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <DocumentTextIcon className="w-4 h-4 mr-2 text-blue-900" />
                    Judul Tiket *
                    <InformationCircleIcon className="w-4 h-4 ml-2 text-gray-400" 
                      title="Buat judul yang jelas dan deskriptif"
                    />
                  </label>
                  <input
                    {...register('title', { required: 'Judul harus diisi' })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all duration-200 hover:border-blue-900"
                    placeholder="Contoh: 'Tidak bisa login ke sistem HR dengan akun admin'"
                  />
                  {errors.title && (
                    <div className="mt-2 flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                      <ExclamationTriangleIcon className="w-4 h-4" />
                      <span className="text-sm">{errors.title.message}</span>
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <UserIcon className="w-4 h-4 mr-2 text-blue-900" />
                    Ditujukan Kepada *
                  </label>
                  <div className="relative">
                    <select
                      {...register('assigned_to_pimpinan_id', { required: 'Pimpinan harus dipilih' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 appearance-none bg-white transition-all duration-200 hover:border-blue-900"
                    >
                      <option value="">Pilih Pimpinan yang Akan Menangani</option>
                      {pimpinanLoading ? (
                        <option disabled>Memuat...</option>
                      ) : pimpinanError ? (
                        <option disabled>Error memuat data</option>
                      ) : !pimpinanList || pimpinanList.length === 0 ? (
                        <option disabled>Tidak ada pimpinan tersedia</option>
                      ) : (
                        pimpinanList.map((pimpinan) => (
                          <option key={pimpinan.id} value={pimpinan.id}>
                            {pimpinan.name} • {pimpinan.email}
                          </option>
                        ))
                      )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.assigned_to_pimpinan_id && (
                    <div className="mt-2 flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                      <ExclamationTriangleIcon className="w-4 h-4" />
                      <span className="text-sm">{errors.assigned_to_pimpinan_id.message}</span>
                    </div>
                  )}
                  <p className="mt-3 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                    <InformationCircleIcon className="w-4 h-4 inline mr-1" />
                    Pilih pimpinan yang paling relevan dengan masalah Anda untuk penanganan yang lebih cepat
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
              <div className="flex items-center space-x-3 mb-8 pb-6 border-b">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <DocumentTextIcon className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Detail Masalah</h2>
                  <p className="text-gray-500 mt-1">Jelaskan masalah Anda secara detail</p>
                </div>
              </div>
              
              <div className="max-w-3xl">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <DocumentTextIcon className="w-4 h-4 mr-2 text-purple-500" />
                    Detail Masalah *
                  </label>
                  <textarea
                    {...register('problem_detail', { required: 'Detail masalah harus diisi' })}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all duration-200 hover:border-blue-900 resize-none"
                    placeholder="Jelaskan secara detail:
• Apa yang terjadi?
• Kapan masalah mulai muncul?
• Langkah apa yang sudah dicoba?
• Dampak yang ditimbulkan?"
                  />
                  {errors.problem_detail && (
                    <div className="mt-2 flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                      <ExclamationTriangleIcon className="w-4 h-4" />
                      <span className="text-sm">{errors.problem_detail.message}</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                  <div className="flex items-start space-x-3">
                    <LightBulbIcon className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-purple-900 mb-1">Contoh detail yang baik:</p>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• "Sejak 3 hari lalu, sistem HR error saat generate laporan bulanan"</li>
                        <li>• "Sudah mencoba restart server dan clear cache, tapi masalah tetap"</li>
                        <li>• "Dampak: 50 karyawan tidak bisa mengakses slip gaji"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
              <div className="flex items-center space-x-3 mb-8 pb-6 border-b">
                <div className="bg-green-100 p-3 rounded-xl">
                  <TagIcon className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Klasifikasi Tiket</h2>
                  <p className="text-gray-500 mt-1">Kategorikan tiket untuk penanganan yang tepat</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <TagIcon className="w-4 h-4 mr-2 text-green-500" />
                      Kategori *
                      {categoriesLoading && <span className="ml-2 text-xs text-gray-500">(Memuat...)</span>}
                      {categoriesError && <span className="ml-2 text-xs text-red-500">(Error)</span>}
                      {categories && <span className="ml-2 text-xs text-green-600">({categories.length} tersedia)</span>}
                    </label>
                    <div className="relative">
                      <select
                        {...register('category_id', { required: 'Kategori harus dipilih' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 appearance-none bg-white transition-all duration-200 hover:border-blue-900"
                      >
                        <option value="">Pilih Kategori Masalah</option>
                        {categoriesLoading ? (
                          <option disabled>Memuat kategori...</option>
                        ) : !categories || categories.length === 0 ? (
                          <option disabled>Tidak ada kategori tersedia</option>
                        ) : (
                          categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}{category.description ? ` • ${category.description}` : ''}
                            </option>
                          ))
                        )}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.category_id && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        <span className="text-sm">{errors.category_id.message}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      <InformationCircleIcon className="w-4 h-4 mr-2" />
                      Panduan Kategori
                    </h4>
                    <ul className="text-sm text-green-700 space-y-2">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                        <span><strong>Teknis:</strong> Masalah software, hardware, jaringan</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                        <span><strong>Non-Teknis:</strong> Prosedur, pelatihan, dokumen</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <ExclamationTriangleIcon className="w-4 h-4 mr-2 text-orange-500" />
                      Prioritas *
                    </label>
                    <div className="space-y-3">
                      {priorities?.map((priority) => {
                        const priorityColors = {
                          'Tinggi': 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
                          'Sedang': 'border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
                          'Rendah': 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
                          'Normal': 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
                        }
                        return (
                          <label key={priority.id} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            watch('priority_id') == priority.id 
                              ? `${priorityColors[priority.name]?.replace('border-', 'border-2 border-')} ring-2 ring-offset-2 ring-opacity-50` 
                              : priorityColors[priority.name] || 'border-gray-200'
                          }`}>
                            <input
                              type="radio"
                              {...register('priority_id', { required: 'Prioritas harus dipilih' })}
                              value={priority.id}
                              className="h-4 w-4 text-blue-900 focus:ring-blue-900"
                            />
                            <div className="ml-3">
                              <span className="font-medium">{priority.name}</span>
                              <p className="text-sm opacity-80 mt-1">{priority.description}</p>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                    {errors.priority_id && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        <span className="text-sm">{errors.priority_id.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
              <div className="flex items-center space-x-3 mb-8 pb-6 border-b">
                <div className="bg-blue-900 bg-opacity-10 p-3 rounded-xl">
                  <PaperClipIcon className="w-8 h-8 text-blue-900" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Lampiran File</h2>
                  <p className="text-gray-500 mt-1">Unggah file pendukung (opsional)</p>
                </div>
              </div>
              
              <div className="max-w-3xl">
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    File Pendukung
                    <span className="text-gray-500 font-normal ml-2">(Maks 10MB per file)</span>
                  </label>
                  
                  <div className="border-3 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-900 transition-all duration-300 bg-gray-50 hover:bg-blue-50">
                    <PaperClipIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer inline-block">
                      <div className="bg-blue-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors inline-flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span>Pilih File</span>
                      </div>
                    </label>
                    <p className="mt-4 text-sm text-gray-500">
                      atau drag and drop file di sini
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      JPG, PNG, PDF, DOC, DOCX, XLS, XLSX
                    </p>
                  </div>
                </div>
                
                {attachments.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">File Terpilih ({attachments.length})</h4>
                    <div className="space-y-3">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-900 border-opacity-20 rounded-xl hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-4">
                            <div className="bg-white p-2 rounded-lg">
                              <PaperClipIcon className="w-6 h-6 text-blue-900" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{file.name}</p>
                              <p className="text-sm text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1]?.toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Remove file"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-8 bg-blue-50 p-5 rounded-xl border border-blue-900 border-opacity-20">
                  <div className="flex items-start space-x-3">
                    <InformationCircleIcon className="w-5 h-5 text-blue-900 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900 mb-1">File yang membantu:</p>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Screenshot error message atau masalah</li>
                        <li>• Log file atau file laporan error</li>
                        <li>• Dokumentasi terkait masalah</li>
                        <li>• Contoh file yang menyebabkan masalah</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex space-x-3 w-full sm:w-auto">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn btn-secondary px-8 py-3 rounded-xl font-medium flex items-center space-x-2"
                  >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Kembali</span>
                  </button>
                )}
                {currentStep < 4 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn btn-primary px-8 py-3 rounded-xl font-medium flex items-center space-x-2"
                  >
                    <span>Lanjut</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
              
              {currentStep === 4 && (
                <button
                  type="submit"
                  disabled={createTicketMutation.isLoading}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-semibold rounded-xl hover:from-blue-800 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                >
                  {createTicketMutation.isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Membuat Tiket...</span>
                    </>
                  ) : (
                    <>
                      <TicketIcon className="w-5 h-5" />
                      <span className="text-lg">Kirim Tiket</span>
                    </>
                  )}
                </button>
              )}
              
              {currentStep < 4 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="text-blue-900 hover:text-blue-700 font-medium text-sm"
                >
                  Lewati dan lanjut ke langkah terakhir →
                </button>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{currentStep} dari {steps.length} langkah selesai</span>
                <span>{Math.round((currentStep / steps.length) * 100)}%</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-900 to-blue-800 transition-all duration-500"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </form>
        {currentStep > 1 && (
          <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-xl p-4 border border-gray-200 max-w-xs animate-slideInUp">
            <h4 className="font-semibold text-gray-800 mb-2">Pratinjau Tiket</h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 truncate">
                <span className="font-medium">Judul:</span> {watch('title') || 'Belum diisi'}
              </p>
              {watch('category_id') && (
                <p className="text-gray-600">
                  <span className="font-medium">Kategori:</span> {
                    categories?.find(c => c.id == watch('category_id'))?.name || 'Belum dipilih'
                  }
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default CreateTicket
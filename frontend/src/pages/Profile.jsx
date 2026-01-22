import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'
import { 
  UserIcon, 
  KeyIcon, 
  CameraIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  LockClosedIcon,
  IdentificationIcon,
  BriefcaseIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { 
  UserIcon as UserSolidIcon,
  CheckCircleIcon as CheckCircleSolidIcon
} from '@heroicons/react/24/solid'

function Profile() {
  const { user, updateUser } = useAuth()
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const queryClient = useQueryClient()
  
  const { register, handleSubmit, formState: { errors, isDirty }, watch, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || ''
    }
  })

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword, watch: watchPassword } = useForm()

  const updateProfileMutation = useMutation(
    (data) => authService.updateProfile(data),
    {
      onSuccess: (response) => {
        console.log('Profile update success:', response)
        if (response && response.user) {
          updateUser(response.user)
          queryClient.invalidateQueries(['user'])
          toast.success(response.message || 'Profile berhasil diperbarui')
          setSelectedFile(null)
          setImagePreview(null)
          reset({
            name: response.user.name,
            email: response.user.email,
            phone: response.user.phone || '',
            department: response.user.department || ''
          })
        } else {
          console.error('Invalid response format:', response)
          toast.error('Response tidak valid dari server')
        }
      },
      onError: (error) => {
        console.error('Profile update error:', error)
        console.error('Error response:', error.response)
        console.error('Error data:', error.response?.data)
        
        let errorMessage = 'Gagal memperbarui profile'
        
        if (error.response?.data) {
          if (error.response.data.message) {
            errorMessage = error.response.data.message
          } else if (error.response.data.errors) {
            const errors = error.response.data.errors
            errorMessage = Object.values(errors).flat().join(', ')
          }
        }
        
        toast.error(errorMessage)
      }
    }
  )

  const updatePasswordMutation = useMutation(
    (data) => authService.updatePassword(data),
    {
      onSuccess: () => {
        setShowPasswordForm(false)
        resetPassword()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal memperbarui password')
      }
    }
  )

  const onSubmitProfile = (data) => {
    console.log('Submitting profile:', data)
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('phone', data.phone || '')
    if (data.department) {
      formData.append('department', data.department)
    }
    if (selectedFile) {
      formData.append('avatar', selectedFile)
    }
    
    updateProfileMutation.mutate(formData)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2048000) {
        toast.error('Ukuran file maksimal 2MB')
        return
      }
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = async () => {
    if (confirm('Hapus foto profil?')) {
      try {
        setSelectedFile(null)
        setImagePreview(null)
        const formData = new FormData()
        formData.append('name', user.name)
        formData.append('email', user.email)
        formData.append('phone', user.phone || '')
        formData.append('department', user.department || '')
        formData.append('remove_avatar', '1')
        await updateProfileMutation.mutateAsync(formData)
      } catch (error) {
        console.error('Remove avatar error:', error)
      }
    }
  }

  const onSubmitPassword = (data) => {
    updatePasswordMutation.mutate(data)
  }

  const newPassword = watchPassword('password')
  const passwordStrength = newPassword ? calculatePasswordStrength(newPassword) : 0

  function calculatePasswordStrength(password) {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return strength
  }

  const getPasswordStrengthColor = (strength) => {
    if (strength >= 4) return 'bg-green-500'
    if (strength >= 3) return 'bg-yellow-500'
    if (strength >= 1) return 'bg-red-500'
    return 'bg-gray-300'
  }

  const getPasswordStrengthText = (strength) => {
    if (strength >= 4) return 'Sangat Kuat'
    if (strength >= 3) return 'Kuat'
    if (strength >= 1) return 'Lemah'
    return 'Sangat Lemah'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <UserSolidIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Pengaturan Profil</h1>
              <p className="text-blue-100">Kelola informasi akun dan keamanan</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Terakhir diupdate</div>
            <div className="font-medium">{new Date().toLocaleDateString('id-ID')}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Overview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : user?.avatar ? (
                    <img 
                      src={`http://localhost:8000${user.avatar}`}
                      alt={user.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold">${user?.name?.charAt(0)?.toUpperCase()}</div>`
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>
                <label className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                  <CameraIcon className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              {(user?.avatar || imagePreview) && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Hapus Foto
                  </button>
                </div>
              )}
              
              <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name}</h2>
              <p className="text-gray-600 mb-3">{user?.email}</p>
              
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <CheckCircleSolidIcon className="w-4 h-4 mr-1" />
                {user?.role?.display_name || user?.role?.name || 'Staff'}
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                Statistik Akun
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tiket Dibuat</span>
                  <span className="font-semibold text-gray-900">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Aktivitas Bulan Ini</span>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bergabung Sejak</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(user?.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ShieldCheckIcon className="w-5 h-5 mr-2 text-green-600" />
              Status Keamanan
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    user?.email_verified_at ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {user?.email_verified_at ? (
                      <CheckCircleIcon className="w-5 h-5" />
                    ) : (
                      <ExclamationCircleIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Email Terverifikasi</div>
                    <div className="text-sm text-gray-500">
                      {user?.email_verified_at ? 'Email sudah terverifikasi' : 'Email belum diverifikasi'}
                    </div>
                  </div>
                </div>
                {!user?.email_verified_at && (
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Verifikasi
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    showPasswordForm ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                  }`}>
                    <LockClosedIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Kata Sandi</div>
                    <div className="text-sm text-gray-500">
                      {showPasswordForm ? 'Sedang diubah' : 'Aman • Terakhir diubah 30 hari lalu'}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showPasswordForm ? 'Batal' : 'Ubah'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <IdentificationIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Informasi Profil</h2>
                  <p className="text-sm text-gray-600">Perbarui informasi personal Anda</p>
                </div>
              </div>
              {isDirty && (
                <button
                  type="button"
                  onClick={() => reset()}
                  className="text-sm text-gray-600 hover:text-gray-700 flex items-center"
                >
                  <ArrowPathIcon className="w-4 h-4 mr-1" />
                  Reset perubahan
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-1 text-gray-400" />
                      Nama Lengkap
                    </span>
                  </label>
                  <input
                    {...register('name', { required: 'Nama lengkap wajib diisi' })}
                    type="text"
                    className="input"
                    placeholder="Masukkan nama lengkap"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <XCircleIcon className="w-4 h-4 mr-1" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center">
                      <EnvelopeIcon className="w-4 h-4 mr-1 text-gray-400" />
                      Alamat Email
                    </span>
                  </label>
                  <input
                    {...register('email', { 
                      required: 'Email wajib diisi',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Format email tidak valid'
                      }
                    })}
                    type="email"
                    className="input"
                    placeholder="nama@unpad.ac.id"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <XCircleIcon className="w-4 h-4 mr-1" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    {...register('phone', {
                      pattern: {
                        value: /^[0-9+\-\s]+$/,
                        message: 'Format nomor telepon tidak valid'
                      }
                    })}
                    type="tel"
                    className="input"
                    placeholder="+62 812-3456-7890"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <XCircleIcon className="w-4 h-4 mr-1" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center">
                      <BriefcaseIcon className="w-4 h-4 mr-1 text-gray-400" />
                      Departemen
                    </span>
                  </label>
                  <input
                    {...register('department')}
                    type="text"
                    className="input"
                    placeholder="Masukkan departemen"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={user?.role?.display_name || user?.role?.name || ''}
                    className="input bg-gray-50 border-gray-200"
                    disabled
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isLoading || (!isDirty && !selectedFile)}
                    className="btn btn-primary"
                  >
                    {updateProfileMutation.isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memperbarui...
                      </>
                    ) : (
                      'Simpan Perubahan'
                    )}
                  </button>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null)
                        setImagePreview(null)
                      }}
                      className="text-sm text-gray-600 hover:text-gray-700"
                    >
                      Batal upload foto
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          {showPasswordForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <KeyIcon className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Keamanan Akun</h2>
                    <p className="text-sm text-gray-600">Perbarui kata sandi untuk keamanan akun</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPasswordForm(false)
                    resetPassword()
                  }}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  Tutup
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kata Sandi Saat Ini
                    </label>
                    <input
                      {...registerPassword('current_password', { required: 'Kata sandi saat ini wajib diisi' })}
                      type="password"
                      className="input"
                      placeholder="Masukkan kata sandi saat ini"
                    />
                    {passwordErrors.current_password && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <XCircleIcon className="w-4 h-4 mr-1" />
                        {passwordErrors.current_password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kata Sandi Baru
                    </label>
                    <input
                      {...registerPassword('password', { 
                        required: 'Kata sandi baru wajib diisi',
                        minLength: { value: 8, message: 'Minimal 8 karakter' }
                      })}
                      type="password"
                      className="input"
                      placeholder="Masukkan kata sandi baru"
                    />
                    {newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Kekuatan kata sandi:</span>
                          <span className={`text-xs font-medium ${
                            passwordStrength >= 4 ? 'text-green-600' :
                            passwordStrength >= 3 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {getPasswordStrengthText(passwordStrength)}
                          </span>
                        </div>
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center">
                            <CheckCircleIcon className={`w-4 h-4 mr-2 ${
                              newPassword.length >= 8 ? 'text-green-500' : 'text-gray-300'
                            }`} />
                            <span className="text-xs text-gray-600">Minimal 8 karakter</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircleIcon className={`w-4 h-4 mr-2 ${
                              /[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'
                            }`} />
                            <span className="text-xs text-gray-600">Huruf kapital</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircleIcon className={`w-4 h-4 mr-2 ${
                              /[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'
                            }`} />
                            <span className="text-xs text-gray-600">Angka</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {passwordErrors.password && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <XCircleIcon className="w-4 h-4 mr-1" />
                        {passwordErrors.password.message}
                    </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Kata Sandi Baru
                    </label>
                    <input
                      {...registerPassword('password_confirmation', { 
                        required: 'Konfirmasi kata sandi wajib diisi',
                        validate: value => value === newPassword || 'Kata sandi tidak cocok'
                      })}
                      type="password"
                      className="input"
                      placeholder="Konfirmasi kata sandi baru"
                    />
                    {passwordErrors.password_confirmation && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <XCircleIcon className="w-4 h-4 mr-1" />
                        {passwordErrors.password_confirmation.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false)
                      resetPassword()
                    }}
                    className="btn btn-secondary"
                    disabled={updatePasswordMutation.isLoading}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={updatePasswordMutation.isLoading}
                    className="btn btn-primary"
                  >
                    {updatePasswordMutation.isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memperbarui...
                      </>
                    ) : (
                      'Perbarui Kata Sandi'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import api from '../services/authService'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  PlusIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  XMarkIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  ArrowPathIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline'
import {
  CheckCircleIcon as CheckCircleSolidIcon,
  UserCircleIcon
} from '@heroicons/react/24/solid'

function Users() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [filters, setFilters] = useState({ search: '', role: '', status: '' })
  const [debouncedFilters, setDebouncedFilters] = useState({ search: '', role: '', status: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage] = useState(10)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 500)
    return () => clearTimeout(timer)
  }, [filters])

  const { data: users, isLoading } = useQuery(
    ['users', debouncedFilters, currentPage],
    async () => {
      const params = {
        page: currentPage,
        per_page: perPage
      }
      if (debouncedFilters.search) params.search = debouncedFilters.search
      if (debouncedFilters.role) params.role = debouncedFilters.role
      if (debouncedFilters.status) params.is_active = debouncedFilters.status === 'active'

      const response = await api.get('/users', { params })
      return response.data
    },
    { keepPreviousData: true }
  )

  const { data: roles } = useQuery('roles', async () => {
    const response = await api.get('/roles')
    return response.data.roles
  })

  const createUserMutation = useMutation(
    async (data) => {
      const response = await api.post('/users', data)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        setShowModal(false)
        reset()
        toast.success('Pengguna berhasil dibuat')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal membuat pengguna')
      }
    }
  )

  const updateUserMutation = useMutation(
    async (data) => {
      const response = await api.put(`/users/${editingUser.id}`, data)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        setShowModal(false)
        setEditingUser(null)
        reset()
        toast.success('Pengguna berhasil diperbarui')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal memperbarui pengguna')
      }
    }
  )

  const toggleStatusMutation = useMutation(
    async (userId) => {
      const response = await api.patch(`/users/${userId}/toggle-status`)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        toast.success('Status pengguna diperbarui')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal memperbarui status')
      }
    }
  )

  const deleteUserMutation = useMutation(
    async (userId) => {
      await api.delete(`/users/${userId}`)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        toast.success('Pengguna berhasil dihapus')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal menghapus pengguna')
      }
    }
  )

  const onSubmit = (data) => {
    if (editingUser) {
      updateUserMutation.mutate(data)
    } else {
      createUserMutation.mutate(data)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role_id: user.role_id,
      is_active: user.is_active
    })
    setShowModal(true)
  }

  const handleCreate = () => {
    setEditingUser(null)
    reset({
      is_active: true
    })
    setShowModal(true)
  }

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getRoleColor = (roleName) => {
    const colors = {
      'admin': 'bg-purple-100 text-purple-800',
      'staff': 'bg-blue-100 text-blue-800',
      'user': 'bg-gray-100 text-gray-800',
      'manager': 'bg-yellow-100 text-yellow-800'
    }
    return colors[roleName] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <UserGroupIcon className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
              <p className="text-blue-100 mt-2">Kelola akun pengguna, hak akses, dan peran dalam sistem</p>
            </div>
          </div>
          <button 
            onClick={handleCreate}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Tambah Pengguna</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Pengguna</p>
              <p className="text-4xl font-bold mt-2">{users?.total || 0}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="text-xs opacity-80 mt-3">
            <span className="flex items-center">
              <ArrowPathIcon className="w-3 h-3 mr-1" />
              Update real-time
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Aktif</p>
              <p className="text-4xl font-bold mt-2">
                {users?.data?.filter(u => u.is_active).length || 0}
              </p>
              <p className="text-xs opacity-80 mt-1">
                {users?.total ? `${Math.round((users.data.filter(u => u.is_active).length / users.total) * 100)}%` : '0%'} dari total
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircleSolidIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Tidak Aktif</p>
              <p className="text-4xl font-bold mt-2">
                {users?.data?.filter(u => !u.is_active).length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <XCircleIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Role Tersedia</p>
              <p className="text-4xl font-bold mt-2">{roles?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative max-w-lg">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pengguna (nama, email, telepon)..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tabel
              </button>
            </div>

            {/* Filter Button */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <FunnelIcon className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Filter</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Filter Lanjutan</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      >
                        <option value="">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={filters.role}
                        onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                      >
                        <option value="">Semua Role</option>
                        {roles?.map((role) => (
                          <option key={role.id} value={role.name}>
                            {role.display_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={() => setFilters({ search: '', role: '', status: '' })}
                      className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users?.data?.map((user) => (
            <div key={user.id} className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden group">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                        user.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{user.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(user.is_active)}`}>
                        {user.is_active ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role?.name)}`}>
                      {user.role?.display_name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-500">
                      Bergabung {formatDate(user.created_at)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => toggleStatusMutation.mutate(user.id)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                      user.is_active
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteUserMutation.mutate(user.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Pengguna
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Kontak
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Bergabung
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users?.data?.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      {user.phone && (
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role?.name)}`}>
                        {user.role?.display_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.is_active)}`}>
                        {user.is_active ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleStatusMutation.mutate(user.id)}
                          className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Toggle Status"
                        >
                          <ArrowPathIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUserMutation.mutate(user.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {users?.data?.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <UserGroupIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada pengguna ditemukan</h3>
          <p className="text-gray-500 mb-6">Coba ubah filter pencarian Anda</p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Tambah Pengguna Pertama</span>
          </button>
        </div>
      )}

      {/* Pagination */}
      {users?.data?.length > 0 && users?.total > perPage && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan <span className="font-semibold">{users?.from || 0}</span> - <span className="font-semibold">{users?.to || 0}</span> dari <span className="font-semibold">{users?.total || 0}</span> pengguna
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sebelumnya
              </button>
              <span className="px-3 py-1.5 text-sm font-medium text-gray-700">
                Halaman {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={users?.to >= users?.total}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                    {editingUser ? (
                      <PencilIcon className="w-5 h-5 text-white" />
                    ) : (
                      <UserCircleIcon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {editingUser ? 'Perbarui informasi pengguna' : 'Isi formulir untuk menambahkan pengguna baru'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingUser(null)
                    reset()
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    {...register('name', { required: 'Nama wajib diisi' })}
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
                    Email *
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email wajib diisi',
                      pattern: {
                        value: /^\S+@\S+$/i,
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
                    Telepon
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="input"
                    placeholder="+62 812-3456-7890"
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      {...register('password', {
                        required: 'Password wajib diisi',
                        minLength: { value: 8, message: 'Minimal 8 karakter' }
                      })}
                      type="password"
                      className="input"
                      placeholder="Masukkan password"
                    />
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <XCircleIcon className="w-4 h-4 mr-1" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    {...register('role_id', { required: 'Role wajib dipilih' })}
                    className="input"
                  >
                    <option value="">Pilih Role</option>
                    {roles?.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.display_name}
                      </option>
                    ))}
                  </select>
                  {errors.role_id && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <XCircleIcon className="w-4 h-4 mr-1" />
                      {errors.role_id.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    {...register('is_active')}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    defaultChecked
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Aktifkan akun
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingUser(null)
                      reset()
                    }}
                    className="btn btn-secondary flex-1"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={createUserMutation.isLoading || updateUserMutation.isLoading}
                    className="btn btn-primary flex-1"
                  >
                    {(createUserMutation.isLoading || updateUserMutation.isLoading) ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menyimpan...
                      </>
                    ) : editingUser ? 'Perbarui' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
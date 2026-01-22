import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await login(data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Email atau password salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 font-sans selection:bg-blue-100">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/unpadflyday.jpg"
          alt="Universitas Padjadjaran"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-black/40 to-blue-900/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-4xl animate-in fade-in zoom-in duration-500">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-white/20">

          {/* Left Side - Form */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12">
            <div className="flex flex-col items-center mb-8">
              <img
                src="/unpad.png"
                alt="Logo UNPAD"
                className="w-20 h-20 object-contain mb-4 drop-shadow-sm"
              />
              <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight text-center">
                Sistem Ticket Universitas Padjadjaran
              </h1>
              <p className="text-gray-500 text-sm mt-1">Silakan masuk ke akun Anda</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                  Email University
                </label>
                <div className="relative transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-600 rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    {...register('email', {
                      required: 'Email wajib diisi',
                      pattern: { value: /^\S+@\S+$/i, message: 'Format email tidak valid' }
                    })}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all"
                    placeholder="nama@unpad.ac.id"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>}
              </div>

              {/* Password Field */}
              <div className="group">
                <div className="flex justify-between items-center mb-1 ml-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-xs text-blue-600 hover:underline">Lupa Password?</Link>
                </div>
                <div className="relative transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-600 rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    {...register('password', { required: 'Password wajib diisi' })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 hover:bg-[#002B5B] text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-blue-900/20 transform transition-all active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : 'Masuk ke Portal'}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm text-gray-500">
                Belum memiliki akun?{' '}
                <Link to="/register" className="text-blue-700 hover:text-blue-800 font-bold decoration-2 hover:underline underline-offset-4">
                  Daftar Sekarang
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Info/Brand */}
          <div className="hidden lg:block lg:w-1/2 relative bg-blue-900">
            <img
              src="/unpadflyday.jpg"
              alt="Unpad Campus"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white">
              <div className="bg-yellow-400 h-1.5 w-16 mb-6 rounded-full"></div>
              <h2 className="text-3xl font-bold mb-4">Membangun Masa Depan Bersama</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Akses layanan tiket mahasiswa dan akademik dengan satu akun terintegrasi.
              </p>
              <div className="mt-8 pt-8 border-t border-white/20 w-full flex justify-around text-xs font-medium uppercase tracking-widest opacity-80">
                <span>Cepat</span>
                <span>•</span>
                <span>Efisien</span>
                <span>•</span>
                <span>Terpadu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <p className="text-center text-white/60 text-[10px] mt-6 tracking-[0.2em] uppercase">
          © {new Date().getFullYear()} Universitas Padjadjaran • Integrated Digital System
        </p>
      </div>
    </div>
  )
}

export default Login

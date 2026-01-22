import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline'

function Register() {
  const [step, setStep] = useState(1) // 1: email, 2: otp + details
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(300) // 5 minutes
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser } = useAuth()
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const otpRefs = useRef([])

  const password = watch('password')

  const sendOtp = async (data) => {
    setLoading(true)
    try {
      await authService.sendOtp({
        email: data.email,
        name: data.name,
        password: data.password
      })
      setEmail(data.email)
      setStep(2)
      startCountdown()
      toast.success('OTP sent to your email!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const startCountdown = () => {
    setCountdown(300)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Auto focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const verifyAndRegister = async () => {
    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      toast.error('Please enter complete OTP code')
      return
    }
    
    setLoading(true)
    try {
      const response = await authService.verifyOtp({
        email,
        otp: otpCode
      })
      
      toast.success('Registration successful! Please login to continue.')
      
      // Delay redirect to show toast message
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
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

      {/* Register Card */}
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
                {step === 1 ? 'Buat Akun Baru' : 'Verifikasi Email'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {step === 1 ? 'Bergabung dengan Portal Tiket Terpadu' : 'Masukkan kode verifikasi'}
              </p>
            </div>

            {step === 1 ? (
              <form className="space-y-5" onSubmit={handleSubmit(sendOtp)}>
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

                {/* Name Field */}
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                    Nama Lengkap
                  </label>
                  <div className="relative transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-600 rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      {...register('name', { required: 'Nama wajib diisi' })}
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name.message}</p>}
                </div>

                {/* Password Field */}
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                    Password
                  </label>
                  <div className="relative transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-600 rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      {...register('password', {
                        required: 'Password wajib diisi',
                        minLength: { value: 8, message: 'Password minimal 8 karakter' }
                      })}
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

                {/* Confirm Password Field */}
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                    Konfirmasi Password
                  </label>
                  <div className="relative transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-600 rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      {...register('password_confirmation', {
                        required: 'Konfirmasi password wajib diisi',
                        validate: value => value === password || 'Password tidak cocok'
                      })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password_confirmation && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password_confirmation.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-900 hover:bg-[#002B5B] text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-blue-900/20 transform transition-all active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Mengirim OTP...
                    </>
                  ) : 'Daftar Akun'}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Masukkan kode verifikasi yang telah dikirim ke:
                  </p>
                  <p className="text-sm font-medium text-gray-900 mb-6">{email}</p>
                  
                  {/* OTP Input Boxes */}
                  <div className="flex justify-center space-x-3 mb-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => otpRefs.current[index] = el}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 focus:bg-white transition-all"
                      />
                    ))}
                  </div>
                  
                  {/* Countdown Timer */}
                  <p className="text-sm text-gray-600 mb-6">
                    Kirim ulang OTP dalam {formatTime(countdown)} detik
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition-all active:scale-[0.98]"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={verifyAndRegister}
                    disabled={loading || otp.join('').length !== 6}
                    className="flex-1 bg-blue-900 hover:bg-[#002B5B] disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-blue-900/20 transform transition-all active:scale-[0.98] disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Memverifikasi...
                      </>
                    ) : 'Verifikasi & Buat Akun'}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-10 text-center">
              <p className="text-sm text-gray-500">
                Sudah memiliki akun?{' '}
                <Link to="/" className="text-blue-700 hover:text-blue-800 font-bold decoration-2 hover:underline underline-offset-4">
                  Masuk Sekarang
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
              <h2 className="text-3xl font-bold mb-4">Bergabung dengan Kami</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Daftar sekarang dan nikmati kemudahan akses layanan tiket terintegrasi.
              </p>
              <div className="mt-8 pt-8 border-t border-white/20 w-full flex justify-around text-xs font-medium uppercase tracking-widest opacity-80">
                <span>Mudah</span>
                <span>•</span>
                <span>Aman</span>
                <span>•</span>
                <span>Terpercaya</span>
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

export default Register
import React, { useState } from 'react'
import { 
  MagnifyingGlassIcon, 
  BookOpenIcon, 
  QuestionMarkCircleIcon, 
  ChevronRightIcon,
  ArrowLeftIcon,
  EyeIcon,
  ClockIcon,
  DocumentTextIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { 
  BookOpenIcon as BookOpenSolid,
  QuestionMarkCircleIcon as QuestionMarkCircleSolid 
} from '@heroicons/react/24/solid'

function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedArticle, setSelectedArticle] = useState(null)

  const categories = [
    { id: 'all', name: 'Semua Artikel', count: 12, icon: BookOpenSolid, color: 'bg-blue-500' },
    { id: 'getting-started', name: 'Panduan Awal', count: 3, icon: BookOpenIcon, color: 'bg-green-500' },
    { id: 'troubleshooting', name: 'Pemecahan Masalah', count: 5, icon: QuestionMarkCircleIcon, color: 'bg-red-500' },
    { id: 'faq', name: 'FAQ Umum', count: 4, icon: QuestionMarkCircleSolid, color: 'bg-purple-500' }
  ]

  const articles = [
    {
      id: 1,
      title: 'Cara Membuat Tiket Baru',
      category: 'getting-started',
      description: 'Panduan lengkap untuk membuat tiket pengaduan baru di sistem.',
      content: `
        <div class="space-y-4">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold text-blue-800 mb-2">📌 Informasi Penting</h4>
            <p class="text-blue-700 text-sm">Pastikan semua informasi yang dimasukkan sudah benar sebelum mengirim tiket.</p>
          </div>
          
          <h3 class="text-xl font-semibold text-gray-900">Langkah-langkah Membuat Tiket:</h3>
          <ol class="space-y-3 pl-5">
            <li class="flex items-start">
              <span class="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium -ml-8 mr-3 flex-shrink-0">1</span>
              <span>Klik menu <strong>"Buat Tiket"</strong> di sidebar</span>
            </li>
            <li class="flex items-start">
              <span class="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium -ml-8 mr-3 flex-shrink-0">2</span>
              <span>Isi judul tiket dengan jelas dan deskriptif</span>
            </li>
            <li class="flex items-start">
              <span class="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium -ml-8 mr-3 flex-shrink-0">3</span>
              <span>Pilih kategori yang sesuai</span>
            </li>
            <li class="flex items-start">
              <span class="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium -ml-8 mr-3 flex-shrink-0">4</span>
              <span>Pilih prioritas (Low, Medium, High, Critical)</span>
            </li>
            <li class="flex items-start">
              <span class="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium -ml-8 mr-3 flex-shrink-0">5</span>
              <span>Tulis deskripsi masalah secara detail</span>
            </li>
            <li class="flex items-start">
              <span class="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium -ml-8 mr-3 flex-shrink-0">6</span>
              <span>Tambahkan lampiran jika diperlukan</span>
            </li>
            <li class="flex items-start">
              <span class="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium -ml-8 mr-3 flex-shrink-0">7</span>
              <span>Klik tombol <strong>"Kirim Tiket"</strong></span>
            </li>
          </ol>
          
          <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <p class="text-gray-700"><strong>💡 Tips:</strong> Tiket akan segera diproses oleh tim kami dalam waktu 1x24 jam.</p>
          </div>
        </div>
      `,
      views: 245,
      readTime: '3 min',
      updatedAt: '2 hari yang lalu'
    },
    {
      id: 2,
      title: 'Cara Melacak Status Tiket',
      category: 'getting-started',
      description: 'Pelajari cara melihat dan melacak status tiket Anda secara real-time.',
      content: `
        <div class="space-y-4">
          <h3 class="text-xl font-semibold text-gray-900">Status Tiket:</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <div class="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                <span class="font-semibold text-blue-800">Open</span>
              </div>
              <p class="text-sm text-gray-700">Tiket baru dibuat dan menunggu ditangani</p>
            </div>
            
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <div class="w-3 h-3 bg-yellow-600 rounded-full mr-2"></div>
                <span class="font-semibold text-yellow-800">In Progress</span>
              </div>
              <p class="text-sm text-gray-700">Tiket sedang ditangani oleh staff</p>
            </div>
            
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <div class="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                <span class="font-semibold text-green-800">Resolved</span>
              </div>
              <p class="text-sm text-gray-700">Masalah sudah diselesaikan</p>
            </div>
            
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <div class="w-3 h-3 bg-gray-600 rounded-full mr-2"></div>
                <span class="font-semibold text-gray-800">Closed</span>
              </div>
              <p class="text-sm text-gray-700">Tiket ditutup</p>
            </div>
          </div>
          
          <p class="mt-4 text-gray-700">Anda dapat melihat status tiket di halaman Dashboard atau melalui menu Tiket → Daftar Tiket.</p>
        </div>
      `,
      views: 189,
      readTime: '2 min',
      updatedAt: '1 minggu yang lalu'
    },
    {
      id: 3,
      title: 'Mengatasi Masalah Login',
      category: 'troubleshooting',
      description: 'Solusi lengkap untuk berbagai masalah login ke sistem.',
      content: `
        <div class="space-y-4">
          <h3 class="text-xl font-semibold text-gray-900">Solusi Masalah Login:</h3>
          
          <div class="space-y-3">
            <div class="bg-red-50 border-l-4 border-red-500 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <span class="text-red-700 font-bold">!</span>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">
                    <strong>Masalah:</strong> Password salah
                  </p>
                  <p class="text-sm text-red-600 mt-1">
                    <strong>Solusi:</strong> Gunakan fitur "Lupa Password" atau hubungi administrator
                  </p>
                </div>
              </div>
            </div>
            
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <span class="text-yellow-700 font-bold">!</span>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-yellow-700">
                    <strong>Masalah:</strong> Akun terkunci
                  </p>
                  <p class="text-sm text-yellow-600 mt-1">
                    <strong>Solusi:</strong> Tunggu 15 menit atau hubungi administrator
                  </p>
                </div>
              </div>
            </div>
            
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <span class="text-blue-700 font-bold">!</span>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-blue-700">
                    <strong>Masalah:</strong> Browser tidak kompatibel
                  </p>
                  <p class="text-sm text-blue-600 mt-1">
                    <strong>Solusi:</strong> Gunakan Chrome/Firefox versi terbaru
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <p class="text-gray-700">
              <strong>📞 Bantuan:</strong> Jika masalah berlanjut, hubungi tim IT support di ext. 1234 atau email support@company.com
            </p>
          </div>
        </div>
      `,
      views: 156,
      readTime: '4 min',
      updatedAt: '3 hari yang lalu'
    },
    {
      id: 4,
      title: 'Cara Menambahkan Lampiran',
      category: 'getting-started',
      description: 'Panduan lengkap untuk menambahkan file lampiran ke tiket.',
      content: `...`,
      views: 134,
      readTime: '2 min',
      updatedAt: '2 minggu yang lalu'
    },
    {
      id: 5,
      title: 'Prioritas Tiket',
      category: 'faq',
      description: 'Memahami tingkat prioritas tiket dan waktu respon.',
      content: `...`,
      views: 201,
      readTime: '3 min',
      updatedAt: '5 hari yang lalu'
    },
    {
      id: 6,
      title: 'Waktu Respons Tiket',
      category: 'faq',
      description: 'Berapa lama waktu yang dibutuhkan untuk mendapat respons?',
      content: `...`,
      views: 178,
      readTime: '2 min',
      updatedAt: '1 minggu yang lalu'
    }
  ]

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (selectedArticle) {
    const categoryInfo = categories.find(c => c.id === selectedArticle.category)
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-6 group"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar Artikel
          </button>
          
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryInfo?.color.replace('bg-', 'bg-')} text-white`}>
                <TagIcon className="w-3 h-3 mr-1" />
                {categoryInfo?.name}
              </span>
              <span className="text-sm text-gray-500 flex items-center">
                <EyeIcon className="w-4 h-4 mr-1" />
                {selectedArticle.views} views
              </span>
              <span className="text-sm text-gray-500 flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                {selectedArticle.readTime}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedArticle.title}</h1>
            <p className="text-gray-600 text-lg mb-6">{selectedArticle.description}</p>
            
            <div className="flex items-center text-sm text-gray-500">
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              Terakhir diperbarui: {selectedArticle.updatedAt}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="prose max-w-none prose-headings:font-semibold prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
              <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
        <div className="max-w-4xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <BookOpenIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Basis Pengetahuan</h1>
              <p className="text-blue-100 mt-1">Temukan jawaban dan panduan untuk menggunakan sistem ticketing</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-6 relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
            <input
              type="text"
              placeholder="Cari artikel, panduan, atau FAQ..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-blue-200">
                {filteredArticles.length} hasil
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Kategori</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-5 rounded-xl border transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`${category.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.count} artikel</p>
                    </div>
                  </div>
                  <ChevronRightIcon className={`w-5 h-5 ${
                    selectedCategory === category.id ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedCategory === 'all' ? 'Semua Artikel' : 
             categories.find(c => c.id === selectedCategory)?.name}
            <span className="ml-2 text-gray-500 text-base font-normal">({filteredArticles.length})</span>
          </h2>
          <div className="text-sm text-gray-500">
            Urutkan: 
            <select className="ml-2 bg-transparent border-none focus:outline-none">
              <option>Paling Populer</option>
              <option>Terbaru</option>
              <option>Judul A-Z</option>
            </select>
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada artikel yang ditemukan</h3>
            <p className="text-gray-500">Coba gunakan kata kunci lain atau pilih kategori yang berbeda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => {
              const categoryInfo = categories.find(c => c.id === article.category)
              return (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryInfo?.color.replace('bg-', 'bg-')} text-white`}>
                        {categoryInfo?.name}
                      </span>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <EyeIcon className="w-3 h-3 mr-1" />
                          {article.views}
                        </span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                      {article.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">Updated {article.updatedAt}</span>
                      <div className="flex items-center text-blue-600 text-sm font-medium">
                        <span className="group-hover:underline">Baca artikel</span>
                        <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-8">
        <div className="flex items-start space-x-6">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Tidak Menemukan Jawaban?</h3>
            <p className="text-gray-700 mb-6">Tim support kami siap membantu Anda. Hubungi kami melalui:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <a href="mailto:support@unpad.ac.id" className="flex items-center space-x-3 p-4 bg-white rounded-xl hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-sm font-semibold text-gray-900">support@unpad.ac.id</p>
                </div>
              </a>
              
              <a href="tel:+622123456789" className="flex items-center space-x-3 p-4 bg-white rounded-xl hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Telepon</p>
                  <p className="text-sm font-semibold text-gray-900">(021) 2345-6789</p>
                </div>
              </a>
              
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-4 bg-white rounded-xl hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">WhatsApp</p>
                  <p className="text-sm font-semibold text-gray-900">+62 812-3456-7890</p>
                </div>
              </a>
            </div>
            
            <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-800">
                <strong>Jam Operasional:</strong> Senin - Jumat, 08:00 - 17:00 WIB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KnowledgeBase
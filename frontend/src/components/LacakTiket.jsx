import { useState } from "react";
import HelpModal from "./HelpModal";
import api from '../services/authService';

export default function LacakTiket() {
    const [ticketId, setTicketId] = useState("");
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [ticketData, setTicketData] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!ticketId.trim()) {
            setError('Masukkan ID tiket yang valid');
            return;
        }

        setIsLoading(true);
        setError('');
        setTicketData(null);
        
        try {
            const response = await api.post('/public/check-ticket', {
                ticket_number: ticketId.trim()
            });
            
            setTicketData(response.data.ticket);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Tiket dengan ID tersebut tidak ditemukan. Pastikan ID tiket yang Anda masukkan benar.');
            } else {
                setError('Terjadi kesalahan saat mencari tiket. Silakan coba lagi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleHelpClick = () => {
        setIsHelpOpen(true);
    };

    const handleCloseHelp = () => {
        setIsHelpOpen(false);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return 'bg-blue-900 text-blue-100';
            case 'in progress': return 'bg-yellow-100 text-yellow-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-red-100 text-red-800';
            case 'critical': return 'bg-red-200 text-red-900';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <section className="py-16 bg-gradient-to-br from-white via-slate-50 to-slate-100">
            <div className="max-w-3xl mx-auto px-6">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-300 hover:shadow-2xl transition-shadow duration-300">
                    {/* Header dengan icon */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-900 to-slate-900 mb-4 shadow-lg shadow-blue-950/25">
                            <img src="/logo/track.png" alt="Tracking" className="w-9 h-9" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Lacak Status Tiket
                        </h2>
                        <p className="text-gray-700 max-w-md mx-auto">
                            Masukkan ID tiket untuk mengetahui status pengaduan
                            Anda secara real-time
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="ticketId"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                ID Tiket
                            </label>
                            <div className="relative">
                                <input
                                    id="ticketId"
                                    type="text"
                                    value={ticketId}
                                    onChange={(e) =>
                                        setTicketId(e.target.value)
                                    }
                                    placeholder="Contoh: TKT-2024-00123"
                                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-slate-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <span className="text-blue-900"><img src="/logo/search.png" alt="search" className="w-6 h-6 object-contain" /></span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                ID tiket dapat ditemukan di email konfirmasi
                                atau dashboard Anda
                            </p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 text-red-500">
                                        <svg fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-red-700 text-sm font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-900 to-slate-900 text-white font-semibold hover:shadow-lg hover:shadow-blue-950/25 hover:from-blue-950 hover:to-slate-950 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Mencari...</span>
                                    </div>
                                ) : (
                                    'Lacak Tiket'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleHelpClick}
                                className="px-6 py-3.5 rounded-xl border-2 border-slate-300 text-gray-700 font-medium hover:border-blue-900 hover:text-blue-950 hover:bg-slate-50 transition-all"
                            >
                                Butuh Bantuan?
                            </button>
                        </div>
                    </form>

                    {/* Ticket Data Display */}
                    {ticketData && (
                        <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Detail Tiket</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <span className="text-sm text-gray-600">ID Tiket:</span>
                                    <p className="font-medium text-gray-900">{ticketData.ticket_number}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Tanggal Dibuat:</span>
                                    <p className="font-medium text-gray-900">{ticketData.created_at}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <span className="text-sm text-gray-600">Kategori:</span>
                                    <p className="font-medium text-gray-900">{ticketData.category}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Terakhir Diupdate:</span>
                                    <p className="font-medium text-gray-900">{ticketData.updated_at}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <span className="text-sm text-gray-600">Judul:</span>
                                <p className="font-medium text-gray-900">{ticketData.title}</p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div>
                                    <span className="text-sm text-gray-600">Status:</span>
                                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticketData.status)}`}>
                                        {ticketData.status}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Prioritas:</span>
                                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticketData.priority)}`}>
                                        {ticketData.priority}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-slate-100 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-900 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-slate-800 font-medium">
                                        Tiket sedang dalam proses penanganan
                                    </span>
                                </div>
                                <p className="text-sm text-slate-700 mt-1">
                                    Anda akan mendapat notifikasi ketika ada update terbaru
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center group">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-blue-900 mb-2 group-hover:bg-slate-300 group-hover:text-blue-950 transition-colors">
                                    <img src="/logo/petir 1.png" alt="Petir" className="w-7 h-7 object-contain" />
                                </div>
                                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-950 transition-colors">
                                    Proses Cepat
                                </p>
                                <p className="text-xs text-gray-700">
                                    24/7 monitoring
                                </p>
                            </div>

                            <div className="text-center group">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-blue-900 mb-2 group-hover:bg-slate-300 group-hover:text-blue-950 transition-colors">
                                     <img src="/logo/grafik.png" alt="Grafik" className="w-7 h-7 object-contain" />
                                </div>
                                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-950 transition-colors">
                                    Status Real-time
                                </p>
                                <p className="text-xs text-gray-700">
                                    Update langsung
                                </p>
                            </div>

                            <div className="text-center group">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-blue-900 mb-2 group-hover:bg-slate-300 group-hover:text-blue-950 transition-colors">
                                    <img src="/logo/safe.png" alt="safe" className="w-7 h-7 object-contain" />
                                </div>
                                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-950 transition-colors">
                                    Data Aman
                                </p>
                                <p className="text-xs text-gray-700">
                                    Terkunci rapat
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <HelpModal 
                isOpen={isHelpOpen}
                onClose={handleCloseHelp}
            />
        </section>
    );
}
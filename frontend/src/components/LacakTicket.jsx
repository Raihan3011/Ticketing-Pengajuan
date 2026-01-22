import { useState } from "react";

export default function LacakTiket() {
    const [ticketId, setTicketId] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Mencari tiket ID: ${ticketId}`);
    };

    return (
        <section className="py-16 bg-gradient-to-br from-white via-blue-50 to-blue-100">
            <div className="max-w-3xl mx-auto px-6">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-200 hover:shadow-2xl transition-shadow duration-300">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 mb-4 shadow-lg shadow-blue-500/25">
                            <span className="text-2xl text-white">📍</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Lacak Status Tiket
                        </h2>
                        <p className="text-gray-700 max-w-md mx-auto">
                            Masukkan ID tiket untuk mengetahui status pengaduan
                            Anda secara real-time
                        </p>
                    </div>
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
                                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-blue-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <span className="text-blue-500">🔍</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                ID tiket dapat ditemukan di email konfirmasi
                                atau dashboard Anda
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <button
                                type="submit"
                                className="flex-1 w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:from-blue-700 hover:to-blue-900 transition-all transform hover:-translate-y-0.5"
                            >
                                Lacak Tiket
                            </button>

                            <button
                                type="button"
                                onClick={() => alert("Bantuan tiket")}
                                className="px-6 py-3.5 rounded-xl border-2 border-blue-200 text-gray-700 font-medium hover:border-blue-400 hover:text-blue-800 hover:bg-blue-50 transition-all"
                            >
                                Butuh Bantuan?
                            </button>
                        </div>
                    </form>
                    <div className="mt-8 pt-6 border-t border-blue-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center group">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mb-2 group-hover:bg-blue-200 group-hover:text-blue-700 transition-colors">
                                    ⚡
                                </div>
                                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                                    Proses Cepat
                                </p>
                                <p className="text-xs text-gray-700">
                                    24/7 monitoring
                                </p>
                            </div>

                            <div className="text-center group">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mb-2 group-hover:bg-blue-200 group-hover:text-blue-700 transition-colors">
                                    📊
                                </div>
                                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                                    Status Real-time
                                </p>
                                <p className="text-xs text-gray-700">
                                    Update langsung
                                </p>
                            </div>

                            <div className="text-center group">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mb-2 group-hover:bg-blue-200 group-hover:text-blue-700 transition-colors">
                                    🔒
                                </div>
                                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
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
        </section>
    );
}

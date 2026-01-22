import { useEffect } from "react";

const HelpModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const helpSteps = [
        {
            icon: (
                <img
                    src="/logo/mail.png"
                    alt="Mail"
                    className="w-9 h-9 object-contain"
                />
            ),
            title: "Cek Email Konfirmasi",
            description:
                "ID tiket telah dikirimkan ke email Anda saat pengaduan dibuat",
            details: [
                "Format ID: TKT-2024-XXXXX",
                "Cari di inbox atau spam folder",
            ],
            color: "blue",
        },
        {
            icon: (
                <img
                    src="/logo/search.png"
                    alt="Search"
                    className="w-7 h-7 object-contain"
                />
            ),
            title: "Masukkan ID Tiket",
            description:
                "Salin ID tiket dari email ke form pelacakan di halaman utama",
            details: [
                "Paste ID di kolom pencarian",
                "Klik tombol 'Lacak' untuk memulai",
            ],
            color: "cyan",
        },
        {
            icon: (
                <img
                    src="/logo/grafik.png"
                    alt="Search"
                    className="w-8 h-8 object-contain"
                />
            ),
            title: "Lihat Status & Detail",
            description:
                "Sistem akan menampilkan informasi lengkap tentang tiket Anda",
            details: [
                "Status terkini",
                "Petugas penanggung jawab",
                "Estimasi penyelesaian",
            ],
            color: "indigo",
        },
        {
            icon: (
                <img
                    src="/logo/time.png"
                    alt="Search"
                    className="w-14 h-14 object-contain"
                />
            ),
            title: "Waktu Respon",
            description: "Tim kami akan merespon tiket sesuai prioritas",
            details: [
                "Penting: ≤ 4 jam",
                "Sedang: ≤ 8 jam",
                "Rendah: ≤ 24 jam",
            ],
            color: "purple",
        },
    ];

    const contactOptions = [
        {
            icon: <img
                    src="/logo/mail.png"
                    alt="Mail"
                    className="w-8 h-8 object-contain"
                />,
            label: "Email",
            value: "helpdesk@unpad.ac.id",
            action: "mailto:helpdesk@unpad.ac.id",
        },
        {
            icon: <img
                    src="/logo/phone.png"
                    alt="Mail"
                    className="w-8 h-8 object-contain"
                />,
            label: "Telepon",
            value: "(022) 842-88888",
            action: "tel:+622284288888",
        },
        {
            icon: <img
                    src="/logo/location.png"
                    alt="Mail"
                    className="w-8 h-8 object-contain"
                />,
            label: "Lokasi",
            value: "Gedung Rektorat Lt. 1",
            action: "#location",
        },
    ];

    const faqItems = [
        {
            q: "Apa yang harus dilakukan jika lupa ID tiket?",
            a: "Cek email konfirmasi atau hubungi helpdesk dengan menyebutkan nama dan tanggal pembuatan tiket.",
        },
        {
            q: "Berapa lama tiket biasanya ditangani?",
            a: "Bergantung pada kompleksitas masalah, rata-rata 2-5 hari kerja.",
        },
        {
            q: "Bisakah memperbarui informasi tiket?",
            a: "Ya, balas email konfirmasi atau hubungi petugas yang ditugaskan.",
        },
        {
            q: "Apa saja kategori prioritas tiket?",
            a: "Kritis, Tinggi, Sedang, dan Rendah berdasarkan dampak masalah.",
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl max-w-4xl w-full shadow-2xl border border-blue-100 overflow-hidden animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <span className="text-2xl">
                                    <img
                                        src="/logo/fahmi.png"
                                        alt="Petir"
                                        className="w-9 h-9 object-contain"
                                    />
                                </span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold font-['Inter']">
                                    Pusat Bantuan Pelacakan
                                </h2>
                                <p className="text-blue-200 text-sm mt-1">
                                    Panduan lengkap menggunakan sistem pelacakan
                                    tiket
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl transition-colors backdrop-blur-sm"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="max-h-[70vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="mb-8 text-center">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Cara Melacak Status Tiket Anda
                            </h3>
                            <p className="text-gray-600">
                                Ikuti langkah-langkah sederhana ini untuk
                                memantau perkembangan pengaduan Anda
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            {helpSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-all hover:shadow-lg group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${step.color}-100 to-${step.color}-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}
                                        >
                                            {step.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                                    Langkah {index + 1}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-1">
                                                {step.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-3">
                                                {step.description}
                                            </p>
                                            <ul className="space-y-1">
                                                {step.details.map(
                                                    (detail, i) => (
                                                        <li
                                                            key={i}
                                                            className="text-xs text-gray-500 flex items-center gap-2"
                                                        >
                                                            <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                                                            {detail}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-xl">❓</span> Pertanyaan
                                Umum
                            </h3>
                            <div className="space-y-3">
                                {faqItems.map((faq, index) => (
                                    <details
                                        key={index}
                                        className="group bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                                    >
                                        <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                                            <span className="font-medium text-gray-800">
                                                {faq.q}
                                            </span>
                                            <span className="text-gray-500 group-open:rotate-180 transition-transform">
                                                ▼
                                            </span>
                                        </summary>
                                        <div className="px-4 pb-4 pt-2 border-t border-gray-200">
                                            <p className="text-sm text-gray-600">
                                                {faq.a}
                                            </p>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-xl">📞</span>Butuh
                                Bantuan Langsung?
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {contactOptions.map((contact, index) => (
                                    <a
                                        key={index}
                                        href={contact.action}
                                        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all group"
                                        onClick={(e) => {
                                            if (
                                                contact.action.startsWith("#")
                                            ) {
                                                e.preventDefault();
                                                onClose();
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-200 transition-colors">
                                                <span className="text-lg">
                                                    {contact.icon}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-700">
                                                        {contact.label}
                                                    </p>
                                                    {contact.badge && (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                                            {contact.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-900 font-semibold mt-1">
                                                    {contact.value}
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600">
                            <p>
                                🕒 Jam Operasional: Senin - Jumat, 08:00 - 17:00
                                WIB
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Nanti Saja
                            </button>
                            <button
                                onClick={() => {
                                    onClose();
                                    setTimeout(() => {
                                        const searchInput = document.querySelector(
                                            'input[type="text"], input[placeholder*="tiket"], input[placeholder*="ID"]'
                                        );
                                        if (searchInput) {
                                            searchInput.scrollIntoView({
                                                behavior: "smooth",
                                                block: "center"
                                            });
                                            searchInput.focus();
                                        }
                                    }, 100);
                                }}
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-700 to-blue-800 text-white font-semibold rounded-xl hover:from-blue-800 hover:to-blue-900 transition-all shadow-md"
                            >
                                 Mulai Lacak Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
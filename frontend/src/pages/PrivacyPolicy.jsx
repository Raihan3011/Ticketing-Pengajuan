import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import CardNav from "/src/components/CardNav";
import Footer from "/src/components/Footer";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
    const navigate = useNavigate();
    const contentRef = useRef(null);
    const [isVisible, setIsVisible] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        setIsVisible((prev) => ({ ...prev, [id]: true }));
                    }
                });
            },
            { threshold: 0.1, rootMargin: "-50px" }
        );

        document.querySelectorAll('[id^="section-"]').forEach((section) => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(`section-${sectionId}`);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
                elementPosition + window.pageYOffset - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    const navItems = [
        {
            label: "Beranda",
            bgColor: "#1e40af",
            textColor: "#fff",
            onClick: () => navigate("/"),
        },
    ];

    const sectionList = [
        { id: "pendahuluan", label: "1. Pendahuluan" },
        {
            id: "informasiyangkamikumpulkan",
            label: "2. Informasi yang Kami Kumpulkan",
        },
        {
            id: "penggunaaninformasi",
            label: "3. Penggunaan Informasi",
        },
        { id: "perlindungandata", label: "4. Perlindungan Data" },
        { id: "hakpengguna", label: "5. Hak Pengguna" },
        {
            id: "cookiesdanteknologipelacakan",
            label: "6. Cookies & Teknologi Pelacakan",
        },
        {
            id: "perubahankebijakan",
            label: "7. Perubahan Kebijakan",
        },
        { id: "hubungikami", label: "Hubungi Kami" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 text-gray-900">
            <CardNav
                logo="./public/unpad.png"
                logoAlt="Unpad Logo"
                items={navItems}
                baseColor="#ffffff"
                menuColor="#374151"
                hideLacakTiket={true}
            />

            <main className="pt-24 pb-16">
                {/* Hero Section with Animation */}
                <section className="relative py-16 bg-gradient-to-br from-blue-900 via-navy-800 to-blue-900 overflow-hidden">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-blue-700 opacity-10 animate-pulse"></div>
                        <div
                            className="absolute top-1/4 right-10 w-16 h-16 rounded-full bg-blue-600 opacity-5 animate-bounce"
                            style={{ animationDelay: "0.5s" }}
                        ></div>
                        <div
                            className="absolute bottom-10 left-1/4 w-20 h-20 rounded-full bg-blue-800 opacity-10 animate-pulse"
                            style={{ animationDelay: "1s" }}
                        ></div>
                    </div>

                    <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
                        <div className="inline-block mb-4 p-3 rounded-full bg-blue-800/20 backdrop-blur-sm">
                            <svg
                                className="w-12 h-12 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
                            Kebijakan Privasi
                        </h1>
                        <p className="text-xl text-blue-100 mb-4">
                            Komitmen Kami dalam Melindungi Data Anda
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-800/30 backdrop-blur-sm rounded-full border border-blue-700/30">
                            <svg
                                className="w-4 h-4 text-blue-200 animate-spin-slow"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="text-blue-100 text-sm">
                                Terakhir diperbarui:{" "}
                                {new Date().toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-12" ref={contentRef}>
                    <div className="mx-auto max-w-4xl px-4 sm:px-6">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 sm:p-8 md:p-12 transform transition-all duration-300 hover:shadow-2xl">
                            {/* Pendahuluan */}
                            <motion.div
                                className="mb-10 scroll-mt-24"
                                id="section-pendahuluan"
                                initial={{ opacity: 0, y: 30 }}
                                animate={
                                    isVisible["section-pendahuluan"]
                                        ? { opacity: 1, y: 0 }
                                        : {}
                                }
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center gap-2">
                                    <svg
                                        className="w-6 h-6 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    1. Pendahuluan
                                </h2>
                                <div className="text-gray-700 leading-relaxed space-y-4">
                                    <p className="transform transition-all duration-300 hover:translate-x-1">
                                        Selamat datang di{" "}
                                        <span className="font-semibold text-blue-700">
                                            Sistem Tiket Universitas Padjadjaran
                                        </span>
                                        . Kami berkomitmen untuk melindungi
                                        privasi dan keamanan data pribadi Anda.
                                        Kebijakan Privasi ini menjelaskan
                                        bagaimana kami mengumpulkan,
                                        menggunakan, dan melindungi informasi
                                        Anda saat menggunakan layanan kami.
                                    </p>
                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 border-l-4 border-blue-600 transform transition-all duration-300 hover:scale-[1.01]">
                                        <p className="flex items-start gap-3">
                                            <svg
                                                className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span>
                                                Dengan menggunakan layanan kami,
                                                Anda menyetujui pengumpulan dan
                                                penggunaan informasi sesuai
                                                dengan kebijakan ini. Kami
                                                berkomitmen untuk memastikan
                                                transparansi dalam pengelolaan
                                                data Anda.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Informasi yang Dikumpulkan */}
                            <motion.div
                                className="mb-10 scroll-mt-24"
                                id="section-informasiyangkamikumpulkan"
                                initial={{ opacity: 0, y: 30 }}
                                animate={
                                    isVisible[
                                        "section-informasiyangkamikumpulkan"
                                    ]
                                        ? { opacity: 1, y: 0 }
                                        : {}
                                }
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600 flex items-center gap-2">
                                    <svg
                                        className="w-6 h-6 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    2. Informasi yang Kami Kumpulkan
                                </h2>
                                <div className="space-y-6">
                                    <div className="group bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border-l-4 border-blue-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-700">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                                2.1
                                            </div>
                                            Informasi Pribadi
                                        </h3>
                                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                                            {[
                                                "Nama lengkap",
                                                "Nomor Induk Mahasiswa (NIM) atau Nomor Induk Pegawai (NIP)",
                                                "Alamat email",
                                                "Nomor telepon",
                                                "Fakultas/Unit kerja",
                                            ].map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="transform transition-all duration-200 hover:translate-x-1 flex items-center gap-2"
                                                >
                                                    <svg
                                                        className="w-4 h-4 text-blue-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="group bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border-l-4 border-blue-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-700">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                                2.2
                                            </div>
                                            Informasi Tiket
                                        </h3>
                                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                                            {[
                                                "Deskripsi masalah atau keluhan",
                                                "Kategori tiket",
                                                "File lampiran (jika ada)",
                                                "Riwayat komunikasi terkait tiket",
                                                "Status dan timeline penyelesaian",
                                            ].map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="transform transition-all duration-200 hover:translate-x-1 flex items-center gap-2"
                                                >
                                                    <svg
                                                        className="w-4 h-4 text-blue-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="group bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border-l-4 border-blue-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-700">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                                2.3
                                            </div>
                                            Informasi Teknis
                                        </h3>
                                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                                            {[
                                                "Alamat IP",
                                                "Jenis browser dan perangkat",
                                                "Waktu akses sistem",
                                                "Log aktivitas pengguna",
                                            ].map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="transform transition-all duration-200 hover:translate-x-1 flex items-center gap-2"
                                                >
                                                    <svg
                                                        className="w-4 h-4 text-blue-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Kontak */}
                            <motion.div
                                className="scroll-mt-24 mb-16"
                                id="section-hubungikami"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={
                                    isVisible["section-hubungikami"]
                                        ? { opacity: 1, scale: 1 }
                                        : {}
                                }
                                transition={{ duration: 0.6 }}
                            >
                                <motion.div
                                    className="bg-gradient-to-r from-blue-100 via-white to-cyan-100 rounded-3xl p-10 border-4 border-blue-300 shadow-2xl relative overflow-hidden"
                                    whileHover={{
                                        boxShadow:
                                            "0 30px 60px -15px rgba(30, 64, 175, 0.4)",
                                    }}
                                >
                                    <motion.h2
                                        className="text-3xl font-bold text-gray-900 mb-6 relative z-10"
                                        animate={{
                                            backgroundPosition: [
                                                "0% 50%",
                                                "100% 50%",
                                                "0% 50%",
                                            ],
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                        }}
                                        style={{
                                            background:
                                                "linear-gradient(90deg, #1e3a8a, #3b82f6, #0ea5e9, #1e3a8a)",
                                            backgroundSize: "300% 100%",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }}
                                    >
                                        Hubungi Kami
                                    </motion.h2>

                                    <p className="text-gray-700 leading-relaxed mb-8 relative z-10">
                                        Jika Anda memiliki pertanyaan tentang
                                        Kebijakan Privasi ini atau ingin
                                        menggunakan hak Anda, silakan hubungi
                                        kami:
                                    </p>

                                    <div className="space-y-6 relative z-10">
                                        {[
                                            {
                                                icon: (
                                                    <svg
                                                        className="w-6 h-6 text-blue-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                ),
                                                text: "Email:",
                                                content: "privacy@unpad.ac.id",
                                                href: "mailto:privacy@unpad.ac.id",
                                            },
                                            {
                                                icon: (
                                                    <svg
                                                        className="w-6 h-6 text-blue-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                        />
                                                    </svg>
                                                ),
                                                text: "Telepon:",
                                                content: "(022) 8784-3000",
                                                href: "tel:+622287843000",
                                            },
                                            {
                                                icon: (
                                                    <svg
                                                        className="w-6 h-6 text-blue-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                    </svg>
                                                ),
                                                text: "Alamat:",
                                                content:
                                                    "Jl. Raya Bandung-Sumedang KM.21, Jatinangor, Sumedang 45363",
                                            },
                                        ].map((contact, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex items-start gap-5 p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-sm"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={
                                                    isVisible[
                                                        "section-hubungikami"
                                                    ]
                                                        ? { y: 0, opacity: 1 }
                                                        : {}
                                                }
                                                transition={{
                                                    delay: index * 0.2,
                                                }}
                                                whileHover={{
                                                    y: -3,
                                                    backgroundColor:
                                                        "rgba(255, 255, 255, 1)",
                                                    boxShadow:
                                                        "0 10px 25px -5px rgba(30, 64, 175, 0.2)",
                                                }}
                                            >
                                                <div>{contact.icon}</div>
                                                <div>
                                                    <span className="font-medium text-gray-900">
                                                        {contact.text}{" "}
                                                    </span>
                                                    {contact.href ? (
                                                        <a
                                                            href={contact.href}
                                                            className="text-blue-600 hover:underline font-semibold"
                                                        >
                                                            {contact.content}
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-700">
                                                            {contact.content}
                                                        </span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <button
                                onClick={() => {
                                    navigate("/");
                                    window.scrollTo(0, 0);
                                }}
                                className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                            >
                                <svg
                                    className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Kembali ke Beranda
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
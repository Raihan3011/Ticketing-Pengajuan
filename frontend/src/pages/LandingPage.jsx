import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LacakTiket from "/src/components/LacakTiket";
import CardNav from "/src/components/CardNav";
import Stepper, { Step } from "../components/Stepper";
import FAQSection from "../components/FAQSection";
import FeatureModal from "../components/FeatureModal";
import Footer from "../components/Footer";

export default function LandingPage() {
    const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [isVisible, setIsVisible] = useState({});
    const [currentSlide, setCurrentSlide] = useState(0);

    const carouselImages = [
        "/landing-picture/unpad-02.jpg",
        "/landing-picture/unpad-03.jpg",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [carouselImages.length]);

    useEffect(() => {
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
        let element;
        if (sectionId === "lacak") {
            element = document.getElementById("lacak");
        } else {
            element = document.getElementById(`section-${sectionId}`);
        }
        if (element) {
            const offsetTop = element.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: "smooth",
            });
        }
    };

    const navItems = [
        {
            label: "Fitur",
            bgColor: "#1e40af",
            textColor: "#fff",
            links: [
                {
                    label: "Manajemen Tiket",
                    ariaLabel: "Fitur Manajemen Tiket",
                },
                {
                    label: "Tracking Real-time",
                    ariaLabel: "Fitur Tracking Real-time",
                },
                { label: "Notifikasi", ariaLabel: "Fitur Notifikasi" },
            ],
        },
        {
            label: "Alur",
            bgColor: "#1d4ed8",
            textColor: "#fff",
            links: [
                { label: "Buat Laporan", ariaLabel: "Cara Buat Laporan" },
                { label: "Verifikasi", ariaLabel: "Proses Verifikasi" },
                { label: "Penanganan", ariaLabel: "Proses Penanganan" },
            ],
        },
        {
            label: "Bantuan",
            bgColor: "#0f172a",
            textColor: "#fff",
            links: [
                { label: "FAQ", ariaLabel: "Frequently Asked Questions" },
                { label: "Panduan", ariaLabel: "Panduan Penggunaan" },
                { label: "Kontak", ariaLabel: "Hubungi Kami" },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* ================= CARD NAV ================= */}
            <CardNav
                logo="/unpad.png"
                logoAlt="Unpad Logo"
                items={navItems}
                baseColor="rgba(255, 255, 255, 0.95)"
                menuColor="#374151"
                onScrollToSection={scrollToSection}
            />
            <main>
                {/* ================= CAROUSEL BANNER ================= */}
                <section className="relative h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden -mt-24 pt-24">
                    <a
                        href="https://www.unpad.ac.id/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                    >
                        {carouselImages.map((image, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ${
                                    index === currentSlide
                                        ? "opacity-100"
                                        : "opacity-0"
                                }`}
                            >
                                <img
                                    src={image}
                                    alt={`Unpad Banner ${index + 1}`}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                        ))}
                    </a>

                    {/* Navigation Arrows */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentSlide((prev) =>
                                prev === 0
                                    ? carouselImages.length - 1
                                    : prev - 1
                            );
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-all z-10"
                        aria-label="Previous slide"
                    >
                        <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentSlide(
                                (prev) => (prev + 1) % carouselImages.length
                            );
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-all z-10"
                        aria-label="Next slide"
                    >
                        <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {carouselImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentSlide(index);
                                }}
                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                                    index === currentSlide
                                        ? "bg-white w-6 sm:w-8"
                                        : "bg-white/50 hover:bg-white/75"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </section>

                {/* ================= WELCOME SECTION ================= */}
                <section className="py-16 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="flex justify-center">
                            <a
                                href="https://www.unpad.ac.id/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block"
                            >
                                <img
                                    src="/logo/unpad-font.png"
                                    alt="Universitas Padjadjaran"
                                    className="h-auto max-w-md w-auto object-contain hover:opacity-80 transition-opacity"
                                />
                            </a>
                        </div>
                    </div>
                </section>

                {/* ================= HERO SIMPLE ================= */}
                <section
                    id="section-hero"
                    className="py-8 sm:py-12 bg-gradient-to-br from-white via-slate-50 to-white"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            {/* Left Column - Text Content */}
                            <motion.div
                                className="text-center lg:text-left"
                                initial={{ opacity: 0, y: 30 }}
                                animate={
                                    isVisible["section-hero"]
                                        ? { opacity: 1, y: 0 }
                                        : {}
                                }
                                transition={{ duration: 0.6 }}
                            >
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                    Sistem Pengaduan
                                    <span className="block mt-2 bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 bg-clip-text text-transparent">
                                        Modern & Efisien
                                    </span>
                                </h1>
                                <p className="mt-6 text-lg sm:text-xl text-gray-700 leading-relaxed">
                                    Platform pengaduan berbasis teknologi untuk
                                    pelaporan dan monitoring tiket secara
                                    real-time dengan antarmuka yang sederhana
                                    dan mudah digunakan.
                                </p>
                                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link
                                        to="/register"
                                        className="inline-flex justify-center items-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-blue-900 to-slate-900 text-white font-semibold hover:shadow-lg hover:shadow-blue-950/25 transition-all hover:from-blue-950 hover:to-slate-950"
                                    >
                                        Mulai Sekarang
                                    </Link>
                                    <button
                                        onClick={() => scrollToSection("fitur")}
                                        className="inline-flex justify-center items-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl border-2 border-slate-300 text-gray-700 font-semibold hover:border-blue-900 hover:text-blue-950 hover:bg-slate-50 transition-all"
                                    >
                                        Pelajari Fitur
                                    </button>
                                </div>
                            </motion.div>

                            {/* Right Column - Stats & Highlights */}
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, y: 30 }}
                                animate={
                                    isVisible["section-hero"]
                                        ? { opacity: 1, y: 0 }
                                        : {}
                                }
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Stat Card 1 */}
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 to-blue-950 flex items-center justify-center">
                                                <svg
                                                    className="w-6 h-6 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <h4 className="text-3xl font-bold text-gray-900 mb-1">
                                            98%
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Tingkat Penyelesaian
                                        </p>
                                    </div>

                                    {/* Stat Card 2 */}
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center">
                                                <svg
                                                    className="w-6 h-6 text-white"
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
                                            </div>
                                        </div>
                                        <h4 className="text-3xl font-bold text-gray-900 mb-1">
                                            24h/5
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Waktu Respons
                                        </p>
                                    </div>

                                    {/* Stat Card 3 */}
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-950 to-slate-900 flex items-center justify-center">
                                                <svg
                                                    className="w-6 h-6 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <h4 className="text-3xl font-bold text-gray-900 mb-1">
                                            500+
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Pengguna Aktif
                                        </p>
                                    </div>

                                    {/* Stat Card 4 */}
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                                                <svg
                                                    className="w-6 h-6 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <h4 className="text-3xl font-bold text-gray-900 mb-1">
                                            1.2K+
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Tiket Terselesaikan
                                        </p>
                                    </div>
                                </div>

                                {/* Floating Badge */}
                                <div className="mt-6 bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                            <img
                                                src="/logo/integrasi.png"
                                                alt="Integrasi"
                                                className="w-9 h-9 object-contain"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">
                                                Sistem Terintegrasi
                                            </h4>
                                            <p className="text-sm text-slate-200">
                                                Monitoring real-time data tiket
                                                Anda
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ================= FITUR SIMPLE ================= */}
                <motion.section
                    id="section-fitur"
                    className="py-16 sm:py-20 bg-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={
                        isVisible["section-fitur"] ? { opacity: 1, y: 0 } : {}
                    }
                    transition={{ duration: 0.6 }}
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Fitur Utama
                            </h2>
                            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                                Dirancang untuk kemudahan penggunaan dan
                                efisiensi maksimal
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "Manajemen Tiket",
                                    desc: "Kelola semua tiket dalam satu dashboard yang terorganisir",
                                    fullDesc:
                                        "Sistem manajemen tiket yang komprehensif memungkinkan Anda untuk mengelola seluruh siklus hidup tiket dari pembuatan hingga penyelesaian dengan mudah dan efisien.",
                                    icon: "/logo/tiket.png",
                                    color: "bg-gradient-to-r from-blue-900 to-blue-950",
                                    details: [
                                        "Dashboard terpusat untuk semua tiket",
                                        "Kategorisasi otomatis berdasarkan jenis masalah",
                                        "Prioritas tiket yang dapat disesuaikan",
                                        "Riwayat lengkap setiap tiket",
                                        "Export data untuk analisis",
                                    ],
                                },
                                {
                                    title: "Pelacakan Real-time",
                                    desc: "Pantau status tiket secara langsung dan akurat",
                                    fullDesc:
                                        "Pantau perkembangan tiket Anda secara real-time dengan sistem tracking yang akurat dan transparan. Dapatkan update instan setiap ada perubahan status.",
                                    icon: "/logo/track.png",
                                    color: "bg-gradient-to-r from-blue-950 to-slate-900",
                                    details: [
                                        "Update status secara real-time",
                                        "Timeline lengkap aktivitas tiket",
                                        "Estimasi waktu penyelesaian",
                                        "Tracking lokasi petugas (jika diperlukan)",
                                        "Notifikasi perubahan status",
                                    ],
                                },
                                {
                                    title: "Notifikasi",
                                    desc: "Dapatkan pemberitahuan penting secara instan",
                                    fullDesc:
                                        "Sistem notifikasi otomatis memastikan Anda tidak melewatkan update penting tentang tiket Anda. Terima pemberitahuan melalui berbagai channel.",
                                    icon: "/logo/notif.png",
                                    color: "bg-gradient-to-r from-slate-800 to-slate-900",
                                    details: [
                                        "Notifikasi email otomatis",
                                        "Push notification di aplikasi",
                                        "SMS untuk update penting",
                                        "Pengaturan preferensi notifikasi",
                                        "Ringkasan harian/mingguan",
                                    ],
                                },
                            ].map((feature, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSelectedFeature(feature);
                                        setIsFeatureModalOpen(true);
                                    }}
                                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-900 transition-all group text-left w-full"
                                >
                                    <div
                                        className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}
                                    >
                                        <img
                                            src={feature.icon}
                                            alt={feature.title}
                                            className="w-8 h-8 object-contain"
                                        />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-blue-950 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-700 mb-3">
                                        {feature.desc}
                                    </p>
                                    <span className="text-sm text-blue-900 font-medium group-hover:underline">
                                        Pelajari lebih lanjut →
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Feature Modal */}
                <FeatureModal
                    isOpen={isFeatureModalOpen}
                    onClose={() => setIsFeatureModalOpen(false)}
                    feature={selectedFeature}
                />

                {/* ================= ALUR SIMPLE ================= */}
                <motion.section
                    id="section-alur"
                    className="py-16 sm:py-20 bg-gray-50"
                    initial={{ opacity: 0, y: 30 }}
                    animate={
                        isVisible["section-alur"] ? { opacity: 1, y: 0 } : {}
                    }
                    transition={{ duration: 0.6 }}
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Alur Pengaduan
                            </h2>
                            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                                Empat langkah sederhana untuk pengaduan yang
                                efektif
                            </p>
                        </div>

                        <Stepper
                            initialStep={1}
                            onStepChange={(step) => {
                                console.log("Current step:", step);
                            }}
                            onFinalStepCompleted={() =>
                                console.log("Semua langkah selesai!")
                            }
                            backButtonText="Sebelumnya"
                            nextButtonText="Selanjutnya"
                        >
                            <Step>
                                <div className="text-center py-2">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-900 to-slate-900 flex items-center justify-center mx-auto mb-3">
                                        <svg
                                            className="w-6 h-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                                        Buat Laporan
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                        Isi form laporan dengan detail masalah
                                    </p>
                                </div>
                            </Step>
                            <Step>
                                <div className="text-center py-2">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-900 to-slate-900 flex items-center justify-center mx-auto mb-3">
                                        <svg
                                            className="w-6 h-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                                        Verifikasi
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                        Tim memverifikasi dalam 1 x 24 jam
                                    </p>
                                </div>
                            </Step>
                            <Step>
                                <div className="text-center py-2">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-900 to-slate-900 flex items-center justify-center mx-auto mb-3">
                                        <svg
                                            className="w-6 h-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                                        Proses
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                        Laporan Anda akan diproses oleh staff
                                        yang berwenang
                                    </p>
                                </div>
                            </Step>
                            <Step>
                                <div className="text-center py-2">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-900 to-slate-900 flex items-center justify-center mx-auto mb-3">
                                        <svg
                                            className="w-6 h-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                                        Penyelesaian
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                        Dapatkan update progress real-time
                                    </p>
                                </div>
                            </Step>
                        </Stepper>
                    </div>
                </motion.section>

                {/* ================= FAQ SECTION ================= */}
                <motion.section
                    id="section-bantuan"
                    className="py-16 sm:py-20 bg-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={
                        isVisible["section-bantuan"] ? { opacity: 1, y: 0 } : {}
                    }
                    transition={{ duration: 0.6 }}
                >
                    <div className="mx-auto max-w-4xl px-4 sm:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Bantuan & FAQ
                            </h2>
                            <p className="text-lg text-gray-700">
                                Temukan jawaban untuk pertanyaan yang sering
                                diajukan
                            </p>
                        </div>

                        <FAQSection />
                    </div>
                </motion.section>

                {/* ================= LACAK TIKET ================= */}
                <section id="lacak">
                    <LacakTiket />
                </section>

                {/* ================= CTA SIMPLE ================= */}
                <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-900 to-slate-900">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                            Siap Memulai?
                        </h2>
                        <p className="text-lg text-slate-200 mb-8 max-w-2xl mx-auto">
                            Bergabung dengan ratusan pengguna yang telah
                            mempercayai sistem kami
                        </p>
                        <Link
                            to="/register"
                            className="inline-block px-8 py-4 bg-white text-blue-950 font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all"
                        >
                            Daftar Sekarang - Gratis
                        </Link>
                    </div>
                </section>

                {/* ================= FOOTER ================= */}
                <Footer onScrollToSection={scrollToSection} />
            </main>
        </div>
    );
}
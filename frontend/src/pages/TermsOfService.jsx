import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CardNav from "/src/components/CardNav";
import Footer from "/src/components/Footer";
import { motion } from "framer-motion";

export default function TermsOfService() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState({});

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

    const navItems = [
        {
            label: "Beranda",
            bgColor: "#1e40af",
            textColor: "#fff",
            onClick: () => navigate("/"),
        },
    ];

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <CardNav
                logo="./public/unpad.png"
                logoAlt="Unpad Logo"
                items={navItems}
                baseColor="#ffffff"
                menuColor="#374151"
                hideLacakTiket={true}
            />

            <main className="pt-24 pb-16 overflow-hidden">
                {/* Hero Section */}
                <section className="relative py-16 bg-gradient-to-br from-blue-900 via-navy-800 to-blue-900 overflow-hidden">
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
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
                            Syarat dan Ketentuan Layanan
                        </h1>
                        <p className="text-xl text-blue-100 mb-4">
                            Ketentuan Penggunaan Sistem Tiket
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
                <section className="py-12">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6">
                        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12 relative overflow-hidden border border-blue-100">
                            {/* Penerimaan Ketentuan */}
                            <motion.div
                                id="section-1"
                                className="relative mb-12"
                                initial={{ opacity: 0, y: 30 }}
                                animate={
                                    isVisible["section-1"]
                                        ? { opacity: 1, y: 0 }
                                        : {}
                                }
                                transition={{ duration: 0.6 }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                        1
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Penerimaan Ketentuan
                                    </h2>
                                </div>

                                <div className="ml-14 space-y-4">
                                    <p className="text-gray-700 leading-relaxed p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border-l-4 border-blue-500">
                                        Dengan mengakses dan menggunakan Sistem
                                        Tiket Universitas Padjadjaran, Anda
                                        menyetujui untuk terikat dengan Syarat
                                        dan Ketentuan Layanan ini.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border-l-4 border-blue-500">
                                        Jika Anda tidak menyetujui ketentuan
                                        ini, mohon untuk tidak menggunakan
                                        layanan kami.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Hubungi Kami */}
                            <motion.div
                                id="section-contact"
                                className="relative"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={
                                    isVisible["section-contact"]
                                        ? { opacity: 1, scale: 1 }
                                        : {}
                                }
                                transition={{ duration: 0.6 }}
                            >
                                <div className="bg-gradient-to-r from-blue-100 via-white to-cyan-100 rounded-3xl p-10 border-4 border-blue-300 shadow-2xl relative overflow-hidden">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6 relative z-10">
                                        Hubungi Kami
                                    </h2>

                                    <p className="text-gray-700 leading-relaxed mb-8 relative z-10">
                                        Jika Anda memiliki pertanyaan tentang
                                        Syarat dan Ketentuan ini, silakan
                                        hubungi kami:
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
                                                content: "support@unpad.ac.id",
                                                href: "mailto:support@unpad.ac.id",
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
                                            <div
                                                key={index}
                                                className="flex items-start gap-5 p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-sm"
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
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Back to Home Button */}
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
        </motion.div>
    );
}
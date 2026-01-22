import { Link } from "react-router-dom";

export default function Footer({ onScrollToSection }) {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-13 h-13 rounded-lg flex items-center justify-center">
                                <img
                                    src="/unpad.png"
                                    alt="Logo"
                                    className="w-9 h-9 object-contain"
                                />
                            </div>
                            <div>
                                <span className="font-bold text-xl text-white leading-tight">
                                    Sistem
                                    <span className="text-blue-500">Tiket</span>
                                </span>
                                <div className="text-xs text-gray-400 -mt-0.5">
                                    Universitas Padjadjaran
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">
                            Sistem pengelolaan tiket bantuan terintegrasi untuk
                            masyarakat dan civitas akademika Universitas
                            Padjadjaran.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://www.instagram.com/universitaspadjadjaran?igsh=OWZvbHIzNmt0ajl0"
                                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all hover:scale-110"
                            >
                                <img
                                    src="/logo/instagram.png"
                                    alt="Instagram"
                                    className="w-9 h-9 object-contain"
                                />
                            </a>
                            <a
                                href="https://www.facebook.com/share/1Kj22YVGJ8/"
                                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all hover:scale-110"
                            >
                                <img
                                    src="/logo/facebook.png"
                                    alt="Facebook"
                                    className="w-5 h-5 object-contain"
                                />
                            </a>
                            <a
                                href="https://x.com/unpad?s=20"
                                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all hover:scale-110"
                            >
                                <img
                                    src="/logo/x.png"
                                    alt="X"
                                    className="w-6 h-6 object-contain"
                                />
                            </a>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            <div>
                                <h4 className="font-bold text-white mb-4 text-lg">
                                    Fitur
                                </h4>
                                <ul className="space-y-3">
                                    <li>
                                        <button
                                            onClick={() =>
                                                onScrollToSection?.("fitur")
                                            }
                                            className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:underline cursor-pointer"
                                        >
                                            Pelacakan Real-time
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() =>
                                                onScrollToSection?.("fitur")
                                            }
                                            className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:underline cursor-pointer"
                                        >
                                            Notifikasi
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() =>
                                                onScrollToSection?.("fitur")
                                            }
                                            className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:underline cursor-pointer"
                                        >
                                            Manajemen Tiket
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-4 text-lg">
                                    Alur
                                </h4>
                                <ul className="space-y-3">
                                    <li>
                                        <button
                                            onClick={() =>
                                                onScrollToSection?.("alur")
                                            }
                                            className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:underline cursor-pointer"
                                        >
                                            Alur Membuat Laporan
                                        </button>
                                    </li>
                                </ul>
                            </div>
                         <div>
                                <h4 className="font-bold text-white mb-4 text-lg">
                                    Bantuan
                                </h4>
                                <ul className="space-y-3">
                                    <li>
                                        <button
                                            onClick={() =>
                                                onScrollToSection?.("bantuan")
                                            }
                                            className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:underline cursor-pointer"
                                        >
                                            Bantuan & FAQ
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-4 text-lg">
                                    Lacak Tiket
                                </h4>
                                <ul className="space-y-3">
                                    <li>
                                        <button
                                            onClick={() =>
                                                onScrollToSection?.("lacak")
                                            }
                                            className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:underline cursor-pointer"
                                        >
                                            Lacak Status Tiket
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 my-6"></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-400">
                        © {new Date().getFullYear()} SistemTiket Unpad. All
                        rights reserved.
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            to="/privacy"
                            className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:underline"
                        >
                            Kebijakan Privasi
                        </Link>
                        <Link
                            to="/terms"
                            className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:underline"
                        >
                            Terms of Service
                        </Link>
                        <button
                            onClick={() => {
                                const duration = 1750;
                                const start = window.pageYOffset;
                                const startTime = performance.now();

                                const scroll = (currentTime) => {
                                    const elapsed = currentTime - startTime;
                                    const progress = Math.min(
                                        elapsed / duration,
                                        1
                                    );
                                    const easeIn = Math.pow(progress, 3);

                                    window.scrollTo(0, start * (1 - easeIn));

                                    if (progress < 1) {
                                        requestAnimationFrame(scroll);
                                    }
                                };

                                requestAnimationFrame(scroll);
                            }}
                            className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-600 flex items-center gap-2 text-sm"
                            aria-label="Back to top"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                                />
                            </svg>
                            Back to Top
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
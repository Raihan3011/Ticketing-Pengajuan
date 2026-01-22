import { useState } from 'react';
import FAQItem from './FAQItem';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqData = [
        {
            question: "Apakah sistem ini gratis?",
            answer: "Ya, sistem dapat digunakan secara gratis dengan fitur dasar yang lengkap. Anda dapat membuat tiket, melacak status, dan menerima notifikasi tanpa biaya apapun.",
            icon: <img src="/logo/money.png" alt="Money" className="w-7 h-7 object-contain" />
        },
        {
            question: "Bagaimana cara melacak tiket?",
            answer: "Masukkan ID tiket Anda di form lacak tiket yang tersedia di halaman ini. Anda akan melihat status real-time dari tiket Anda beserta riwayat update.",
            icon: <img src="/logo/search.png" alt="Search" className="w-7 h-7 object-contain" />
        },
        {
            question: "Siapa yang menangani pengaduan?",
            answer: "Pengaduan ditangani oleh petugas khusus yang berpengalaman sesuai dengan kategori masalah. Setiap tiket akan diverifikasi dalam 1x24 jam.",
            icon: <img src="/logo/peapole.png" alt="People" className="w-7 h-7 object-contain" />
        },
        {
            question: "Berapa lama waktu penyelesaian tiket?",
            answer: "Waktu penyelesaian bervariasi tergantung kompleksitas masalah. Namun, kami berkomitmen untuk merespons dalam waktu kurang dari 24 jam dan memberikan update secara berkala.",
            icon: <img src="/logo/time-run.png" alt="Time" className="w-7 h-7 object-contain" />
        }
    ];

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            {faqData.map((faq, index) => (
                <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    icon={faq.icon}
                    index={index}
                    isOpen={openIndex === index}
                    onToggle={() => handleToggle(index)}
                />
            ))}
        </div>
    );
};

export default FAQSection;
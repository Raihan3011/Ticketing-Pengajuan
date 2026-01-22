import { motion, AnimatePresence } from 'framer-motion';

const FeatureModal = ({ isOpen, onClose, feature }) => {
    if (!feature) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                                <img src={feature.icon} alt={feature.title} className="w-10 h-10 object-contain" />
                            </div>


                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>

    
                            <p className="text-gray-700 mb-6 leading-relaxed">{feature.fullDesc}</p>


                            <div className="space-y-3">
                                {feature.details?.map((detail, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-700">{detail}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={onClose}
                                className="mt-8 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold hover:shadow-lg hover:from-blue-700 hover:to-blue-900 transition-all"
                            >
                                Mengerti
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FeatureModal;
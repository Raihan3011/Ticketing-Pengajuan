import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer, icon, index, isOpen, onToggle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative"
        >
            <div className={`relative bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-xl overflow-hidden
                ${isOpen ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300'}`}
                onClick={onToggle}
            >
                {isOpen && (
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"
                    />
                )}
                
                <div className="p-6 sm:p-8 cursor-pointer">
                    <div className="flex items-start gap-4">
                        <motion.div 
                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
                            animate={{ rotate: isOpen ? [0, 10, -10, 0] : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {icon}
                        </motion.div>
                        
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h4 className={`font-bold text-lg sm:text-xl transition-colors duration-300
                                    ${isOpen ? 'text-blue-700' : 'text-gray-900 hover:text-blue-600'}`}>
                                    {question}
                                </h4>
                                
                                <motion.div
                                    className="ml-4 text-blue-500"
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <svg 
                                        className="w-6 h-6" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M19 9l-7 7-7-7" 
                                        />
                                    </svg>
                                </motion.div>
                            </div>
                            
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.p 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                            className="mt-4 text-gray-700 leading-relaxed pl-10 border-l-2 border-blue-200 bg-blue-50 p-4 rounded-lg"
                                        >
                                            {answer}
                                        </motion.p>
                                        <motion.div 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="mt-4 flex items-center gap-2 text-sm text-blue-600 pl-10"
                                        >
                                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                                            <span>berikut adalah informasi umum dari pertanyaan yang ditanyakan</span>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            <motion.div 
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-100 to-transparent opacity-0 -z-10"
                animate={{ opacity: isOpen ? 0.3 : 0 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
};

export default FAQItem;
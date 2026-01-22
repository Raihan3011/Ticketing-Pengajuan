import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const CardNav = ({
  logo,
  logoAlt = 'Logo',
  items = [],
  baseColor = '#0a192f', 
  menuColor = '#000000', 
  onScrollToSection
}) => {
  const [activeCard, setActiveCard] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cardRefs = useRef([]);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (index) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setActiveCard(index);
    }, 2100);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setActiveCard(null);
  };

  const handleCardMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleCardMouseLeave = () => {
    setActiveCard(null);
  };

  const handleNavClick = (label) => {
    if (onScrollToSection) {
      onScrollToSection(label.toLowerCase());
    }
  };

  const scrollToSection = (sectionId) => {
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav 
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 rounded-2xl shadow-lg backdrop-blur-md border border-blue-800/30 w-full max-w-5xl mx-4"
      style={{ backgroundColor: baseColor }}
    >
      <div className="flex items-center justify-between px-8 py-4">
       
        <div className="flex items-center gap-3">
          <img src={logo} alt={logoAlt} className="h-10 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="font-bold text-lg text-black leading-tight">
              Sistem<span className="text-blue-600">Ticket</span>
            </span>
            <span className="text-xs text-gray-600 -mt-1">Universitas Padjadjaran</span>
          </div>
        </div>

     
        <div className="hidden md:flex items-center gap-6 relative">
          {items.map((item, index) => (
            <div key={index} className="relative">
              <button
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-blue-100 hover:text-blue-800"
                style={{ color: menuColor }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleNavClick(item.label)}
              >
                {item.label}
              </button>

             
              {activeCard === index && (
                <div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 rounded-xl shadow-xl border border-blue-800/30 backdrop-blur-md min-w-48 animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{ 
                    backgroundColor: '#ffffff', 
                    color: '#000000' 
                  }}
                  onMouseEnter={handleCardMouseEnter}
                  onMouseLeave={handleCardMouseLeave}
                  ref={el => cardRefs.current[index] = el}
                >
                  <div className="p-4 space-y-2">
                    {item.links?.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.href || '#'}
                        className="block px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150 text-black"
                        aria-label={link.ariaLabel}
                        onClick={(e) => e.preventDefault()}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
         
          <button
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-blue-100 hover:text-blue-800 text-black"
            onClick={() => scrollToSection("lacak")}
          >
            Lacak Tiket
          </button>
        </div>

        
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-black hover:text-blue-700 font-medium transition-colors border border-blue-200 rounded-lg hover:bg-blue-50"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-blue-800"
          >
            Daftar
          </Link>
        </div>

        
        <button
          className="md:hidden p-2 rounded-lg hover:bg-blue-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ color: menuColor }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-blue-800/30 bg-white backdrop-blur-md rounded-b-2xl">
          <div className="p-4 space-y-2">
            {items.map((item, index) => (
              <div key={index} className="space-y-1">
                <button
                  className="w-full text-left font-medium text-black px-3 py-2 hover:bg-blue-50 hover:text-blue-800 rounded-lg transition-colors"
                  onClick={() => {
                    handleNavClick(item.label);
                    setIsMenuOpen(false);
                  }}
                >
                  {item.label}
                </button>
                {item.links?.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href || '#'}
                    className="block px-6 py-2 text-gray-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label={link.ariaLabel}
                    onClick={(e) => e.preventDefault()}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
             
            <button
              className="w-full text-left font-medium text-black px-3 py-2 hover:bg-blue-50 hover:text-blue-800 rounded-lg transition-colors"
              onClick={() => {
                scrollToSection("lacak");
                setIsMenuOpen(false);
              }}
            >
              Lacak Tiket
            </button>
            <div className="pt-3 border-t border-blue-200 space-y-2">
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2 text-black hover:text-blue-700 font-medium transition-colors border border-blue-200 rounded-lg hover:bg-blue-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="block w-full text-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium hover:shadow-md hover:from-blue-600 hover:to-blue-800 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CardNav;
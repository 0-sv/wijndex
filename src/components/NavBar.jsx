import { useRef, useState, useEffect } from 'react';
import { translations } from '../translations';
import wineGlassLogo from '/wine-glass.svg';

export default function NavBar({
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  showUnder10,
  setShowUnder10,
  showUnder5,
  setShowUnder5,
  sortBy,
  setSortBy,
  setShowTips,
  grapeVarieties
}) {
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close search suggestions and menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchRef, menuRef]);

  return (
    <nav className="w-full bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={wineGlassLogo} alt="wijndex logo" className="w-8 h-8" />
          <h1 className="hidden sm:block text-2xl font-bold text-gray-800 dark:text-white">
            wijndex
          </h1>
        </div>
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              placeholder={translations[language].searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                        placeholder-gray-500 dark:placeholder-gray-400 border border-transparent 
                        focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 
                        dark:focus:ring-blue-800 focus:outline-none transition-colors"
            />
            {showSuggestions && grapeVarieties.length > 0 && searchQuery && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                {grapeVarieties
                  .filter(variety => 
                    variety.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((variety, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                      onClick={() => {
                        setSearchQuery(variety);
                        setShowSuggestions(false);
                      }}
                    >
                      {variety}
                    </button>
                  ))}
              </div>
            )}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newLang = language === 'en' ? 'nl' : 'en';
                setLanguage(newLang);
                localStorage.setItem('language', newLang);
              }}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {language === 'en' ? '🇳🇱' : '🇬🇧'}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="py-2 px-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
                <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
                <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
              </div>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowTips(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {translations[language].showTips}
                  </button>
                  {(showUnder10 || showUnder5) && (
                    <button
                      onClick={() => {
                        setShowUnder10(false);
                        setShowUnder5(false);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {translations[language].clearFilters}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowUnder10(!showUnder10);
                      setShowUnder5(false);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${showUnder10 ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                  >
                    {translations[language].under10}
                  </button>
                  <button
                    onClick={() => {
                      setShowUnder5(!showUnder5);
                      setShowUnder10(false);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${showUnder5 ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                  >
                    {translations[language].under5}
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button
                    onClick={() => {
                      setSortBy('score');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${sortBy === 'score' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                  >
                    {translations[language].sortByRating}
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('value');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${sortBy === 'value' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                  >
                    {translations[language].sortByValue}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

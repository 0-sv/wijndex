import { useState, useEffect, useRef, createContext } from 'react';
import { translations } from './translations';
import WineRecommendations from './components/WineRecommendations.jsx';
import TipsPopup from './components/TipsPopup.jsx';
import wineGlassLogo from '/wine-glass.svg';

function App() {
  const [showUnder10, setShowUnder10] = useState(false);
  const [showUnder5, setShowUnder5] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('score'); // 'score' or 'value'
  const [grapeVarieties, setGrapeVarieties] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const [showTips, setShowTips] = useState(() => {
    return !localStorage.getItem('tipsShown');
  });

  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem('language');
    return savedLang || 'en';
  });

  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuRef]);

  // Close search suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchRef]);

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      <TipsPopup
        isOpen={showTips}
        language={language}
        onClose={() => {
          setShowTips(false);
          localStorage.setItem('tipsShown', 'true');
        }}
      />
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
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${showUnder10 ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    >
                      {translations[language].under10}
                    </button>
                    <button
                      onClick={() => {
                        setShowUnder5(!showUnder5);
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
      <WineRecommendations
        showUnder10={showUnder10}
        showUnder5={showUnder5}
        searchQuery={searchQuery}
        sortBy={sortBy}
        language={language}
        onGrapeVarietiesLoaded={setGrapeVarieties}
      />
      <footer className="w-full bg-white dark:bg-gray-800 shadow-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {translations[language].copyright}
          </p>
          <a
            href="https://github.com/0-sv/wijndex"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            <span>{translations[language].viewOnGithub}</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;

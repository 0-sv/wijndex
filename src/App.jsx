import { useState, useEffect, useRef } from 'react';
import WineRecommendations from './components/WineRecommendations.jsx';
import wineGlassLogo from '/wine-glass.svg';

function App() {
  const [showUnder10, setShowUnder10] = useState(false);
  const [showUnder5, setShowUnder5] = useState(false);
  const [wineType, setWineType] = useState('all'); // 'all', 'red', 'white'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);
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

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      <nav className="w-full bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={wineGlassLogo} alt="wijndex logo" className="w-8 h-8" />
            <h1 className="hidden sm:block text-2xl font-bold text-gray-800 dark:text-white">
              wijndex
            </h1>
          </div>
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search wines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                          placeholder-gray-500 dark:placeholder-gray-400 border border-transparent 
                          focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 
                          dark:focus:ring-blue-800 focus:outline-none transition-colors"
              />
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
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className="relative" ref={menuRef}>
              <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="py-2 px-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center"
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
                  {(showUnder10 || showUnder5 || wineType !== 'all') && (
                    <button
                      onClick={() => {
                        setShowUnder10(false);
                        setShowUnder5(false);
                        setWineType('all');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      ❌ Clear filters
                    </button>
                  )}
                  <button
                      onClick={() => {
                        setWineType('red');
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${wineType === 'red' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    >
                      🍷 Red wines
                    </button>
                    <button
                      onClick={() => {
                        setWineType('white');
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${wineType === 'white' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    >
                      🥂 White wines
                    </button>
                    <button
                      onClick={() => {
                        setShowUnder10(!showUnder10);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${showUnder10 ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    >
                      🍷 Under €10
                    </button>
                    <button
                      onClick={() => {
                        setShowUnder5(!showUnder5);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${showUnder5 ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    >
                      🍷 Under €5
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
        wineType={wineType}
        searchQuery={searchQuery}
      />
      <footer className="w-full bg-white dark:bg-gray-800 shadow-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2024 wijndex. All rights reserved.
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
            <span>View on GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;

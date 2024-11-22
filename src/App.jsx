import { useState, useEffect, useRef } from 'react';
import './App.css';
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
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="w-full bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={wineGlassLogo} alt="DruifDuif logo" className="w-8 h-8" />
            <h1 className="hidden sm:block text-2xl font-bold text-gray-800 dark:text-white">DruifDuif</h1>
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
                <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" 
                     strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
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
              <div 
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700"
              >
                <div className="py-1">
                  <button
                    onClick={() => {
                      setWineType(wineType === 'all' ? 'red' : wineType === 'red' ? 'white' : 'all');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {wineType === 'all' ? '🍷 Filter by type' : wineType === 'red' ? '🍷 Red wines' : '🥂 White wines'}
                  </button>
                  <button
                    onClick={() => {
                      setShowUnder10(!showUnder10);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {showUnder10 ? '🍷 Show all wines' : '🍷 Under €10'}
                  </button>
                  <button
                    onClick={() => {
                      setShowUnder5(!showUnder5);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {showUnder5 ? '🍷 Show all wines' : '🍷 Under €5'}
                  </button>
                  <button
                    onClick={() => {
                      setDarkMode(!darkMode);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {darkMode ? '☀️ Light' : '🌙 Dark'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      <WineRecommendations 
        showUnder10={showUnder10}
        showUnder5={showUnder5}
        wineType={wineType}
        searchQuery={searchQuery}
      />
    </div>
  );
}

export default App;

import { useState, useEffect, useRef } from 'react';
import './App.css';
import WineRecommendations from './components/WineRecommendations.jsx';
import wineGlassLogo from '/wine-glass.svg';

function App() {
  const [showUnder10, setShowUnder10] = useState(false);
  const [wineType, setWineType] = useState('all'); // 'all', 'red', 'white'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
                <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
                <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
              </div>
            </button>
            
            {isMenuOpen && (
              <div 
                ref={menuRef}
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
        wineType={wineType}
      />
    </div>
  );
}

export default App;

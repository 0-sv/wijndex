import { useState, useEffect } from 'react';
import './App.css';
import WineRecommendations from './components/WineRecommendations.jsx';
import wineGlassLogo from '/wine-glass.svg';

function App() {
  const [showUnder10, setShowUnder10] = useState(false);
  const [wineType, setWineType] = useState('all'); // 'all', 'red', 'white'
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

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="w-full bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={wineGlassLogo} alt="DruifDuif logo" className="w-8 h-8" />
            <h1 className="hidden sm:block text-2xl font-bold text-gray-800 dark:text-white">DruifDuif</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setWineType(wineType === 'all' ? 'red' : wineType === 'red' ? 'white' : 'all');
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                wineType === 'red'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : wineType === 'white'
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {wineType === 'all' ? '🍷 Filter by type' : wineType === 'red' ? '🍷 Red wines' : '🥂 White wines'}
            </button>
            <button
              onClick={() => setShowUnder10(!showUnder10)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showUnder10
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {showUnder10 ? '🍷 Show all wines' : '🍷 Under €10'}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
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

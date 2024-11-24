import { useState, useEffect, useRef } from 'react';
import { translations } from './translations';
import WineRecommendations from './components/WineRecommendations.jsx';
import TipsPopup from './components/TipsPopup.jsx';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

function App() {
  const [showUnder10, setShowUnder10] = useState(false);
  const [showUnder5, setShowUnder5] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('score'); // 'score' or 'value'
  const [grapeVarieties, setGrapeVarieties] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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
      <NavBar
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showUnder10={showUnder10}
        setShowUnder10={setShowUnder10}
        showUnder5={showUnder5}
        setShowUnder5={setShowUnder5}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setShowTips={setShowTips}
        grapeVarieties={grapeVarieties}
      />
      <WineRecommendations
        showUnder10={showUnder10}
        showUnder5={showUnder5}
        searchQuery={searchQuery}
        sortBy={sortBy}
        language={language}
        onGrapeVarietiesLoaded={setGrapeVarieties}
      />
      <Footer language={language} />
    </div>
  );
}

export default App;

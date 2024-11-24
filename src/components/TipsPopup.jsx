import wineGlassLogo from '/wine-glass.svg';
import { translations } from '../translations';

function TipsPopup({ isOpen, onClose, language = 'en' }) {
  const t = translations[language];
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <img src={wineGlassLogo} alt="wijndex logo" className="w-6 h-6" />
          {t.welcome}
        </h2>
        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
          <p>{t.intro}</p>
          <li>• {t.searchTip}</li>
          <li>• {t.budgetTip}</li>
          <li>• {t.databaseInfo}</li>
          <li>• {t.themeTip}</li>
        </ul>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          {t.gotIt}
        </button>
      </div>
    </div>
  );
}

export default TipsPopup;

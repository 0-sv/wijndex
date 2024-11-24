import { QRCodeSVG } from 'qrcode.react';
import { translations } from '../translations';

export default function ShareModal({ isOpen, onClose, language }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{translations[language].shareTitle}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <QRCodeSVG value="https://wijndex.com" size={200} />
        </div>
        <p className="text-center text-gray-600 dark:text-gray-400">
          {translations[language].shareDescription}
        </p>
      </div>
    </div>
  );
}

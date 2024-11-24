import { useState } from 'react';
import { X } from 'lucide-react';
import { translations } from '../translations';

export default function WineWizard({ isOpen, onClose, language, onComplete }) {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    type: '',
    budget: '',
    occasion: '',
  });

  const t = translations[language];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(selections);
      onClose();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t.wizardTitle}</h2>

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">{t.wizardQuestion1}</p>
            {[
              { value: 'red', label: t.wizardRed },
              { value: 'white', label: t.wizardWhite },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSelections({ ...selections, type: option.value });
                  handleNext();
                }}
                className={`w-full p-4 text-left rounded-lg border ${
                  selections.type === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">{t.wizardQuestion2}</p>
            {[
              { value: 'any', label: t.wizardAny },
              { value: 'under10', label: t.wizardUnder10 },
              { value: 'under5', label: t.wizardUnder5 },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSelections({ ...selections, budget: option.value });
                  handleNext();
                }}
                className={`w-full p-4 text-left rounded-lg border ${
                  selections.budget === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">{t.wizardQuestion3}</p>
            {[
              { value: 'casual', label: t.wizardCasual },
              { value: 'dinner', label: t.wizardDinner },
              { value: 'gift', label: t.wizardGift },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSelections({ ...selections, occasion: option.value });
                  handleNext();
                }}
                className={`w-full p-4 text-left rounded-lg border ${
                  selections.occasion === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={handlePrevious}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              {t.wizardPrevious}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

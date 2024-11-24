import { ExternalLink, Star, Award } from 'lucide-react';
import { translations } from '../translations';

export default function WineCard({ wine, index, setSelectedImage, language = 'en' }) {
  const t = translations[language];
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-6 transition-transform hover:scale-[1.01]">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-shrink-0 flex items-center justify-center h-full">
          <img
            src={wine.imgSrc}
            alt={wine.productUrl.split('/').pop()}
            className="w-20 sm:w-32 h-20 sm:h-32 object-contain rounded my-auto cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setSelectedImage(wine.imgSrc)}
          />
        </div>

        <div className="flex-grow w-full">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                #{index}
              </span>
              <h2 className="text-base sm:text-xl font-semibold mt-1">
                {wine.productUrl.split('/').pop().split('-').join(' ').toUpperCase()}
              </h2>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-1 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="ml-1 font-semibold">{wine.userRating}/5</span>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                ({wine.amountOfUserRatings} {t.ratings})
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <div className="flex items-center">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                <span className="ml-1 font-semibold">{wine.criticScore}/100</span>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                ({wine.amountOfCriticReviews || 0} {t.reviews})
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="font-semibold text-xs sm:text-sm">{t.style}:</span>
              <span className="text-xs sm:text-sm truncate">{wine.style}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="font-semibold text-xs sm:text-sm">{t.grape}:</span>
              <span className="text-xs sm:text-sm truncate">{wine.grapeVariety}</span>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
              {t.bestPairedWith}: <span className="font-medium">{wine.foodPairing}</span>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-base sm:text-lg font-bold">
                €{wine.price}
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1">
                  / {wine.unitSize}
                </span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Score/€: {wine.valueScore}
              </div>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex flex-wrap gap-1 sm:gap-2">
            <a
              href={wine.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {t.viewAtAH} <ExternalLink className="w-4 h-4 ml-1" />
            </a>
            <a
              href={wine.wineSearcherUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {t.viewOnWineSearcher} <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

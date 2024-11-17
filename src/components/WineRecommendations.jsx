import { useState, useEffect } from 'react';
import { ExternalLink, Star, Award } from 'lucide-react';

export default function WineRecommendations() {
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/0-sv/scrape-ah/refs/heads/main/results.json')
      .then((response) => response.json())
      .then((data) => {
        // Filter out wines without ratings or scores
        const validWines = data.filter(
          (wine) => wine.userRating && wine.amountOfUserRatings > 0 && wine.criticScore
        );

        // Calculate weighted scores for valid wines
        const processedWines = validWines.map((wine) => {
          // Normalize scores to 0-1 range and apply weights
          const userScore = (wine.userRating / 5) * 0.3; // 30% weight
          const userCountScore = (Math.min(wine.amountOfUserRatings, 100) / 100) * 0.2; // 20% weight
          const criticScore = (wine.criticScore / 100) * 0.35; // 35% weight
          const criticCountScore = (Math.min(wine.amountOfCriticReviews || 0, 10) / 10) * 0.15; // 15% weight

          const totalScore = (userScore + userCountScore + criticScore + criticCountScore) * 100;

          return {
            ...wine,
            totalScore: parseFloat(totalScore.toFixed(1)),
          };
        });

        // Sort by total score and get top 10
        const sortedWines = processedWines.sort((a, b) => b.totalScore - a.totalScore).slice(0, 10);

        setWines(sortedWines);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load wines');
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="py-4 sm:py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4">
          {wines.map((wine, index) => (
            <div
              key={wine.productUrl}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-transform hover:scale-[1.01]"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={wine.imgSrc}
                    alt={wine.productUrl.split('/').pop()}
                    className="w-24 sm:w-32 h-24 sm:h-32 object-contain rounded"
                  />
                </div>

                <div className="flex-grow w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                        #{index + 1}
                      </span>
                      <h2 className="text-xl font-semibold mt-1">
                        {wine.productUrl.split('/').pop().split('-').join(' ').toUpperCase()}
                      </h2>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{wine.totalScore}</div>
                  </div>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="ml-1 font-semibold">{wine.userRating}/5</span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">({wine.amountOfUserRatings} ratings)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center">
                        <Award className="w-5 h-5 text-purple-500" />
                        <span className="ml-1 font-semibold">{wine.criticScore}/100</span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">
                        ({wine.amountOfCriticReviews || 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">Style:</span>
                      <span className="text-sm">{wine.style}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">Grape:</span>
                      <span className="text-sm">{wine.grapeVariety}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400 break-words">
                      Best paired with: <span className="font-medium">{wine.foodPairing}</span>
                    </div>
                    <div className="text-lg font-bold">
                      €{wine.price}
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/ {wine.unitSize}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={wine.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View at AH <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                    <a
                      href={wine.wineSearcherUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View on Wine-Searcher <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

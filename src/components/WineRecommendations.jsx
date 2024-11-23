import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import EmailSignupCard from './EmailSignupCard';
import WineCard from './WineCard';

export default function WineRecommendations({
  showUnder10,
  showUnder5,
  wineType,
  searchQuery,
  sortBy,
}) {
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    fetch(
      import.meta.env.DEV
        ? '/results.json'
        : 'https://raw.githubusercontent.com/0-sv/scrape-ah/refs/heads/main/results.json'
    )
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

          // Logarithmic scaling for user ratings (base 1000)
          const userCountLog = Math.log(wine.amountOfUserRatings + 1) / Math.log(1000);
          const userCountScore = Math.min(userCountLog, 1) * 0.25; // 25% weight

          const criticScore = (wine.criticScore / 100) * 0.3; // 30% weight

          // Logarithmic scaling for critic reviews (base 100)
          const criticCountLog = Math.log((wine.amountOfCriticReviews || 0) + 1) / Math.log(100);
          const criticCountScore = Math.min(criticCountLog, 1) * 0.15; // 15% weight

          const totalScore = (userScore + userCountScore + criticScore + criticCountScore) * 100;
          const valueScore = (totalScore / parseFloat(wine.price)) * 10; // Higher score per euro = better value

          return {
            ...wine,
            totalScore: parseFloat(totalScore.toFixed(1)),
            valueScore: parseFloat(valueScore.toFixed(1)),
          };
        });

        setWines(processedWines);
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

  const sortedAndFilteredWines = wines
    .sort((a, b) =>
      sortBy === 'value' ? b.valueScore - a.valueScore : b.totalScore - a.totalScore
    )
    .filter((wine) => {
      const priceCondition =
        (!showUnder10 && !showUnder5) ||
        (showUnder5 ? parseFloat(wine.price) < 5 : parseFloat(wine.price) < 10);
      const searchCondition =
        !searchQuery ||
        [
          wine.style, // Wine style (e.g., "Red Wine", "White Wine")
          wine.grapeVariety, // Grape variety
          wine.foodPairing, // Food pairing suggestions
          wine.productUrl?.split('/')?.pop(), // Product name from URL
        ].some((field) => field?.toLowerCase()?.includes(searchQuery.toLowerCase()));
      return priceCondition && searchCondition;
    });

  return (
    <div className="py-2 sm:py-8 px-1 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="space-y-2 sm:space-y-4">
          {sortedAndFilteredWines.slice(0, 3).map((wine, index) => (
            <WineCard
              key={wine.productUrl}
              wine={wine}
              index={index + 1}
              setSelectedImage={setSelectedImage}
            />
          ))}
          <EmailSignupCard />
          {sortedAndFilteredWines.slice(3, displayCount).map((wine, index) => (
            <WineCard
              key={wine.productUrl}
              wine={wine}
              index={index + 4}
              setSelectedImage={setSelectedImage}
            />
          ))}
          {sortedAndFilteredWines.length >= displayCount && (
            <button
              onClick={() => setDisplayCount((prev) => prev + 10)}
              className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-lg border border-gray-200 shadow-sm transition-colors"
            >
              Show More Results
            </button>
          )}
        </div>
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Wine bottle"
              className="w-full h-auto object-contain max-h-[80vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const fs = require('fs');

// Read the results file
const results = JSON.parse(fs.readFileSync('results_deduplicated.json', 'utf8'));

// Group by wineSearcherUrl
const groupedByUrl = results.reduce((acc, wine) => {
  if (!acc[wine.wineSearcherUrl]) {
    acc[wine.wineSearcherUrl] = {
      ...wine,
      productUrls: [wine.productUrl], // Store all product URLs
    };
    delete acc[wine.wineSearcherUrl].productUrl; // Remove single productUrl field
  } else {
    // For duplicates, just add the product URL to the array
    acc[wine.wineSearcherUrl].productUrls.push(wine.productUrl);
  }
  return acc;
}, {});

// Convert back to array and restore structure
const deduplicatedResults = Object.values(groupedByUrl).map((wine) => {
  // Use the first product URL as the main one
  const [productUrl, ...alternativeUrls] = wine.productUrls;
  return {
    productUrl,
    alternativeUrls, // Keep track of other URLs where this wine appears
    imgSrc: wine.imgSrc,
    price: wine.price,
    unitSize: wine.unitSize,
    wineSearcherUrl: wine.wineSearcherUrl,
    criticScore: wine.criticScore,
    userRating: wine.userRating,
    amountOfUserRatings: wine.amountOfUserRatings,
    style: wine.style,
    grapeVariety: wine.grapeVariety,
    foodPairing: wine.foodPairing,
    amountOfCriticReviews: wine.amountOfCriticReviews,
  };
});

// Filter out entries with 'bacardi' in the productUrl
const filteredResults = deduplicatedResults.filter(
  (wine) => !wine.productUrl.toLowerCase().includes('bacardi') && wine.unitSize === '0,75 l'
);

// Write the deduplicated and filtered results
fs.writeFileSync('results_deduplicated.json', JSON.stringify(filteredResults, null, 2));

console.log(`Original entries: ${results.length}`);
console.log(`After deduplication: ${deduplicatedResults.length}`);
console.log(`After Bacardi filtering: ${filteredResults.length}`);

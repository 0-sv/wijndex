# Wine Data Scraper

A Node.js application for scraping and processing wine data.

## Scripts

The application consists of multiple processing steps:

1. `1_scrape_ah.js` - Initial data scraping
2. `2_map_wine_searcher_rating.js` - Maps wine searcher ratings
3. `3_post_processing.js` - Post-processing of scraped data
4. `4_WARNING_merge_dedup.js` - Merges and deduplicates results

## Installation

```bash
npm install
```

## Usage

Run the scripts in sequence:

1. `node 1_scrape_ah.js`
2. `node 2_map_wine_searcher_rating.js`
3. `node 3_post_processing.js`
4. `node 4_WARNING_merge_dedup.js`

Results can be viewed in:
- `results.json` - Raw results
- `results_deduplicated.json` - Deduplicated results
- `index.html` - Web view of results

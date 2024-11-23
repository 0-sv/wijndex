# 🍷 wijndex

wijndex is a modern web application that helps wine enthusiasts discover the top 10 recommended wines from Albert Heijn, ranked using a sophisticated scoring algorithm that considers both user and critic ratings.

## Features

- 🏆 Smart ranking algorithm combining user ratings, critic scores, and review counts
- 🌓 Dark/light mode with system preference detection and persistence
- 📱 Responsive design for all devices
- 💡 Enhanced user tips and guidance
- 🔍 Detailed wine information including:
  - User and critic ratings
  - Wine style and grape variety with smart suggestions
  - Intelligent food pairing suggestions
  - Price and unit size
  - Direct links to Albert Heijn and Wine-Searcher
- 🍇 Smart grape variety search suggestions

## Tech Stack

- React + Vite
- Tailwind CSS
- Lucide React Icons
- External data from ./lib/scraper

## Getting Started

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Scoring Algorithm

Wines are ranked using a weighted scoring system:
- User Rating (30%): Rating out of 5 stars
- User Count (20%): Number of user ratings (normalized to 100)
- Critic Score (35%): Professional rating out of 100
- Critic Count (15%): Number of critic reviews (normalized to 10)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project as you wish.

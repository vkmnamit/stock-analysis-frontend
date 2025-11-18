# Stock Analysis App

A full-stack stock market analysis application with a clean black-and-white UI.

## Features

- 📈 **Real-time Stock Quotes** - Live stock prices from Finnhub API
- 📊 **Interactive Charts** - Price charts using Recharts
- 📰 **Market News** - Latest financial news and headlines
- 💰 **Cryptocurrency Prices** - Track major crypto assets
- ⭐ **Watchlist** - Save and manage your favorite symbols
- 🔍 **Company Profiles** - Detailed company information
- 📉 **Technical Indicators** - RSI, MACD, SMA analysis

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios
- Recharts
- Vite

### Backend
- Node.js
- Express
- Axios
- Finnhub API

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- NPM or Yarn
- Finnhub API key (free at https://finnhub.io)

### Backend Setup

```bash
cd my-express-app

# Install dependencies
npm install

# Create .env file with your API key
echo "FINHUB_API_KEY=your_api_key_here" > .env
echo "PORT=5000" >> .env

# Start the server
./run.sh
# Or use: node server.js
```

The backend API will run on `http://localhost:5000`

### Frontend Setup

```bash
cd stock_analysis

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173` (or next available port)

## API Endpoints

- `GET /api/stock/:symbol` - Get stock quote
- `GET /api/company/:symbol` - Get company profile
- `GET /api/stock-news/:symbol` - Get company news
- `GET /api/market-news` - Get general market news
- `GET /api/forex/:pair` - Get forex rates
- `GET /api/watchlist` - Get saved symbols
- `POST /api/watchlist` - Add symbol to watchlist
- `DELETE /api/watchlist/:symbol` - Remove symbol from watchlist

## Usage

1. **Home Page** - View market overview and top stocks
2. **Stock Page** - Enter a symbol (e.g., AAPL) to see detailed analysis
3. **Crypto Page** - View cryptocurrency prices
4. **Watchlist** - Add/remove symbols to track
5. **News Page** - Browse latest market news

## Design

The app uses a strict **black-and-white color scheme**:
- Background: White (`#ffffff`)
- Text: Black (`#000000`)
- Muted text: Dark gray (`#333333`)
- Borders: Black (`#000000`)
- Buttons: Black background with white text

## Development

### Running in Development

Terminal 1 (Backend):
```bash
cd my-express-app
./run.sh
```

Terminal 2 (Frontend):
```bash
cd stock_analysis
npm run dev
```

### Building for Production

```bash
cd stock_analysis
npm run build
```

## Environment Variables

### Backend (.env)
```
FINHUB_API_KEY=your_finnhub_api_key
PORT=5000
```

### Frontend
No environment variables required for development.

## Notes

- The watchlist is currently stored in-memory and will reset when the server restarts
- For production, replace the in-memory watchlist with MongoDB or another database
- The Finnhub API has rate limits on the free tier
- CORS is enabled for local development

## Future Enhancements

- User authentication
- Persistent database for watchlists
- WebSocket for real-time price updates
- Advanced charting with more technical indicators
- Portfolio tracking
- Email/push notifications
- Dark mode toggle (keeping B/W palette)

## License

MIT

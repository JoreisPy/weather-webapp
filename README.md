# WeatherHub - Modern Weather Data Visualization

A beautiful, modern web application for visualizing weather data collected from Raspberry Pi sensors. Features real-time updates, interactive charts, and comprehensive analytics.

![WeatherHub Dashboard](https://via.placeholder.com/800x400?text=WeatherHub+Dashboard+Screenshot)

## 🌟 Features

- **📊 Real-time Dashboard** - Live weather readings with auto-refresh
- **📈 Interactive Charts** - Beautiful visualizations with multiple timeframes
- **🔍 Weather Insights** - Statistical analysis and trends
- **📱 Responsive Design** - Works perfectly on desktop and mobile
- **⚡ High Performance** - Redis caching and optimized queries
- **🎨 Modern UI** - Dark theme with glassmorphism effects

## 🏗️ Architecture

```
Raspberry Pi → PostgreSQL → FastAPI → React → Beautiful Dashboard
     ↓              ↓          ↓         ↓
  Sensors      Data Storage   API    User Interface
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- PostgreSQL database with weather data
- Node.js 18+ (for development)

### 1. Clone Repository
```bash
git clone https://github.com/JoreisPy/weather-hub.git
cd weather-hub
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit with your database credentials
nano .env
```

### 3. Start Application
```bash
# Start all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

### 4. Access Application
- **Full App**: http://localhost:8080
- **Frontend Dev**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📁 Project Structure

```
weather-hub/
├── backend/              # FastAPI backend
│   ├── main.py          # Main application
│   ├── Dockerfile       # Backend container
│   └── requirements.txt # Python dependencies
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Main pages
│   │   └── context/     # State management
│   ├── Dockerfile       # Frontend container
│   └── package.json     # Node dependencies
├── nginx/               # Reverse proxy
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml   # Multi-container setup
```

## 🛠️ Development

### Backend Development
```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm start
```

### Database Schema
```sql
CREATE TABLE weather_data (
    id SERIAL PRIMARY KEY,
    temperature REAL,
    humidity REAL,
    pressure REAL,
    light REAL,
    timestamp TIMESTAMP DEFAULT NOW(),
    dew_point REAL,
    feels_like REAL
);
```

## 📊 API Endpoints

- `GET /current` - Latest weather reading
- `GET /charts/{timeframe}` - Chart data (1hour, 6hours, 24hours, month, year)
- `GET /insights` - Statistical analysis and trends
- `GET /health` - Application health check
- `WS /ws` - WebSocket for real-time updates

## 🎨 Features in Detail

### Real-time Dashboard
- Live temperature, humidity, pressure, and light readings
- Comfort level analysis and recommendations
- Data freshness indicators
- Auto-refresh every 30 seconds

### Interactive Charts
- **Temperature Analysis**: Min/max ranges with feels-like comparison
- **Humidity & Pressure**: Dual-axis correlation charts
- **Light Patterns**: Daily and seasonal light cycles
- **Comfort Analysis**: Multi-metric comfort assessment

### Weather Insights
- All-time record temperatures and conditions
- Week-over-week temperature trends
- Seasonal pattern analysis
- Data quality statistics

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis Cache
REDIS_URL=redis://localhost:6379

# Application
ENVIRONMENT=development
REACT_APP_API_URL=http://localhost:8080
```

### Docker Compose Services
- **backend**: FastAPI application (port 8000)
- **frontend**: React development server (port 3000)
- **nginx**: Reverse proxy (port 8080)
- **redis**: Cache layer (port 6379)

## 📈 Performance

- **Redis Caching**: 30s for current data, 5min for charts
- **Database Optimization**: Connection pooling and indexed queries
- **Frontend Optimization**: Code splitting and asset optimization
- **CDN Ready**: Static assets optimized for CDN delivery

## 🔒 Security

- Input validation and sanitization
- CORS configuration
- Rate limiting on API endpoints
- Security headers via nginx
- No sensitive data in logs

## 🚀 Deployment

### Development
```bash
docker-compose up --build
```

### Production
See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment guide including:
- SSL/TLS configuration
- Cloudflare integration
- Security hardening
- Monitoring setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Recharts** for beautiful chart components
- **FastAPI** for the excellent Python web framework
- **React** and **TypeScript** for the frontend foundation
- **Tailwind CSS** for the utility-first styling
- **Framer Motion** for smooth animations

## 📞 Support

- 📚 Check the [documentation](docs/)
- 🐛 Report bugs via [GitHub Issues](https://github.com/yourusername/weather-hub/issues)
- 💬 Join discussions in [GitHub Discussions](https://github.com/yourusername/weather-hub/discussions)

---

**Made with ❤️ and lots of ☕ for weather enthusiasts everywhere!**

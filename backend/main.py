from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncpg
import redis.asyncio as redis
import json
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import os
from dataclasses import dataclass
import numpy as np
from statistics import mode, StatisticsError

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@192.168.0.16:5432/weather_metrics")
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")

# Global variables
db_pool = None
redis_client = None

@dataclass
class WeatherReading:
    id: int
    temperature: float
    humidity: float
    pressure: float
    light: float
    timestamp: datetime
    dew_point: float
    feels_like: float

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global db_pool, redis_client
    db_pool = await asyncpg.create_pool(DATABASE_URL, min_size=5, max_size=20)
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)

    # Start background task for real-time updates
    asyncio.create_task(broadcast_updates())

    yield

    # Shutdown
    await db_pool.close()
    await redis_client.close()

app = FastAPI(
    title="Weather Data API",
    description="Modern weather data API with real-time updates",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_cached_data(key: str, expiry: int = 300):
    """Get data from Redis cache"""
    try:
        cached = await redis_client.get(key)
        if cached:
            return json.loads(cached)
    except:
        pass
    return None

async def set_cached_data(key: str, data: Any, expiry: int = 300):
    """Set data in Redis cache"""
    try:
        await redis_client.setex(key, expiry, json.dumps(data, default=str))
    except:
        pass

async def broadcast_updates():
    """Background task to broadcast real-time updates"""
    while True:
        try:
            if manager.active_connections:
                current_data = await get_current_weather()
                if current_data:
                    await manager.broadcast(json.dumps(current_data, default=str))
        except:
            pass
        await asyncio.sleep(30)  # Update every 30 seconds

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
async def root():
    return {"message": "Weather Data API", "status": "running"}

@app.get("/current")
async def get_current_weather():
    """Get the most recent weather reading"""
    cache_key = "current_weather"
    cached = await get_cached_data(cache_key, 30)  # Cache for 30 seconds
    if cached:
        return cached

    async with db_pool.acquire() as conn:
        row = await conn.fetchrow("""
            SELECT * FROM weather_data
            ORDER BY timestamp DESC
            LIMIT 1
        """)

        if not row:
            raise HTTPException(status_code=404, detail="No weather data found")

        result = dict(row)
        await set_cached_data(cache_key, result, 30)
        return result

@app.get("/charts/{timeframe}")
async def get_chart_data(timeframe: str):
    """Get aggregated data for charts"""
    cache_key = f"charts_{timeframe}"
    cached = await get_cached_data(cache_key, 300)  # Cache for 5 minutes
    if cached:
        return cached

    # Define time ranges and aggregation
    time_configs = {
        "1hour": {"hours": 1, "interval": "1 minute", "group_minutes": 1},
        "6hours": {"hours": 6, "interval": "5 minutes", "group_minutes": 5},
        "24hours": {"hours": 24, "interval": "30 minutes", "group_minutes": 30},
        "month": {"days": 30, "interval": "4 hours", "group_hours": 4},
        "year": {"days": 365, "interval": "1 day", "group_days": 1}
    }

    if timeframe not in time_configs:
        raise HTTPException(status_code=400, detail="Invalid timeframe")

    config = time_configs[timeframe]

    async with db_pool.acquire() as conn:
        if timeframe in ["1hour", "6hours", "24hours"]:
            # Minute-based aggregation
            group_minutes = config["group_minutes"]
            hours = config["hours"]

            query = f"""
                SELECT
                    DATE_TRUNC('hour', timestamp) +
                    INTERVAL '{group_minutes} minutes' * FLOOR(EXTRACT(MINUTE FROM timestamp) / {group_minutes}) as time_bucket,
                    AVG(temperature) as avg_temp,
                    MIN(temperature) as min_temp,
                    MAX(temperature) as max_temp,
                    AVG(humidity) as avg_humidity,
                    AVG(pressure) as avg_pressure,
                    AVG(light) as avg_light,
                    AVG(dew_point) as avg_dew_point,
                    AVG(feels_like) as avg_feels_like
                FROM weather_data
                WHERE timestamp >= NOW() - INTERVAL '{hours} hours'
                GROUP BY time_bucket
                ORDER BY time_bucket
            """
        else:
            # Day-based aggregation
            if timeframe == "month":
                query = """
                    SELECT
                        DATE_TRUNC('hour', timestamp) +
                        INTERVAL '4 hours' * FLOOR(EXTRACT(HOUR FROM timestamp) / 4) as time_bucket,
                        AVG(temperature) as avg_temp,
                        MIN(temperature) as min_temp,
                        MAX(temperature) as max_temp,
                        AVG(humidity) as avg_humidity,
                        AVG(pressure) as avg_pressure,
                        AVG(light) as avg_light,
                        AVG(dew_point) as avg_dew_point,
                        AVG(feels_like) as avg_feels_like
                    FROM weather_data
                    WHERE timestamp >= NOW() - INTERVAL '30 days'
                    GROUP BY time_bucket
                    ORDER BY time_bucket
                """
            else:  # year
                query = """
                    SELECT
                        DATE_TRUNC('day', timestamp) as time_bucket,
                        AVG(temperature) as avg_temp,
                        MIN(temperature) as min_temp,
                        MAX(temperature) as max_temp,
                        AVG(humidity) as avg_humidity,
                        AVG(pressure) as avg_pressure,
                        AVG(light) as avg_light,
                        AVG(dew_point) as avg_dew_point,
                        AVG(feels_like) as avg_feels_like
                    FROM weather_data
                    WHERE timestamp >= NOW() - INTERVAL '365 days'
                    GROUP BY time_bucket
                    ORDER BY time_bucket
                """

        rows = await conn.fetch(query)
        result = [dict(row) for row in rows]

        await set_cached_data(cache_key, result, 300)
        return result

@app.get("/insights")
async def get_weather_insights():
    """Get interesting weather statistics and insights"""
    cache_key = "weather_insights"
    cached = await get_cached_data(cache_key, 900)  # Cache for 15 minutes
    if cached:
        return cached

    async with db_pool.acquire() as conn:
        # All-time records
        records = await conn.fetchrow("""
            SELECT
                MAX(temperature) as max_temp,
                MIN(temperature) as min_temp,
                MAX(humidity) as max_humidity,
                MIN(humidity) as min_humidity,
                MAX(pressure) as max_pressure,
                MIN(pressure) as min_pressure,
                MAX(light) as max_light,
                MIN(light) as min_light
            FROM weather_data
        """)

        # Today's statistics
        today_stats = await conn.fetchrow("""
            SELECT
                AVG(temperature) as avg_temp_today,
                MAX(temperature) as max_temp_today,
                MIN(temperature) as min_temp_today,
                AVG(humidity) as avg_humidity_today
            FROM weather_data
            WHERE DATE(timestamp) = CURRENT_DATE
        """)

        # Temperature trends (last 7 days average vs previous 7 days)
        temp_trend = await conn.fetchrow("""
            WITH recent_week AS (
                SELECT AVG(temperature) as recent_avg
                FROM weather_data
                WHERE timestamp >= NOW() - INTERVAL '7 days'
            ),
            previous_week AS (
                SELECT AVG(temperature) as previous_avg
                FROM weather_data
                WHERE timestamp >= NOW() - INTERVAL '14 days'
                AND timestamp < NOW() - INTERVAL '7 days'
            )
            SELECT
                recent_week.recent_avg,
                previous_week.previous_avg,
                (recent_week.recent_avg - previous_week.previous_avg) as temp_change
            FROM recent_week, previous_week
        """)

        # Seasonal patterns (monthly averages)
        seasonal_data = await conn.fetch("""
            SELECT
                EXTRACT(MONTH FROM timestamp) as month,
                AVG(temperature) as avg_temp,
                AVG(humidity) as avg_humidity,
                AVG(pressure) as avg_pressure
            FROM weather_data
            GROUP BY EXTRACT(MONTH FROM timestamp)
            ORDER BY month
        """)

        # Daily patterns (hourly averages)
        daily_pattern = await conn.fetch("""
            SELECT
                EXTRACT(HOUR FROM timestamp) as hour,
                AVG(temperature) as avg_temp,
                AVG(light) as avg_light
            FROM weather_data
            WHERE timestamp >= NOW() - INTERVAL '30 days'
            GROUP BY EXTRACT(HOUR FROM timestamp)
            ORDER BY hour
        """)

        # Correlations (sample recent data for performance)
        correlation_data = await conn.fetch("""
            SELECT temperature, humidity, pressure, light
            FROM weather_data
            WHERE timestamp >= NOW() - INTERVAL '7 days'
            ORDER BY RANDOM()
            LIMIT 10000
        """)

        # Calculate correlations
        temps = [row['temperature'] for row in correlation_data]
        humids = [row['humidity'] for row in correlation_data]
        pressures = [row['pressure'] for row in correlation_data]
        lights = [row['light'] for row in correlation_data]

        temp_humidity_corr = np.corrcoef(temps, humids)[0, 1] if len(temps) > 1 else 0
        temp_pressure_corr = np.corrcoef(temps, pressures)[0, 1] if len(temps) > 1 else 0

        # Data quality stats
        data_quality = await conn.fetchrow("""
            SELECT
                COUNT(*) as total_readings,
                COUNT(*) - COUNT(temperature) as missing_temp,
                COUNT(*) - COUNT(humidity) as missing_humidity,
                MAX(timestamp) as last_reading,
                MIN(timestamp) as first_reading
            FROM weather_data
        """)

        result = {
            "records": dict(records),
            "today": dict(today_stats) if today_stats else {},
            "temperature_trend": dict(temp_trend) if temp_trend else {},
            "seasonal_patterns": [dict(row) for row in seasonal_data],
            "daily_patterns": [dict(row) for row in daily_pattern],
            "correlations": {
                "temperature_humidity": float(temp_humidity_corr),
                "temperature_pressure": float(temp_pressure_corr)
            },
            "data_quality": dict(data_quality)
        }

        await set_cached_data(cache_key, result, 900)
        return result

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        async with db_pool.acquire() as conn:
            await conn.fetchval("SELECT 1")

        await redis_client.ping()

        return {
            "status": "healthy",
            "database": "connected",
            "redis": "connected",
            "timestamp": datetime.now()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now()
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# 🌤️ Weather Query Assistant

An AI-powered weather assistant that understands natural language queries and provides real-time weather information.

## ✨ Features

- 🤖 Natural language understanding (ask in any way!)
- 🌍 Real-time weather data from OpenWeather API
- 🔄 Compare weather between cities
- 🎨 Beautiful, responsive UI
- ⚡ Fast LangChain-powered responses

## 🚀 Quick Setup

### 1. Clone & Install

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### 2. Configure Environment

Create `backend/.env`:
```env
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openai/gpt-3.5-turbo
OPEN_WEATHER_API=your_openweather_key
```

Get API keys:
- OpenRouter: https://openrouter.ai/
- OpenWeather: https://openweathermap.org/api

### 3. Run

```bash
# Terminal 1 - Backend
cd backend
venv\Scripts\activate
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit: http://localhost:5173

## 💬 Example Queries

```
"weather in Paris"
"comparison of weather of London and Tokyo"
"new delhi temperature"
"is it raining in Mumbai?"
```

## 🛠️ Tech Stack

- **Frontend**: React, Vite
- **Backend**: FastAPI, LangChain
- **AI**: OpenRouter (GPT-3.5)
- **Weather**: OpenWeather API

## 📦 Project Structure

```
WeatherApp/
├── backend/
│   ├── main.py          # FastAPI app with LangChain
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   └── services/    # API client
    └── package.json
```

## 🌐 Deployment

- **Backend**: Deploy on Render
- **Frontend**: Deploy on Vercel

## Demo Video

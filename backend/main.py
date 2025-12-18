from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import requests
import os
import re
import logging

load_dotenv()

# Production-ready logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# --------------------------------------------------
# CONFIG
# --------------------------------------------------

OPEN_WEATHER_KEY = os.getenv("OPEN_WEATHER_API")
OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-3.5-turbo")
PORT = int(os.getenv("PORT", 8000))

# Validate required environment variables
if not OPEN_WEATHER_KEY or not OPENROUTER_KEY:
    raise ValueError("Missing required API keys. Check your .env file.")

# --------------------------------------------------
# APP
# --------------------------------------------------

app = FastAPI(title="Weather Query API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# MODELS
# --------------------------------------------------

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    success: bool
    response: str | None = None
    message: str | None = None

# --------------------------------------------------
# HELPER FUNCTIONS
# --------------------------------------------------

def is_greeting(text: str) -> bool:
    return text.lower().strip() in {
        "hi", "hello", "hey", "good morning", "good evening"
    }

def is_weather_query(text: str) -> bool:
    t = text.lower()
    return any(word in t for word in WEATHER_KEYWORDS)

def detect_weather_parameter(text: str) -> str:
    t = text.lower()
    if "temperature" in t or "temp" in t:
        return "temperature"
    if "humidity" in t:
        return "humidity"
    if "wind" in t or "speed" in t:
        return "wind"
    return "general"

def extract_cities(text: str) -> list[str]:
    text = text.lower()

    # remove common noise words
    text = re.sub(
        r'\b(weather|temperature|temp|humidity|wind|speed|forecast|'
        r'compare|comparison|between|versus|vs|of|the|is|what|tell|me|in)\b',
        '',
        text
    )

    parts = re.split(r'\s+and\s+|,|\s+vs\s+', text)
    cities = []

    for part in parts:
        part = part.strip()
        if part and re.fullmatch(r'[a-z\s]+', part):
            cities.append(part.title())

    return list(dict.fromkeys(cities))  # remove duplicates

# --------------------------------------------------
# WEATHER API
# --------------------------------------------------

def fetch_weather(city: str) -> dict | None:
    try:
        res = requests.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={
                "q": city,
                "appid": OPEN_WEATHER_KEY,
                "units": "metric"
            },
            timeout=8
        )

        if res.status_code != 200:
            logging.warning(f"Weather API error for {city}: {res.text}")
            return None

        data = res.json()
        return {
            "city": data["name"],
            "country": data["sys"]["country"],
            "temp": round(data["main"]["temp"], 1),
            "humidity": data["main"]["humidity"],
            "wind": round(data["wind"]["speed"], 1),
            "condition": data["weather"][0]["description"]
        }

    except Exception as e:
        logging.error(f"Weather fetch failed: {e}")
        return None

# --------------------------------------------------
# LLM (FREE, NO STRICTNESS)
# --------------------------------------------------

llm = ChatOpenAI(
    model=MODEL,
    openai_api_key=OPENROUTER_KEY,
    openai_api_base="https://openrouter.ai/api/v1",
    temperature=0.6,
    max_tokens=220
)

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are a friendly weather assistant. "
        "Use the provided weather data to respond naturally."
    ),
    ("human", "{input}")
])

chain = prompt | llm

# --------------------------------------------------
# ROUTES
# --------------------------------------------------

@app.get("/")
def health():
    return {"status": "running"}

@app.post("/api/weather", response_model=ChatResponse)
async def weather_chat(req: ChatRequest):
    query = req.query.strip()

    # Greeting
    if is_greeting(query):
        return ChatResponse(
            success=True,
            response="Hi! How can I help you with the weather today?"
        )

    # Reject non-weather queries
    if not is_weather_query(query):
        return ChatResponse(
            success=False,
            message="I am only answerable to weather-related queries."
        )

    cities = extract_cities(query)

    # Weather intent but no city
    if not cities:
        return ChatResponse(
            success=True,
            response="Please tell me the city you want weather information for."
        )

    param = detect_weather_parameter(query)

    # ---------------- COMPARISON ----------------
    if len(cities) >= 2:
        w1 = fetch_weather(cities[0])
        w2 = fetch_weather(cities[1])

        if not w1 or not w2:
            return ChatResponse(
                success=False,
                message="Sorry, I couldn't fetch weather for one of the cities."
            )

        text = f"""
Compare the {param if param != 'general' else 'weather'} of these cities:

{w1['city']}:
Temperature: {w1['temp']}°C
Humidity: {w1['humidity']}%
Wind: {w1['wind']} km/h
Condition: {w1['condition']}

{w2['city']}:
Temperature: {w2['temp']}°C
Humidity: {w2['humidity']}%
Wind: {w2['wind']} km/h
Condition: {w2['condition']}
"""
        result = chain.invoke({"input": text})
        return ChatResponse(success=True, response=result.content.strip())

    # ---------------- SINGLE CITY ----------------
    weather = fetch_weather(cities[0])
    if not weather:
        return ChatResponse(
            success=False,
            message=f"Sorry, I couldn't find weather for {cities[0]}."
        )

    if param == "temperature":
        text = f"The current temperature in {weather['city']} is {weather['temp']}°C."
    elif param == "humidity":
        text = f"The humidity level in {weather['city']} is {weather['humidity']}%."
    elif param == "wind":
        text = f"The wind speed in {weather['city']} is {weather['wind']} km/h."
    else:
        text = f"""
Here is the current weather in {weather['city']}:
Temperature: {weather['temp']}°C
Humidity: {weather['humidity']}%
Wind: {weather['wind']} km/h
Condition: {weather['condition']}
"""

    result = chain.invoke({"input": text})
    return ChatResponse(success=True, response=result.content.strip())

# --------------------------------------------------
# RUN SERVER
# --------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting Weather Query API on port {PORT}")
    uvicorn.run(app, host="0.0.0.0", port=PORT)

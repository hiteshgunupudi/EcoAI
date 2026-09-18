from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from carbon.calculator import (
    calculate_transport,
    calculate_electricity,
    calculate_food,
    calculate_water,
    calculate_waste,
    calculate_sustainability_score,
    get_carbon_level,
)

from ai.recommender import (
    generate_recommendation,
    generate_overall_insight,
)

from ai.chat import generate_chat_response

from database.database import (
    initialize_database,
    add_activity,
    get_activities,
    delete_activity,
)


# =========================================================
# ECOAI APPLICATION
# =========================================================

app = FastAPI(
    title="EcoAI API",
    description="AI-powered Smart Carbon Footprint Analyzer",
    version="1.0.0",
)


# =========================================================
# CORS CONFIGURATION
# =========================================================

app.add_middleware(
    CORSMiddleware,

    # Exact production frontend
    allow_origins=[
        "https://eco-ai-zeta.vercel.app",

        # Local development
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    # Allow Vercel preview deployments too
    allow_origin_regex=r"https://.*\.vercel\.app",

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# REQUEST MODELS
# =========================================================

class CarbonRequest(BaseModel):
    category: str
    amount: float
    mode: str | None = None


class RecommendationRequest(BaseModel):
    category: str
    carbon: float


class OverallInsightRequest(BaseModel):
    category_impacts: dict[str, float]


class ActivityRequest(BaseModel):
    category: str
    amount: float
    unit: str
    carbon_kg: float
    mode: str | None = None


class ChatRequest(BaseModel):
    message: str
    total_carbon: float = 0
    category_impacts: dict[str, float] = Field(
        default_factory=dict
    )


# =========================================================
# STARTUP
# =========================================================

@app.on_event("startup")
def startup():
    initialize_database()


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "message": "EcoAI Backend is running 🌱",
        "status": "success",
        "version": "1.0.0",
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy",
    }


# =========================================================
# CARBON CALCULATION
# =========================================================

@app.post("/calculate")
def calculate_carbon(data: CarbonRequest):

    category = data.category.strip().lower()
    amount = data.amount

    if amount < 0:
        raise HTTPException(
            status_code=400,
            detail="Amount cannot be negative",
        )

    if category == "transport":

        carbon = calculate_transport(
            amount,
            data.mode or "car",
        )

    elif category == "electricity":

        carbon = calculate_electricity(
            amount
        )

    elif category == "food":

        carbon = calculate_food(
            amount,
            data.mode or "mixed",
        )

    elif category == "water":

        carbon = calculate_water(
            amount
        )

    elif category == "waste":

        carbon = calculate_waste(
            amount
        )

    else:

        raise HTTPException(
            status_code=400,
            detail="Invalid category",
        )

    score = calculate_sustainability_score(
        carbon
    )

    level = get_carbon_level(
        carbon
    )

    return {
        "status": "success",
        "category": category,
        "amount": amount,
        "carbon_kg": carbon,
        "sustainability_score": score,
        "carbon_level": level,
    }


# =========================================================
# CATEGORY RECOMMENDATION
# =========================================================

@app.post("/recommendation")
def recommendation(
    data: RecommendationRequest
):

    result = generate_recommendation(
        data.category,
        data.carbon,
    )

    return {
        "status": "success",
        "recommendation": result,
    }


# =========================================================
# OVERALL AI INSIGHT
# =========================================================

@app.post("/overall-insight")
def overall_insight(
    data: OverallInsightRequest
):

    result = generate_overall_insight(
        data.category_impacts,
    )

    return {
        "status": "success",
        "insight": result,
    }


# =========================================================
# AI SUSTAINABILITY COPILOT
# =========================================================

@app.post("/chat")
def chat(data: ChatRequest):

    message = data.message.strip()

    if not message:

        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty",
        )

    result = generate_chat_response(
        message=message,
        total_carbon=data.total_carbon,
        category_impacts=data.category_impacts,
    )

    return {
        "status": "success",
        "response": result,
    }


# =========================================================
# CREATE ACTIVITY
# =========================================================

@app.post("/activities")
def create_activity(
    data: ActivityRequest
):

    if data.amount < 0:

        raise HTTPException(
            status_code=400,
            detail="Amount cannot be negative",
        )

    if data.carbon_kg < 0:

        raise HTTPException(
            status_code=400,
            detail="Carbon value cannot be negative",
        )

    activity_id = add_activity(
        category=data.category,
        amount=data.amount,
        unit=data.unit,
        carbon_kg=data.carbon_kg,
        mode=data.mode,
    )

    return {
        "status": "success",
        "message": "Activity saved successfully",
        "activity_id": activity_id,
    }


# =========================================================
# GET ALL ACTIVITIES
# =========================================================

@app.get("/activities")
def activities():

    return {
        "status": "success",
        "activities": get_activities(),
    }


# =========================================================
# DELETE ACTIVITY
# =========================================================

@app.delete("/activities/{activity_id}")
def remove_activity(
    activity_id: int
):

    deleted = delete_activity(
        activity_id
    )

    if not deleted:

        raise HTTPException(
            status_code=404,
            detail="Activity not found",
        )

    return {
        "status": "success",
        "message": "Activity deleted successfully",
    }
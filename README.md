# 🌱 EcoAI — Smart Carbon Footprint Analyzer

> **AI-assisted sustainability intelligence for understanding everyday carbon impact and making practical, informed choices.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-00DCA0?style=for-the-badge)](https://eco-ai-zeta.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge)](https://ecoai-backend-5fgd.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/hiteshgunupudi/EcoAI)

---

## 🌍 Overview

**EcoAI** is a full-stack AI-assisted sustainability platform designed to help users estimate their everyday carbon footprint, understand the categories contributing to their impact, and discover practical actions for more sustainable choices.

Users can track activities across:

- 🚗 Transport
- ⚡ Electricity
- 🍽️ Food
- 💧 Water
- ♻️ Waste

EcoAI converts tracked activities into estimated **CO₂e impact**, provides a **Sustainability Score**, visualizes impact through an interactive dashboard, and provides personalized sustainability guidance through the **EcoAI Copilot**.

---

## 🎯 Problem Statement

People make many everyday decisions that contribute to their carbon footprint, but the environmental impact of these choices is often difficult to understand.

Common challenges include:

- Generic sustainability advice
- Difficulty interpreting carbon impact
- Lack of personalized recommendations
- Limited visibility into daily activity patterns
- Lack of continuous feedback

EcoAI addresses this gap through a simple feedback loop:

> **Track → Calculate → Understand → Prioritize → Act**

---

## 💡 Our Solution

EcoAI combines activity tracking, carbon estimation, analytics, and AI-assisted recommendations into a single platform.

### Core Workflow

```text
User Activity
      ↓
Activity Validation
      ↓
Carbon Calculation
      ↓
Activity Storage
      ↓
Impact Analysis
      ↓
Dashboard & Sustainability Score
      ↓
AI Recommendations
      ↓
EcoAI Sustainability Copilot
```

---

## ✨ Key Features

### 🚗 Activity Tracking

Track everyday activities across:

- Transport
- Electricity
- Food
- Water
- Waste

### 🧮 Carbon Footprint Calculator

EcoAI estimates the carbon impact of each activity using an activity-based calculation model.

```text
Carbon Impact = Activity Amount × Emission Factor
```

The result is represented as estimated:

```text
kg CO₂e
```

### 🌿 Sustainability Score

The platform converts tracked carbon impact into an easy-to-understand sustainability score that helps users monitor their progress.

### 📊 Interactive Dashboard

The dashboard provides:

- Total tracked carbon impact
- Sustainability score
- Number of activities tracked
- Highest-impact category
- Category-level impact visualization
- Activity history

### 🤖 AI Sustainability Insights

EcoAI provides practical sustainability recommendations based on tracked activity information.

Examples include:

- Reducing unnecessary vehicle trips
- Using public transportation where practical
- Improving electricity efficiency
- Exploring more plant-based meals
- Reducing avoidable waste
- Conserving water

### 💬 EcoAI Copilot

The conversational sustainability assistant allows users to ask natural-language questions.

Example:

```text
What is my carbon footprint?
```

or:

```text
How can I reduce transport emissions?
```

The Copilot can use tracked activity context to provide more relevant sustainability guidance.

### 🔐 Authentication

The prototype includes a login and registration flow for the demonstration experience.

### 📝 Activity History

Users can review previously tracked activities and remove activities when required.

---

## 🧠 Why AI?

Traditional carbon calculators mainly provide numerical results.

EcoAI adds an intelligence layer that helps users understand their data and identify practical actions.

```text
Activity Data
      ↓
Impact Analysis
      ↓
Contextual Understanding
      ↓
Personalized Recommendation
      ↓
Conversational Assistance
```

The current prototype uses a **context-aware recommendation and conversational engine**.

Future versions can incorporate trained machine-learning models using larger and appropriately anonymized datasets.

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │        User         │
                    └──────────┬──────────┘
                               │
                               ▼
              ┌────────────────────────────┐
              │ React + Vite Frontend      │
              │ Tailwind CSS               │
              │ Recharts + Lucide React    │
              └──────────────┬─────────────┘
                             │
                         REST API
                             │
                             ▼
              ┌────────────────────────────┐
              │ Python + FastAPI Backend   │
              │ Uvicorn + Pydantic         │
              └──────────────┬─────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
       ┌────────────┐ ┌────────────┐ ┌────────────┐
       │   Carbon   │ │ AI Engine  │ │   SQLite   │
       │ Calculator │ │ & Copilot  │ │  Database  │
       └────────────┘ └────────────┘ └────────────┘
```

---

## 🔄 End-to-End Workflow

```text
1. User registers or logs in
              ↓
2. User records a daily activity
              ↓
3. EcoAI validates the activity
              ↓
4. Carbon impact is calculated
              ↓
5. Activity is stored
              ↓
6. Dashboard updates automatically
              ↓
7. Category impacts are analyzed
              ↓
8. AI generates sustainability guidance
              ↓
9. User interacts with EcoAI Copilot
              ↓
10. User receives practical sustainability actions
```

---

## 🛠️ Technology Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Recharts
- Lucide React

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- REST API

### AI / Intelligence

- Python
- Context-aware recommendation engine
- Conversational sustainability Copilot
- Rule-based intelligence in the current prototype
- Scikit-learn planned for future ML expansion

### Database

- SQLite

### Development & Deployment

- Visual Studio Code
- Git
- GitHub
- Vercel
- Render

---

## 📁 Project Structure

```text
EcoAI/
│
├── backend/
│   ├── ai/
│   │   ├── chat.py
│   │   └── recommender.py
│   │
│   ├── carbon/
│   │   ├── __init__.py
│   │   └── calculator.py
│   │
│   ├── database/
│   │   └── database.py
│   │
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── EcoAICopilot.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ActivityTracker.jsx
│   │   │   └── AIInsights.jsx
│   │   │
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── vercel.json
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Backend health check |
| POST | `/calculate` | Calculate carbon impact |
| POST | `/recommendation` | Generate recommendation |
| POST | `/overall-insight` | Generate overall sustainability insight |
| POST | `/activities` | Add activity |
| GET | `/activities` | Retrieve activities |
| DELETE | `/activities/{id}` | Delete activity |
| POST | `/chat` | EcoAI Copilot |

---

## 🚀 Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/hiteshgunupudi/EcoAI.git
cd EcoAI
```

---

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn main:app --reload
```

Backend will be available at:

```text
http://127.0.0.1:8000
```

---

### 3. Frontend Setup

Open another terminal and navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will be available at:

```text
http://localhost:5173
```

---

## 🌐 Live Deployment

### 🌱 Frontend

**EcoAI Live Demo**

https://eco-ai-zeta.vercel.app

### ⚙️ Backend

**EcoAI Backend API**

https://ecoai-backend-5fgd.onrender.com

### 💻 GitHub Repository

https://github.com/hiteshgunupudi/EcoAI

---

## 📊 Example Prototype Calculation

For example:

```text
Activity:
Transport

Distance:
10 km

Mode:
Car
```

Illustrative output:

```text
Carbon Impact:
1.92 kg CO₂e
```

The dashboard can then combine multiple tracked activities to provide an overall view of estimated impact.

---

## ⚠️ Carbon Calculation Disclaimer

The emission factors currently used by EcoAI are **illustrative prototype values intended for demonstration purposes**.

They should not be interpreted as certified or region-specific greenhouse-gas accounting.

Future versions can integrate authoritative, transparent, and region-specific emission-factor datasets.

---

## 🌱 SDG Alignment

### SDG 13 — Climate Action

EcoAI primarily aligns with **United Nations Sustainable Development Goal 13: Climate Action**.

The platform supports climate awareness by helping users:

- Understand their estimated carbon impact
- Identify higher-impact activity categories
- Receive practical sustainability recommendations
- Track everyday activities
- Make more informed sustainability decisions

> **Measure → Understand → Act**

---

## 🤝 Responsible AI

EcoAI follows a human-centered approach to AI-assisted sustainability guidance.

### 🔍 Transparency

Carbon values are presented as estimates, and the prototype's emission factors are documented.

### 🔐 Privacy

The application is designed to use only the information required for the sustainability experience.

### ⚖️ Fairness

Recommendations should remain practical across different lifestyles, circumstances, and resource constraints.

### 👤 Human Control

AI provides guidance rather than making decisions for users. Users remain responsible for deciding which actions are appropriate for their circumstances.

---

## 🎯 Target Users

EcoAI can be useful for:

- 🎓 Students
- 🏠 Households
- 🌱 Environmentally conscious individuals
- 📚 Sustainability learners
- 🏢 Organizations exploring sustainability awareness tools

---

## 📈 Expected Impact

EcoAI is designed to create a simple behavioral feedback loop:

```text
Measure
   ↓
Understand
   ↓
Identify High-Impact Areas
   ↓
Take Action
   ↓
Track Again
```

This approach can help make sustainability information more understandable and actionable at the individual level.

---

## 🔮 Future Scope

Future versions of EcoAI can include:

- 🧠 Machine-learning based personalization
- 🌍 Region-specific emission-factor datasets
- 📊 Advanced carbon trend analysis
- 🔮 Carbon footprint forecasting
- 🎯 Personalized sustainability goals
- 🏆 Gamification and achievement systems
- 📱 Mobile application
- 🔄 What-if carbon simulations
- 🌱 Expanded SDG tracking
- 📡 Integration with smart devices and activity data

---

## 🎥 Demo Flow

For a live project demonstration:

```text
Open EcoAI
      ↓
Register / Login
      ↓
Open Activity Tracker
      ↓
Add Daily Activity
      ↓
View Carbon Calculation
      ↓
Save Activity
      ↓
Open Dashboard
      ↓
View Impact Breakdown
      ↓
Open AI Insights
      ↓
View Personalized Recommendation
      ↓
Open EcoAI Copilot
      ↓
Ask Sustainability Question
```

---

## 📸 Project Highlights

### Dashboard

The EcoAI dashboard provides a visual overview of:

- Total CO₂e tracked
- Sustainability score
- Activities tracked
- Highest-impact category
- Category impact analysis

### AI Insights

The AI Insights section provides:

- Overall sustainability insight
- Category-level analysis
- Personalized recommendations
- Action plan
- Responsible AI information

### EcoAI Copilot

The Copilot enables conversational interaction around:

- Carbon footprint
- Transport
- Electricity
- Food
- Water
- Waste
- Sustainable daily choices

---

## 📚 Project Context

| Category | Details |
|----------|---------|
| **Project** | EcoAI — Smart Carbon Footprint Analyzer |
| **Program** | 1M1B AI for Sustainability Virtual Internship |
| **Domain** | Artificial Intelligence + Sustainability |
| **Primary SDG** | SDG 13 — Climate Action |
| **Project Type** | Full-Stack AI-Assisted Sustainability Platform |
| **Frontend** | React.js |
| **Backend** | Python + FastAPI |
| **Database** | SQLite |
| **Deployment** | Vercel + Render |

---

## 📂 Project Resources

| Resource | Link |
|----------|------|
| 🌐 Live Demo | https://eco-ai-zeta.vercel.app |
| ⚙️ Backend API | https://ecoai-backend-5fgd.onrender.com |
| 💻 GitHub Repository | https://github.com/hiteshgunupudi/EcoAI |

---

## 👨‍💻 Developer

### Gunupudi Venkata Sai Hitesh

**B.Tech — Cybersecurity**  
**Godavari Institute of Engineering and Technology (GIET)**

GitHub:

https://github.com/hiteshgunupudi

---

## ⭐ Project

If you find **EcoAI** useful, consider giving the repository a ⭐ on GitHub.

---

> ## 🌱 EcoAI
>
> **Measure your impact. Understand it. Act on it.**
>
> *Building technology for a more sustainable future.*

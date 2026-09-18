# EcoAI AI Recommendation Engine
# Rule-based intelligent recommendation layer.


RECOMMENDATIONS = {

    "transport": {

        "title":
            "Reduce transport emissions",

        "message":
            "Consider public transport, cycling, walking, or carpooling for suitable trips.",

        "actions": [
            "Use public transport when practical",
            "Try cycling or walking for short distances",
            "Combine multiple errands into one trip",
        ],
    },


    "electricity": {

        "title":
            "Optimize electricity usage",

        "message":
            "Reducing unnecessary electricity consumption can lower your estimated footprint.",

        "actions": [
            "Switch off unused appliances",
            "Use energy-efficient LED lighting",
            "Avoid leaving devices on standby",
        ],
    },


    "food": {

        "title":
            "Make food choices greener",

        "message":
            "Including more plant-based meals can reduce the estimated impact of your diet.",

        "actions": [
            "Add more plant-based meals",
            "Reduce unnecessary food waste",
            "Prefer seasonal and locally available foods",
        ],
    },


    "water": {

        "title":
            "Use water efficiently",

        "message":
            "Small changes in daily water consumption can improve resource efficiency.",

        "actions": [
            "Fix leaking taps",
            "Take shorter showers",
            "Reuse water where appropriate",
        ],
    },


    "waste": {

        "title":
            "Reduce and manage waste",

        "message":
            "Reducing waste and improving segregation can support a more sustainable lifestyle.",

        "actions": [
            "Separate recyclable waste",
            "Avoid unnecessary single-use items",
            "Reuse items before replacing them",
        ],
    },
}


def generate_recommendation(
    category,
    carbon
):

    category = category.lower()

    recommendation = RECOMMENDATIONS.get(
        category,
        {
            "title":
                "Keep improving your sustainability",

            "message":
                "Continue tracking your activities to discover opportunities for improvement.",

            "actions": [
                "Track your daily activities",
                "Review your carbon trends",
                "Make one sustainable change at a time",
            ],
        }
    )

    return {

        "category":
            category,

        "carbon_kg":
            round(float(carbon), 2),

        "title":
            recommendation["title"],

        "message":
            recommendation["message"],

        "actions":
            recommendation["actions"],
    }


def generate_overall_insight(
    category_impacts
):

    if not category_impacts:

        return {

            "focus":
                "Start tracking",

            "message":
                "Add some activities so EcoAI can generate personalized sustainability insights.",
        }


    highest_category = max(
        category_impacts,
        key=category_impacts.get
    )

    highest_value = category_impacts[
        highest_category
    ]

    recommendation = generate_recommendation(
        highest_category,
        highest_value
    )

    return {

        "focus":
            highest_category,

        "carbon_kg":
            round(
                float(highest_value),
                2
            ),

        "title":
            recommendation["title"],

        "message":
            recommendation["message"],
    }
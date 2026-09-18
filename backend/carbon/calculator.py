# EcoAI Carbon Calculation Engine
# Prototype emission factors for demonstration purposes.


EMISSION_FACTORS = {

    "transport": {
        "car": 0.192,
        "bus": 0.105,
        "train": 0.041,
        "bike": 0.0,
    },

    "electricity": {
        "grid": 0.7,
    },

    "food": {
        "plant": 0.5,
        "mixed": 1.5,
        "meat": 3.3,
    },

    "water": {
        "standard": 0.0003,
    },

    "waste": {
        "standard": 0.5,
    },
}


def calculate_transport(
    distance,
    mode="car"
):

    factor = EMISSION_FACTORS[
        "transport"
    ].get(
        mode,
        EMISSION_FACTORS[
            "transport"
        ]["car"]
    )

    return round(
        float(distance) * factor,
        2
    )


def calculate_electricity(kwh):

    return round(
        float(kwh)
        * EMISSION_FACTORS[
            "electricity"
        ]["grid"],
        2
    )


def calculate_food(
    meals,
    food_type="mixed"
):

    factor = EMISSION_FACTORS[
        "food"
    ].get(
        food_type,
        EMISSION_FACTORS[
            "food"
        ]["mixed"]
    )

    return round(
        float(meals) * factor,
        2
    )


def calculate_water(litres):

    return round(
        float(litres)
        * EMISSION_FACTORS[
            "water"
        ]["standard"],
        2
    )


def calculate_waste(kg):

    return round(
        float(kg)
        * EMISSION_FACTORS[
            "waste"
        ]["standard"],
        2
    )


def calculate_total_carbon(
    transport=0,
    electricity=0,
    food=0,
    water=0,
    waste=0
):

    total = (
        float(transport)
        + float(electricity)
        + float(food)
        + float(water)
        + float(waste)
    )

    return round(
        total,
        2
    )


def calculate_sustainability_score(
    carbon
):

    carbon = float(carbon)

    if carbon <= 100:
        return 95

    elif carbon <= 150:
        return 90

    elif carbon <= 200:
        return 82

    elif carbon <= 250:
        return 75

    elif carbon <= 300:
        return 68

    elif carbon <= 400:
        return 58

    return 45


def get_carbon_level(carbon):

    carbon = float(carbon)

    if carbon <= 150:
        return "Low"

    elif carbon <= 250:
        return "Moderate"

    return "High"
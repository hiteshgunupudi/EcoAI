# EcoAI AI Sustainability Copilot
# Context-aware recommendation engine for the prototype.


def generate_chat_response(
    message: str,
    total_carbon: float = 0,
    category_impacts: dict | None = None,
):
    """
    Generate a sustainability-focused response
    using the user's message and tracked activity context.
    """

    message = message.strip().lower()

    category_impacts = category_impacts or {}

    total_carbon = float(total_carbon or 0)


    # Find highest-impact category

    highest_category = None
    highest_impact = 0

    if category_impacts:

        highest_category, highest_impact = max(
            category_impacts.items(),
            key=lambda item: float(item[1])
        )


    # =========================
    # Greeting
    # =========================

    if any(
        word in message
        for word in [
            "hello",
            "hi",
            "hey",
            "namaste",
        ]
    ):

        return {
            "type": "greeting",
            "message": (
                "Hi! I'm EcoAI, your sustainability "
                "copilot. I can help you understand "
                "your carbon impact and discover "
                "practical ways to make your daily "
                "choices more sustainable."
            ),
        }


    # =========================
    # Carbon Questions
    # =========================

    if (
        "carbon" in message
        or "co2" in message
        or "footprint" in message
    ):

        if total_carbon > 0:

            return {
                "type": "carbon",
                "message": (
                    f"Your currently tracked activities "
                    f"add up to approximately "
                    f"{total_carbon:.2f} kg CO₂e. "
                    f"EcoAI can use this activity history "
                    f"to identify where the largest share "
                    f"of your tracked impact comes from."
                ),
            }

        return {
            "type": "carbon",
            "message": (
                "You haven't tracked any activities yet. "
                "Add some transport, electricity, food, "
                "water, or waste activities and I'll "
                "help you understand your estimated impact."
            ),
        }


    # =========================
    # Transport
    # =========================

    if any(
        word in message
        for word in [
            "transport",
            "car",
            "travel",
            "bus",
            "train",
            "bike",
            "cycling",
            "driving",
        ]
    ):

        return {
            "type": "transport",
            "message": (
                "For suitable trips, consider public "
                "transport, walking, cycling, or "
                "carpooling. Combining errands into "
                "fewer trips can also reduce unnecessary "
                "travel."
            ),
        }


    # =========================
    # Electricity
    # =========================

    if any(
        word in message
        for word in [
            "electricity",
            "energy",
            "power",
            "appliance",
            "electric",
        ]
    ):

        return {
            "type": "electricity",
            "message": (
                "Try switching off unused appliances, "
                "using efficient lighting, and avoiding "
                "unnecessary standby consumption. "
                "Tracking your electricity usage over "
                "time can help identify patterns."
            ),
        }


    # =========================
    # Food
    # =========================

    if any(
        word in message
        for word in [
            "food",
            "meal",
            "meat",
            "diet",
            "vegetarian",
            "plant",
        ]
    ):

        return {
            "type": "food",
            "message": (
                "You can explore more plant-based meals, "
                "reduce avoidable food waste, and choose "
                "seasonal or locally available foods "
                "where practical."
            ),
        }


    # =========================
    # Water
    # =========================

    if any(
        word in message
        for word in [
            "water",
            "shower",
            "tap",
            "litre",
            "liter",
        ]
    ):

        return {
            "type": "water",
            "message": (
                "Consider shorter showers, fixing leaks, "
                "and reusing water where appropriate. "
                "Tracking daily usage can help you "
                "identify opportunities to save water."
            ),
        }


    # =========================
    # Waste
    # =========================

    if any(
        word in message
        for word in [
            "waste",
            "garbage",
            "trash",
            "recycle",
            "recycling",
            "plastic",
        ]
    ):

        return {
            "type": "waste",
            "message": (
                "Focus on reducing unnecessary waste, "
                "reusing items where possible, and "
                "separating recyclable materials "
                "appropriately."
            ),
        }


    # =========================
    # Personalized Context
    # =========================

    if highest_category:

        category_name = (
            str(highest_category)
            .replace("_", " ")
            .title()
        )

        return {
            "type": "personalized",
            "message": (
                f"Based on your tracked activity data, "
                f"{category_name} currently represents "
                f"your largest tracked impact at about "
                f"{float(highest_impact):.2f} kg CO₂e. "
                f"Consider focusing your next sustainable "
                f"action on this category."
            ),
        }


    # =========================
    # Default Response
    # =========================

    return {
        "type": "general",
        "message": (
            "I can help you with transport, "
            "electricity, food, water, waste, "
            "carbon footprint, and sustainable "
            "daily choices. Tell me what you'd "
            "like to improve."
        ),
    }
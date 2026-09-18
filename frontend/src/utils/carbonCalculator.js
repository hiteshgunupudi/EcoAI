// EcoAI Carbon Calculation Engine
// Values are illustrative emission factors for the prototype.

const EMISSION_FACTORS = {
  transport: {
    car: 0.192,
    bus: 0.105,
    train: 0.041,
    bike: 0,
  },

  electricity: {
    grid: 0.7,
  },

  food: {
    plant: 0.5,
    mixed: 1.5,
    meat: 3.3,
  },

  water: {
    standard: 0.0003,
  },

  waste: {
    standard: 0.5,
  },
};

export function calculateTransport(distance, mode = "car") {
  const factor =
    EMISSION_FACTORS.transport[mode] ??
    EMISSION_FACTORS.transport.car;

  return Number(distance) * factor;
}

export function calculateElectricity(kwh) {
  return Number(kwh) * EMISSION_FACTORS.electricity.grid;
}

export function calculateFood(meals, type = "mixed") {
  const factor =
    EMISSION_FACTORS.food[type] ??
    EMISSION_FACTORS.food.mixed;

  return Number(meals) * factor;
}

export function calculateWater(litres) {
  return Number(litres) * EMISSION_FACTORS.water.standard;
}

export function calculateWaste(kg) {
  return Number(kg) * EMISSION_FACTORS.waste.standard;
}

export function calculateTotalCarbon({
  transport = 0,
  electricity = 0,
  food = 0,
  water = 0,
  waste = 0,
}) {
  const total =
    Number(transport) +
    Number(electricity) +
    Number(food) +
    Number(water) +
    Number(waste);

  return Number(total.toFixed(2));
}

export function calculateSustainabilityScore(monthlyCarbon) {
  const carbon = Number(monthlyCarbon);

  if (carbon <= 100) return 95;
  if (carbon <= 150) return 90;
  if (carbon <= 200) return 82;
  if (carbon <= 250) return 75;
  if (carbon <= 300) return 68;
  if (carbon <= 400) return 58;

  return 45;
}

export function getCarbonLevel(monthlyCarbon) {
  const carbon = Number(monthlyCarbon);

  if (carbon <= 150) {
    return "Low";
  }

  if (carbon <= 250) {
    return "Moderate";
  }

  return "High";
}
const API_BASE_URL = "http://127.0.0.1:8000";


async function request(endpoint, options = {}) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response from server");
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
      data.message ||
      "Something went wrong"
    );
  }

  return data;
}


// =========================
// Health
// =========================

export async function checkHealth() {
  return request("/health");
}


// =========================
// Carbon Calculation
// =========================

export async function calculateCarbon(
  category,
  amount,
  mode = null
) {
  return request("/calculate", {
    method: "POST",

    body: JSON.stringify({
      category,
      amount: Number(amount),
      mode,
    }),
  });
}


// =========================
// AI Recommendation
// =========================

export async function getRecommendation(
  category,
  carbon
) {
  return request("/recommendation", {
    method: "POST",

    body: JSON.stringify({
      category,
      carbon: Number(carbon),
    }),
  });
}


// =========================
// Overall AI Insight
// =========================

export async function getOverallInsight(
  categoryImpacts
) {
  return request("/overall-insight", {
    method: "POST",

    body: JSON.stringify({
      category_impacts: categoryImpacts,
    }),
  });
}


// =========================
// Save Activity
// =========================

export async function saveActivity(activity) {
  return request("/activities", {
    method: "POST",

    body: JSON.stringify({
      category: activity.category,
      amount: Number(activity.amount),
      unit: activity.unit,
      carbon_kg: Number(activity.carbon),
      mode: activity.mode || null,
    }),
  });
}


// =========================
// Get Activities
// =========================

export async function getActivities() {
  return request("/activities");
}


// =========================
// Delete Activity
// =========================

export async function deleteActivity(
  activityId
) {
  return request(
    `/activities/${activityId}`,
    {
      method: "DELETE",
    }
  );
}
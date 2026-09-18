import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Database,
  Leaf,
  Loader2,
  RefreshCw,
  Trash2,
  TrendingDown,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE = "https://ecoai-backend-5fgd.onrender.com";

const CATEGORY_CONFIG = {
  transport: {
    label: "Transport",
    unit: "km",
    icon: "🚗",
  },
  electricity: {
    label: "Electricity",
    unit: "kWh",
    icon: "⚡",
  },
  food: {
    label: "Food",
    unit: "meals",
    icon: "🍽️",
  },
  water: {
    label: "Water",
    unit: "litres",
    icon: "💧",
  },
  waste: {
    label: "Waste",
    unit: "kg",
    icon: "♻️",
  },
};

function formatCategory(category) {
  return (
    CATEGORY_CONFIG[category]?.label ||
    category?.replaceAll("_", " ") ||
    "Activity"
  );
}

function formatDate(dateString) {
  if (!dateString) return "Recently";

  const date = new Date(dateString.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getModeOptions(category) {
  if (category === "transport") {
    return [
      { value: "car", label: "Car" },
      { value: "bus", label: "Bus" },
      { value: "train", label: "Train" },
      { value: "bike", label: "Bike" },
    ];
  }

  if (category === "food") {
    return [
      { value: "mixed", label: "Mixed" },
      { value: "plant", label: "Plant-based" },
      { value: "meat", label: "Meat-heavy" },
    ];
  }

  return [];
}

export default function ActivityTracker() {
  const [category, setCategory] = useState("transport");
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("car");

  const [activities, setActivities] = useState([]);
  const [previewCarbon, setPreviewCarbon] = useState(0);

  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [clearing, setClearing] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const currentConfig =
    CATEGORY_CONFIG[category] || CATEGORY_CONFIG.transport;

  const modeOptions = getModeOptions(category);

  useEffect(() => {
    if (category === "transport") {
      setMode("car");
    } else if (category === "food") {
      setMode("mixed");
    } else {
      setMode("");
    }

    setAmount("");
    setPreviewCarbon(0);
    setMessage("");
    setError("");
  }, [category]);

  async function loadActivities() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/activities`);

      if (!response.ok) {
        throw new Error("Unable to load activities");
      }

      const data = await response.json();

      setActivities(data.activities || []);
    } catch (err) {
      console.error("EcoAI activity loading error:", err);

      setError(
        "Unable to connect to EcoAI backend. Please try refreshing the page."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActivities();
  }, []);

  async function calculatePreview(value = amount) {
    if (!value || Number(value) <= 0) {
      setPreviewCarbon(0);
      return;
    }

    try {
      setCalculating(true);

      const response = await fetch(`${API_BASE}/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          amount: Number(value),
          mode: mode || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Calculation failed");
      }

      const data = await response.json();

      setPreviewCarbon(Number(data.carbon_kg || 0));
    } catch (err) {
      console.error("EcoAI calculation error:", err);
      setPreviewCarbon(0);
    } finally {
      setCalculating(false);
    }
  }

  function handleAmountChange(event) {
    const value = event.target.value;

    setAmount(value);
    calculatePreview(value);
  }

  async function saveActivity(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid activity amount.");
      return;
    }

    try {
      setSaving(true);

      const calculateResponse = await fetch(`${API_BASE}/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          amount: Number(amount),
          mode: mode || null,
        }),
      });

      if (!calculateResponse.ok) {
        throw new Error("Carbon calculation failed");
      }

      const calculated = await calculateResponse.json();

      const saveResponse = await fetch(`${API_BASE}/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          amount: Number(amount),
          unit: currentConfig.unit,
          carbon_kg: Number(calculated.carbon_kg || 0),
          mode: mode || null,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error("Activity could not be saved");
      }

      setMessage("Activity saved successfully 🌱");
      setAmount("");
      setPreviewCarbon(0);

      await loadActivities();
    } catch (err) {
      console.error("EcoAI save activity error:", err);

      setError(
        "Unable to save activity. Please check your connection and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteActivity(id) {
    try {
      setDeleting(id);
      setError("");
      setMessage("");

      const response = await fetch(`${API_BASE}/activities/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setActivities((current) =>
        current.filter((activity) => activity.id !== id)
      );

      setMessage("Activity deleted successfully.");
    } catch (err) {
      console.error("EcoAI delete activity error:", err);

      setError("Unable to delete this activity. Please try again.");
    } finally {
      setDeleting(null);
    }
  }

  async function clearDemoData() {
    if (!activities.length) {
      setMessage("There are no activities to clear.");
      return;
    }

    const confirmed = window.confirm(
      "Delete all currently stored activities? This is useful before taking final demo screenshots."
    );

    if (!confirmed) return;

    try {
      setClearing(true);
      setError("");
      setMessage("");

      const deleteRequests = activities.map((activity) =>
        fetch(`${API_BASE}/activities/${activity.id}`, {
          method: "DELETE",
        })
      );

      const results = await Promise.all(deleteRequests);

      const failed = results.some((response) => !response.ok);

      if (failed) {
        throw new Error("Some activities could not be deleted");
      }

      setActivities([]);
      setMessage("All demo activity data has been cleared.");
    } catch (err) {
      console.error("EcoAI clear activities error:", err);

      setError("Some activities could not be deleted. Please try again.");

      await loadActivities();
    } finally {
      setClearing(false);
    }
  }

  const totalCarbon = useMemo(() => {
    return activities.reduce(
      (sum, activity) => sum + Number(activity.carbon_kg || 0),
      0
    );
  }, [activities]);

  const highestImpact = useMemo(() => {
    if (!activities.length) return null;

    return activities.reduce((highest, current) => {
      if (!highest) return current;

      return Number(current.carbon_kg || 0) >
        Number(highest.carbon_kg || 0)
        ? current
        : highest;
    }, null);
  }, [activities]);

  const categoryCount = useMemo(() => {
    const counts = {};

    activities.forEach((activity) => {
      counts[activity.category] =
        (counts[activity.category] || 0) + 1;
    });

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [activities]);

  return (
    <div className="min-h-screen bg-[#06110d] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-green-500/5 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06110d]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400 text-[#06110d] shadow-lg shadow-emerald-500/20">
              <Leaf size={21} strokeWidth={2.5} />
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight">
                Eco<span className="text-emerald-400">AI</span>
              </div>

              <div className="text-[10px] uppercase tracking-[0.25em] text-white/35">
                Sustainability Intelligence
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              to="/dashboard"
              className="rounded-xl px-4 py-2 text-sm text-white/55 transition hover:bg-white/5 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              to="/activity"
              className="rounded-xl bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/20"
            >
              Activity
            </Link>

            <Link
              to="/insights"
              className="rounded-xl px-4 py-2 text-sm text-white/55 transition hover:bg-white/5 hover:text-white"
            >
              AI Insights
            </Link>
          </nav>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        {/* Heading */}
        <section className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
            <Activity size={14} />
            Personal Activity Tracker
          </div>

          <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Track your daily impact.
            <span className="block text-emerald-400">
              Understand. Improve. Repeat.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
            Add everyday activities and EcoAI will estimate their carbon
            impact, store your history, and use the data to generate
            personalized sustainability insights.
          </p>
        </section>

        {/* Alerts */}
        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Add Activity */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-7">
            <div className="mb-7 flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-emerald-300">
                  <Zap size={17} />

                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    New Activity
                  </span>
                </div>

                <h2 className="text-2xl font-semibold">
                  Add an activity
                </h2>

                <p className="mt-1 text-sm text-white/40">
                  Your impact is calculated instantly.
                </p>
              </div>

              <div className="hidden rounded-2xl bg-emerald-400/10 p-3 text-emerald-300 sm:block">
                <Leaf size={21} />
              </div>
            </div>

            <form onSubmit={saveActivity} className="space-y-5">
              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Activity category
                </label>

                <div className="relative">
                  <select
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value)
                    }
                    className="w-full appearance-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 pr-11 text-sm text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
                  >
                    {Object.entries(CATEGORY_CONFIG).map(
                      ([value, config]) => (
                        <option
                          key={value}
                          value={value}
                          className="bg-[#0b1712]"
                        >
                          {config.icon} {config.label}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/35"
                  />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Amount
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder={`Enter amount in ${currentConfig.unit}`}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 pr-20 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-white/35">
                    {currentConfig.unit}
                  </span>
                </div>
              </div>

              {/* Mode */}
              {modeOptions.length > 0 && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/75">
                    {category === "transport"
                      ? "Transport mode"
                      : "Food type"}
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {modeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setMode(option.value);

                          setTimeout(
                            () => calculatePreview(),
                            0
                          );
                        }}
                        className={`rounded-2xl border px-4 py-3 text-sm transition ${
                          mode === option.value
                            ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                            : "border-white/10 bg-black/15 text-white/50 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview */}
              <div className="rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-400/[0.09] to-transparent p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                      Estimated impact
                    </p>

                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-3xl font-bold tracking-tight text-emerald-300">
                        {calculating
                          ? "..."
                          : previewCarbon.toFixed(2)}
                      </span>

                      <span className="mb-1 text-sm text-white/35">
                        kg CO₂e
                      </span>
                    </div>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl">
                    {currentConfig.icon}
                  </div>
                </div>

                <p className="mt-3 text-xs leading-5 text-white/35">
                  Prototype estimate based on EcoAI's configured emission
                  factors.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-[#06110d] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Leaf size={18} />
                    Save Activity
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Stats */}
          <section className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                  <BarChart3 size={19} />
                </div>

                <p className="text-xs uppercase tracking-[0.15em] text-white/35">
                  Total impact
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {totalCarbon.toFixed(2)}
                  <span className="ml-1 text-xs font-normal text-white/35">
                    kg
                  </span>
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                  <Database size={19} />
                </div>

                <p className="text-xs uppercase tracking-[0.15em] text-white/35">
                  Activities
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {activities.length}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-300">
                  <TrendingDown size={20} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                    Highest tracked impact
                  </p>

                  <p className="mt-1 font-semibold">
                    {highestImpact
                      ? formatCategory(highestImpact.category)
                      : "No data yet"}
                  </p>
                </div>
              </div>

              {highestImpact && (
                <div className="mt-5 flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                  <span className="text-sm text-white/45">
                    Current highest activity
                  </span>

                  <span className="font-semibold text-orange-300">
                    {Number(
                      highestImpact.carbon_kg
                    ).toFixed(2)}{" "}
                    kg CO₂e
                  </span>
                </div>
              )}
            </div>

            {/* Category distribution */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                  Activity distribution
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  What you're tracking
                </h3>
              </div>

              {categoryCount.length === 0 ? (
                <p className="text-sm text-white/35">
                  Add your first activity to see the distribution.
                </p>
              ) : (
                <div className="space-y-3">
                  {categoryCount.map(
                    ([itemCategory, count]) => (
                      <div
                        key={itemCategory}
                        className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/15 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {CATEGORY_CONFIG[itemCategory]?.icon ||
                              "🌱"}
                          </span>

                          <span className="text-sm text-white/70">
                            {formatCategory(itemCategory)}
                          </span>
                        </div>

                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/45">
                          {count}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* History */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-emerald-300">
                <Database size={16} />

                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Activity History
                </span>
              </div>

              <h2 className="text-2xl font-semibold">
                Your tracked activities
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={loadActivities}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              {activities.length > 0 && (
                <button
                  onClick={clearDemoData}
                  disabled={clearing}
                  className="flex items-center gap-2 rounded-xl border border-red-400/15 bg-red-400/5 px-4 py-2.5 text-xs font-medium text-red-300/80 transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50"
                >
                  {clearing ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={15} />
                  )}
                  Clear Data
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-48 items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-white/40">
                <Loader2
                  size={20}
                  className="animate-spin text-emerald-400"
                />
                Loading activity history...
              </div>
            </div>
          ) : activities.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/10 px-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <Leaf size={24} />
              </div>

              <h3 className="font-semibold">No activities yet</h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
                Add your first daily activity above. Your carbon estimate
                and history will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="group flex flex-col gap-4 rounded-2xl border border-white/7 bg-black/15 p-4 transition hover:border-emerald-400/15 hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-xl">
                      {CATEGORY_CONFIG[activity.category]?.icon ||
                        "🌱"}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium">
                          {formatCategory(activity.category)}
                        </h3>

                        {activity.mode && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/35">
                            {activity.mode}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-white/35">
                        {activity.amount} {activity.unit} •{" "}
                        {formatDate(activity.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-white/30">
                        Estimated impact
                      </p>

                      <p className="mt-1 font-semibold text-emerald-300">
                        {Number(
                          activity.carbon_kg || 0
                        ).toFixed(2)}{" "}
                        kg CO₂e
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        deleteActivity(activity.id)
                      }
                      disabled={deleting === activity.id}
                      title="Delete activity"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/30 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50"
                    >
                      {deleting === activity.id ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Responsible AI note */}
        <section className="mt-8 rounded-3xl border border-emerald-400/10 bg-emerald-400/[0.035] p-5 sm:p-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
              <Leaf size={18} />
            </div>

            <div>
              <h3 className="font-semibold">
                Responsible AI & transparency
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/40">
                EcoAI provides estimated carbon values for decision
                support. Results depend on the configured prototype
                emission factors and should not be treated as certified
                greenhouse-gas accounting.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  Car,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Droplets,
  Leaf,
  Loader2,
  Menu,
  Recycle,
  Sparkles,
  Utensils,
  X,
  Zap,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getActivities,
  getOverallInsight,
} from "../services/api";

import {
  calculateSustainabilityScore,
  getCarbonLevel,
} from "../utils/carbonCalculator";

const CATEGORY_CONFIG = {
  transport: {
    label: "Transport",
    icon: Car,
  },

  electricity: {
    label: "Electricity",
    icon: Zap,
  },

  food: {
    label: "Food",
    icon: Utensils,
  },

  water: {
    label: "Water",
    icon: Droplets,
  },

  waste: {
    label: "Waste",
    icon: Recycle,
  },
};

function Dashboard() {
  const location = useLocation();

  const [activities, setActivities] = useState([]);
  const [insight, setInsight] = useState(null);

  const [loading, setLoading] = useState(true);
  const [insightLoading, setInsightLoading] = useState(false);

  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // =========================
  // Load Dashboard Data
  // =========================

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const data = await getActivities();

      const activityList = data.activities || [];

      setActivities(activityList);

      if (activityList.length > 0) {
        await loadInsight(activityList);
      } else {
        setInsight(null);
      }
    } catch (err) {
      setError(
        err.message || "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // Generate AI Insight
  // =========================

  async function loadInsight(activityList) {
    try {
      setInsightLoading(true);

      const categoryImpacts = {};

      activityList.forEach((activity) => {
        const category = activity.category;

        categoryImpacts[category] =
          (categoryImpacts[category] || 0) +
          Number(activity.carbon_kg || 0);
      });

      const result =
        await getOverallInsight(categoryImpacts);

      setInsight(result.insight);
    } catch (err) {
      console.error("AI insight error:", err);
    } finally {
      setInsightLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // =========================
  // Total Carbon
  // =========================

  const totalCarbon = useMemo(() => {
    return activities.reduce(
      (total, activity) =>
        total + Number(activity.carbon_kg || 0),
      0
    );
  }, [activities]);

  // =========================
  // Sustainability Score
  // =========================

  const sustainabilityScore = useMemo(() => {
    return calculateSustainabilityScore(totalCarbon);
  }, [totalCarbon]);

  // =========================
  // Carbon Level
  // =========================

  const carbonLevel = useMemo(() => {
    return getCarbonLevel(totalCarbon);
  }, [totalCarbon]);

  // =========================
  // Category Data
  // =========================

  const categoryData = useMemo(() => {
    const totals = {
      transport: 0,
      electricity: 0,
      food: 0,
      water: 0,
      waste: 0,
    };

    activities.forEach((activity) => {
      const category = activity.category;

      if (
        Object.prototype.hasOwnProperty.call(
          totals,
          category
        )
      ) {
        totals[category] += Number(
          activity.carbon_kg || 0
        );
      }
    });

    return Object.entries(totals).map(
      ([category, carbon]) => ({
        category:
          CATEGORY_CONFIG[category]?.label ||
          category,

        carbon: Number(carbon.toFixed(2)),
      })
    );
  }, [activities]);

  // =========================
  // Highest Category
  // =========================

  const highestCategory = useMemo(() => {
    if (!activities.length) {
      return null;
    }

    const totals = {};

    activities.forEach((activity) => {
      const category = activity.category;

      totals[category] =
        (totals[category] || 0) +
        Number(activity.carbon_kg || 0);
    });

    const highest = Object.entries(totals).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return highest
      ? {
          name:
            CATEGORY_CONFIG[highest[0]]?.label ||
            highest[0],

          value: Number(highest[1].toFixed(2)),
        }
      : null;
  }, [activities]);

  // =========================
  // Navigation
  // =========================

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: BarChart3,
    },
    {
      label: "Activity",
      path: "/activity",
      icon: Activity,
    },
    {
      label: "AI Insights",
      path: "/insights",
      icon: BrainCircuit,
    },
  ];

  return (
    <div className="min-h-screen bg-[#061612] text-white">

      {/* =========================
          Ambient Background
      ========================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      {/* =========================
          Global Navbar
      ========================= */}

      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#061612]/90 backdrop-blur-2xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          {/* Logo */}

          <Link
            to="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400 text-[#062018] shadow-lg shadow-emerald-400/20 transition group-hover:scale-105">
              <Leaf
                size={21}
                strokeWidth={2.5}
              />
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight">
                Eco<span className="text-emerald-400">AI</span>
              </div>

              <div className="hidden text-[10px] uppercase tracking-[0.24em] text-white/30 sm:block">
                Sustainability Intelligence
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-1 md:flex">

            {navItems.map((item) => {
              const Icon = item.icon;

              const active =
                location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition ${
                    active
                      ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/15"
                      : "text-white/45 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    size={16}
                    className={
                      active
                        ? "text-emerald-300"
                        : "text-white/30 group-hover:text-white/70"
                    }
                  />

                  {item.label}
                </Link>
              );
            })}

          </nav>

          {/* Desktop AI Badge */}

          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-4 py-2 text-xs text-emerald-300 sm:flex">
            <Sparkles size={14} />
            AI-powered insights
          </div>

          {/* Mobile Button */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (current) => !current
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X size={19} />
            ) : (
              <Menu size={19} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}

        {mobileMenuOpen && (
          <div className="border-t border-white/5 bg-[#071a15]/95 px-5 py-4 backdrop-blur-xl md:hidden">

            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                const active =
                  location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ${
                      active
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "text-white/55 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />

                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 px-4 py-3 text-xs text-emerald-300">
              <Sparkles size={14} />
              AI-powered sustainability insights
            </div>
          </div>
        )}
      </header>

      {/* =========================
          Main
      ========================= */}

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-9 lg:px-8 lg:py-12">

        {/* =========================
            Heading
        ========================= */}

        <div className="mb-10">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5 text-xs font-medium text-emerald-300">
            <Activity size={14} />
            Live activity data
          </div>

          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">

            Your sustainability

            <span className="block text-emerald-300">
              at a glance.
            </span>

          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
            EcoAI turns your tracked activities
            into meaningful carbon insights and
            practical sustainability actions.
          </p>

        </div>

        {/* =========================
            Error
        ========================= */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-96 items-center justify-center">
            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/5">
                <Loader2
                  size={28}
                  className="animate-spin text-emerald-300"
                />
              </div>

              <p className="mt-4 text-sm text-white/40">
                Loading your dashboard...
              </p>

            </div>
          </div>
        ) : (
          <>
            {/* =========================
                KPI CARDS
            ========================= */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {/* Carbon */}

              <div className="group rounded-3xl border border-white/5 bg-[#0a211b]/80 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-400/15 hover:bg-[#0c261f]">

                <div className="flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300 transition group-hover:scale-105">
                    <Cloud size={21} />
                  </div>

                  <span className="text-xs text-white/30">
                    CO₂e
                  </span>

                </div>

                <p className="mt-6 text-xs uppercase tracking-wider text-white/30">
                  Total tracked impact
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {totalCarbon.toFixed(2)}

                  <span className="ml-2 text-sm font-medium text-white/30">
                    kg
                  </span>
                </p>

              </div>

              {/* Score */}

              <div className="group rounded-3xl border border-white/5 bg-[#0a211b]/80 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/15 hover:bg-[#0c261f]">

                <div className="flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                    <Leaf size={21} />
                  </div>

                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                    {carbonLevel}
                  </span>

                </div>

                <p className="mt-6 text-xs uppercase tracking-wider text-white/30">
                  Sustainability score
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {sustainabilityScore}

                  <span className="ml-2 text-sm font-medium text-white/30">
                    / 100
                  </span>
                </p>

              </div>

              {/* Activities */}

              <div className="group rounded-3xl border border-white/5 bg-[#0a211b]/80 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-400/15 hover:bg-[#0c261f]">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                  <Activity size={21} />
                </div>

                <p className="mt-6 text-xs uppercase tracking-wider text-white/30">
                  Activities tracked
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {activities.length}
                </p>

              </div>

              {/* Highest Impact */}

              <div className="group rounded-3xl border border-white/5 bg-[#0a211b]/80 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-orange-400/15 hover:bg-[#0c261f]">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300">
                  <BarChart3 size={21} />
                </div>

                <p className="mt-6 text-xs uppercase tracking-wider text-white/30">
                  Highest impact
                </p>

                <p className="mt-2 text-xl font-bold">
                  {highestCategory
                    ? highestCategory.name
                    : "—"}
                </p>

                {highestCategory && (
                  <p className="mt-1 text-xs text-white/30">
                    {highestCategory.value.toFixed(2)}{" "}
                    kg CO₂e
                  </p>
                )}

              </div>

            </div>

            {/* =========================
                Chart + AI
            ========================= */}

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">

              {/* Chart */}

              <div className="rounded-3xl border border-white/5 bg-[#0a211b]/80 p-6 backdrop-blur-xl sm:p-8">

                <div className="mb-7 flex items-center justify-between">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/60">
                      Impact breakdown
                    </p>

                    <h3 className="mt-2 text-xl font-bold">
                      Carbon by category
                    </h3>
                  </div>

                  <div className="rounded-xl bg-white/5 p-3 text-white/40">
                    <BarChart3 size={20} />
                  </div>

                </div>

                <div className="h-72">

                  {activities.length === 0 ? (
                    <div className="flex h-full items-center justify-center">

                      <div className="text-center">

                        <BarChart3
                          size={30}
                          className="mx-auto text-white/15"
                        />

                        <p className="mt-3 text-sm text-white/35">
                          Add activities to see
                          your impact breakdown.
                        </p>

                        <Link
                          to="/activity"
                          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/15"
                        >
                          <Activity size={14} />
                          Add Activity
                        </Link>

                      </div>

                    </div>
                  ) : (
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart
                        data={categoryData}
                        margin={{
                          top: 10,
                          right: 10,
                          left: -20,
                          bottom: 0,
                        }}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.05)"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="category"
                          tick={{
                            fill: "rgba(255,255,255,0.4)",
                            fontSize: 11,
                          }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <YAxis
                          tick={{
                            fill: "rgba(255,255,255,0.3)",
                            fontSize: 11,
                          }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <Tooltip
                          cursor={{
                            fill: "rgba(255,255,255,0.03)",
                          }}
                          contentStyle={{
                            background: "#071a15",
                            border:
                              "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "14px",
                            color: "#fff",
                          }}
                          formatter={(value) => [
                            `${Number(value).toFixed(
                              2
                            )} kg CO₂e`,
                            "Impact",
                          ]}
                        />

                        <Bar
                          dataKey="carbon"
                          radius={[8, 8, 0, 0]}
                          fill="#34d399"
                        />

                      </BarChart>

                    </ResponsiveContainer>
                  )}

                </div>

              </div>

              {/* AI Insight */}

              <div className="relative overflow-hidden rounded-3xl border border-emerald-400/10 bg-gradient-to-br from-emerald-500/10 via-[#0a211b] to-[#071a15] p-6 sm:p-8">

                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

                <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-cyan-400/5 blur-3xl" />

                <div className="relative">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-[#062018] shadow-lg shadow-emerald-400/20">
                    <BrainCircuit size={23} />
                  </div>

                  <div className="mt-6">

                    <div className="flex items-center gap-2">

                      <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                        AI Insight
                      </span>

                    </div>

                    {insightLoading ? (
                      <div className="mt-6">

                        <Loader2
                          size={22}
                          className="animate-spin text-emerald-300"
                        />

                        <p className="mt-3 text-sm text-white/35">
                          Analyzing your activities...
                        </p>

                      </div>
                    ) : insight ? (
                      <>
                        <h3 className="mt-5 text-2xl font-bold">
                          {insight.title ||
                            "Your next sustainability move"}
                        </h3>

                        <p className="mt-4 text-sm leading-6 text-white/45">
                          {insight.message}
                        </p>

                        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/5 bg-black/10 p-4">

                          <CheckCircle2
                            size={18}
                            className="text-emerald-400"
                          />

                          <div>
                            <p className="text-xs text-white/30">
                              Priority focus
                            </p>

                            <p className="mt-1 font-semibold capitalize text-emerald-300">
                              {insight.focus}
                            </p>
                          </div>

                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="mt-5 text-2xl font-bold">
                          Start tracking
                        </h3>

                        <p className="mt-4 text-sm leading-6 text-white/45">
                          Add a few activities and
                          EcoAI will identify your
                          highest-impact category
                          and generate personalized
                          insights.
                        </p>

                        <Link
                          to="/activity"
                          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-bold text-[#062018] transition hover:bg-emerald-300"
                        >
                          Start tracking
                          <ChevronDown
                            size={14}
                            className="-rotate-90"
                          />
                        </Link>
                      </>
                    )}

                  </div>

                </div>
              </div>

            </div>

            {/* =========================
                Recent Activities
            ========================= */}

            <section className="mt-8 rounded-3xl border border-white/5 bg-[#0a211b]/70 p-6 backdrop-blur-xl sm:p-8">

              <div className="mb-7 flex items-center justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/60">
                    Live database
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    Recent activities
                  </h3>
                </div>

                <Link
                  to="/activity"
                  className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white/50 transition hover:bg-white/10 hover:text-white sm:flex"
                >
                  View all
                  <ChevronDown
                    size={14}
                    className="-rotate-90"
                  />
                </Link>

              </div>

              {activities.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 py-14 text-center">

                  <Leaf
                    size={28}
                    className="mx-auto text-white/15"
                  />

                  <p className="mt-4 font-semibold">
                    No activities tracked yet
                  </p>

                  <p className="mt-1 text-sm text-white/30">
                    Add your first activity from
                    Activity Tracker.
                  </p>

                  <Link
                    to="/activity"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-bold text-[#062018] transition hover:bg-emerald-300"
                  >
                    <Activity size={14} />
                    Track Activity
                  </Link>

                </div>
              ) : (
                <div className="space-y-3">

                  {activities
                    .slice(0, 6)
                    .map((activity) => {

                      const config =
                        CATEGORY_CONFIG[
                          activity.category
                        ];

                      const Icon =
                        config?.icon || Activity;

                      return (
                        <div
                          key={activity.id}
                          className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-emerald-400/10 hover:bg-white/[0.035] sm:flex-row sm:items-center sm:justify-between"
                        >

                          <div className="flex items-center gap-4">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                              <Icon size={19} />
                            </div>

                            <div>
                              <p className="font-semibold capitalize">
                                {config?.label ||
                                  activity.category}
                              </p>

                              <p className="mt-1 text-xs text-white/30">
                                {activity.amount}{" "}
                                {activity.unit}

                                {activity.mode
                                  ? ` • ${activity.mode}`
                                  : ""}

                                {" • "}

                                {activity.created_at}
                              </p>
                            </div>

                          </div>

                          <div className="text-left sm:text-right">

                            <p className="text-xs text-white/30">
                              Estimated impact
                            </p>

                            <p className="mt-1 font-bold text-emerald-300">
                              {Number(
                                activity.carbon_kg || 0
                              ).toFixed(2)}{" "}
                              kg CO₂e
                            </p>

                          </div>

                        </div>
                      );
                    })}

                </div>
              )}

            </section>

            {/* =========================
                Responsible AI
            ========================= */}

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-5">

              <Cloud
                size={18}
                className="mt-0.5 shrink-0 text-emerald-300/60"
              />

              <p className="text-xs leading-5 text-white/30">
                Carbon values shown by EcoAI are
                estimates based on the prototype's
                configured emission factors. They are
                intended for awareness and decision
                support, not as certified emissions
                accounting.
              </p>

            </div>

          </>
        )}

      </main>
    </div>
  );
}

export default Dashboard;
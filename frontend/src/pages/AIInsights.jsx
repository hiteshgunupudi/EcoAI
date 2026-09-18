import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  Droplets,
  Leaf,
  Lightbulb,
  Loader2,
  Menu,
  Recycle,
  Sparkles,
  Target,
  TrendingDown,
  Utensils,
  X,
  Zap,
} from "lucide-react";

import EcoAICopilot from "../components/EcoAICopilot";

const API_URL = "https://ecoai-backend-5fgd.onrender.com";

const CATEGORY_CONFIG = {
  transport: {
    label: "Transport",
    icon: Activity,
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

function AIInsights() {
  const location = useLocation();

  const [activities, setActivities] = useState([]);
  const [overallInsight, setOverallInsight] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // =========================================
  // LOAD EVERYTHING
  // =========================================

  async function loadInsights() {
    try {
      setLoading(true);
      setError("");

      const activityResponse = await fetch(
        `${API_URL}/activities`
      );

      if (!activityResponse.ok) {
        throw new Error("Unable to load activities");
      }

      const activityData =
        await activityResponse.json();

      const list = activityData.activities || [];

      setActivities(list);

      if (!list.length) {
        setOverallInsight(null);
        setRecommendation(null);
        return;
      }

      // =====================================
      // CATEGORY IMPACTS
      // =====================================

      const categoryImpacts = {};

      list.forEach((activity) => {
        const category = activity.category;

        categoryImpacts[category] =
          (categoryImpacts[category] || 0) +
          Number(activity.carbon_kg || 0);
      });

      // =====================================
      // OVERALL AI INSIGHT
      // =====================================

      const insightResponse = await fetch(
        `${API_URL}/overall-insight`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category_impacts: categoryImpacts,
          }),
        }
      );

      if (insightResponse.ok) {
        const insightData =
          await insightResponse.json();

        setOverallInsight(
          insightData.insight || null
        );
      }

      // =====================================
      // HIGHEST CATEGORY
      // =====================================

      const highest = Object.entries(
        categoryImpacts
      ).sort((a, b) => b[1] - a[1])[0];

      if (highest) {
        const recommendationResponse =
          await fetch(
            `${API_URL}/recommendation`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                category: highest[0],
                carbon: Number(
                  highest[1].toFixed(2)
                ),
              }),
            }
          );

        if (recommendationResponse.ok) {
          const recommendationData =
            await recommendationResponse.json();

          setRecommendation(
            recommendationData.recommendation ||
              null
          );
        }
      }
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to generate AI insights."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInsights();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // =========================================
  // TOTAL CARBON
  // =========================================

  const totalCarbon = useMemo(() => {
    return activities.reduce(
      (total, activity) =>
        total +
        Number(activity.carbon_kg || 0),
      0
    );
  }, [activities]);

  // =========================================
  // SCORE
  // =========================================

  const score = useMemo(() => {
    if (totalCarbon <= 100) return 95;
    if (totalCarbon <= 150) return 90;
    if (totalCarbon <= 200) return 82;
    if (totalCarbon <= 250) return 75;
    if (totalCarbon <= 300) return 68;
    if (totalCarbon <= 400) return 58;

    return 45;
  }, [totalCarbon]);

  // =========================================
  // LEVEL
  // =========================================

  const level = useMemo(() => {
    if (totalCarbon <= 150) return "Low";
    if (totalCarbon <= 250) return "Moderate";

    return "High";
  }, [totalCarbon]);

  // =========================================
  // CATEGORY ANALYSIS
  // =========================================

  const categoryAnalysis = useMemo(() => {
    const totals = {};

    activities.forEach((activity) => {
      const category = activity.category;

      totals[category] =
        (totals[category] || 0) +
        Number(activity.carbon_kg || 0);
    });

    return Object.entries(totals)
      .map(([category, carbon]) => ({
        category,

        label:
          CATEGORY_CONFIG[category]?.label ||
          category,

        carbon: Number(
          carbon.toFixed(2)
        ),
      }))
      .sort(
        (a, b) => b.carbon - a.carbon
      );
  }, [activities]);

  // =========================================
  // FOCUS PERCENTAGE
  // =========================================

  const focusPercentage = useMemo(() => {
    if (
      !categoryAnalysis.length ||
      totalCarbon <= 0
    ) {
      return 0;
    }

    return Math.round(
      (categoryAnalysis[0].carbon /
        totalCarbon) *
        100
    );
  }, [categoryAnalysis, totalCarbon]);

  // =========================================
  // NAVIGATION
  // =========================================

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

      {/* =====================================
          AMBIENT BACKGROUND
      ===================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-400/5 blur-3xl" />

      </div>

      {/* =====================================
          GLOBAL NAVBAR
      ===================================== */}

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
                Eco<span className="text-emerald-400">
                  AI
                </span>
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

          {/* AI Badge */}

          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-4 py-2 text-xs text-emerald-300 sm:flex">
            <Sparkles size={14} />
            Personalized AI analysis
          </div>

          {/* Mobile Menu */}

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
              Personalized AI sustainability analysis
            </div>

          </div>
        )}

      </header>

      {/* =====================================
          MAIN
      ===================================== */}

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-9 lg:px-8 lg:py-12">

        {/* =================================
            HERO
        ================================= */}

        <section className="relative overflow-hidden rounded-[2rem] border border-emerald-400/10 bg-gradient-to-br from-emerald-500/10 via-[#0a211b] to-[#071a15] p-7 shadow-2xl sm:p-10">

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-cyan-400/5 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <Sparkles size={14} />
                AI Sustainability Copilot
              </div>

              <h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                Understand your impact.

                <span className="block text-emerald-300">
                  Act smarter.
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
                EcoAI analyzes your tracked
                activities to identify high-impact
                areas and turn your data into
                practical sustainability actions.
              </p>

            </div>

            <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-emerald-400/10 bg-emerald-400/10 text-emerald-300 shadow-2xl shadow-emerald-400/10">
              <BrainCircuit size={42} />
            </div>

          </div>

        </section>

        {/* =================================
            ERROR
        ================================= */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* =================================
            LOADING
        ================================= */}

        {loading ? (
          <div className="flex min-h-96 items-center justify-center">

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/5">
                <Loader2
                  size={30}
                  className="animate-spin text-emerald-300"
                />
              </div>

              <p className="mt-4 text-sm text-white/40">
                EcoAI is analyzing your data...
              </p>

            </div>

          </div>
        ) : activities.length === 0 ? (

          /* =================================
             EMPTY STATE
          ================================= */

          <section className="mt-8 rounded-3xl border border-dashed border-white/10 bg-[#0a211b]/60 py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
              <Leaf size={28} />
            </div>

            <h3 className="mt-5 text-2xl font-bold">
              Your AI insights are waiting
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/35">
              Track a few activities first.
              EcoAI will then analyze your
              footprint and generate personalized
              sustainability recommendations.
            </p>

            <Link
              to="/activity"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-xs font-bold text-[#062018] transition hover:bg-emerald-300"
            >
              <Activity size={15} />
              Start tracking
            </Link>

          </section>

        ) : (

          <>

            {/* =================================
                STATS
            ================================= */}

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {/* Impact */}

              <div className="group rounded-3xl border border-white/5 bg-[#0a211b]/80 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-400/15 hover:bg-[#0c261f]">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <Cloud size={21} />
                </div>

                <p className="mt-6 text-xs uppercase tracking-wider text-white/30">
                  Tracked impact
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {totalCarbon.toFixed(2)}

                  <span className="ml-2 text-sm font-medium text-white/30">
                    kg CO₂e
                  </span>
                </p>

              </div>

              {/* Score */}

              <div className="group rounded-3xl border border-white/5 bg-[#0a211b]/80 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/15 hover:bg-[#0c261f]">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <Target size={21} />
                </div>

                <p className="mt-6 text-xs uppercase tracking-wider text-white/30">
                  Sustainability score
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {score}

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
                  Activities analyzed
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {activities.length}
                </p>

              </div>

              {/* Level */}

              <div className="group rounded-3xl border border-white/5 bg-[#0a211b]/80 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-orange-400/15 hover:bg-[#0c261f]">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300">
                  <TrendingDown size={21} />
                </div>

                <p className="mt-6 text-xs uppercase tracking-wider text-white/30">
                  Current level
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {level}
                </p>

              </div>

            </div>

            {/* =================================
                AI INSIGHT
            ================================= */}

            <section className="mt-8 rounded-3xl border border-emerald-400/10 bg-gradient-to-br from-emerald-500/10 via-[#0a211b] to-[#071a15] p-6 sm:p-8">

              <div className="grid gap-8 lg:grid-cols-[auto_1fr]">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400 text-[#062018] shadow-lg shadow-emerald-400/20">
                  <BrainCircuit size={27} />
                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      AI-generated insight
                    </span>

                    {overallInsight?.focus && (
                      <span className="rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium capitalize text-white/40">
                        Focus: {overallInsight.focus}
                      </span>
                    )}

                  </div>

                  <h3 className="mt-4 text-2xl font-bold sm:text-3xl">
                    {overallInsight?.title ||
                      "Your sustainability focus"}
                  </h3>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-white/45">
                    {overallInsight?.message ||
                      "Continue tracking your activities to receive personalized sustainability guidance."}
                  </p>

                  {overallInsight?.carbon_kg !==
                    undefined && (
                    <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/5 bg-black/10 px-4 py-3">

                      <Cloud
                        size={18}
                        className="text-emerald-300"
                      />

                      <div>

                        <p className="text-[10px] uppercase tracking-wider text-white/25">
                          Focus category impact
                        </p>

                        <p className="mt-1 font-bold text-emerald-300">
                          {Number(
                            overallInsight.carbon_kg
                          ).toFixed(2)}{" "}
                          kg CO₂e
                        </p>

                      </div>

                    </div>
                  )}

                </div>

              </div>

            </section>

            {/* =================================
                CATEGORY ANALYSIS
            ================================= */}

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.8fr]">

              {/* Analysis */}

              <section className="rounded-3xl border border-white/5 bg-[#0a211b]/80 p-6 backdrop-blur-xl sm:p-8">

                <div className="mb-7 flex items-center justify-between">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/60">
                      Pattern analysis
                    </p>

                    <h3 className="mt-2 text-xl font-bold">
                      Where your impact comes from
                    </h3>

                  </div>

                  <div className="rounded-xl bg-white/5 p-3 text-white/40">
                    <BarChart3 size={20} />
                  </div>

                </div>

                <div className="space-y-5">

                  {categoryAnalysis.map(
                    (item) => {

                      const percentage =
                        totalCarbon > 0
                          ? Math.round(
                              (item.carbon /
                                totalCarbon) *
                                100
                            )
                          : 0;

                      const config =
                        CATEGORY_CONFIG[
                          item.category
                        ];

                      const Icon =
                        config?.icon ||
                        Activity;

                      return (
                        <div
                          key={item.category}
                          className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-emerald-400/10 hover:bg-white/[0.035]"
                        >

                          <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                                <Icon size={18} />
                              </div>

                              <div>

                                <p className="font-semibold">
                                  {item.label}
                                </p>

                                <p className="text-xs text-white/30">
                                  {percentage}% of tracked impact
                                </p>

                              </div>

                            </div>

                            <p className="font-bold text-emerald-300">
                              {item.carbon.toFixed(2)}

                              <span className="ml-1 text-xs text-white/30">
                                kg
                              </span>
                            </p>

                          </div>

                          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">

                            <div
                              className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                              style={{
                                width: `${Math.min(
                                  percentage,
                                  100
                                )}%`,
                              }}
                            />

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </section>

              {/* Priority */}

              <section className="relative overflow-hidden rounded-3xl border border-emerald-400/10 bg-[#0a211b]/80 p-6 sm:p-8">

                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

                <div className="relative">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-300">
                    <Target size={23} />
                  </div>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/60">
                    Priority focus
                  </p>

                  <h3 className="mt-3 text-3xl font-bold">
                    {categoryAnalysis[0]?.label ||
                      "Start tracking"}
                  </h3>

                  {categoryAnalysis[0] && (
                    <>

                      <p className="mt-3 text-sm leading-6 text-white/40">
                        This category currently
                        represents approximately{" "}
                        <span className="font-semibold text-emerald-300">
                          {focusPercentage}%
                        </span>{" "}
                        of your tracked carbon
                        impact.
                      </p>

                      <div className="mt-6 rounded-2xl border border-white/5 bg-black/10 p-5">

                        <p className="text-xs text-white/30">
                          Estimated impact
                        </p>

                        <p className="mt-2 text-2xl font-bold text-emerald-300">
                          {categoryAnalysis[0].carbon.toFixed(
                            2
                          )}{" "}
                          kg CO₂e
                        </p>

                      </div>

                    </>
                  )}

                </div>

              </section>

            </div>

            {/* =================================
                RECOMMENDATION
            ================================= */}

            {recommendation && (
              <section className="mt-8 rounded-3xl border border-white/5 bg-[#0a211b]/80 p-6 sm:p-8">

                <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">

                  <div className="max-w-2xl">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                        <Lightbulb size={21} />
                      </div>

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/60">
                          Recommended action
                        </p>

                        <h3 className="mt-1 text-xl font-bold">
                          {recommendation.title}
                        </h3>

                      </div>

                    </div>

                    <p className="mt-5 text-sm leading-7 text-white/45">
                      {recommendation.message}
                    </p>

                  </div>

                  <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 px-5 py-4">

                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                      <Sparkles size={14} />
                      Personalized for you
                    </div>

                  </div>

                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">

                  {(
                    recommendation.actions || [
                      "Track your activities consistently",
                      "Review your highest-impact category",
                      "Make one practical sustainable change at a time",
                    ]
                  ).map((action, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-emerald-400/10"
                    >

                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-emerald-400"
                      />

                      <p className="text-sm leading-6 text-white/60">
                        {action}
                      </p>

                    </div>
                  ))}

                </div>

              </section>
            )}

            {/* =================================
                ACTION PLAN
            ================================= */}

            <section className="mt-8 rounded-3xl border border-white/5 bg-gradient-to-br from-[#0a211b] to-[#071a15] p-6 sm:p-8">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                  <Lightbulb size={21} />
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/60">
                    Your action plan
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Small changes, measurable progress
                  </h3>

                </div>

              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-3">

                {[
                  {
                    number: "01",
                    title: "Track",
                    text: "Keep recording daily activities so EcoAI can identify meaningful patterns.",
                  },
                  {
                    number: "02",
                    title: "Focus",
                    text: "Start with the category contributing the largest share of your tracked impact.",
                  },
                  {
                    number: "03",
                    title: "Improve",
                    text: "Apply practical recommendations and continue tracking to observe progress.",
                  },
                ].map((step) => (
                  <div
                    key={step.number}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition hover:border-emerald-400/10 hover:bg-white/[0.035]"
                  >

                    <span className="text-xs font-bold text-emerald-300/50">
                      {step.number}
                    </span>

                    <h4 className="mt-4 font-bold">
                      {step.title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      {step.text}
                    </p>

                  </div>
                ))}

              </div>

            </section>

            {/* =================================
                RESPONSIBLE AI
            ================================= */}

            <section className="mt-8 rounded-3xl border border-white/5 bg-white/[0.02] p-6 sm:p-8">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <Leaf size={20} />
                </div>

                <div>

                  <h3 className="font-bold">
                    Responsible AI
                  </h3>

                  <p className="mt-2 max-w-4xl text-xs leading-6 text-white/30">
                    EcoAI provides estimates and
                    decision-support suggestions based
                    on user-entered activity data.
                    Results are not certified emissions
                    accounting. The system should avoid
                    collecting unnecessary personal data,
                    clearly communicate uncertainty, and
                    allow users to understand how
                    recommendations are generated.
                  </p>

                </div>

              </div>

            </section>

          </>
        )}

      </main>

      {/* =====================================
          ECOAI COPILOT
      ===================================== */}

      <EcoAICopilot />

    </div>
  );
}

export default AIInsights;
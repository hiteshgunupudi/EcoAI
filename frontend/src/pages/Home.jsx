import {
  ArrowRight,
  BarChart3,
  Brain,
  Leaf,
  Sparkles,
  TrendingDown,
} from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-[#06110D] text-white">

      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-[#06110D]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
              <Leaf className="text-emerald-400" size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold">EcoAI</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                Sustainable Intelligence
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#how" className="hover:text-white">
              How It Works
            </a>
            <a href="#impact" className="hover:text-white">
              Impact
            </a>
          </div>

          <a
            href="/login"
            className="rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-bold text-[#06110D] transition hover:bg-emerald-300"
          >
            Sign In
          </a>

        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">

        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[140px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

          {/* LEFT */}
          <div className="relative">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
              <Sparkles size={16} />
              AI-Powered Sustainability
            </div>

            <h2 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Make your lifestyle
              <span className="text-emerald-400"> greener </span>
              with AI.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              Track your carbon footprint, understand your environmental
              impact, and receive intelligent recommendations for a more
              sustainable lifestyle.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="/register"
                className="group flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 font-bold text-[#06110D] transition hover:bg-emerald-300"
              >
                Start Your Journey
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <a
                href="#features"
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold transition hover:bg-white/10"
              >
                Explore
              </a>

            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">

              <div className="flex items-center gap-2">
                <Leaf size={16} className="text-emerald-400" />
                Sustainable
              </div>

              <div className="flex items-center gap-2">
                <Brain size={16} className="text-emerald-400" />
                AI Insights
              </div>

              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-emerald-400" />
                Smart Analytics
              </div>

            </div>

          </div>

          {/* RIGHT DASHBOARD */}
          <div className="relative">

            <div className="absolute inset-0 rounded-[2rem] bg-emerald-400/10 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl">

              {/* Header */}
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Personal Dashboard
                  </p>

                  <h3 className="mt-1 text-xl font-semibold">
                    Environmental Impact
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10">
                  <Leaf className="text-emerald-400" size={22} />
                </div>

              </div>

              {/* Main Score */}
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-6">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-slate-500">
                      Sustainability Score
                    </p>

                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-5xl font-bold text-emerald-400">
                        82
                      </span>

                      <span className="mb-2 text-sm text-slate-500">
                        / 100
                      </span>
                    </div>
                  </div>

                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[7px] border-emerald-400/20">

                    <div className="absolute inset-0 rounded-full border-[7px] border-emerald-400 border-b-transparent border-l-transparent rotate-[-35deg]" />

                    <Leaf
                      size={26}
                      className="text-emerald-400"
                    />

                  </div>

                </div>

                <div className="mt-5 flex items-center gap-2 text-sm text-emerald-400">
                  <TrendingDown size={16} />
                  12.8% lower than last month
                </div>

              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-4">

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                  <p className="text-xs text-slate-500">
                    Carbon Footprint
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    184.6
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    kg CO₂e / month
                  </p>

                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                  <p className="text-xs text-slate-500">
                    CO₂ Reduced
                  </p>

                  <p className="mt-2 text-2xl font-bold text-emerald-400">
                    26.4
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    kg this month
                  </p>

                </div>

              </div>

              {/* AI Insight */}
              <div className="mt-4 flex gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-5">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                  <Sparkles
                    size={18}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    AI Insight
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Reducing short-distance car trips could significantly
                    improve your sustainability score.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="border-t border-white/10 px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Powerful features
            </p>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              Understand your impact.
              <br />
              Improve it with AI.
            </h2>

          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">

            {[
              {
                icon: BarChart3,
                title: "Carbon Tracking",
                text: "Monitor your transportation, energy, food, water and waste impact.",
              },
              {
                icon: Brain,
                title: "AI Insights",
                text: "Turn your lifestyle data into intelligent sustainability insights.",
              },
              {
                icon: Leaf,
                title: "Green Recommendations",
                text: "Get personalized actions that can help reduce your environmental impact.",
              },
            ].map((item) => {

              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-7 transition hover:-translate-y-1 hover:border-emerald-400/30"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10">
                    <Icon
                      size={22}
                      className="text-emerald-400"
                    />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {item.text}
                  </p>

                </div>
              );

            })}

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        className="border-t border-white/10 bg-white/[0.02] px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              How it works
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              Three steps to a greener you
            </h2>

          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            {[
              ["01", "Track", "Enter your everyday activities."],
              ["02", "Analyze", "EcoAI calculates and analyzes your impact."],
              ["03", "Improve", "Follow personalized AI recommendations."],
            ].map(([number, title, text]) => (

              <div
                key={number}
                className="rounded-2xl border border-white/10 bg-[#06110D] p-8"
              >

                <span className="text-sm font-bold text-emerald-400">
                  {number}
                </span>

                <h3 className="mt-5 text-2xl font-semibold">
                  {title}
                </h3>

                <p className="mt-3 text-slate-400">
                  {text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}
      <section
        id="impact"
        className="px-6 py-24"
      >

        <div className="mx-auto max-w-5xl rounded-[2rem] border border-emerald-400/10 bg-emerald-400/[0.06] px-6 py-16 text-center">

          <Leaf
            className="mx-auto text-emerald-400"
            size={38}
          />

          <h2 className="mt-6 text-4xl font-bold sm:text-5xl">
            Small choices.
            <span className="text-emerald-400">
              {" "}Meaningful change.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-slate-400">
            Start tracking your environmental impact and build
            smarter, more sustainable habits with EcoAI.
          </p>

          <a
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-7 py-3.5 font-bold text-[#06110D] hover:bg-emerald-300"
          >
            Create Your Eco Profile
            <ArrowRight size={18} />
          </a>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-8">

        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-slate-500">

          <div className="flex items-center gap-2">
            <Leaf size={16} className="text-emerald-400" />
            EcoAI
          </div>

          <p>
            AI for a more sustainable future.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Home;
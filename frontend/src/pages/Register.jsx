import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const existingUser = localStorage.getItem("ecoai_user");

    if (existingUser) {
      const parsedUser = JSON.parse(existingUser);

      if (parsedUser.email.toLowerCase() === email.trim().toLowerCase()) {
        setError("An account with this email already exists.");
        setLoading(false);
        return;
      }
    }

    const user = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    localStorage.setItem("ecoai_user", JSON.stringify(user));

    localStorage.setItem("ecoai_authenticated", "true");

    localStorage.setItem(
      "ecoai_current_user",
      JSON.stringify({
        name: user.name,
        email: user.email,
      })
    );

    setTimeout(() => {
      navigate("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f5f8f3] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden overflow-hidden bg-[#0d2f24] lg:flex">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-teal-400/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* BRAND */}
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400 text-[#0d2f24] shadow-lg shadow-emerald-500/20">
                <Leaf size={23} strokeWidth={2.5} />
              </div>

              <div>
                <p className="text-xl font-bold tracking-tight text-white">
                  EcoAI
                </p>
                <p className="text-xs text-emerald-200/70">
                  Smart Carbon Intelligence
                </p>
              </div>
            </Link>

            {/* CONTENT */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                <Leaf size={15} />
                Start your sustainability journey
              </div>

              <h1 className="text-5xl font-bold leading-tight tracking-tight text-white xl:text-6xl">
                Make every
                <span className="block text-emerald-300">
                  choice count.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-emerald-100/70">
                Create your EcoAI account and start understanding,
                tracking, and reducing your everyday carbon footprint.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  "Track your daily environmental impact",
                  "Get personalized sustainability insights",
                  "Use AI to discover practical green actions",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-emerald-100/80"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-emerald-300"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER */}
            <p className="text-sm text-emerald-100/40">
              © 2026 EcoAI · AI for a more sustainable future
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">

            {/* MOBILE BRAND */}
            <div className="mb-10 flex items-center justify-center lg:hidden">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0d2f24] text-emerald-300">
                  <Leaf size={23} />
                </div>

                <div className="text-left">
                  <p className="text-xl font-bold text-slate-900">
                    EcoAI
                  </p>
                  <p className="text-xs text-slate-500">
                    Smart Carbon Intelligence
                  </p>
                </div>
              </Link>
            </div>

            {/* HEADER */}
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <User size={22} />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Join EcoAI and begin tracking your environmental impact.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm password
                </label>

                <div className="relative">
                  <ShieldCheck
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm your password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d2f24] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0d2f24]/10 transition hover:-translate-y-0.5 hover:bg-[#123d2f] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create Account"}

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* LOGIN LINK */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                Sign in
              </Link>
            </p>

            {/* SECURITY NOTE */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={14} />
              Demo authentication · Your data stays in this browser
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const storedUser = localStorage.getItem("ecoai_user");

      if (!storedUser) {
        setError("No account found. Please create an account first.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);

      if (
        user.email.toLowerCase() !== email.toLowerCase() ||
        user.password !== password
      ) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      localStorage.setItem("ecoai_authenticated", "true");
      localStorage.setItem("ecoai_current_user", JSON.stringify(user));

      setLoading(false);
      navigate("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#06110D] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-400/5 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
              <span className="text-xl">🌱</span>
            </div>

            <div>
              <h1 className="text-xl font-bold">EcoAI</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                Sustainable Intelligence
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-81px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-8 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10">
              <span className="text-2xl">✨</span>
            </div>

            <div className="mt-6 text-center">
              <h2 className="text-3xl font-bold">Welcome back</h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Sign in to continue your sustainability journey.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-emerald-400"
                />

                <span className="text-sm text-slate-400">
                  Remember me
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-400 py-3.5 font-bold text-[#06110D] transition hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-7 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                Create one
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            🌍 Every sustainable choice makes an impact.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
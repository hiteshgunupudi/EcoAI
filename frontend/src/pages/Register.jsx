function Register() {
  return (
    <div className="min-h-screen bg-[#06110D] text-white">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-green-400/5 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
              <span className="text-xl">🌱</span>
            </div>

            <div>
              <h1 className="text-xl font-bold">
                EcoAI
              </h1>

              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                Sustainable Intelligence
              </p>
            </div>
          </a>

          <a
            href="/"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Home
          </a>

        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex min-h-[calc(100vh-81px)] items-center justify-center px-6 py-10">

        <div className="w-full max-w-md">

          {/* Register Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-8 shadow-2xl backdrop-blur-xl sm:p-10">

            {/* Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10">
              <span className="text-2xl">🌍</span>
            </div>

            {/* Heading */}
            <div className="mt-5 text-center">
              <h2 className="text-3xl font-bold">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Start tracking your impact and build a greener lifestyle.
              </p>
            </div>

            {/* Form */}
            <form className="mt-7 space-y-4">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Confirm password
                </label>

                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-emerald-400"
                />

                <span className="text-xs leading-5 text-slate-500">
                  I agree to the{" "}
                  <span className="text-emerald-400">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-emerald-400">
                    Privacy Policy
                  </span>
                </span>
              </label>

              {/* Button */}
              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-emerald-400 py-3.5 font-bold text-[#06110D] transition hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/10"
              >
                Create Account
              </button>

            </form>

            {/* Login */}
            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}

              <a
                href="/login"
                className="font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                Sign in
              </a>
            </div>

          </div>

          {/* Bottom */}
          <p className="mt-5 text-center text-xs text-slate-600">
            🌱 Small actions today. A better planet tomorrow.
          </p>

        </div>

      </main>

    </div>
  );
}

export default Register;
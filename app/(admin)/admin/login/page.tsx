"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg font-body">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-2xl font-bold tracking-tight text-surface-0">
            ASE TECH
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Connexion a l&apos;administration
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-admin-border bg-admin-card p-6 shadow-sm"
        >
          {error && (
            <div className="mb-4 rounded-md border border-admin-warning/30 bg-admin-warning/10 px-4 py-3 text-sm text-admin-warning">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-surface-0"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-admin-border bg-admin-bg px-3 py-2.5 text-sm text-surface-0 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="admin@asetech.mg"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-surface-0"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-admin-border bg-admin-bg px-3 py-2.5 text-sm text-surface-0 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-admin-success px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

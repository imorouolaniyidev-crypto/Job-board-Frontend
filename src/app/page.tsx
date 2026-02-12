"use client";
import React from "react";
import { useEffect } from "react";
import JobListClient from "@/components/jobs/JobListClient";
import JobFilters from "@/components/jobs/JobFilters";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { Briefcase, Home, LogIn, UserCircle, Users } from "lucide-react";

type Filters = {
  q?: string;
  type?: string;
  location?: string;
};

export default function JobsPage() {
  const user = useAuthStore((state) => state.user);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [quickFilters, setQuickFilters] = React.useState<Filters>({
    q: "",
    type: "",
    location: "",
  });
  const hasQuickFilters =
    Boolean(quickFilters.q?.trim()) ||
    Boolean(quickFilters.type?.trim()) ||
    Boolean(quickFilters.location?.trim());
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    fetchMe().finally(() => setIsCheckingAuth(false));
  }, [fetchMe]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <nav className="sticky top-0 z-50 bg-white/95 shadow backdrop-blur">
        <div className="container mx-auto flex items-center justify-between p-4">
          <img
            src="/JobBooster-Enterprises-ENG-FullColor.png"
            width={200}
            height={50}
            className="object-contain"
            alt="logo_job-booster"
          />
          <ul className="flex items-center space-x-4 text-[#2c3e6e]">
            <Link href="/" className="flex items-center gap-1.5 cursor-pointer hover:underline">
              <Home size={16} />
              Accueil
            </Link>
            <Link href="/" className="flex items-center gap-1.5 cursor-pointer hover:underline">
              <Briefcase size={16} />
              Offres
            </Link>
            <Link href="/candidats" className="flex items-center gap-1.5 cursor-pointer hover:underline">
              <Users size={16} />
              Candidats
            </Link>
            {!isCheckingAuth && user?.role === "CANDIDATE" ? (
              <Link href="/profile" className="flex items-center gap-1.5 cursor-pointer hover:underline">
                <UserCircle size={16} />
                Mon Profil
              </Link>
            ) : (
              <Link href="/login" className="flex items-center gap-1.5 cursor-pointer hover:underline">
                <LogIn size={16} />
                Se connecter
              </Link>
            )}
          </ul>
        </div>
      </nav>

      <main className="container mx-auto p-6 pt-8">
        <div className="mb-8 overflow-hidden rounded-2xl bg-[#2c3e6e] px-8 py-10 text-white shadow-lg">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">Decouvrez nos offres d&apos;emploi</h1>
            <p className="text-sm opacity-90 md:text-base">
              Trouvez l&apos;opportunite qui correspond a vos competences et aspirations professionnelles.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs md:text-sm">CDI</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs md:text-sm">CDD</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs md:text-sm">Stage</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs md:text-sm">Remote</span>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Recherche rapide</h2>
          <JobFilters
            initial={{ q: "", type: "", location: "" }}
            onChange={(filters) => setQuickFilters(filters)}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-5 text-lg font-semibold text-slate-800">Offres disponibles</h2>
          <JobListClient externalFilters={hasQuickFilters ? quickFilters : undefined} />
        </div>
      </main>
    </div>
  );
}

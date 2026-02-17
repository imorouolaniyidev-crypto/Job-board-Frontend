"use client";
import React from "react";
import { useEffect } from "react";
import JobListClient from "@/components/jobs/JobListClient";
import JobFilters from "@/components/jobs/JobFilters";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { Briefcase, Home, LogIn, Users } from "lucide-react";
import ProfileDropdown from "@/components/navbar/ProfileDropdown";
import UserMobileMenu from "@/components/navbar/UserMobileMenu";

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
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <img
            src="/JobBooster-Enterprises-ENG-FullColor.png"
            width={200}
            height={50}
            className="h-10 w-auto object-contain sm:h-11"
            alt="logo_job-booster"
          />
          <UserMobileMenu isAuthenticated={!isCheckingAuth && user?.role === "CANDIDATE"} />
          <ul className="hidden w-full items-center gap-x-4 gap-y-2 overflow-x-auto pb-1 text-sm font-semibold text-[#0a1530] sm:flex sm:w-auto sm:text-base md:text-[17px]">
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
              <ProfileDropdown />
            ) : (
              <Link href="/login" className="flex items-center gap-1.5 cursor-pointer hover:underline">
                <LogIn size={16} />
                Se connecter
              </Link>
            )}
          </ul>
        </div>
      </nav>

      <main className="container mx-auto px-4 pb-6 pt-6 sm:px-6 sm:pt-8">
        <div className="mb-8 overflow-hidden rounded-2xl bg-[#2c3e6e] px-4 py-8 text-white shadow-lg sm:px-8 sm:py-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">Decouvrez nos offres d&apos;emploi</h1>
            <p className="text-sm opacity-90 md:text-base">
              Trouvez l&apos;opportunite qui correspond a vos competences et aspirations professionnelles.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs md:text-sm">CDI</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs md:text-sm">CDD</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs md:text-sm">Remote</span>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
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

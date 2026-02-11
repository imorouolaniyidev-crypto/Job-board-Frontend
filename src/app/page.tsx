"use client";

import React from "react";
import JobListClient from "@/components/jobs/JobListClient";
import JobFilters from "@/components/jobs/JobFilters";
import mockJobs from "@/lib/mockJobs";
import Link from "next/link";
import LoginPage from "@/app/(auth)/login/page";
import { useAuthStore } from "@/lib/store";

export default function JobsPage() {
  const jobs = mockJobs;
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <img src="/JobBooster-Enterprises-ENG-FullColor.png" width={150}
            height={50}
            className="object-contain" alt="logo_job-booster" />
          <ul className="flex text-[#2c3e6e] space-x-4">
            <a href="/" className="hover:underline cursor-pointer">Accueil</a>
            <a href="/" className="hover:underline cursor-pointer">Offres</a>
            <a href="/candidats" className="hover:underline cursor-pointer">Candidats</a>
            {user ? (
              <a href="/profile" className="hover:underline cursor-pointer">
                Mon Profil
              </a>
            ) : (
              <a href="/login" className="hover:underline cursor-pointer">
                Se connecter
              </a>
            )}

          </ul>
        </div>
      </nav>

      {/* Page Content */}
      <main className="container mx-auto p-6 pt-8">
        {/* Hero / Intro */}
        <div className="bg-[#2c3e6e] text-white rounded-lg p-8 mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Découvrez nos offres d'emploi</h1>
          <p className="text-sm opacity-90 mx-auto max-w-2xl">
            Trouvez l'opportunité qui correspond à vos compétences et aspirations professionnelles
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
          <JobFilters initial={{ q: "", type: "", location: "" }} />
        </div>

        {/* Job List */}
        <JobListClient initialJobs={jobs} />
      </main>
    </div>
  );
}

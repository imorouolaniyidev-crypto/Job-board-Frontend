"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Home,
  LogIn,
  Users,
  Search,
  Mail,
  UserRound,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store";
import ProfileDropdown from "@/components/navbar/ProfileDropdown";
import UserMobileMenu from "@/components/navbar/UserMobileMenu";
import { candidatesApi } from "@/lib/api";

export default function CandidatesPage() {
  const user = useAuthStore((state) => state.user);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [q, setQ] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sort, setSort] = useState("recent");

  useEffect(() => {
    fetchMe().finally(() => setIsCheckingAuth(false));
  }, [fetchMe]);

  const { data: candidates = [], isLoading, error } = useQuery({
    queryKey: ["public-candidates"],
    queryFn: candidatesApi.getPublicCandidates,
    staleTime: 60 * 1000,
  });

  const acceptedCandidates = useMemo(
    () => candidates.filter((candidate) => candidate.confirmationStatus === "ACCEPTED"),
    [candidates]
  );

  const availableSkills = useMemo(() => {
    const set = new Set();
    acceptedCandidates.forEach((candidate) => {
      (candidate.skills || []).forEach((skill) => {
        if (skill) set.add(String(skill).trim());
      });
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [acceptedCandidates]);

  const filteredCandidates = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    const list = acceptedCandidates.filter((candidate) => {
      const fullName = `${candidate.firstName || ""} ${candidate.lastName || ""}`.toLowerCase();
      const email = String(candidate.email || "").toLowerCase();
      const skills = (candidate.skills || []).map((s) => String(s).toLowerCase());
      const status = String(candidate.status || "").toUpperCase();

      if (statusFilter !== "ALL" && status !== statusFilter) return false;
      if (skillFilter && !skills.includes(skillFilter.toLowerCase())) return false;
      if (keyword && !fullName.includes(keyword) && !email.includes(keyword) && !skills.join(" ").includes(keyword)) return false;
      return true;
    });

    list.sort((a, b) => {
      if (sort === "name") {
        return `${a.firstName || ""} ${a.lastName || ""}`.localeCompare(
          `${b.firstName || ""} ${b.lastName || ""}`
        );
      }
      const aDate = new Date(a.createdAt || 0).getTime();
      const bDate = new Date(b.createdAt || 0).getTime();
      return bDate - aDate;
    });

    return list;
  }, [acceptedCandidates, q, skillFilter, statusFilter, sort]);

  const stats = useMemo(() => {
    const total = acceptedCandidates.length;
    const active = acceptedCandidates.filter((c) => c.status === "ACTIVE").length;
    const reviewing = acceptedCandidates.filter((c) => c.status === "REVIEWING").length;
    const rejected = acceptedCandidates.filter((c) => c.status === "REJECTED").length;
    return { total, active, reviewing, rejected };
  }, [acceptedCandidates]);

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
            <Link href="/" className="flex cursor-pointer items-center gap-1.5 hover:underline">
              <Home size={16} />
              Accueil
            </Link>
            <Link href="/" className="flex cursor-pointer items-center gap-1.5 hover:underline">
              <Briefcase size={16} />
              Offres
            </Link>
            <Link href="/candidats" className="flex cursor-pointer items-center gap-1.5 hover:underline">
              <Users size={16} />
              Candidats
            </Link>
            {!isCheckingAuth && user?.role === "CANDIDATE" ? (
              <ProfileDropdown />
            ) : (
              <Link href="/login" className="flex cursor-pointer items-center gap-1.5 hover:underline">
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
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">Decouvrez les profils candidats</h1>
            <p className="text-sm opacity-90 md:text-base">
              Filtrez rapidement les profils et contactez directement les talents disponibles.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs md:text-sm">
              {stats.total} profils
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs md:text-sm">
              {stats.active} actifs
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs md:text-sm">
              {stats.reviewing} en revision
            </span>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
            <Filter size={18} />
            Recherche rapide
          </h2>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative lg:col-span-2">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Nom, email, competence..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm"
              />
            </div>

            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Toutes les competences</option>
              {availableSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="ACTIVE">Actif</option>
              <option value="REVIEWING">En revision</option>
              <option value="REJECTED">Rejete</option>
            </select>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
            <SlidersHorizontal size={16} className="text-slate-500" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="recent">Plus recents</option>
              <option value="name">Nom A-Z</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            Chargement des candidats...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
            {error instanceof Error
              ? error.message
              : "Impossible de charger les candidats depuis la base de donnees."}
          </div>
        ) : null}

        {!isLoading && !error ? (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <h2 className="mb-5 text-lg font-semibold text-slate-800">
              Profils disponibles ({filteredCandidates.length})
            </h2>

            {filteredCandidates.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
                Aucun profil ne correspond a vos filtres.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCandidates.map((candidate) => (
                  <article
                    key={candidate.id}
                    className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="mb-3 flex items-start justify-between">
        
                      <img
                        src={candidate.photo}
                        alt={`${candidate.firstName} ${candidate.lastName}`}
                        className="h-12 w-12 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/default-avatar.png";
                        }}
                      />
                    </div>

                      <div className="mb-3 flex items-start justify-between">
                      <h3 className="text-lg font-bold text-slate-800">
                        {candidate.firstName} {candidate.lastName}
                      </h3>
                      <span className={statusClass(candidate.status)}>{statusLabel(candidate.status)}</span>
                    </div>

                    <div className="mb-3 text-sm text-slate-700">
                      <span className="mb-1 inline-flex items-center gap-1.5 font-semibold">
                        <UserRound size={14} />
                        Competences
                      </span>
                      {candidate.skills?.length ? (
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {candidate.skills.slice(0, 4).map((skill) => (
                            <span
                              key={`${candidate.id}-${skill}`}
                              className="max-w-[500px] truncate rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                              title={skill}
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 4 ? (
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
                              +{candidate.skills.length - 4}
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <p className="mt-1">Non renseignees</p>
                      )}
                    </div>

                    <p className="mb-4 inline-flex max-w-full items-center gap-2 break-all text-sm text-slate-700">
                      <Mail size={14} />
                      {candidate.email}
                    </p>

                    {candidate.isUnderContract !== undefined && (
                      <div className="mb-4 rounded-lg bg-slate-50 p-3">
                        <p className="inline-flex items-center gap-2 text-xs text-slate-700">
                          <span className="font-semibold">Statut contrat:</span>
                          <span className={candidate.isUnderContract ? 'text-green-600 font-semibold' : 'text-orange-600 font-semibold'}>
                            {candidate.isUnderContract ? '✓ En contrat' : '○ Sans contrat'}
                          </span>
                        </p>
                      </div>
                    )}

                    {candidate.profileData && Object.keys(candidate.profileData).length > 0 ? (
                      <div className="mb-4 space-y-1 rounded-lg bg-slate-50 p-3">
                        {Object.entries(candidate.profileData)
                          .filter(([key]) => key !== 'isUnderContract' && key !== 'is_under_contract')
                          .map(([key, value]) => (
                          <p key={key} className="text-xs text-slate-700">
                            <span className="font-semibold">{prettyLabel(key)}:</span>{" "}
                            {formatValue(value)}
                          </p>
                        ))}
                      </div>
                    ) : null}

                    <div className="flex items-center justify-end">
                      <a
                        href={`mailto:${candidate.email}`}
                        className="inline-block rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
                      >
                        Contacter
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}

function statusLabel(status) {
  if (status === "ACTIVE") return "Actif";
  if (status === "REVIEWING") return "En revision";
  if (status === "REJECTED") return "Rejete";
  return "Actif";
}

function statusClass(status) {
  if (status === "ACTIVE") return "rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700";
  if (status === "REVIEWING") return "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700";
  if (status === "REJECTED") return "rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700";
  return "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700";
}

function prettyLabel(key) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (c) => c.toUpperCase());
}

function formatValue(value) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

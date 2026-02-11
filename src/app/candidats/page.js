import React from "react";

// Exemple de données mockées pour les candidats
const mockCandidates = [
  {
    id: 1,
    name: "Alice Dupont",
    skills: ["React", "Node.js", "PHP"],
    location: "Paris, France",
    contact: "alice@example.com",
  },
  {
    id: 2,
    name: "Mohamed Diallo",
    skills: ["Flutter", "Dart", "Firebase"],
    location: "Abidjan, Côte d'Ivoire",
    contact: "mohamed@example.com",
  },
  {
    id: 3,
    name: "Sara Konaté",
    skills: ["Symfony", "PHP", "MySQL"],
    location: "Bamako, Mali",
    contact: "sara@example.com",
  },
];

export default function CandidatesPage() {
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
            <a href="/login" className="hover:underline cursor-pointer">Se connecter</a>
          </ul>
        </div>
      </nav>

      {/* Page Content */}
      <main className="container mx-auto p-6 pt-8">
        <div className="bg-[#2c3e6e] text-white rounded-lg p-6 mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Liste des Candidats</h1>
          <p className="text-sm opacity-90 mx-auto max-w-2xl">
            Découvrez les candidats disponibles et contactez-les directement pour vos offres.
          </p>
        </div>

        {/* Candidates List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2">{candidate.name}</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Compétences:</span> {candidate.skills.join(", ")}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Localisation:</span> {candidate.location}
              </p>

              {/* Bouton Contacter */}
              <a
                href={`mailto:${candidate.contact}`} // ouvre l'email
                className="inline-block bg-[#2c3e6e] text-white px-4 py-2 rounded hover:bg-[#1f2a4b] transition"
              >
                Contacter
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

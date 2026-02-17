"use client";

import React, { useEffect, useState } from "react";

type Filters = {
	q?: string;
	type?: string;
	location?: string;
};

export default function JobFilters({ initial = { q: "", type: "", location: "" }, onChange, }: { initial?: Filters; onChange?: (f: Filters) => void; }) {
	const [filters, setFilters] = useState<Filters>(initial);

	useEffect(() => {
		const t = setTimeout(() => onChange?.(filters), 300);
		return () => clearTimeout(t);
	}, [filters, onChange]);

	return (
		<div className="grid gap-4">
			<input
				aria-label="Rechercher"
				value={filters.q}
				onChange={(e) => setFilters((s) => ({ ...s, q: e.target.value }))}
				className="w-full border px-3 py-2 rounded"
				placeholder="Mots-clés, poste, compétence"
			/>

			<div className="flex flex-col gap-2 sm:flex-row">
				<select value={filters.type} onChange={(e) => setFilters((s) => ({ ...s, type: e.target.value }))} className="w-full rounded border px-2 py-2 sm:w-auto" aria-label="Type de contrat">
					<option value="">Tous types</option>
					<option value="CDI">CDI</option>
					<option value="CDD">CDD</option>
				</select>

				<input
					value={filters.location}
					onChange={(e) => setFilters((s) => ({ ...s, location: e.target.value }))}
					className="border px-3 py-2 rounded flex-1"
					placeholder="Ville ou télétravail"
				/>
			</div>
		</div>
	);
}

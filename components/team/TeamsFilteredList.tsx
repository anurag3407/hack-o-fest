'use client';

import React, { useState } from 'react';
import TeamSection from './TeamSection';
import type { Team } from '@/lib/types';

export default function TeamsFilteredList({ teams }: { teams: Team[] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', color: '#00D4FF' },
    ...teams.map(t => ({ id: t.id, name: t.name, color: t.color }))
  ];

  const filteredTeams = selectedCategory === 'all'
    ? teams
    : teams.filter(t => t.id === selectedCategory);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Category Filter Tags */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 px-4 max-w-4xl">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              '--theme-color': cat.color,
              '--glow-color': `${cat.color}33`,
            } as React.CSSProperties}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase border transition-all duration-300 active:scale-95 cursor-pointer ${
              selectedCategory === cat.id
                ? 'border-[var(--theme-color)] text-[var(--theme-color)] bg-[var(--theme-color)]/10 shadow-[0_0_20px_var(--glow-color)]'
                : 'border-white/10 text-[#A1A6B4] hover:border-[var(--theme-color)] hover:text-white bg-[#111214]/50 hover:bg-[#111214]/80'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filtered Team List */}
      <div className="w-full">
        {filteredTeams.map((team, i) => (
          <div key={`${team.id}-${i}`}>
            <TeamSection team={team} />
            {/* Show divider only when displaying multiple teams and not on the last one */}
            {selectedCategory === 'all' && i < filteredTeams.length - 1 && (
              <hr className="section-divider my-16" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

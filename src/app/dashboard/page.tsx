// File: frontend/src/app/dashboard/page.tsx (Updated)

'use client';

import VentureCard from "../components/VentureCard";
// Remove the imports for useAuth, useState, useEffect for now

export default function DashboardPage() {
  // We'll use mock data for now. Later, you can fetch this from your backend.
  const ventures = [
    { date: "Oct 21, 2025", sharkName: "Mark Cuban AI", status: "Verdict In" as const },
    { date: "Oct 15, 2025", sharkName: "Barbara Corcoran AI", status: "Verdict In" as const },
    { date: "Sep 30, 2025", sharkName: "Kevin O'Leary AI", status: "In Progress" as const },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-main-text">Your Ventures</h1>
        <button className="
          px-6 py-3 bg-accent text-main-text font-bold rounded-lg
          shadow-[0_0_15px_theme(colors.accent-glow)] 
          hover:shadow-[0_0_25px_theme(colors.accent-glow)] 
          transition-shadow duration-300
        ">
          + Prepare a New Venture
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ventures.map((venture, index) => (
          <VentureCard key={index} {...venture} />
        ))}
      </div>
    </div>
  );
}
// File: frontend/src/components/VentureCard.tsx

import Image from 'next/image'; // For shark avatar

// A placeholder shark avatar
const SHARK_AVATAR_URL = '/shark-avatar.png'; // Add a placeholder image in your /public folder

interface VentureCardProps {
  date: string;
  sharkName: string;
  status: 'Verdict In' | 'In Progress' | 'Awaiting Pitch';
}

export default function VentureCard({ date, sharkName, status }: VentureCardProps) {
  const statusColor = status === 'Verdict In' ? 'bg-accent' : 'bg-yellow-500';

  return (
    <div className="glass-card p-6 flex flex-col gap-4 hover:border-accent transition-colors cursor-pointer group">
      <div className="flex justify-between items-start">
        <span className="text-sm text-body-text">{date}</span>
        <div className="flex items-center gap-2 text-sm">
          <span className={`${statusColor} w-2 h-2 rounded-full`}></span>
          <span>{status}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Image 
          src={SHARK_AVATAR_URL} 
          alt={`${sharkName} avatar`} 
          width={48} 
          height={48} 
          className="rounded-full border-2 border-white/30"
        />
        <div>
          <p className="text-body-text text-sm">Pitched to</p>
          <h3 className="text-xl font-medium text-main-text">{sharkName}</h3>
        </div>
      </div>
      <button className="mt-auto w-full py-2 text-center font-semibold bg-white/10 rounded-lg group-hover:bg-accent transition-colors">
        View Debrief
      </button>
    </div>
  );
}
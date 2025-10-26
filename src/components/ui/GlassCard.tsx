// (alternative) GlassCard.tsx
'use client';
import * as React from 'react';
import { cn } from '@/lib/cn';

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function GlassCard({ className, ...rest }: Props) {
  return (
    <div
      {...rest}
      className={cn(
        'relative rounded-2xl border border-glass-border bg-glass-bg backdrop-blur-md',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_30px_rgba(0,0,0,0.35)]',
        'focus-within:ring-2 focus-within:ring-accent',
        className
      )}
      style={{ transform: 'translateZ(0)' }}
    />
  );
}

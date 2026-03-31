"use client";

import { cn } from"@/lib/utils";

interface SkillBreakdownProps {
  scores: {
    total: number;
    ai: number;
    backend: number;
    frontend: number;
    devops: number;
    data: number;
  };
  className?: string;
}

export function SkillBreakdown({ scores, className }: SkillBreakdownProps) {
  const categories = [
    { label: "AI", value: scores.ai, color: "bg-[#7F5AF0]" },
    { label: "Backend", value: scores.backend, color: "bg-[#0072FF]" },
    { label: "Frontend", value: scores.frontend, color: "bg-[#00D9F5]" },
    { label: "DevOps", value: scores.devops, color: "bg-[#00F5A0]" },
    { label: "Data", value: scores.data, color: "bg-[#F500D9]" },
  ];

  // Calculate percentages relative to the highest category score or a fixed maximum
  const maxScore = Math.max(...categories.map(c => c.value), 10);

  return (
    <div className={cn("space-y-6 w-full", className)}>
      <h4 className="text-[10px] tracking-[0.4em] uppercase font-black text-slate-600 mb-6">Neural Breakdown</h4>
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.label} className="group">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black tracking-widest text-slate-500 group-hover:text-white transition-colors uppercase">
                {category.label}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {category.value.toFixed(1)}
              </span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all duration-1000 ease-out rounded-full", category.color)}
                style={{ 
                  width: `${Math.min((category.value / maxScore) * 100, 100)}%`,
                  boxShadow: `0 0 8px ${category.color.replace('bg-', '')}` 
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[9px] text-slate-700 mt-6 italic uppercase font-black tracking-tighter">
        * Signal strength derived from node metadata
      </p>
    </div>
  );
}

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
    { label: "AI", value: scores.ai, color: "bg-violet-400" },
    { label: "Backend", value: scores.backend, color: "bg-blue-400" },
    { label: "Frontend", value: scores.frontend, color: "bg-indigo-400" },
    { label: "DevOps", value: scores.devops, color: "bg-emerald-400" },
    { label: "Data", value: scores.data, color: "bg-pink-400" },
  ];

  const maxScore = Math.max(...categories.map(c => c.value), 10);

  return (
    <div className={cn("space-y-6 w-full", className)}>
      <h4 className="text-xs font-semibold text-zinc-500 mb-6">Skill breakdown</h4>
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.label} className="group">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-medium text-zinc-500 group-hover:text-white transition-colors">
                {category.label}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {category.value.toFixed(1)}
              </span>
            </div>
            <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all duration-1000 ease-out rounded-full", category.color)}
                style={{ width: `${Math.min((category.value / maxScore) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-600 mt-6 italic">
        Based on repository metadata and contribution patterns
      </p>
    </div>
  );
}

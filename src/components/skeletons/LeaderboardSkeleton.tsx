"use client";

export default function LeaderboardSkeleton() {
  return (
    <div className="bg-gray-900/50 border border-gray-900 rounded-md overflow-hidden animate-pulse">
      <div className="h-14 bg-gray-950/50 border-b border-gray-800" />
      {[...Array(20)].map((_, i) => (
        <div key={i} className="h-20 border-b border-gray-900/50 flex items-center px-6 gap-6">
          <div className="w-10 h-6 bg-gray-900 rounded border border-gray-800" />
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-gray-900 rounded border border-gray-800" />
            <div className="h-4 w-32 bg-gray-900 rounded" />
          </div>
          <div className="h-3 w-24 bg-gray-900 rounded hidden md:block" />
          <div className="flex flex-col items-end gap-2 ml-auto">
            <div className="h-5 w-16 bg-gray-900 rounded" />
            <div className="h-1 w-24 bg-gray-900 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

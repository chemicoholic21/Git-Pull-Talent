"use client";

export default function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-pulse">
      {/* Header Skeleton */}
      <header className="flex flex-col md:flex-row gap-8 items-start mb-12 border-b border-gray-900 pb-12">
        <div className="w-24 h-24 bg-gray-900 rounded-md border border-gray-800" />
        <div className="flex-1 space-y-4">
          <div className="h-8 w-48 bg-gray-900 rounded" />
          <div className="h-4 w-full max-w-xl bg-gray-900 rounded" />
          <div className="flex gap-4">
            <div className="h-4 w-24 bg-gray-900 rounded" />
            <div className="h-4 w-24 bg-gray-900 rounded" />
          </div>
        </div>
        <div className="md:text-right space-y-2">
          <div className="h-4 w-32 bg-gray-900 rounded ml-auto" />
          <div className="h-12 w-48 bg-gray-900 rounded ml-auto" />
          <div className="h-4 w-32 bg-gray-900 rounded ml-auto" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Table Skeleton */}
        <div className="lg:col-span-2">
          <div className="h-6 w-48 bg-gray-900 rounded mb-6" />
          <div className="bg-gray-900/50 border border-gray-900 rounded-md overflow-hidden">
            <div className="h-12 bg-gray-950/50 border-b border-gray-800" />
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 border-b border-gray-900/50 flex items-center px-6 gap-4">
                <div className="h-4 w-32 bg-gray-900 rounded" />
                <div className="h-4 w-12 bg-gray-900 rounded ml-auto" />
                <div className="h-4 w-12 bg-gray-900 rounded" />
                <div className="h-2 w-24 bg-gray-900 rounded-full" />
                <div className="h-4 w-16 bg-gray-900 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Chart Skeleton */}
        <div>
          <div className="h-6 w-40 bg-gray-900 rounded mb-6" />
          <div className="bg-gray-900/30 border border-gray-900 p-6 rounded-md h-[400px] flex flex-col gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-3 w-12 bg-gray-900 rounded" />
                <div className="h-4 flex-1 bg-gray-900 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

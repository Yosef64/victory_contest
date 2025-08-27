import { Skeleton } from "../components/ui/skeleton";

export function LeaderboardSkeleton() {
  return (
    // This new container constrains the width and centers the content.
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <main className="mt-10 pb-4">
        {/* Podium Skeleton - now with responsive sizes and gaps */}
        <div className="flex justify-center items-end gap-2 sm:gap-4 md:gap-8 mb-12 animate-pulse">
          {/* 2nd Place */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              {/* Smaller on mobile, larger on sm+ */}
              <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-full dark:bg-gray-700 mb-1" />
            </div>
            <Skeleton className="h-5 w-24 sm:w-32 rounded-md dark:bg-gray-700" />
            <Skeleton className="h-4 w-16 sm:w-24 rounded-md dark:bg-gray-700" />
          </div>
          {/* 1st Place */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="relative">
              {/* Scaled down for mobile */}
              <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 mb-1 rounded-full dark:bg-gray-700" />
            </div>
            <Skeleton className="h-5 w-28 sm:w-36 rounded-md dark:bg-gray-700" />
            <Skeleton className="h-4 w-20 sm:w-28 rounded-md dark:bg-gray-700" />
          </div>
          {/* 3rd Place */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 mb-1 rounded-full dark:bg-gray-700" />
            </div>
            <Skeleton className="h-5 w-24 sm:w-32 rounded-md dark:bg-gray-700" />
            <Skeleton className="h-4 w-16 sm:w-24 rounded-md dark:bg-gray-700" />
          </div>
        </div>

        {/* Full Rankings List Skeleton (benefits from the main container) */}
        <div>
          <Skeleton className="h-7 w-48 mb-4 rounded-md dark:bg-gray-700" />
          <div className="space-y-2 rounded-xl">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-card dark:bg-gray-800 text-card-foreground flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-6 w-6 dark:bg-gray-700 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1.5 rounded-md dark:bg-gray-700" />
                    <Skeleton className="h-4 w-20 rounded-md dark:bg-gray-700" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-8 w-20 rounded-md dark:bg-gray-700" />
                  <Skeleton className="h-8 w-20 rounded-md dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Your Performance Summary Skeleton (benefits from the main container) */}
      <div className="mt-8 p-4 rounded-xl border">
        <Skeleton className="h-5 w-40 mb-4 dark:bg-gray-700 rounded-md" />
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center flex flex-col items-center gap-2">
            <Skeleton className="h-7 w-12 rounded-md dark:bg-gray-700" />
            <Skeleton className="h-4 w-24 rounded-md dark:bg-gray-700" />
          </div>
          <div className="text-center flex flex-col items-center gap-2">
            <Skeleton className="h-7 w-16 rounded-md dark:bg-gray-700" />
            <Skeleton className="h-4 w-16 rounded-md dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

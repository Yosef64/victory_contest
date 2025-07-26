import { Skeleton } from "../components/ui/skeleton";

export function LeaderboardSkeleton() {
  return (
    <div>
      <main className="mt-10 pb-4">
        {/* Podium Skeleton */}
        <div className="flex justify-center items-center gap-4 md:gap-8 mb-12 px-4 animate-pulse dark:bg-gray-900">
          {/* 2nd Place */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="relative">
              <Skeleton className="h-20 w-20 rounded-full dark:bg-gray-700 mb-1" />
            </div>
            <Skeleton className="h-5 w-32 rounded-md dark:bg-gray-700" />
            <Skeleton className="h-4 w-24 rounded-md dark:bg-gray-700" />
          </div>
          {/* 1st Place */}
          <div className="flex flex-col items-center gap-2 -mt-8 z-10">
            <div className="relative">
              <Skeleton className="h-24 w-24 mb-1 rounded-full dark:bg-gray-700" />
            </div>
            <Skeleton className="h-5 w-36 rounded-md dark:bg-gray-700" />
            <Skeleton className="h-4 w-28 rounded-md dark:bg-gray-700" />
          </div>
          {/* 3rd Place */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="relative">
              <Skeleton className="h-20 w-20 mb-1 rounded-full dark:bg-gray-700" />
            </div>
            <Skeleton className="h-5 w-32 rounded-md dark:bg-gray-700" />
            <Skeleton className="h-4 w-24 rounded-md dark:bg-gray-700" />
          </div>
        </div>

        {/* Full Rankings List Skeleton */}
        <div className="">
          <Skeleton className="h-7 w-48 mb-4 rounded-md dark:bg-gray-700" />
          <div className="space-y-2 dark:bg-gray-800  rounded-xl">
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

      {/* Your Performance Summary Skeleton */}
      <div className="mt-8 p-4 rounded-xl bg-card border">
        <Skeleton className="h-5 w-40 mb-4 rounded-md" />
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center flex flex-col items-center gap-2">
            <Skeleton className="h-7 w-12 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
          <div className="text-center flex flex-col items-center gap-2">
            <Skeleton className="h-7 w-16 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

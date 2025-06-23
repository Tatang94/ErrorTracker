import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-primary border-t-transparent", sizeClasses[size], className)} />
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full loading-shimmer" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded loading-shimmer" />
                <div className="h-3 w-24 bg-gray-200 rounded loading-shimmer" />
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="h-6 w-28 bg-gray-200 rounded loading-shimmer" />
              <div className="h-4 w-20 bg-gray-200 rounded loading-shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

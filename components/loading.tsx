import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Loading({ message = "Loading...", size = "md", className = "" }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
      {message && (
        <p className="mt-2 text-sm text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
}

export function LoadingCard({ message = "Loading data..." }: { message?: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
      <Loading message={message} />
    </div>
  );
}

export function LoadingPage({ message = "Loading page..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loading message={message} size="lg" />
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

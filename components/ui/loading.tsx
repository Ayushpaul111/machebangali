import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  className?: string;
}

export function Loading({
  message = "Loading...",
  className = "",
}: LoadingProps) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-red-600" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loading message={message} />
    </div>
  );
}

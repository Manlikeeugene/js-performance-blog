import { Zap } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Zap className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
        <p className="text-slate-400">{message}</p>
      </div>
    </div>
  );
}
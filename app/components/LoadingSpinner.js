
// import { Zap } from 'lucide-react';

// export default function LoadingSpinner({ message = 'Loading...' }) {
//   return (
//     <div className="text-center py-16">
//       <Zap className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-4" />
//       <p className="text-slate-400">{message}</p>
//     </div>
//   );
// }

// import { Zap } from 'lucide-react';

// export default function LoadingSpinner({ message = 'Loading...' }) {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center py-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
//       <Zap className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-4" />
//       <p className="text-slate-400">{message}</p>
//     </div>
//   );
// }

// import { Zap } from 'lucide-react';

// export default function LoadingSpinner({ message = 'Loading...' }) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
//       <div className="text-center space-y-4">
//         <Zap className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
//         <p className="text-slate-400">{message}</p>
//       </div>
//     </div>
//   );
// }



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
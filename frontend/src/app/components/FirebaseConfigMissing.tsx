import { Link } from 'react-router';
import { Sparkles } from 'lucide-react';

/**
 * Shown when VITE_FIREBASE_* env vars are missing so we never call initializeApp with an invalid key.
 */
export function FirebaseConfigMissing() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-lg w-full bg-surface border border-border rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-semibold">Configure Firebase</h1>
        </div>
        <p className="text-text-secondary text-[15px] leading-relaxed mb-4">
          UniShare needs your Firebase web app configuration. Create{' '}
          <code className="text-sm bg-background px-1.5 py-0.5 rounded border border-border">
            frontend/.env
          </code>{' '}
          (copy from <code className="text-sm bg-background px-1.5 py-0.5 rounded border border-border">.env.example</code>
          ) and fill in all <code className="text-sm">VITE_FIREBASE_*</code> values from the Firebase Console → Project
          settings → Your apps → Web app config.
        </p>
        <p className="text-text-secondary text-[14px] mb-6">
          Restart the Vite dev server after saving <code className="text-sm">.env</code>.
        </p>
        <Link
          to="/"
          className="inline-flex text-primary font-medium hover:underline text-[15px]"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

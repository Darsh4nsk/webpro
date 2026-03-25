import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { FirebaseConfigMissing } from '../components/FirebaseConfigMissing';
import { formatFirebaseAuthError } from '../lib/authErrors';
import { mockCommunities } from '../lib/communities';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !communityId) {
      setError('Please fill in all fields');
      return;
    }

    const selectedCommunity = mockCommunities.find((c) => c.id === communityId);

    if (!selectedCommunity) {
      setError('Please select a valid college');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters (Firebase requirement).');
      return;
    }

    setSubmitting(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, 'users', cred.user.uid), {
        name,
        email,
        communityId: selectedCommunity.id,
        communityName: selectedCommunity.name,
      });
      navigate('/');
    } catch (err: unknown) {
      setError(formatFirebaseAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isFirebaseConfigured || !auth || !db) {
    return <FirebaseConfigMissing />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              UniShare
            </span>
          </Link>
          <h1 className="mb-3">Join Your Community</h1>
          <p className="text-text-secondary text-[16px]">
            Start sharing resources with students at your college
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-3xl p-8 border border-border-light shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-error/10 text-error px-4 py-3 rounded-xl text-[14px] font-medium border border-error/20"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="name" className="block text-[14px] font-semibold mb-2 text-text-primary">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3.5 bg-white/50 border-2 border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-[15px] placeholder:text-text-tertiary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[14px] font-semibold mb-2 text-text-primary">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full px-4 py-3.5 bg-white/50 border-2 border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-[15px] placeholder:text-text-tertiary"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[14px] font-semibold mb-2 text-text-primary">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-white/50 border-2 border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-[15px] placeholder:text-text-tertiary"
              />
            </div>

            <div>
              <label htmlFor="community" className="block text-[14px] font-semibold mb-2 text-text-primary">
                Select Your College
              </label>
              <select
                id="community"
                value={communityId}
                onChange={(e) => setCommunityId(e.target.value)}
                className="w-full px-4 py-3.5 bg-surface border-2 border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-[15px] text-text-primary"
              >
                <option value="" className="text-text-tertiary">Choose your college...</option>
                {mockCommunities.map((community) => (
                  <option key={community.id} value={community.id} className="text-text-primary">
                    {community.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3.5 rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all text-[15px] flex items-center justify-center gap-2 group mt-6 disabled:opacity-60"
            >
              Create Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-secondary text-[15px]">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-secondary transition-colors font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <Link to="/" className="text-text-secondary hover:text-primary transition-colors text-[14px] font-medium">
            ← Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

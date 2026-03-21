import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { setCurrentUser, mockCommunities } from '../utils/mockData';
import { User } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Mock login - in production, this would call an API
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: email,
      communityId: '1',
      communityName: mockCommunities[0].name,
    };

    setCurrentUser(mockUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
          <h1 className="mb-3">Welcome Back!</h1>
          <p className="text-text-secondary text-[16px]">
            Sign in to continue sharing with your community
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-3xl p-8 border border-border-light shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3.5 rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all text-[15px] flex items-center justify-center gap-2 group"
            >
              Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-secondary text-[15px]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-secondary transition-colors font-semibold">
                Sign up free
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

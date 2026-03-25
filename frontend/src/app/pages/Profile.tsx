import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { fetchListings, fetchRequests } from '../lib/api';
import { User, Package, Send, CheckCircle } from 'lucide-react';

export function Profile() {
  const { user: currentUser, refreshProfile } = useAuth();
  const [myListingsCount, setMyListingsCount] = useState(0);
  const [myRequestsCount, setMyRequestsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  const profileReady = Boolean(currentUser?.communityId?.trim());

  useEffect(() => {
    if (!currentUser || !profileReady) return;
    let cancelled = false;
    setLoadError(null);
    Promise.all([fetchListings(), fetchRequests('outgoing')])
      .then(([listings, outgoing]) => {
        if (cancelled) return;
        const mine = listings.filter((l) => l.ownerId === currentUser.id);
        setMyListingsCount(mine.length);
        setMyRequestsCount(outgoing.length);
        setCompletedCount(outgoing.filter((r) => r.status === 'completed').length);
      })
      .catch((e: Error) => {
        if (!cancelled) setLoadError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [currentUser?.id, profileReady]);

  // If Firestore profile didn't load yet (or we only have the Auth-only placeholder),
  // try one refresh so the UI can display signup-provided name/college.
  useEffect(() => {
    if (!currentUser) return;
    if (!profileReady || currentUser.name === 'User') {
      void refreshProfile();
    }
  }, [currentUser?.id, profileReady, currentUser?.name, refreshProfile]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        <div className="max-w-[900px] mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="mb-2">Profile</h1>
            <p className="text-text-secondary text-[15px]">Your account information and activity</p>
          </div>

          {!profileReady && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h2 className="text-amber-900 text-[16px] font-semibold mb-2">Profile not loaded</h2>
              <p className="text-amber-900/90 text-[14px] mb-4">
                Your college/community info is saved during signup in Firestore. If this page can’t find it,
                please sign out and sign in again (or create the account again).
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link to="/signup" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-[14px]">
                  Go to Signup
                </Link>
              </div>
            </div>
          )}

          {loadError && (
            <div className="mb-4 bg-error/10 text-error px-4 py-3 rounded-lg text-[14px] border border-error/20">
              {loadError}
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="mb-1">{currentUser.name}</h2>
                  <p className="text-text-secondary text-[15px] mb-4">{currentUser.email}</p>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded text-[14px] font-medium">
                    {currentUser.communityName || 'Set your college above'}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-semibold">{myListingsCount}</div>
                </div>
                <div className="text-text-secondary text-[14px]">Resources Shared</div>
              </div>

              <div className="bg-surface border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Send className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-semibold">{myRequestsCount}</div>
                </div>
                <div className="text-text-secondary text-[14px]">Requests Sent</div>
              </div>

              <div className="bg-surface border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-semibold">{completedCount}</div>
                </div>
                <div className="text-text-secondary text-[14px]">Completed Exchanges</div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-8">
              <h3 className="mb-6">Account Details</h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between py-3 border-b border-border">
                  <div>
                    <div className="text-[14px] font-medium mb-1">Full Name</div>
                    <div className="text-text-secondary text-[14px]">
                      {currentUser.name && currentUser.name !== 'User' ? currentUser.name : '—'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between py-3 border-b border-border">
                  <div>
                    <div className="text-[14px] font-medium mb-1">Email Address</div>
                    <div className="text-text-secondary text-[14px]">{currentUser.email}</div>
                  </div>
                </div>
                <div className="flex items-start justify-between py-3">
                  <div>
                    <div className="text-[14px] font-medium mb-1">Community</div>
                    <div className="text-text-secondary text-[14px]">{currentUser.communityName}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-blue-900 mb-2">Platform Information</h3>
              <p className="text-blue-800 text-[14px] leading-relaxed">
                Listings and requests are stored in CSV files on the server. Sign-in uses Firebase
                Authentication; your college and profile live in Firestore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { CategoryBadge } from '../components/CategoryBadge';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  fetchListings,
  fetchRequests,
  patchRequest,
} from '../lib/api';
import type { Listing, Request } from '../types';
import { Package, Inbox, Send } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'incoming' | 'outgoing'>('listings');
  const [listings, setListings] = useState<Listing[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<Request[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<Request[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const initialFetchDone = useRef(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    const showBootSpinner = !initialFetchDone.current;
    if (!user.communityId?.trim()) {
      setLoadError(null);
      setListings([]);
      setIncomingRequests([]);
      setOutgoingRequests([]);
      if (showBootSpinner) {
        initialFetchDone.current = true;
        setDataLoading(false);
      }
      return;
    }
    setLoadError(null);
    if (showBootSpinner) setDataLoading(true);
    try {
      const [allListings, inc, out] = await Promise.all([
        fetchListings(),
        fetchRequests('incoming'),
        fetchRequests('outgoing'),
      ]);
      setListings(allListings);
      setIncomingRequests(inc);
      setOutgoingRequests(out);
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      if (showBootSpinner) {
        initialFetchDone.current = true;
        setDataLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const myListings = useMemo(() => {
    return listings.filter((listing) => listing.ownerId === user?.id);
  }, [listings, user?.id]);

  const handleApproveRequest = async (requestId: string) => {
    try {
      await patchRequest(requestId, 'approve');
      await refresh();
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : 'Approve failed');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await patchRequest(requestId, 'reject');
      await refresh();
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : 'Reject failed');
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    try {
      await patchRequest(requestId, 'complete');
      await refresh();
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : 'Complete failed');
    }
  };

  const tabs = [
    { id: 'listings' as const, label: 'My Listings', icon: Package, count: myListings.length },
    { id: 'incoming' as const, label: 'Incoming Requests', icon: Inbox, count: incomingRequests.length },
    { id: 'outgoing' as const, label: 'My Requests', icon: Send, count: outgoingRequests.length },
  ];

  if (!user) {
    return null;
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[40vh] text-text-secondary">
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        <div className="max-w-[1100px] mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="mb-2">My Dashboard</h1>
            <p className="text-text-secondary text-[15px]">Manage your listings and requests</p>
          </div>

          {loadError && (
            <div className="mb-4 bg-error/10 text-error px-4 py-3 rounded-lg text-[14px] border border-error/20">
              {loadError}
            </div>
          )}

          {!user.communityId?.trim() && (
            <div className="mb-4 bg-amber-50 text-amber-950 px-4 py-3 rounded-lg text-[14px] border border-amber-200">
              Set your college on{' '}
              <Link to="/profile" className="font-semibold underline">
                Profile
              </Link>{' '}
              so the server can load listings and requests.
            </div>
          )}

          <div className="flex gap-2 mb-8 border-b border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors text-[15px] ${
                    activeTab === tab.id
                      ? 'border-primary text-text-primary font-medium'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span className="bg-gray-100 text-text-secondary px-2 py-0.5 rounded text-[13px] font-medium">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {activeTab === 'listings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-text-secondary text-[14px]">
                  {myListings.length} active {myListings.length === 1 ? 'listing' : 'listings'}
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/create-listing')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary-hover transition-colors text-[14px]"
                >
                  Create New Listing
                </button>
              </div>

              {myListings.length === 0 ? (
                <div className="bg-surface border border-border rounded-lg p-12 text-center">
                  <Package className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                  <h3 className="mb-2">No listings yet</h3>
                  <p className="text-text-secondary text-[15px] mb-6">
                    Start sharing resources with your community
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/create-listing')}
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded font-medium hover:bg-primary-hover transition-colors text-[15px]"
                  >
                    Create Your First Listing
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myListings.map((listing) => (
                    <div
                      key={listing.id}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          navigate(`/listing/${listing.id}`);
                        }
                      }}
                      className="bg-surface border border-border rounded-lg p-6 hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => navigate(`/listing/${listing.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CategoryBadge category={listing.category} />
                            <StatusBadge status={listing.status} type="availability" />
                          </div>
                          <h3 className="mb-1">{listing.title}</h3>
                          <p className="text-text-secondary text-[14px] line-clamp-2">
                            {listing.description}
                          </p>
                        </div>
                        {listing.isPaid && listing.price != null && (
                          <div className="text-primary font-semibold text-lg ml-4">${listing.price}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'incoming' && (
            <div>
              <p className="text-text-secondary text-[14px] mb-6">
                {incomingRequests.length}{' '}
                {incomingRequests.length === 1 ? 'request' : 'requests'}
              </p>

              {incomingRequests.length === 0 ? (
                <div className="bg-surface border border-border rounded-lg p-12 text-center">
                  <Inbox className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                  <h3 className="mb-2">No incoming requests</h3>
                  <p className="text-text-secondary text-[15px]">
                    When someone requests your resources, they'll appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incomingRequests.map((request) => (
                    <div key={request.id} className="bg-surface border border-border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3>{request.listingTitle}</h3>
                            <StatusBadge status={request.status} type="request" />
                          </div>
                          <p className="text-text-secondary text-[14px]">
                            Requested by <span className="font-medium">{request.requesterName}</span>
                          </p>
                          {request.message && (
                            <div className="mt-3 bg-background border border-border rounded p-3">
                              <p className="text-[14px] text-text-secondary italic">
                                &quot;{request.message}&quot;
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => void handleApproveRequest(request.id)}
                            className="flex-1 bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 transition-colors text-[14px]"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleRejectRequest(request.id)}
                            className="flex-1 bg-surface text-text-primary border border-border py-2 rounded font-medium hover:bg-gray-50 transition-colors text-[14px]"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {request.status === 'approved' && (
                        <button
                          type="button"
                          onClick={() => void handleCompleteRequest(request.id)}
                          className="w-full bg-primary text-primary-foreground py-2 rounded font-medium hover:bg-primary-hover transition-colors text-[14px]"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'outgoing' && (
            <div>
              <p className="text-text-secondary text-[14px] mb-6">
                {outgoingRequests.length}{' '}
                {outgoingRequests.length === 1 ? 'request' : 'requests'} sent
              </p>

              {outgoingRequests.length === 0 ? (
                <div className="bg-surface border border-border rounded-lg p-12 text-center">
                  <Send className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                  <h3 className="mb-2">No requests sent</h3>
                  <p className="text-text-secondary text-[15px] mb-6">
                    Browse resources and request what you need
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/browse')}
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded font-medium hover:bg-primary-hover transition-colors text-[15px]"
                  >
                    Browse Resources
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {outgoingRequests.map((request) => {
                    const listing = listings.find((l) => l.id === request.listingId);
                    return (
                      <div key={request.id} className="bg-surface border border-border rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3>{request.listingTitle}</h3>
                              <StatusBadge status={request.status} type="request" />
                            </div>
                            <p className="text-text-secondary text-[14px]">
                              Owner: {listing?.ownerName ?? '—'}
                            </p>
                            {request.message && (
                              <div className="mt-3 bg-background border border-border rounded p-3">
                                <p className="text-[13px] text-text-secondary">
                                  <span className="font-medium">Your message:</span> {request.message}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

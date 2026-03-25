import { useParams, useNavigate, Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { CategoryBadge } from '../components/CategoryBadge';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { fetchListing, fetchRequests, createRequest } from '../lib/api';
import type { Listing, Request } from '../types';
import { ArrowLeft, User, Calendar, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null | undefined>(undefined);
  const [outgoingRequests, setOutgoingRequests] = useState<Request[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [requestMessage, setRequestMessage] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    if (!user.communityId?.trim()) {
      setListing(null);
      setLoadError(
        'Set your college on your Profile before viewing listings. The server matches you to a community in Firestore.'
      );
      return;
    }
    let cancelled = false;
    setLoadError(null);
    Promise.all([fetchListing(id), fetchRequests('outgoing')])
      .then(([l, out]) => {
        if (!cancelled) {
          setListing(l);
          setOutgoingRequests(out);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setListing(null);
          setLoadError(e.message);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id, user?.id, user?.communityId]);

  const existingRequest = outgoingRequests.find(
    (r) => r.listingId === id && r.requesterId === user?.id
  );

  if (listing === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[40vh] text-text-secondary">
          Loading…
        </div>
      </div>
    );
  }

  if (!listing || loadError) {
    const needsCollege = Boolean(user && !user.communityId?.trim());
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-[1100px] mx-auto px-6 py-12">
            <div className="bg-surface border border-border rounded-lg p-12 text-center">
              <h2 className="mb-2">{needsCollege ? 'Set your college' : 'Resource Not Found'}</h2>
              <p className="text-text-secondary mb-6">
                {loadError || "The resource you're looking for doesn't exist or has been removed."}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {needsCollege && (
                  <Link
                    to="/profile"
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded font-medium hover:bg-primary-hover transition-colors text-[15px] inline-block"
                  >
                    Open Profile
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => navigate('/browse')}
                  className="px-6 py-2.5 bg-surface border border-border rounded font-medium hover:bg-gray-50 transition-colors text-[15px]"
                >
                  Browse Resources
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOwnListing = listing.ownerId === user?.id;
  const canRequest =
    !isOwnListing && listing.status === 'available' && !existingRequest;

  const handleRequestSubmit = async () => {
    if (!user || !id) return;
    setSubmitting(true);
    setErrorMessage('');
    try {
      await createRequest(listing.id, requestMessage);
      setSuccessMessage('Request sent successfully! The owner will be notified.');
      setShowRequestForm(false);
      setRequestMessage('');
      const out = await fetchRequests('outgoing');
      setOutgoingRequests(out);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        <div className="max-w-[900px] mx-auto px-6 py-8">
          <button
            type="button"
            onClick={() => navigate('/browse')}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 text-[15px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </button>

          <div className="bg-surface border border-border rounded-lg p-8">
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-border">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <CategoryBadge category={listing.category} />
                  <StatusBadge status={listing.status} type="availability" />
                </div>
                <h1 className="mb-2">{listing.title}</h1>
                <div className="flex items-center gap-4 text-[14px] text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    {listing.ownerName}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(listing.createdAt)}
                  </div>
                </div>
              </div>

              {listing.isPaid && listing.price != null && (
                <div className="bg-primary/10 px-4 py-2 rounded">
                  <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                    <DollarSign className="w-5 h-5" />
                    {listing.price}
                  </div>
                </div>
              )}
              {!listing.isPaid && (
                <div className="bg-green-50 px-4 py-2 rounded">
                  <div className="text-green-700 font-semibold">Free</div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="mb-3">Description</h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">{listing.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="mb-3">Conditions</h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">{listing.conditions}</p>
            </div>

            <div className="mb-8">
              <h3 className="mb-3">Community</h3>
              <p className="text-text-secondary text-[15px]">{listing.communityName}</p>
            </div>

            {successMessage && (
              <div className="bg-green-50 text-green-700 px-4 py-3 rounded mb-6 text-[15px]">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded mb-6 text-[15px]">
                {errorMessage}
              </div>
            )}

            <div className="border-t border-border pt-6">
              {isOwnListing && (
                <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded text-[14px]">
                  This is your listing. You can manage it from your dashboard.
                </div>
              )}

              {existingRequest && !isOwnListing && (
                <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded text-[14px]">
                  You&apos;ve already requested this resource. Status:{' '}
                  <span className="font-medium">{existingRequest.status}</span>
                </div>
              )}

              {listing.status === 'unavailable' && !isOwnListing && !existingRequest && (
                <div className="bg-gray-100 text-gray-700 px-4 py-3 rounded text-[14px]">
                  This resource is currently unavailable.
                </div>
              )}

              {canRequest && !showRequestForm && (
                <button
                  type="button"
                  onClick={() => setShowRequestForm(true)}
                  className="w-full bg-primary text-primary-foreground py-3 rounded font-medium hover:bg-primary-hover transition-colors text-[15px]"
                >
                  Request Resource
                </button>
              )}

              {showRequestForm && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="message" className="block text-[14px] font-medium mb-2">
                      Message to Owner (Optional)
                    </label>
                    <textarea
                      id="message"
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder="Let the owner know why you need this resource..."
                      rows={4}
                      className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-[15px]"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => void handleRequestSubmit()}
                      className="flex-1 bg-primary text-primary-foreground py-2.5 rounded font-medium hover:bg-primary-hover transition-colors text-[15px] disabled:opacity-60"
                    >
                      Send Request
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRequestForm(false);
                        setRequestMessage('');
                      }}
                      className="flex-1 bg-surface text-text-primary border border-border py-2.5 rounded font-medium hover:bg-gray-50 transition-colors text-[15px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

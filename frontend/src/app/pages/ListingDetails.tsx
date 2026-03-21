import { useParams, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { CategoryBadge } from '../components/CategoryBadge';
import { StatusBadge } from '../components/StatusBadge';
import { getListings, getCurrentUser, addRequest, getRequests } from '../utils/mockData';
import { ArrowLeft, User, Calendar, DollarSign } from 'lucide-react';
import { useState } from 'react';

export function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const listings = getListings();
  const requests = getRequests();
  
  const [requestMessage, setRequestMessage] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const listing = listings.find(l => l.id === id);

  // Check if user has already requested this listing
  const existingRequest = requests.find(
    r => r.listingId === id && r.requesterId === currentUser?.id
  );

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-[1100px] mx-auto px-6 py-12">
            <div className="bg-surface border border-border rounded-lg p-12 text-center">
              <h2 className="mb-2">Resource Not Found</h2>
              <p className="text-text-secondary mb-6">
                The resource you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => navigate('/browse')}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded font-medium hover:bg-primary-hover transition-colors text-[15px]"
              >
                Browse Resources
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOwnListing = listing.ownerId === currentUser?.id;
  const canRequest = !isOwnListing && listing.status === 'available' && !existingRequest;

  const handleRequestSubmit = () => {
    if (!currentUser) return;

    addRequest({
      listingId: listing.id,
      listingTitle: listing.title,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      ownerId: listing.ownerId,
      status: 'pending',
      message: requestMessage,
    });

    setSuccessMessage('Request sent successfully! The owner will be notified.');
    setShowRequestForm(false);
    setRequestMessage('');
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
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
            onClick={() => navigate('/browse')}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 text-[15px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </button>

          <div className="bg-surface border border-border rounded-lg p-8">
            {/* Header */}
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
              
              {listing.isPaid && listing.price && (
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

            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-3">Description</h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Conditions */}
            <div className="mb-6">
              <h3 className="mb-3">Conditions</h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                {listing.conditions}
              </p>
            </div>

            {/* Community */}
            <div className="mb-8">
              <h3 className="mb-3">Community</h3>
              <p className="text-text-secondary text-[15px]">
                {listing.communityName}
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 text-green-700 px-4 py-3 rounded mb-6 text-[15px]">
                {successMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t border-border pt-6">
              {isOwnListing && (
                <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded text-[14px]">
                  This is your listing. You can manage it from your dashboard.
                </div>
              )}

              {existingRequest && (
                <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded text-[14px]">
                  You've already requested this resource. Status: <span className="font-medium">{existingRequest.status}</span>
                </div>
              )}

              {listing.status === 'unavailable' && !isOwnListing && !existingRequest && (
                <div className="bg-gray-100 text-gray-700 px-4 py-3 rounded text-[14px]">
                  This resource is currently unavailable.
                </div>
              )}

              {canRequest && !showRequestForm && (
                <button
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
                      onClick={handleRequestSubmit}
                      className="flex-1 bg-primary text-primary-foreground py-2.5 rounded font-medium hover:bg-primary-hover transition-colors text-[15px]"
                    >
                      Send Request
                    </button>
                    <button
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

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { CategoryBadge } from '../components/CategoryBadge';
import { StatusBadge } from '../components/StatusBadge';
import { 
  getListings, 
  getCurrentUser, 
  getRequests, 
  updateRequest, 
  updateListing,
  setListings,
  setRequests 
} from '../utils/mockData';
import { Package, Inbox, Send } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState<'listings' | 'incoming' | 'outgoing'>('listings');
  const [listings, setListingsState] = useState(getListings());
  const [requests, setRequestsState] = useState(getRequests());

  // Filter data based on current user
  const myListings = useMemo(() => {
    return listings.filter(listing => listing.ownerId === currentUser?.id);
  }, [listings, currentUser]);

  const incomingRequests = useMemo(() => {
    return requests.filter(request => request.ownerId === currentUser?.id);
  }, [requests, currentUser]);

  const outgoingRequests = useMemo(() => {
    return requests.filter(request => request.requesterId === currentUser?.id);
  }, [requests, currentUser]);

  const handleApproveRequest = (requestId: string, listingId: string) => {
    // Update request status
    updateRequest(requestId, { status: 'approved' });
    
    // Update listing availability
    updateListing(listingId, { status: 'unavailable' });
    
    // Refresh state
    setRequestsState(getRequests());
    setListingsState(getListings());
  };

  const handleRejectRequest = (requestId: string) => {
    updateRequest(requestId, { status: 'rejected' });
    setRequestsState(getRequests());
  };

  const handleCompleteRequest = (requestId: string, listingId: string) => {
    updateRequest(requestId, { status: 'completed' });
    updateListing(listingId, { status: 'available' });
    
    setRequestsState(getRequests());
    setListingsState(getListings());
  };

  const tabs = [
    { id: 'listings' as const, label: 'My Listings', icon: Package, count: myListings.length },
    { id: 'incoming' as const, label: 'Incoming Requests', icon: Inbox, count: incomingRequests.length },
    { id: 'outgoing' as const, label: 'My Requests', icon: Send, count: outgoingRequests.length },
  ];

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-[1100px] mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="mb-2">My Dashboard</h1>
            <p className="text-text-secondary text-[15px]">
              Manage your listings and requests
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
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

          {/* My Listings Tab */}
          {activeTab === 'listings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-text-secondary text-[14px]">
                  {myListings.length} active {myListings.length === 1 ? 'listing' : 'listings'}
                </p>
                <button
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
                        {listing.isPaid && listing.price && (
                          <div className="text-primary font-semibold text-lg ml-4">
                            ${listing.price}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Incoming Requests Tab */}
          {activeTab === 'incoming' && (
            <div>
              <p className="text-text-secondary text-[14px] mb-6">
                {incomingRequests.length} {incomingRequests.length === 1 ? 'request' : 'requests'}
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
                    <div
                      key={request.id}
                      className="bg-surface border border-border rounded-lg p-6"
                    >
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
                                "{request.message}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApproveRequest(request.id, request.listingId)}
                            className="flex-1 bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 transition-colors text-[14px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            className="flex-1 bg-surface text-text-primary border border-border py-2 rounded font-medium hover:bg-gray-50 transition-colors text-[14px]"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {request.status === 'approved' && (
                        <button
                          onClick={() => handleCompleteRequest(request.id, request.listingId)}
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

          {/* Outgoing Requests Tab */}
          {activeTab === 'outgoing' && (
            <div>
              <p className="text-text-secondary text-[14px] mb-6">
                {outgoingRequests.length} {outgoingRequests.length === 1 ? 'request' : 'requests'} sent
              </p>

              {outgoingRequests.length === 0 ? (
                <div className="bg-surface border border-border rounded-lg p-12 text-center">
                  <Send className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                  <h3 className="mb-2">No requests sent</h3>
                  <p className="text-text-secondary text-[15px] mb-6">
                    Browse resources and request what you need
                  </p>
                  <button
                    onClick={() => navigate('/browse')}
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded font-medium hover:bg-primary-hover transition-colors text-[15px]"
                  >
                    Browse Resources
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {outgoingRequests.map((request) => {
                    const listing = listings.find(l => l.id === request.listingId);
                    return (
                      <div
                        key={request.id}
                        className="bg-surface border border-border rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3>{request.listingTitle}</h3>
                              <StatusBadge status={request.status} type="request" />
                            </div>
                            <p className="text-text-secondary text-[14px]">
                              Owner: {listing?.ownerName}
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

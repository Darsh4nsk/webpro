import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { CategoryBadge } from '../components/CategoryBadge';
import { StatusBadge } from '../components/StatusBadge';
import { getListings, getCurrentUser } from '../utils/mockData';
import { Category } from '../types';
import { Search, SlidersHorizontal } from 'lucide-react';

export function Browse() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const listings = getListings();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [paidFilter, setPaidFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter listings based on current user's community
  const communityListings = useMemo(() => {
    return listings.filter(listing => listing.communityId === currentUser?.communityId);
  }, [listings, currentUser]);

  // Apply filters
  const filteredListings = useMemo(() => {
    return communityListings.filter(listing => {
      // Search filter
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           listing.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = categoryFilter === 'all' || listing.category === categoryFilter;
      
      // Availability filter
      const matchesAvailability = availabilityFilter === 'all' || listing.status === availabilityFilter;
      
      // Paid filter
      const matchesPaid = paidFilter === 'all' || 
                         (paidFilter === 'free' && !listing.isPaid) ||
                         (paidFilter === 'paid' && listing.isPaid);
      
      return matchesSearch && matchesCategory && matchesAvailability && matchesPaid;
    });
  }, [communityListings, searchQuery, categoryFilter, availabilityFilter, paidFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-[1100px] mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="mb-2">Browse Resources</h1>
            <p className="text-text-secondary text-[15px]">
              Discover resources shared by your {currentUser?.communityName} community
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-[15px]"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 bg-surface border border-border rounded font-medium hover:bg-gray-50 transition-colors text-[15px] flex items-center gap-2 ${showFilters ? 'bg-gray-50' : ''}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="bg-surface border border-border rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[14px] font-medium mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as Category | 'all')}
                    className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary text-[14px]"
                  >
                    <option value="all">All Categories</option>
                    <option value="physical">Physical</option>
                    <option value="digital">Digital</option>
                    <option value="service">Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[14px] font-medium mb-2">Availability</label>
                  <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value as 'all' | 'available' | 'unavailable')}
                    className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary text-[14px]"
                  >
                    <option value="all">All</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[14px] font-medium mb-2">Price</label>
                  <select
                    value={paidFilter}
                    onChange={(e) => setPaidFilter(e.target.value as 'all' | 'free' | 'paid')}
                    className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary text-[14px]"
                  >
                    <option value="all">All</option>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-text-secondary text-[14px]">
              Showing {filteredListings.length} {filteredListings.length === 1 ? 'resource' : 'resources'}
            </p>
          </div>

          {/* Listings Grid */}
          {filteredListings.length === 0 ? (
            <div className="bg-surface border border-border rounded-lg p-12 text-center">
              <p className="text-text-secondary text-[15px]">
                No resources found matching your filters. Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                  onClick={() => navigate(`/listing/${listing.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <CategoryBadge category={listing.category} />
                    <StatusBadge status={listing.status} type="availability" />
                  </div>
                  
                  <h3 className="mb-2 line-clamp-2">{listing.title}</h3>
                  
                  <p className="text-text-secondary text-[14px] mb-4 line-clamp-2">
                    {listing.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-text-secondary">by {listing.ownerName}</span>
                    {listing.isPaid && listing.price && (
                      <span className="font-medium text-primary">${listing.price}</span>
                    )}
                    {!listing.isPaid && (
                      <span className="font-medium text-green-600">Free</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Navbar } from '../components/Navbar';
import { getCurrentUser, getListings, getRequests } from '../utils/mockData';
import { User, Package, Send, CheckCircle } from 'lucide-react';

export function Profile() {
  const currentUser = getCurrentUser();
  const listings = getListings();
  const requests = getRequests();

  if (!currentUser) {
    return null;
  }

  const myListings = listings.filter(l => l.ownerId === currentUser.id);
  const myRequests = requests.filter(r => r.requesterId === currentUser.id);
  const completedRequests = myRequests.filter(r => r.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-[900px] mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="mb-2">Profile</h1>
            <p className="text-text-secondary text-[15px]">
              Your account information and activity
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Information */}
            <div className="bg-surface border border-border rounded-lg p-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="mb-1">{currentUser.name}</h2>
                  <p className="text-text-secondary text-[15px] mb-4">{currentUser.email}</p>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded text-[14px] font-medium">
                    {currentUser.communityName}
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-semibold">{myListings.length}</div>
                </div>
                <div className="text-text-secondary text-[14px]">
                  Resources Shared
                </div>
              </div>

              <div className="bg-surface border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Send className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-semibold">{myRequests.length}</div>
                </div>
                <div className="text-text-secondary text-[14px]">
                  Requests Sent
                </div>
              </div>

              <div className="bg-surface border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-semibold">{completedRequests.length}</div>
                </div>
                <div className="text-text-secondary text-[14px]">
                  Completed Exchanges
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-surface border border-border rounded-lg p-8">
              <h3 className="mb-6">Account Details</h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between py-3 border-b border-border">
                  <div>
                    <div className="text-[14px] font-medium mb-1">Full Name</div>
                    <div className="text-text-secondary text-[14px]">{currentUser.name}</div>
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

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-blue-900 mb-2">Platform Information</h3>
              <p className="text-blue-800 text-[14px] leading-relaxed">
                This is a demo version using local storage for data persistence. 
                In a production environment, all data would be securely stored in a database 
                and synchronized across devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

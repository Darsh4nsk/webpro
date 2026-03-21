// Core data types for the platform

export type Category = 'physical' | 'digital' | 'service';

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export type AvailabilityStatus = 'available' | 'unavailable';

export interface Community {
  id: string;
  name: string;
  type: string; // e.g., "College", "University"
}

export interface User {
  id: string;
  name: string;
  email: string;
  communityId: string;
  communityName: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: Category;
  isPaid: boolean;
  price?: number;
  conditions: string;
  status: AvailabilityStatus;
  ownerId: string;
  ownerName: string;
  communityId: string;
  communityName: string;
  createdAt: string;
}

export interface Request {
  id: string;
  listingId: string;
  listingTitle: string;
  requesterId: string;
  requesterName: string;
  ownerId: string;
  status: RequestStatus;
  createdAt: string;
  message?: string;
}

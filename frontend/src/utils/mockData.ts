// Mock data for development - will be replaced with real API calls later

import { Community, User, Listing, Request } from '../app/types';

export const mockCommunities: Community[] = [
  { id: '1', name: 'MIT', type: 'University' },
  { id: '2', name: 'Stanford University', type: 'University' },
  { id: '3', name: 'Harvard University', type: 'University' },
  { id: '4', name: 'UC Berkeley', type: 'University' },
];

export const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Introduction to Algorithms (CLRS)',
    description: 'Third edition textbook in excellent condition. Perfect for algorithms course.',
    category: 'physical',
    isPaid: false,
    conditions: 'Return within 2 weeks, handle with care',
    status: 'available',
    ownerId: '2',
    ownerName: 'Sarah Chen',
    communityId: '1',
    communityName: 'MIT',
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'CS101 Lecture Notes - Complete Semester',
    description: 'Comprehensive handwritten notes from Professor Johnson\'s class. Covers all topics.',
    category: 'digital',
    isPaid: false,
    conditions: 'Do not redistribute',
    status: 'available',
    ownerId: '3',
    ownerName: 'Alex Kumar',
    communityId: '1',
    communityName: 'MIT',
    createdAt: '2026-02-18T14:30:00Z',
  },
  {
    id: '3',
    title: 'Python Tutoring - Beginner to Advanced',
    description: 'Offering personalized Python tutoring sessions. 3 years of teaching experience.',
    category: 'service',
    isPaid: true,
    price: 25,
    conditions: 'Online sessions via Zoom, 1 hour minimum',
    status: 'available',
    ownerId: '4',
    ownerName: 'Emily Rodriguez',
    communityId: '1',
    communityName: 'MIT',
    createdAt: '2026-02-15T09:00:00Z',
  },
  {
    id: '4',
    title: 'Scientific Calculator (TI-84)',
    description: 'Barely used graphing calculator. All functions working perfectly.',
    category: 'physical',
    isPaid: false,
    conditions: 'Return after exam week',
    status: 'unavailable',
    ownerId: '2',
    ownerName: 'Sarah Chen',
    communityId: '1',
    communityName: 'MIT',
    createdAt: '2026-02-10T16:00:00Z',
  },
  {
    id: '5',
    title: 'Data Structures Exam Prep Materials',
    description: 'Practice problems, solutions, and study guides. Helped me ace the exam!',
    category: 'digital',
    isPaid: false,
    conditions: 'Credit the source if sharing further',
    status: 'available',
    ownerId: '5',
    ownerName: 'Michael Park',
    communityId: '1',
    communityName: 'MIT',
    createdAt: '2026-02-12T11:00:00Z',
  },
  {
    id: '6',
    title: 'Photography Services for Events',
    description: 'Professional event photography. Portfolio available on request.',
    category: 'service',
    isPaid: true,
    price: 100,
    conditions: '2 hours minimum, editing included',
    status: 'available',
    ownerId: '6',
    ownerName: 'Jessica Lin',
    communityId: '1',
    communityName: 'MIT',
    createdAt: '2026-02-08T13:00:00Z',
  },
];

export const mockRequests: Request[] = [
  {
    id: '1',
    listingId: '4',
    listingTitle: 'Scientific Calculator (TI-84)',
    requesterId: '1',
    requesterName: 'Current User',
    ownerId: '2',
    status: 'approved',
    createdAt: '2026-02-22T10:00:00Z',
    message: 'Need it for the calculus exam next week',
  },
  {
    id: '2',
    listingId: '1',
    listingTitle: 'Introduction to Algorithms (CLRS)',
    requesterId: '7',
    requesterName: 'David Kim',
    ownerId: '1',
    status: 'pending',
    createdAt: '2026-02-24T14:00:00Z',
    message: 'Would love to borrow this for the semester project',
  },
];

// Helper functions for localStorage management
const STORAGE_KEYS = {
  USER: 'crsp_current_user',
  LISTINGS: 'crsp_listings',
  REQUESTS: 'crsp_requests',
};

export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  return userJson ? JSON.parse(userJson) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

export function getListings(): Listing[] {
  const listingsJson = localStorage.getItem(STORAGE_KEYS.LISTINGS);
  return listingsJson ? JSON.parse(listingsJson) : mockListings;
}

export function setListings(listings: Listing[]): void {
  localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
}

export function getRequests(): Request[] {
  const requestsJson = localStorage.getItem(STORAGE_KEYS.REQUESTS);
  return requestsJson ? JSON.parse(requestsJson) : mockRequests;
}

export function setRequests(requests: Request[]): void {
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
}

export function addListing(listing: Omit<Listing, 'id' | 'createdAt'>): Listing {
  const listings = getListings();
  const newListing: Listing = {
    ...listing,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  listings.unshift(newListing);
  setListings(listings);
  return newListing;
}

export function updateListing(id: string, updates: Partial<Listing>): void {
  const listings = getListings();
  const index = listings.findIndex(l => l.id === id);
  if (index !== -1) {
    listings[index] = { ...listings[index], ...updates };
    setListings(listings);
  }
}

export function addRequest(request: Omit<Request, 'id' | 'createdAt'>): Request {
  const requests = getRequests();
  const newRequest: Request = {
    ...request,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  requests.unshift(newRequest);
  setRequests(requests);
  return newRequest;
}

export function updateRequest(id: string, updates: Partial<Request>): void {
  const requests = getRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index !== -1) {
    requests[index] = { ...requests[index], ...updates };
    setRequests(requests);
  }
}

export function logout(): void {
  setCurrentUser(null);
}

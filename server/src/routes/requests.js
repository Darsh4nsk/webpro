import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getUserProfile } from '../profile.js';
import {
  readResourcesSync,
  readRequestsSync,
  mutateResourcesAndRequests,
} from '../store/csvStore.js';
import { sendRouteError } from '../routeError.js';
import { getExistingUserUids } from '../userExistence.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const profile = await getUserProfile(req.uid);
    if (!profile) {
      return res.status(403).json({ error: 'Complete your profile first.' });
    }
    const role = req.query.role;
    if (role !== 'incoming' && role !== 'outgoing') {
      return res.status(400).json({ error: 'Query role=incoming or role=outgoing is required' });
    }

    const allListings = readResourcesSync();
    const listingByIdAll = new Map(allListings.map((l) => [l.id, l]));

    const requestsAll = readRequestsSync();
    // Candidate requests for this user+role, only if the referenced listing exists.
    const candidateRequests = requestsAll.filter((r) => {
      const listing = listingByIdAll.get(r.listingId);
      if (!listing) return false;
      if (role === 'incoming') return r.ownerId === req.uid;
      return r.requesterId === req.uid;
    });

    // Remove requests for listings whose owner doesn't exist in Firebase.
    const ownerIds = [...new Set(candidateRequests.map((r) => String(listingByIdAll.get(r.listingId)?.ownerId ?? '')))].filter(Boolean);
    const existingOwners = await getExistingUserUids(ownerIds);
    const invalidListingIds = new Set(
      candidateRequests
        .filter((r) => {
          const listing = listingByIdAll.get(r.listingId);
          return listing ? !existingOwners.has(String(listing.ownerId ?? '')) : true;
        })
        .map((r) => r.listingId)
    );

    // Validate requester + owner for the candidate requests.
    const uidsToCheck = [
      ...new Set(
        candidateRequests.flatMap((r) => [
          String(r.requesterId ?? ''),
          String(r.ownerId ?? ''),
        ])
      ),
    ].filter(Boolean);
    const existingUsers = await getExistingUserUids(uidsToCheck);

    const validRequests = candidateRequests.filter((r) => {
      // Must reference a listing whose owner exists.
      if (invalidListingIds.has(r.listingId)) return false;
      // Must reference users that exist.
      return (
        existingUsers.has(String(r.requesterId ?? '')) && existingUsers.has(String(r.ownerId ?? ''))
      );
    });

    const invalidRequestIds = new Set(
      candidateRequests
        .filter((r) => !validRequests.some((vr) => vr.id === r.id))
        .map((r) => r.id)
    );

    if (invalidListingIds.size > 0 || invalidRequestIds.size > 0) {
      await mutateResourcesAndRequests(async ({ listings, requests }) => {
        const nextListings = invalidListingIds.size > 0
          ? listings.filter((l) => !invalidListingIds.has(l.id))
          : listings;
        const nextRequests = invalidRequestIds.size > 0
          ? requests.filter((r) => !invalidRequestIds.has(r.id))
          : requests;
        return { listings: nextListings, requests: nextRequests };
      });
    }

    res.json(validRequests);
  } catch (e) {
    sendRouteError(res, e, 'Failed to load requests');
  }
});

router.post('/listing/:listingId', async (req, res) => {
  try {
    const profile = await getUserProfile(req.uid);
    if (!profile) {
      return res.status(403).json({ error: 'Complete your profile first.' });
    }
    const { listingId } = req.params;
    const { message } = req.body || {};

    let created;
    await mutateResourcesAndRequests(async ({ listings, requests }) => {
      const listing = listings.find((l) => l.id === listingId);
      if (!listing) {
        throw Object.assign(new Error('Not found'), { statusCode: 404 });
      }
      if (listing.ownerId === req.uid) {
        throw Object.assign(new Error('Cannot request own listing'), { statusCode: 400 });
      }
      if (listing.status !== 'available') {
        throw Object.assign(new Error('Listing unavailable'), { statusCode: 400 });
      }
      const open = requests.some(
        (r) =>
          r.listingId === listingId &&
          r.requesterId === req.uid &&
          (r.status === 'pending' || r.status === 'approved')
      );
      if (open) {
        throw Object.assign(new Error('Already requested'), { statusCode: 400 });
      }

      created = {
        id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        listingId,
        listingTitle: listing.title,
        requesterId: req.uid,
        requesterName: profile.name,
        ownerId: listing.ownerId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        message: message ? String(message) : undefined,
      };
      requests.unshift(created);
      return { listings, requests };
    });

    res.status(201).json(created);
  } catch (e) {
    if (e.statusCode) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    sendRouteError(res, e, 'Failed to create request');
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const profile = await getUserProfile(req.uid);
    if (!profile) {
      return res.status(403).json({ error: 'Complete your profile first.' });
    }
    const { action } = req.body;
    if (!['approve', 'reject', 'complete'].includes(action)) {
      return res.status(400).json({ error: 'action must be approve, reject, or complete' });
    }

    const out = await mutateResourcesAndRequests(async ({ listings, requests }) => {
      const ri = requests.findIndex((r) => r.id === req.params.id);
      if (ri === -1) throw Object.assign(new Error('Not found'), { statusCode: 404 });
      const reqRow = requests[ri];
      const listing = listings.find((l) => l.id === reqRow.listingId);
      if (!listing) {
        throw Object.assign(new Error('Not found'), { statusCode: 404 });
      }
      if (reqRow.ownerId !== req.uid) {
        throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
      }

      if (action === 'approve') {
        if (reqRow.status !== 'pending') {
          throw Object.assign(new Error('Invalid state'), { statusCode: 400 });
        }
        reqRow.status = 'approved';
        const li = listings.findIndex((l) => l.id === listing.id);
        if (li !== -1) listings[li] = { ...listings[li], status: 'unavailable' };
      } else if (action === 'reject') {
        if (reqRow.status !== 'pending') {
          throw Object.assign(new Error('Invalid state'), { statusCode: 400 });
        }
        reqRow.status = 'rejected';
      } else if (action === 'complete') {
        if (reqRow.status !== 'approved') {
          throw Object.assign(new Error('Invalid state'), { statusCode: 400 });
        }
        reqRow.status = 'completed';
        const li = listings.findIndex((l) => l.id === listing.id);
        if (li !== -1) listings[li] = { ...listings[li], status: 'available' };
      }
      requests[ri] = reqRow;
      return { listings, requests };
    });

    const updated = out.requests.find((r) => r.id === req.params.id);
    res.json(updated);
  } catch (e) {
    if (e.statusCode) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    sendRouteError(res, e, 'Failed to update request');
  }
});

export default router;

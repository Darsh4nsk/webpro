import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getUserProfile } from '../profile.js';
import {
  readResourcesSync,
  mutateResources,
} from '../store/csvStore.js';
import { sendRouteError } from '../routeError.js';
import { getExistingUserUids } from '../userExistence.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const profile = await getUserProfile(req.uid);
    if (!profile) {
      return res.status(403).json({ error: 'Complete your profile (community) in the app first.' });
    }
    const all = readResourcesSync();

    // Show listings across communities, but only keep rows whose owner exists in Firebase.
    const ownerIds = [...new Set(all.map((l) => String(l.ownerId ?? '')))].filter(Boolean);
    const existingOwners = await getExistingUserUids(ownerIds);

    const validListings = all.filter((l) => existingOwners.has(String(l.ownerId ?? '')));
    const invalidListingIds = new Set(all.filter((l) => !existingOwners.has(String(l.ownerId ?? ''))).map((l) => l.id));

    if (invalidListingIds.size > 0) {
      await mutateResources(async (listings) => listings.filter((l) => !invalidListingIds.has(l.id)));
    }

    res.json(validListings);
  } catch (e) {
    sendRouteError(res, e, 'Failed to load listings');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const profile = await getUserProfile(req.uid);
    if (!profile) {
      return res.status(403).json({ error: 'Complete your profile first.' });
    }
    const all = readResourcesSync();
    const listing = all.find((l) => l.id === req.params.id);
    if (!listing) return res.status(404).json({ error: 'Not found' });

    const existingOwners = await getExistingUserUids([String(listing.ownerId ?? '')]);
    if (!existingOwners.has(String(listing.ownerId ?? ''))) {
      // Delete stale listing from CSV.
      await mutateResources(async (listings) => listings.filter((l) => l.id !== listing.id));
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(listing);
  } catch (e) {
    sendRouteError(res, e, 'Failed to load listing');
  }
});

router.post('/', async (req, res) => {
  try {
    const profile = await getUserProfile(req.uid);
    if (!profile) {
      return res.status(403).json({ error: 'Complete your profile first.' });
    }
    const { title, description, category, isPaid, price, conditions } = req.body;
    if (!title || !description || !conditions || !category) {
      return res.status(400).json({ error: 'title, description, category, and conditions are required' });
    }
    const paid = Boolean(isPaid);
    if (paid && (price == null || Number(price) <= 0)) {
      return res.status(400).json({ error: 'Valid price required when isPaid is true' });
    }

    const newListing = {
      id: `l-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: String(title),
      description: String(description),
      category,
      isPaid: paid,
      price: paid ? Number(price) : undefined,
      conditions: String(conditions),
      status: 'available',
      ownerId: req.uid,
      ownerName: profile.name,
      communityId: profile.communityId,
      communityName: profile.communityName,
      createdAt: new Date().toISOString(),
    };

    await mutateResources(async (listings) => {
      listings.unshift(newListing);
      return listings;
    });

    res.status(201).json(newListing);
  } catch (e) {
    sendRouteError(res, e, 'Failed to create listing');
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const profile = await getUserProfile(req.uid);
    if (!profile) {
      return res.status(403).json({ error: 'Complete your profile first.' });
    }
    const { status, title, description, category, isPaid, price, conditions } = req.body;
    const updated = await mutateResources(async (listings) => {
      const i = listings.findIndex((l) => l.id === req.params.id);
      if (i === -1) {
        throw Object.assign(new Error('Not found'), { statusCode: 404 });
      }
      const listing = listings[i];
      if (listing.ownerId !== req.uid) {
        throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
      }
      if (status !== undefined) listing.status = status;
      if (title !== undefined) listing.title = title;
      if (description !== undefined) listing.description = description;
      if (category !== undefined) listing.category = category;
      if (isPaid !== undefined) listing.isPaid = Boolean(isPaid);
      if (price !== undefined) listing.price = price === '' || price == null ? undefined : Number(price);
      if (conditions !== undefined) listing.conditions = conditions;
      listings[i] = listing;
      return listings;
    });
    const listing = updated.find((l) => l.id === req.params.id);
    if (!listing) return res.status(404).json({ error: 'Not found' });
    if (listing.ownerId !== req.uid) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(listing);
  } catch (e) {
    if (e.statusCode === 403) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (e.statusCode === 404) {
      return res.status(404).json({ error: 'Not found' });
    }
    sendRouteError(res, e, 'Failed to update listing');
  }
});

export default router;

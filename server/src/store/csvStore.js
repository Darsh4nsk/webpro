import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', '..', 'data');
const RESOURCES_PATH = join(DATA_DIR, 'resources.csv');
const REQUESTS_PATH = join(DATA_DIR, 'requests.csv');

const LISTING_COLUMNS = [
  'id',
  'title',
  'description',
  'category',
  'isPaid',
  'price',
  'conditions',
  'status',
  'ownerId',
  'ownerName',
  'communityId',
  'communityName',
  'createdAt',
];

const REQUEST_COLUMNS = [
  'id',
  'listingId',
  'listingTitle',
  'requesterId',
  'requesterName',
  'ownerId',
  'status',
  'createdAt',
  'message',
];

const queue = [];
let busy = false;

function processQueue() {
  if (busy || queue.length === 0) return;
  busy = true;
  const { fn, resolve, reject } = queue.shift();
  Promise.resolve(fn())
    .then(resolve, reject)
    .finally(() => {
      busy = false;
      processQueue();
    });
}

function withLock(fn) {
  return new Promise((resolve, reject) => {
    queue.push({
      fn,
      resolve,
      reject,
    });
    processQueue();
  });
}

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function parseListings(text) {
  if (!text.trim()) return [];
  const rows = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    isPaid: row.isPaid === 'true' || row.isPaid === true,
    price: row.price === '' || row.price == null ? undefined : Number(row.price),
    conditions: row.conditions,
    status: row.status,
    ownerId: row.ownerId,
    ownerName: row.ownerName,
    communityId: row.communityId != null ? String(row.communityId).trim() : '',
    communityName: row.communityName != null ? String(row.communityName).trim() : '',
    createdAt: row.createdAt,
  }));
}

function parseRequests(text) {
  if (!text.trim()) return [];
  const rows = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return rows.map((row) => ({
    id: row.id,
    listingId: row.listingId,
    listingTitle: row.listingTitle,
    requesterId: row.requesterId,
    requesterName: row.requesterName,
    ownerId: row.ownerId,
    status: row.status,
    createdAt: row.createdAt,
    message: row.message || undefined,
  }));
}

function listingToRow(l) {
  return {
    id: l.id,
    title: l.title,
    description: l.description,
    category: l.category,
    isPaid: String(l.isPaid),
    price: l.price === undefined || l.price === null ? '' : String(l.price),
    conditions: l.conditions,
    status: l.status,
    ownerId: l.ownerId != null ? String(l.ownerId).trim() : '',
    ownerName: l.ownerName != null ? String(l.ownerName).trim() : '',
    communityId: l.communityId != null ? String(l.communityId).trim() : '',
    communityName: l.communityName != null ? String(l.communityName).trim() : '',
    createdAt: l.createdAt,
  };
}

function requestToRow(r) {
  return {
    id: r.id,
    listingId: r.listingId,
    listingTitle: r.listingTitle,
    requesterId: r.requesterId != null ? String(r.requesterId).trim() : '',
    requesterName: r.requesterName != null ? String(r.requesterName).trim() : '',
    ownerId: r.ownerId != null ? String(r.ownerId).trim() : '',
    status: r.status,
    createdAt: r.createdAt,
    message: r.message ?? '',
  };
}

export function readResourcesSync() {
  try {
    ensureDataDir();
    if (!existsSync(RESOURCES_PATH)) return [];
    const text = readFileSync(RESOURCES_PATH, 'utf8');
    return parseListings(text);
  } catch (e) {
    console.error('Failed to read or parse resources.csv', e);
    return [];
  }
}

export function writeResourcesSync(listings) {
  ensureDataDir();
  const rows = listings.map(listingToRow);
  const out = stringify(rows, {
    header: true,
    columns: LISTING_COLUMNS,
    quoted: true,
    quoted_empty: false,
  });
  writeFileSync(RESOURCES_PATH, out, 'utf8');
}

export function readRequestsSync() {
  try {
    ensureDataDir();
    if (!existsSync(REQUESTS_PATH)) return [];
    const text = readFileSync(REQUESTS_PATH, 'utf8');
    return parseRequests(text);
  } catch (e) {
    console.error('Failed to read or parse requests.csv', e);
    return [];
  }
}

export function writeRequestsSync(requests) {
  ensureDataDir();
  const rows = requests.map(requestToRow);
  const out = stringify(rows, {
    header: true,
    columns: REQUEST_COLUMNS,
    quoted: true,
    quoted_empty: false,
  });
  writeFileSync(REQUESTS_PATH, out, 'utf8');
}

export async function mutateResources(mutator) {
  return withLock(async () => {
    const listings = readResourcesSync();
    const next = await mutator([...listings]);
    writeResourcesSync(next);
    return next;
  });
}

export async function mutateRequests(mutator) {
  return withLock(async () => {
    const requests = readRequestsSync();
    const next = await mutator([...requests]);
    writeRequestsSync(next);
    return next;
  });
}

export async function mutateResourcesAndRequests(mutator) {
  return withLock(async () => {
    const listings = readResourcesSync();
    const requests = readRequestsSync();
    const result = await mutator({
      listings: [...listings],
      requests: [...requests],
    });
    if (result.listings) writeResourcesSync(result.listings);
    if (result.requests) writeRequestsSync(result.requests);
    return result;
  });
}

export { RESOURCES_PATH, REQUESTS_PATH, DATA_DIR };

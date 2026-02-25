import { verifyToken } from '@clerk/backend';

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

/**
 * Returns true if the request carries a valid Clerk JWT.
 * Falls back to open mode in dev when CLERK_SECRET_KEY is not set.
 */
export async function getClerkUserId(req) {
  if (!CLERK_SECRET_KEY) {
    return process.env.NODE_ENV === 'production' ? null : 'dev_user';
  }
  const authHeader = req.headers?.['authorization'];
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    const payload = await verifyToken(authHeader.slice(7), { secretKey: CLERK_SECRET_KEY });
    return payload.sub;
  } catch {
    return null;
  }
}

export async function isAuthorized(req) {
  return (await getClerkUserId(req)) !== null;
}

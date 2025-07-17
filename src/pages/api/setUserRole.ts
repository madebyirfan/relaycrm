import type { VercelRequest, VercelResponse } from '@vercel/node';
import { adminDb } from '../../firebase/admin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const { uid, role } = req.body;

  if (!uid || !role) return res.status(400).json({ error: 'Missing uid or role' });

  try {
    await adminDb.collection('userRoles').doc(uid).set({ role });
    return res.status(200).json({ message: 'Role set successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to set role' });
  }
}

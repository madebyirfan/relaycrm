import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.REACT_APP_FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.REACT_APP_FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { uid, role } = req.body;

  if (!uid || !role) return res.status(400).json({ error: 'Missing uid or role' });

  try {
    await db.collection('userRoles').doc(uid).set({ role });
    return res.status(200).json({ message: 'Role set successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error' });
  }
}

'use client';

import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebase/config';
import { Loader2, Users } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  createdAt?: string;
}

const AdminClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const db = getFirestore(app);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'clients'));
        const clientsData: Client[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Client, 'id'>),
        }));
        setClients(clientsData);
      } catch (err: any) {
        console.error('Failed to fetch clients:', err);
        setError('Failed to load clients.');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [db]);

  return (
    <div className="p-6">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
        <Users className="w-6 h-6" />
        Admin – Manage Clients
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400">{error}</p>
      ) : clients.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No clients found.</p>
      ) : (
        <div className="overflow-x-auto rounded shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm text-left text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Created At</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-2">{client.name}</td>
                  <td className="px-4 py-2">{client.email}</td>
                  <td className="px-4 py-2">{client.company || '-'}</td>
                  <td className="px-4 py-2">
                    {client.createdAt
                      ? new Date(client.createdAt).toLocaleDateString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminClientsPage;

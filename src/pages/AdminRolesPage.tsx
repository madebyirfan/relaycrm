// src/pages/AdminRolesPage.tsx
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { app } from '../firebase/config'; // ensure this is your Firebase config file
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Button
} from '../components/ui/button';
import {
  Input
} from '../components/ui/input';
import { TrashIcon } from 'lucide-react';

const db = getFirestore(app);

type Role = {
  id: string;
  name: string;
};

const AdminRolesPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'roles'));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
    setLoading(false);
  };

  const handleAddRole = async () => {
    if (!newRole.trim()) return;
    try {
      const docRef = await addDoc(collection(db, 'roles'), { name: newRole });
      setRoles([...roles, { id: docRef.id, name: newRole }]);
      setNewRole('');
    } catch (error) {
      console.error('Error adding role:', error);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'roles', id));
      setRoles(roles.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 bg-white dark:bg-black text-black dark:text-white">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Admin – Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                placeholder="Enter new role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              />
              <Button onClick={handleAddRole}>Add Role</Button>
            </div>

            {loading ? (
              <p className="text-center text-gray-500 dark:text-gray-400">Loading roles…</p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {roles.map((role) => (
                  <li key={role.id} className="flex items-center justify-between py-2">
                    <span>{role.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRole(role.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRolesPage;

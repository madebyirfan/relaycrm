'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Loader2, PlusCircle } from 'lucide-react';
import { Dialog } from '@headlessui/react';

interface Project {
  id: string;
  title: string;
  client: string;
  clientLogo?: string;
  description?: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  dueDate: string;
}

const AdminProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'projects'));
        const fetchedProjects = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Project, 'id'>),
        }));
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects
    .filter((project) =>
      statusFilter === 'All' ? true : project.status === statusFilter
    )
    .sort((a, b) =>
      sortBy === 'asc'
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    );

  return (
    <div className="min-h-screen px-4 py-6 md:px-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin - Assigned Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          <PlusCircle className="w-4 h-4" />
          Assign Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md dark:bg-gray-800"
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'asc' | 'desc')}
          className="px-3 py-2 border rounded-md dark:bg-gray-800"
        >
          <option value="asc">Sort by Due Date ↑</option>
          <option value="desc">Sort by Due Date ↓</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="animate-spin h-8 w-8 text-gray-600 dark:text-gray-300" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No projects found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-300">
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    {project.clientLogo && (
                      <img
                        src={project.clientLogo}
                        alt={`${project.client} Logo`}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span>{project.client}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{project.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {project.description}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        project.status === 'Completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : project.status === 'In Progress'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                          : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{project.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal - Project Assignment */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
          <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Assign New Project
            </Dialog.Title>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // handle submission
                setIsModalOpen(false);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Project Title"
                required
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700"
              />
              <input
                type="text"
                placeholder="Client Name"
                required
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700"
              />
              <select
                required
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700"
              >
                <option value="">Select Status</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
              <input
                type="date"
                required
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700"
              />
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Assign
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminProjectsPage;

'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Card, Spin, Empty, Tag, Progress } from 'antd';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  deadline?: string;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData: Project[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Project, 'id'>),
      }));
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const statusColor = {
    'not-started': 'red',
    'in-progress': 'blue',
    'completed': 'green',
  };

  return (
    <div className="p-6 dark:bg-black min-h-screen transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Assigned Projects</h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Empty
            description={<span className="text-black dark:text-gray-300">No projects found</span>}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              title={
                <span className="text-black dark:text-white font-semibold">{project.name}</span>
              }
              bordered
              className="shadow-md dark:bg-neutral-900 dark:border-gray-700 dark:text-white"
              extra={
                <Tag color={statusColor[project.status]} className="capitalize">
                  {project.status}
                </Tag>
              }
            >
              <p className="text-gray-800 dark:text-gray-300">{project.description}</p>
              <div className="mt-3">
                <Progress percent={project.progress} status={project.status === 'completed' ? 'success' : 'active'} />
              </div>
              {project.deadline && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Deadline: {project.deadline}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;

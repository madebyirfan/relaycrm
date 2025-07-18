'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  Timestamp,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  Card,
  Spin,
  Empty,
  Button,
  Modal,
  Input,
  Select,
  DatePicker,
  message,
} from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDate: null as null | dayjs.Dayjs,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'tasks'),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const taskList: Task[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Task, 'id'>),
        }));
        setTasks(taskList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
        message.error('Failed to load tasks.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddTask = async () => {
    const { title, description, status, dueDate } = formData;

    if (!title || !description) {
      return message.warning('Title and Description are required.');
    }

    try {
      await addDoc(collection(db, 'tasks'), {
        title,
        description,
        status,
        dueDate: dueDate ? dayjs(dueDate).format('YYYY-MM-DD') : null,
        createdAt: Timestamp.now(),
      });

      message.success('Task added successfully');
      setModalVisible(false);
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        dueDate: null,
      });
    } catch (error) {
      console.error('Error adding task:', error);
      message.error('Failed to add task');
    }
  };

  return (
    <div className="p-6 dark:bg-black min-h-screen transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">Your Tasks</h1>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          Add Task
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Empty
            description={<span className="text-black dark:text-gray-300">No tasks available</span>}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Card
              key={task.id}
              title={<span className="text-black dark:text-white">{task.title}</span>}
              bordered
              className="shadow-md dark:bg-neutral-900 dark:border-gray-700 dark:text-white"
              extra={
                <span className="capitalize text-xs dark:text-gray-300 text-gray-600">
                  {task.status}
                </span>
              }
            >
              <p className="text-gray-800 dark:text-gray-200">{task.description}</p>
              {task.dueDate && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Due: {task.dueDate}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal
        title="Add New Task"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleAddTask}
        okText="Add Task"
      >
        <Input
          placeholder="Task Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mb-3"
        />
        <TextArea
          placeholder="Task Description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mb-3"
        />
        <Select
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: value })}
          className="mb-3 w-full"
        >
          <Option value="pending">Pending</Option>
          <Option value="in-progress">In Progress</Option>
          <Option value="completed">Completed</Option>
        </Select>
        <DatePicker
          className="w-full"
          placeholder="Select Due Date (optional)"
          value={formData.dueDate}
          onChange={(date) => setFormData({ ...formData, dueDate: date })}
        />
      </Modal>
    </div>
  );
};

export default TasksPage;

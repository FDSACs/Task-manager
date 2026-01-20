
import { Task, TaskStatus } from '../types';

const STORAGE_KEY = 'sacs_tasks_v1';

export const taskService = {
  getTasks: (): Task[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to read from localStorage", error);
      return [];
    }
  },

  saveTasks: (tasks: Task[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save to localStorage", error);
    }
  },

  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const tasks = taskService.getTasks();
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    const updated = [...tasks, newTask];
    taskService.saveTasks(updated);
    return newTask;
  },

  updateTaskStatus: (taskId: string, status: TaskStatus): Task[] => {
    const tasks = taskService.getTasks();
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status } : t);
    taskService.saveTasks(updatedTasks);
    return updatedTasks;
  },

  deleteTask: (taskId: string): Task[] => {
    const tasks = taskService.getTasks();
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    taskService.saveTasks(updatedTasks);
    return updatedTasks;
  }
};

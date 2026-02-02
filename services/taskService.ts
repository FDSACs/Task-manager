import { Task, TaskStatus } from '../types';

const STORAGE_KEY = 'zenith_tasks';

export const taskService = {
  // 1. Fetch all tasks from LocalStorage
  getTasks: (): Task[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // 2. Save the entire task array to LocalStorage
  saveTasks: (tasks: Task[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  // 3. Create a new task with a random ID and timestamp
  addTask: (task: Omit<Task, 'id' | 'createdAt'>): Task => {
    const tasks = taskService.getTasks();
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    taskService.saveTasks([...tasks, newTask]);
    return newTask;
  },

  /**
   * NEW: Generic update function.
   * This is what saves your Map Pin location!
   * It finds the task by ID and replaces it with the updated version.
   */
  updateTask: (updatedTask: Task): Task[] => {
    const tasks = taskService.getTasks();
    const updatedTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    taskService.saveTasks(updatedTasks);
    return updatedTasks;
  },

  // 4. Specifically update just the status (column) of a task
  updateTaskStatus: (taskId: string, status: TaskStatus): Task[] => {
    const tasks = taskService.getTasks();
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status } : t);
    taskService.saveTasks(updatedTasks);
    return updatedTasks;
  },

  // 5. Remove a task by ID
  deleteTask: (taskId: string): Task[] => {
    const tasks = taskService.getTasks();
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    taskService.saveTasks(updatedTasks);
    return updatedTasks;
  }
};
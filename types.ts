
export type Priority = 'Urgent' | 'Non-Urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: number;
}

export interface ColumnData {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

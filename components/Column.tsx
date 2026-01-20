
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { Task, TaskStatus } from '../types';

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
}

const Column: React.FC<ColumnProps> = ({ id, title, tasks, onDeleteTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const getBgColor = () => {
    switch (id) {
      case 'todo': return 'bg-gray-100 dark:bg-slate-800/40';
      case 'in-progress': return 'bg-blue-50 dark:bg-blue-900/10';
      case 'completed': return 'bg-green-50 dark:bg-green-900/10';
      default: return 'bg-gray-100';
    }
  };

  const getBorderColor = () => {
    if (isOver) return 'border-blue-500 shadow-xl';
    switch (id) {
      case 'todo': return 'border-gray-200 dark:border-slate-700';
      case 'in-progress': return 'border-blue-200 dark:border-blue-900/30';
      case 'completed': return 'border-green-200 dark:border-green-900/30';
    }
  };

  const getBadgeColor = () => {
    switch (id) {
      case 'todo': return 'bg-gray-400 dark:bg-slate-600';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
    }
  };

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col min-h-[600px] rounded-2xl border-2 transition-all duration-200 p-4 ${getBgColor()} ${getBorderColor()}`}
    >
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-xl font-bold tracking-tight uppercase flex items-center gap-2">
          {title}
          <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${getBadgeColor()}`}>
            {tasks.length}
          </span>
        </h2>
        <div className="h-1 w-12 rounded-full opacity-50 bg-current"></div>
      </div>

      <div className="flex flex-col gap-4">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center opacity-40">
            <i className="fa-solid fa-box-open text-2xl mb-2"></i>
            <p className="text-sm font-medium">Empty Column</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;

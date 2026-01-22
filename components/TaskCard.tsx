
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const isUrgent = task.priority === 'Urgent';
  
  // Notification check: Due date within 24 hours
  const isDueSoon = () => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate).getTime();
    const now = Date.now();
    const diff = due - now;
    return diff > 0 && diff < 86400000; // 24 hours in ms
  };

  // Apply specific background color based on the task's current status (column)
  const getStatusBg = () => {
    switch (task.status) {
      case 'todo':
        return 'bg-gray-100 dark:bg-slate-700';
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900/40';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/40';
      default:
        return 'bg-white dark:bg-slate-800';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative p-4 rounded-xl shadow-sm hover:shadow-md transition-all border-2 
        ${getStatusBg()}
        ${isUrgent ? 'border-red-500' : 'border-transparent dark:border-slate-600'} 
        ${isDragging ? 'opacity-50 scale-105 ring-2 ring-blue-400 shadow-2xl' : 'opacity-100'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{task.title}</h3>
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="text-slate-400 hover:text-red-500 transition-colors p-1"
          >
            <i className="fa-solid fa-trash-can text-sm"></i>
          </button>
          <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <i className="fa-solid fa-grip-vertical"></i>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
        {task.description || "No description provided."}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md ${
          isDueSoon() ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'text-slate-500 dark:text-slate-400'
        }`}>
          <i className="fa-regular fa-calendar"></i>
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
          {isDueSoon() && <span className="flex h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse ml-1"></span>}
        </div>

        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
          isUrgent 
            ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
            : 'bg-slate-200/50 text-slate-600 border-slate-300 dark:bg-slate-700/50 dark:border-slate-600 dark:text-slate-400'
        }`}>
          {task.priority}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;

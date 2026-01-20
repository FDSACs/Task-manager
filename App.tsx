
import React, { useState, useEffect } from 'react';
import KanbanBoard from './components/KanbanBoard';
import NewTaskModal from './components/NewTaskModal';
import ThemeToggle from './components/ThemeToggle';
import { Task } from './types';
import { taskService } from './services/taskService';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Load tasks on initial mount
  useEffect(() => {
    const savedTasks = taskService.getTasks();
    setTasks(savedTasks);
  }, []);

  // Handle Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = taskService.addTask(newTaskData);
    setTasks(prev => [...prev, newTask]);
    setIsModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = taskService.deleteTask(taskId);
    setTasks(updated);
  };

  const handleUpdateStatus = (taskId: string, newStatus: Task['status']) => {
    const updated = taskService.updateTaskStatus(taskId, newStatus);
    setTasks(updated);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-brand-light dark:bg-brand-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="bg-white dark:bg-white/90 p-3 rounded-xl shadow-sm border border-slate-200">
            <img 
              src="https://www.acs.com.sa/wp-content/uploads/2021/03/ACS-Logo.png" 
              alt="Arabic Computer Systems Logo" 
              className="h-16 md:h-20 w-auto object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-dark dark:text-white flex items-center gap-3">
              SACs Task Management Board
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium text-lg">Manage your tasks efficiently.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle isDark={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
          >
            <i className="fa-solid fa-plus"></i>
            New Task
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <KanbanBoard 
          tasks={tasks} 
          onDeleteTask={handleDeleteTask} 
          onUpdateStatus={handleUpdateStatus} 
        />
      </main>

      {isModalOpen && (
        <NewTaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddTask} 
        />
      )}
      
      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-sm pb-10">
        <p>© {new Date().getFullYear()} Arabic Computer Systems. Hosted on GitHub Pages.</p>
      </footer>
    </div>
  );
};

export default App;

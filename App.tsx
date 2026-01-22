
import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import KanbanBoard from './components/KanbanBoard';
import NewTaskModal from './components/NewTaskModal';
import ThemeToggle from './components/ThemeToggle';
import Login from './components/Login';
import { Task } from './types';
import { taskService } from './services/taskService';
// Fix: Import auth and logout from local service; import firebase for namespaced types
import { auth, logout } from './services/firebase';


const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  // Fix: Use namespaced User type to resolve 'User' export error
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error("Connection to backend failed. Is main.py running?", err);
    }
  };

  useEffect(() => {
    // Fix: Use instance-based onAuthStateChanged to resolve 'onAuthStateChanged' export error
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        loadTasks();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleAddTask = async (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const newTask = await taskService.addTask(newTaskData);
      setTasks(prev => [...prev, newTask]);
      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to save task to server.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      await taskService.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      loadTasks();
      alert("Update failed.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-brand-light dark:bg-brand-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="bg-white dark:bg-white/90 p-3 rounded-xl shadow-sm border border-slate-200">
            <img 
              src="https://www.acs.com.sa/wp-content/uploads/2021/03/ACS-Logo.png" 
              alt="ACS Logo" 
              className="h-14 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
              SACs Task Board
            </h1>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <p className="font-medium text-sm">Welcome, {user.displayName?.split(' ')[0]}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle isDark={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg active:scale-95"
          >
            <i className="fa-solid fa-plus"></i>
            New Task
          </button>
          <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
          <div className="flex items-center gap-3 pl-1">
            <img src={user.photoURL || ''} alt="Profile" className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" />
            <button 
              onClick={logout}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-all"
              title="Logout"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
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
    </div>
  );
};

export default App;

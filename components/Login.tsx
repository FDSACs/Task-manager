
import React from 'react';
import { loginWithGoogle } from '../services/firebase';

const Login: React.FC = () => {
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-dark p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-700 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <img 
              src="./ACS_LOGO.png" 
              alt="ACS Logo" 
              className="h-20 w-auto object-contain"
            />
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Please sign in to access the SACs Task Board</p>
        </div>

        <button 
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 py-4 px-6 rounded-2xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-md active:scale-95 group"
        >
          <img src="./GoogleLogoSignin.png" alt="Google" className="h-6 w-6" />
          Continue with Google
        </button>

        <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
          Arabic Computer Systems Secure Access
        </p>
      </div>
    </div>
  );
};

export default Login;

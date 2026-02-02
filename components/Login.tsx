import React, { useState, useEffect } from 'react';
import { loginWithGoogle, setupRecaptcha, sendOtp } from '../services/firebase';
import acsLogo from '../ACS_LOGO.png'; 
import googleLogo from '../GoogleLogoSignin.png';

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);

  // --- 1. Cleanup reCAPTCHA on Unmount ---
  // This ensures that if the user leaves the page and comes back, 
  // the old reCAPTCHA "widget" is cleared out.
  useEffect(() => {
    return () => {
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber.startsWith('+')) {
      alert("Please enter number in international format (e.g., +966500000000)");
      return;
    }
    
    setIsSending(true);
    try {
      // --- 2. Improved reCAPTCHA Initialization ---
      // We check if it already exists to avoid the "already rendered" error
      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = setupRecaptcha('recaptcha-container');
      }
      
      const appVerifier = (window as any).recaptchaVerifier;
      const result = await sendOtp(phoneNumber, appVerifier);
      
      setConfirmationResult(result);
      alert("Verification code sent!");
    } catch (error: any) {
      console.error(error);
      // If reCAPTCHA fails, we reset it so the user can try again
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.render().then((widgetId: any) => {
          (window as any).grecaptcha.reset(widgetId);
        });
      }
      alert("Failed to send SMS. Please check your number format.");
    }
    setIsSending(false);
  };

  const handleVerifyOtp = async () => {
    try {
      await confirmationResult.confirm(verificationCode);
    } catch (error) {
      alert("Invalid code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-dark p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-700 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <img src={acsLogo} alt="ACS Logo" className="h-20 w-auto object-contain" />
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Secure Access</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Verify your identity to proceed</p>
        </div>

        {/* --- reCAPTCHA Container --- */}
        <div id="recaptcha-container" className="flex justify-center"></div>

        {!confirmationResult ? (
          <div className="space-y-4">
            <input 
              type="tel"
              placeholder="+966 5XXXXXXXX"
              className="w-full p-4 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:text-white dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button 
              onClick={handleSendOtp}
              disabled={isSending}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg active:scale-95"
            >
              {isSending ? "Sending SMS..." : "Get Verification Code"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input 
              type="text"
              placeholder="Enter 6-digit code"
              className="w-full p-4 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:text-white text-center text-2xl tracking-[0.5em] font-bold outline-none focus:ring-2 focus:ring-green-500"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button 
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl hover:bg-green-700 transition-all shadow-lg active:scale-95"
            >
              Verify & Login
            </button>
            <button 
              onClick={() => {
                setConfirmationResult(null);
                setVerificationCode('');
              }}
              className="text-sm text-slate-500 hover:text-blue-600 underline transition-colors"
            >
              Change phone number
            </button>
          </div>
        )}

        <div className="relative flex items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-sm font-bold">OR</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 py-4 px-6 rounded-2xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <img src={googleLogo} alt="Google" className="h-6 w-6" />
          Continue with Google
        </button>

        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
          Arabic Computer Systems Secure Access
        </p>
      </div>
    </div>
  );
};

export default Login;
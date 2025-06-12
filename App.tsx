import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthForm from './components/auth/AuthForm';
import Dashboard from './components/tasks/Dashboard';
import KickOffPage from './components/static/KickOffPage'; // Import KickOffPage
import { APP_NAME } from './constants';
import { Button } from './components/ui/Button';

const App: React.FC = () => {
  const { currentUser, loading, logout } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false); // New state to control AuthForm visibility

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-xl font-semibold text-slate-700">Loading Assistant...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{APP_NAME}</h1>
          {currentUser && (
             <Button 
              onClick={() => {
                logout();
                setShowAuthForm(false); // Reset to show KickOffPage after logout
              }} 
              variant="secondary" 
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </Button>
          )}
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {currentUser ? (
          <Dashboard />
        ) : showAuthForm ? (
          <AuthForm />
        ) : (
          <KickOffPage onGetStarted={() => setShowAuthForm(true)} />
        )}
      </main>
      <footer className="text-center p-4 text-sm text-slate-500 mt-8">
        © {new Date().getFullYear()} {APP_NAME}. AI-Powered Productivity.
      </footer>
    </div>
  );
};

export default App;


import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { login, register, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) { // Basic validation
        setError("Email is required.");
        return;
    }
    // Password validation can be added here if not optional in demo
    // if (!password && !isLogin) { // Password might be required for register
    //     setError("Password is required for registration.");
    //     return;
    // }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full" title={isLogin ? 'Welcome Back!' : 'Create Account'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          {/* Password field is optional for this demo setup based on context, but generally needed */}
          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isLogin ? "Enter your password" : "Create a password (optional for demo)"}
          />
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <Button type="submit" isLoading={loading} className="w-full">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="font-medium text-sm text-slate-600 hover:text-slate-500"
            >
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AuthForm;

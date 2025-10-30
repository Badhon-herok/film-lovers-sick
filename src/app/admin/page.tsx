'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn(email, password);

    if (result.success) {
      router.push('/admin/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div 
        className="max-w-md w-full p-8 rounded-lg border-2"
        style={{ 
          backgroundColor: '#2d2d2d',
          borderColor: '#8b0000'
        }}
      >
        <h1 
          className="text-4xl text-center mb-8"
          style={{ 
            fontFamily: 'var(--font-cinzel)',
            color: '#a40000'
          }}
        >
          Admin Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block mb-2"
              style={{ color: '#c0c0c0' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded border-2 focus:outline-none"
              style={{
                backgroundColor: '#0a0a0a',
                borderColor: '#8b0000',
                color: '#c0c0c0'
              }}
              placeholder="admin@filmlover.com"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block mb-2"
              style={{ color: '#c0c0c0' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded border-2 focus:outline-none"
              style={{
                backgroundColor: '#0a0a0a',
                borderColor: '#8b0000',
                color: '#c0c0c0'
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div 
              className="p-3 rounded text-center"
              style={{ 
                backgroundColor: 'rgba(164, 0, 0, 0.2)',
                color: '#a40000',
                border: '1px solid #a40000'
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded font-bold transition-all"
            style={{
              backgroundColor: '#a40000',
              color: 'white',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Enter the Darkness'}
          </button>
        </form>
      </div>
    </div>
  );
}

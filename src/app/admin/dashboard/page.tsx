'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p style={{ color: '#c0c0c0' }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 
          className="text-5xl"
          style={{ 
            fontFamily: 'var(--font-cinzel)',
            color: '#a40000'
          }}
        >
          Admin Dashboard
        </h1>
        <button
          onClick={handleSignOut}
          className="px-6 py-3 rounded border-2 font-bold transition-all hover:opacity-80"
          style={{
            borderColor: '#8b0000',
            color: '#c0c0c0'
          }}
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Film Card */}
        <Link href="/admin/upload-film">
          <div 
            className="p-8 rounded-lg border-2 hover:opacity-80 transition-all cursor-pointer"
            style={{
              backgroundColor: '#2d2d2d',
              borderColor: '#8b0000'
            }}
          >
            <h2 
              className="text-3xl mb-4"
              style={{ 
                fontFamily: 'var(--font-creepster)',
                color: '#a40000'
              }}
            >
              Upload New Film
            </h2>
            <p style={{ color: '#c0c0c0' }}>
              Add a new film with poster, rating, and Letterboxd link
            </p>
          </div>
        </Link>

        {/* Manage Films Card */}
        <Link href="/admin/manage-films">
          <div 
            className="p-8 rounded-lg border-2 hover:opacity-80 transition-all cursor-pointer"
            style={{
              backgroundColor: '#2d2d2d',
              borderColor: '#8b0000'
            }}
          >
            <h2 
              className="text-3xl mb-4"
              style={{ 
                fontFamily: 'var(--font-creepster)',
                color: '#a40000'
              }}
            >
              Manage Films
            </h2>
            <p style={{ color: '#c0c0c0' }}>
              View all films and upload frames to existing films
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: '#2d2d2d' }}>
        <p style={{ color: '#c0c0c0' }}>
          <strong style={{ color: '#a40000' }}>Logged in as:</strong> {user.email}
        </p>
      </div>
    </div>
  );
}

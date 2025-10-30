'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getAllFilms } from '@/lib/firebaseHelpers';
import { Film } from '@/lib/firestoreSchema';
import Image from 'next/image';
import Link from 'next/link';

export default function ManageFilms() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [films, setFilms] = useState<Film[]>([]);
  const [loadingFilms, setLoadingFilms] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const allFilms = await getAllFilms(true); // Include explicit
        setFilms(allFilms);
      } catch (error) {
        console.error('Error fetching films:', error);
      } finally {
        setLoadingFilms(false);
      }
    };

    if (user) {
      fetchFilms();
    }
  }, [user]);

  if (loading || loadingFilms) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p style={{ color: '#c0c0c0' }}>Loading films...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 
          className="text-5xl"
          style={{ 
            fontFamily: 'var(--font-cinzel)',
            color: '#a40000'
          }}
        >
          Manage Films
        </h1>
        <Link
          href="/admin/dashboard"
          className="px-6 py-3 rounded border-2 font-bold hover:opacity-80"
          style={{
            borderColor: '#8b0000',
            color: '#c0c0c0'
          }}
        >
          Back to Dashboard
        </Link>
      </div>

      {films.length === 0 ? (
        <div className="text-center py-20">
          <p style={{ color: '#c0c0c0' }}>No films uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {films.map((film) => (
            <Link key={film.id} href={`/admin/upload-frames/${film.id}`}>
              <div 
                className="rounded-lg border-2 overflow-hidden hover:opacity-80 transition-all cursor-pointer"
                style={{ borderColor: '#8b0000' }}
              >
                <Image
                  src={film.posterUrl}
                  alt={film.name}
                  width={300}
                  height={450}
                  className="w-full h-96 object-cover"
                />
                <div className="p-4" style={{ backgroundColor: '#2d2d2d' }}>
                  <h3 
                    className="text-xl mb-2"
                    style={{ 
                      fontFamily: 'var(--font-cinzel)',
                      color: '#c0c0c0'
                    }}
                  >
                    {film.name}
                  </h3>
                  <p style={{ color: '#a40000' }}>
                    ⭐ {film.letterboxdRating}/5
                  </p>
                  <p style={{ color: '#c0c0c0', fontSize: '0.9rem' }}>
                    {film.frameCount} frames
                  </p>
                  {film.isExplicit && (
                    <span 
                      className="inline-block mt-2 px-3 py-1 text-xs rounded"
                      style={{ backgroundColor: '#a40000', color: 'white' }}
                    >
                      EXPLICIT
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

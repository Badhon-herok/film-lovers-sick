'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllFilms } from '@/lib/firebaseHelpers';
import { Film } from '@/lib/firestoreSchema';

export default function FilmsPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [explicitMode, setExplicitMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('explicitMode');
    if (saved) setExplicitMode(JSON.parse(saved));

    const handleExplicitChange = () => {
      const saved = localStorage.getItem('explicitMode');
      if (saved) setExplicitMode(JSON.parse(saved));
    };
    window.addEventListener('explicitModeChanged', handleExplicitChange);

    const fetchFilms = async () => {
      try {
        const allFilms = await getAllFilms(explicitMode);
        setFilms(allFilms);
      } catch (error) {
        console.error('Error fetching films:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();

    return () => window.removeEventListener('explicitModeChanged', handleExplicitChange);
  }, [explicitMode]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p style={{ color: '#c0c0c0' }}>Loading the collection...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <section className="text-center mb-16">
        <h1 
          className="text-6xl mb-4" 
          style={{ 
            fontFamily: 'var(--font-creepster)',
            color: '#a40000',
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.7))'
          }}
        >
          Film Collection
        </h1>
        <p 
          className="text-lg max-w-2xl mx-auto" 
          style={{ color: 'rgba(192, 192, 192, 0.8)' }}
        >
          Explore our collection of dark, haunting, and disturbing films.
        </p>
      </section>

      {films.length === 0 ? (
        <div className="text-center py-20">
          <p 
            className="text-xl" 
            style={{ 
              fontFamily: 'var(--font-cinzel)',
              color: 'rgba(192, 192, 192, 0.6)'
            }}
          >
            No films in our collection yet...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {films.map((film) => (
            <Link key={film.id} href={`/films/${film.id}`}>
              <div 
                className="rounded-lg border-2 overflow-hidden hover:opacity-80 transition-all cursor-pointer group"
                style={{ borderColor: '#8b0000' }}
              >
                <div className="relative overflow-hidden h-96">
                  <Image
                    src={film.posterUrl}
                    alt={film.name}
                    width={300}
                    height={450}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4" style={{ backgroundColor: '#2d2d2d' }}>
                  <h3 
                    className="text-xl mb-2 line-clamp-2"
                    style={{ 
                      fontFamily: 'var(--font-cinzel)',
                      color: '#c0c0c0'
                    }}
                  >
                    {film.name}
                  </h3>
                  <p style={{ color: '#a40000', marginBottom: '0.5rem' }}>
                    ⭐ {film.letterboxdRating}/5
                  </p>
                  <p style={{ color: '#c0c0c0', fontSize: '0.9rem' }}>
                    {film.frameCount} frame{film.frameCount !== 1 ? 's' : ''}
                  </p>
                  {film.isExplicit && (
                    <span 
                      className="inline-block mt-3 px-3 py-1 text-xs rounded font-bold"
                      style={{ backgroundColor: '#a40000', color: 'white' }}
                    >
                      ⚠️ EXPLICIT
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

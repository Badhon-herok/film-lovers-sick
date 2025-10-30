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
      <div style={{ width: '100%', padding: 'clamp(32px, 5vw, 48px)', textAlign: 'center' }}>
        <p style={{ color: '#c0c0c0', fontSize: 'clamp(16px, 3vw, 20px)' }}>
          Loading films...
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Header Section */}
      <section 
        style={{ 
          width: '100%',
          backgroundColor: '#0a0a0a',
          paddingTop: 'clamp(32px, 6vw, 48px)',
          paddingBottom: 'clamp(32px, 6vw, 48px)',
          paddingLeft: 'clamp(16px, 2vw, 24px)',
          paddingRight: 'clamp(16px, 2vw, 24px)',
          borderBottom: '2px solid #8b0000'
        }}
      >
        <div style={{ 
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center'
        }}>
          <h1 
            style={{ 
              fontFamily: 'var(--font-creepster)',
              color: '#a40000',
              fontSize: 'clamp(2rem, 8vw, 4rem)',
              marginBottom: 'clamp(8px, 2vw, 12px)',
              textShadow: '0 0 20px rgba(164, 0, 0, 0.5)',
              lineHeight: '1.2'
            }}
          >
            Film Collection
          </h1>
          
          <p 
            style={{ 
              color: 'rgba(192, 192, 192, 0.8)',
              fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            Explore our collection of dark, haunting, and disturbing films.
          </p>
        </div>
      </section>

      {/* Films Grid Section */}
      <section 
        style={{ 
          width: '100%',
          backgroundColor: '#1a1a1a',
          paddingTop: 'clamp(24px, 5vw, 40px)',
          paddingBottom: 'clamp(24px, 5vw, 40px)',
          paddingLeft: 'clamp(16px, 2vw, 24px)',
          paddingRight: 'clamp(16px, 2vw, 24px)',
          minHeight: '60vh'
        }}
      >
        <div style={{ 
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          {films.length === 0 ? (
            <div 
              style={{
                padding: 'clamp(32px, 5vw, 80px)',
                textAlign: 'center'
              }}
            >
              <p 
                style={{ 
                  fontFamily: 'var(--font-cinzel)',
                  color: 'rgba(192, 192, 192, 0.6)',
                  fontSize: 'clamp(1rem, 2.5vw, 1.3rem)'
                }}
              >
                No films in our collection yet...
              </p>
            </div>
          ) : (
            <>
              {/* Film Count */}
              <div 
                style={{ 
                  marginBottom: 'clamp(16px, 3vw, 24px)',
                  textAlign: 'center'
                }}
              >
                <p 
                  style={{ 
                    color: '#a40000',
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    fontWeight: 'bold'
                  }}
                >
                  {films.length} Film{films.length !== 1 ? 's' : ''} Available
                </p>
              </div>

              {/* Grid */}
              <div 
                style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(130px, 22vw, 220px), 1fr))',
                  gap: 'clamp(12px, 2.5vw, 20px)'
                }}
              >
                {films.map((film) => (
                  <Link 
                    key={film.id} 
                    href={`/films/${film.id}`}
                    style={{ display: 'block' }}
                  >
                    <div 
                      style={{ 
                        borderRadius: '8px',
                        border: '2px solid #8b0000',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        backgroundColor: '#2d2d2d'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#a40000';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(164, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#8b0000';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Poster */}
                      <div style={{ position: 'relative', paddingBottom: '150%', overflow: 'hidden' }}>
                        <Image
                          src={film.posterUrl}
                          alt={film.name}
                          fill
                          sizes="(max-width: 480px) 45vw, (max-width: 768px) 35vw, (max-width: 1024px) 28vw, 22vw"
                          style={{
                            objectFit: 'cover'
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div style={{ padding: 'clamp(12px, 2vw, 16px)' }}>
                        <h3 
                          style={{ 
                            fontFamily: 'var(--font-cinzel)',
                            color: '#c0c0c0',
                            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                            marginBottom: 'clamp(6px, 1.5vw, 8px)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: '1.3'
                          }}
                        >
                          {film.name}
                        </h3>
                        
                        {/* Rating */}
                        <p style={{ color: '#a40000', marginBottom: '4px', fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)', fontWeight: 'bold' }}>
                          ⭐ {film.letterboxdRating}/5
                        </p>
                        
                        {/* Frames Count */}
                        <p style={{ color: '#c0c0c0', fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)', marginBottom: '8px' }}>
                          {film.frameCount} frame{film.frameCount !== 1 ? 's' : ''}
                        </p>
                        
                        {/* Explicit Badge */}
                        {film.isExplicit && (
                          <span 
                            style={{ 
                              display: 'inline-block',
                              padding: 'clamp(3px, 0.8vw, 4px) clamp(8px, 1.5vw, 12px)',
                              fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                              borderRadius: '4px',
                              backgroundColor: '#a40000',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            ⚠️ EXPLICIT
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

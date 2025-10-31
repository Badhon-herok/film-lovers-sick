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
      <div style={{ padding: 'clamp(32px, 5vw, 48px)', textAlign: 'center' }}>
        <p style={{ color: '#c0c0c0', fontSize: 'clamp(14px, 2vw, 16px)' }}>Loading films...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{
      maxWidth: '1400px',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: 'clamp(24px, 3vw, 48px) clamp(16px, 2vw, 24px)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'clamp(20px, 4vw, 32px)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h1 
          style={{ 
            fontFamily: 'var(--font-creepster)',
            color: '#a40000',
            fontSize: 'clamp(1.8rem, 6vw, 3rem)',
            margin: 0
          }}
        >
          Manage Films
        </h1>
        <Link
          href="/admin/dashboard"
          style={{
            padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 2vw, 24px)',
            borderRadius: '6px',
            border: '2px solid #8b0000',
            color: '#c0c0c0',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            display: 'inline-block',
            backgroundColor: 'transparent',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#8b0000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>

      {films.length === 0 ? (
        <div style={{
          padding: 'clamp(40px, 8vw, 80px)',
          textAlign: 'center',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          border: '2px solid #8b0000'
        }}>
          <p style={{ 
            color: '#c0c0c0',
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)'
          }}>
            No films uploaded yet.
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(150px, 25vw, 280px), 1fr))',
          gap: 'clamp(16px, 2.5vw, 24px)'
        }}>
          {films.map((film) => (
            <div
              key={film.id}
              style={{
                borderRadius: '8px',
                border: '2px solid #8b0000',
                overflow: 'hidden',
                backgroundColor: '#2d2d2d',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#a40000';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#8b0000';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {/* Poster Image */}
              <div style={{ position: 'relative', paddingBottom: '150%', overflow: 'hidden' }}>
                <Image
                  src={film.posterUrl}
                  alt={film.name}
                  fill
                  sizes="(max-width: 480px) 45vw, (max-width: 768px) 35vw, (max-width: 1024px) 28vw, 22vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Film Info */}
              <div style={{ padding: 'clamp(12px, 2vw, 16px)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 
                  style={{ 
                    fontFamily: 'var(--font-cinzel)',
                    color: '#c0c0c0',
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    margin: '0 0 8px 0',
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

                <p style={{ 
                  color: '#a40000',
                  fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
                  margin: '4px 0',
                  fontWeight: 'bold'
                }}>
                  ⭐ {film.letterboxdRating}/5
                </p>

                <p style={{ 
                  color: '#c0c0c0',
                  fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                  margin: '4px 0 12px 0'
                }}>
                  {film.frameCount} frame{film.frameCount !== 1 ? 's' : ''}
                </p>

                {film.isExplicit && (
                  <span 
                    style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                      borderRadius: '4px',
                      backgroundColor: '#a40000',
                      color: 'white',
                      fontWeight: 'bold',
                      marginBottom: '8px'
                    }}
                  >
                    ⚠️ EXPLICIT
                  </span>
                )}

                {/* Buttons - NOW WITH 3 BUTTONS */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  marginTop: 'auto'
                }}>
                  {/* Upload Frames Button */}
                  <Link
                    href={`/admin/upload-frames/${film.id}`}
                    style={{
                      padding: 'clamp(6px, 1.2vw, 8px) clamp(8px, 1.5vw, 12px)',
                      backgroundColor: '#a40000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: 'clamp(0.75rem, 1.6vw, 0.85rem)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'block'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ff0000';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#a40000';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    📤 Upload
                  </Link>

                  {/* Edit Button - NEW */}
                  <Link
                    href={`/admin/edit-film/${film.id}`}
                    style={{
                      padding: 'clamp(6px, 1.2vw, 8px) clamp(8px, 1.5vw, 12px)',
                      backgroundColor: 'transparent',
                      color: '#c0c0c0',
                      border: '2px solid #a40000',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: 'clamp(0.75rem, 1.6vw, 0.85rem)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'block'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#a40000';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#c0c0c0';
                    }}
                  >
                    ✏️ Edit
                  </Link>

                  {/* View Frames Button - Spans 2 columns */}
                  <Link
                    href={`/films/${film.id}`}
                    style={{
                      gridColumn: '1 / -1',
                      padding: 'clamp(6px, 1.2vw, 8px) clamp(8px, 1.5vw, 12px)',
                      backgroundColor: 'transparent',
                      color: '#c0c0c0',
                      border: '2px solid #8b0000',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: 'clamp(0.75rem, 1.6vw, 0.85rem)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'block'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#8b0000';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#c0c0c0';
                    }}
                  >
                    👁️ View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

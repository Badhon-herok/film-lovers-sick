'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFilmById, getFramesByFilmId, deleteFrame } from '@/lib/firebaseHelpers';
import { useAuth } from '@/hooks/useAuth';
import { Film, Frame } from '@/lib/firestoreSchema';
import Image from 'next/image';
import Link from 'next/link';

export default function FilmDetailsPage() {
  const { filmId } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [film, setFilm] = useState<Film | null>(null);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [explicitMode, setExplicitMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('explicitMode');
    if (saved) setExplicitMode(JSON.parse(saved));

    const handleExplicitChange = () => {
      const saved = localStorage.getItem('explicitMode');
      if (saved) setExplicitMode(JSON.parse(saved));
    };
    window.addEventListener('explicitModeChanged', handleExplicitChange);

    const fetchData = async () => {
      if (typeof filmId === 'string') {
        try {
          const filmData = await getFilmById(filmId);
          if (!filmData) {
            router.push('/films');
            return;
          }
          setFilm(filmData);

          const framesData = await getFramesByFilmId(filmId, explicitMode);
          setFrames(framesData);
        } catch (error) {
          console.error('Error fetching film:', error);
          router.push('/films');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => window.removeEventListener('explicitModeChanged', handleExplicitChange);
  }, [filmId, explicitMode, router]);

  // Close lightbox on ESC key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedFrame) {
        setSelectedFrame(null);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedFrame]);

  const handleDeleteFrame = async (frameId: string) => {
    if (!confirm('Are you sure you want to delete this frame?')) return;

    setDeleting(frameId);
    try {
      await deleteFrame(frameId, filmId as string);
      setFrames(frames.filter(f => f.id !== frameId));
      if (film) {
        setFilm({ ...film, frameCount: Math.max(0, film.frameCount - 1) });
      }
      alert('✓ Frame deleted successfully');
    } catch (error) {
      console.error('Error deleting frame:', error);
      alert('Failed to delete frame');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 'clamp(24px, 5vw, 48px)', textAlign: 'center' }}>
        <p style={{ color: '#c0c0c0', fontSize: 'clamp(14px, 2vw, 16px)' }}>Loading film details...</p>
      </div>
    );
  }

  if (!film) {
    return (
      <div style={{ padding: 'clamp(24px, 5vw, 48px)', textAlign: 'center' }}>
        <p style={{ color: '#c0c0c0', fontSize: 'clamp(14px, 2vw, 16px)' }}>Film not found</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Back Link */}
      <div style={{ padding: 'clamp(16px, 3vw, 24px)', backgroundColor: '#0a0a0a' }}>
        <div style={{ maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: 'clamp(16px, 2vw, 24px)', paddingRight: 'clamp(16px, 2vw, 24px)' }}>
          <Link 
            href="/films"
            style={{
              display: 'inline-block',
              padding: 'clamp(6px, 1.2vw, 8px) clamp(12px, 2vw, 16px)',
              borderRadius: '6px',
              border: '2px solid #8b0000',
              color: '#c0c0c0',
              textDecoration: 'none',
              fontSize: 'clamp(12px, 2vw, 14px)',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8b0000'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ← Back to Films
          </Link>
        </div>
      </div>

      {/* Film Header */}
      <section style={{ padding: 'clamp(20px, 4vw, 32px)', backgroundColor: '#1a1a1a' }}>
        <div style={{ maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: 'clamp(16px, 2vw, 24px)', paddingRight: 'clamp(16px, 2vw, 24px)' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'minmax(120px, 200px) 1fr',
            gap: 'clamp(16px, 5vw, 32px)',
            alignItems: 'start'
          }}>
            {/* Poster */}
            <div style={{ width: '100%' }}>
              <Image
                src={film.posterUrl}
                alt={film.name}
                width={200}
                height={300}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  border: '2px solid #8b0000',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Film Info */}
            <div>
              <h1 
                style={{ 
                  fontFamily: 'var(--font-creepster)',
                  color: '#a40000',
                  fontSize: 'clamp(1.5rem, 5vw, 3rem)',
                  marginBottom: '12px',
                  lineHeight: '1.2'
                }}
              >
                {film.name}
              </h1>

              {film.releaseYear && (
                <p style={{ color: '#c0c0c0', fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginBottom: '8px' }}>
                  <strong style={{ color: '#a40000' }}>Released:</strong> {film.releaseYear}
                </p>
              )}

              <p style={{ color: '#a40000', fontSize: 'clamp(1rem, 3vw, 1.2rem)', marginBottom: '12px', fontWeight: 'bold' }}>
                ⭐ {film.letterboxdRating} / 5
              </p>

              {film.director && (
                <p style={{ color: '#c0c0c0', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', marginBottom: '8px' }}>
                  <strong style={{ color: '#a40000' }}>Director:</strong> {film.director}
                </p>
              )}

              {film.genre && film.genre.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ color: '#a40000', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', marginBottom: '4px' }}>
                    <strong>Genres:</strong>
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {film.genre.map((g, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          backgroundColor: '#8b0000',
                          color: '#c0c0c0',
                          borderRadius: '20px',
                          fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)'
                        }}
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {film.cast && film.cast.length > 0 && (
                <p style={{ color: '#c0c0c0', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', marginBottom: '8px' }}>
                  <strong style={{ color: '#a40000' }}>Cast:</strong> {film.cast.join(', ')}
                </p>
              )}

              {film.plot && (
                <p style={{ color: '#c0c0c0', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', lineHeight: '1.6', marginBottom: '12px' }}>
                  {film.plot}
                </p>
              )}

              <p style={{ color: '#c0c0c0', fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginBottom: '4px' }}>
                <strong style={{ color: '#a40000' }}>Frames:</strong> {film.frameCount}
              </p>

              {film.isExplicit && (
                <div
                  style={{
                    padding: 'clamp(8px, 1.5vw, 12px)',
                    borderRadius: '6px',
                    border: '2px solid #a40000',
                    backgroundColor: 'rgba(164, 0, 0, 0.2)',
                    color: '#a40000',
                    marginBottom: '12px',
                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
                  }}
                >
                  <strong>⚠️ Explicit Content</strong>
                </div>
              )}

              <a
                href={film.letterboxdLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: 'clamp(6px, 1.5vw, 10px) clamp(12px, 2vw, 24px)',
                  borderRadius: '6px',
                  border: '2px solid #8b0000',
                  color: '#c0c0c0',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8b0000'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                View on Letterboxd →
              </a>

              {/* Admin Review Section - NEW */}
              {(film.adminName || film.adminReview) && (
                <div
                  style={{
                    marginTop: '20px',
                    padding: 'clamp(12px, 2vw, 16px)',
                    borderRadius: '8px',
                    border: '2px solid #8b0000',
                    backgroundColor: 'rgba(139, 0, 0, 0.1)'
                  }}
                >
                  <p style={{ color: '#a40000', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', marginBottom: '8px', fontWeight: 'bold', margin: 0 }}>
                    🎬 Admin's Thoughts
                  </p>
                  {film.adminName && (
                    <p style={{ color: '#c0c0c0', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', marginBottom: '8px', margin: 0 }}>
                      <strong>By:</strong> {film.adminName}
                    </p>
                  )}
                  {film.adminReview && (
                    <p style={{ color: '#c0c0c0', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', lineHeight: '1.6', fontStyle: 'italic', margin: 0 }}>
                      "{film.adminReview}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Frames Section */}
      <section style={{ padding: 'clamp(20px, 4vw, 32px)', backgroundColor: '#0a0a0a' }}>
        <div style={{ maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: 'clamp(16px, 2vw, 24px)', paddingRight: 'clamp(16px, 2vw, 24px)' }}>
          <h2 
            style={{ 
              fontFamily: 'var(--font-creepster)',
              color: '#a40000',
              fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
              marginBottom: '20px',
              textAlign: 'center'
            }}
          >
            Frame Collection
          </h2>

          {frames.length === 0 ? (
            <div 
              style={{
                padding: 'clamp(20px, 5vw, 32px)',
                borderRadius: '8px',
                textAlign: 'center',
                backgroundColor: '#1a1a1a'
              }}
            >
              <p style={{ color: '#c0c0c0', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                No frames available for this film yet.
              </p>
            </div>
          ) : (
            <>
              {/* Lightbox */}
              {selectedFrame && (
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'clamp(12px, 2vw, 16px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'blur(4px)'
                  }}
                  onClick={() => setSelectedFrame(null)}
                >
                  <div 
                    style={{
                      position: 'relative',
                      maxWidth: '80vw',
                      maxHeight: '80vh',
                      width: 'auto',
                      backgroundColor: '#1a1a1a',
                      borderRadius: '12px',
                      border: '2px solid #a40000',
                      padding: 'clamp(12px, 2vw, 20px)',
                      boxShadow: '0 0 40px rgba(164, 0, 0, 0.5)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedFrame(null)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        fontSize: 'clamp(20px, 5vw, 32px)',
                        background: 'none',
                        border: 'none',
                        color: '#a40000',
                        cursor: 'pointer',
                        zIndex: 10,
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(164, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title="Close (ESC)"
                    >
                      ✕
                    </button>

                    {/* Image Container */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}>
                      <Image
                        src={selectedFrame.imageUrl}
                        alt={selectedFrame.filmName}
                        width={1200}
                        height={800}
                        style={{
                          width: 'auto',
                          height: 'auto',
                          maxWidth: '100%',
                          maxHeight: '70vh',
                          borderRadius: '8px',
                          objectFit: 'contain'
                        }}
                      />
                    </div>

                    {/* Film Name */}
                    <p 
                      style={{
                        textAlign: 'center',
                        marginTop: 'clamp(12px, 2vw, 16px)',
                        color: '#c0c0c0',
                        fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                        margin: 0,
                        paddingTop: '12px',
                        borderTop: '1px solid #8b0000'
                      }}
                    >
                      {selectedFrame.filmName}
                    </p>

                    {/* Keyboard Hint */}
                    <p 
                      style={{
                        textAlign: 'center',
                        marginTop: '8px',
                        color: 'rgba(192, 192, 192, 0.5)',
                        fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                        margin: 0
                      }}
                    >
                      Click ✕ or press ESC to close
                    </p>
                  </div>
                </div>
              )}

              {/* Grid */}
                <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(200px, 30vw, 350px), 1fr))',
                gap: 'clamp(12px, 3vw, 20px)'
              }}>

                {frames.map((frame) => (
                  <div
                    key={frame.id}
                    style={{
                      position: 'relative',
                      borderRadius: '8px',
                      border: '2px solid #8b0000',
                      overflow: 'hidden',
                      aspectRatio: '16 / 9',
                      backgroundColor: '#000'
                    }}
                  >
                    <Image
                      src={frame.imageUrl}
                      alt={frame.filmName}
                      fill
                      sizes="(max-width: 480px) 45vw, (max-width: 768px) 35vw, (max-width: 1024px) 25vw, 20vw"
                      style={{
                        objectFit: 'cover',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedFrame(frame)}
                    />
                    
                    {frame.isExplicit && (
                      <span 
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          padding: '2px 6px',
                          backgroundColor: '#a40000',
                          color: 'white',
                          fontSize: 'clamp(9px, 2vw, 12px)',
                          fontWeight: 'bold',
                          borderRadius: '4px'
                        }}
                      >
                        EXPLICIT
                      </span>
                    )}

                    {/* Delete Button - Admin Only */}
                    {user && (
                      <button
                        onClick={() => handleDeleteFrame(frame.id)}
                        disabled={deleting === frame.id}
                        style={{
                          position: 'absolute',
                          bottom: '6px',
                          right: '6px',
                          padding: 'clamp(3px, 0.8vw, 4px) clamp(6px, 1vw, 8px)',
                          backgroundColor: '#a40000',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: deleting === frame.id ? 'not-allowed' : 'pointer',
                          fontSize: 'clamp(8px, 1.8vw, 11px)',
                          fontWeight: 'bold',
                          opacity: deleting === frame.id ? 0.6 : 1,
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          if (deleting !== frame.id) {
                            e.currentTarget.style.backgroundColor = '#ff0000';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#a40000';
                        }}
                        title="Delete this frame (Admin only)"
                      >
                        {deleting === frame.id ? '...' : '🗑️'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

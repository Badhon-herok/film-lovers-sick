'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFilmById, getFramesByFilmId } from '@/lib/firebaseHelpers';
import { Film, Frame } from '@/lib/firestoreSchema';
import Image from 'next/image';
import Link from 'next/link';

export default function FilmDetailsPage() {
  const { filmId } = useParams();
  const router = useRouter();

  const [film, setFilm] = useState<Film | null>(null);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [explicitMode, setExplicitMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

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

  if (loading) {
    return (
      <div style={{ padding: 'clamp(24px, 5vw, 48px)', textAlign: 'center' }}>
        <p style={{ color: '#c0c0c0' }}>Loading film details...</p>
      </div>
    );
  }

  if (!film) {
    return (
      <div style={{ padding: 'clamp(24px, 5vw, 48px)', textAlign: 'center' }}>
        <p style={{ color: '#c0c0c0' }}>Film not found</p>
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
              padding: '6px 12px',
              borderRadius: '6px',
              border: '2px solid #8b0000',
              color: '#c0c0c0',
              textDecoration: 'none',
              fontSize: 'clamp(12px, 3vw, 14px)',
              fontWeight: 'bold'
            }}
          >
            ← Back
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

              {/* Release Year */}
              {film.releaseYear && (
                <p style={{ color: '#c0c0c0', fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginBottom: '8px' }}>
                  <strong style={{ color: '#a40000' }}>Released:</strong> {film.releaseYear}
                </p>
              )}

              {/* Rating */}
              <p style={{ color: '#a40000', fontSize: 'clamp(1rem, 3vw, 1.2rem)', marginBottom: '12px' }}>
                ⭐ {film.letterboxdRating} / 5
              </p>

              {/* Director */}
              {film.director && (
                <p style={{ color: '#c0c0c0', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', marginBottom: '8px' }}>
                  <strong style={{ color: '#a40000' }}>Director:</strong> {film.director}
                </p>
              )}

              {/* Genre */}
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

              {/* Cast */}
              {film.cast && film.cast.length > 0 && (
                <p style={{ color: '#c0c0c0', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', marginBottom: '8px' }}>
                  <strong style={{ color: '#a40000' }}>Cast:</strong> {film.cast.join(', ')}
                </p>
              )}

              {/* Frames Count */}
              <p style={{ color: '#c0c0c0', fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginBottom: '12px' }}>
                <strong style={{ color: '#a40000' }}>Frames:</strong> {film.frameCount}
              </p>

              {/* Explicit Warning */}
              {film.isExplicit && (
                <div
                  style={{
                    padding: '8px',
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

              {/* Letterboxd Link */}
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
              >
                View on Letterboxd →
              </a>
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
            Frames
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
              <p style={{ color: '#c0c0c0' }}>
                No frames available
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
                    backgroundColor: 'rgba(0, 0, 0, 0.95)'
                  }}
                  onClick={() => setSelectedFrame(null)}
                >
                  <div 
                    style={{
                      position: 'relative',
                      maxWidth: '95vw',
                      maxHeight: '90vh',
                      width: '100%'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
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
                        zIndex: 10
                      }}
                    >
                      ✕
                    </button>
                    <Image
                      src={selectedFrame.imageUrl}
                      alt={selectedFrame.filmName}
                      width={1200}
                      height={800}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Grid */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(100px, 20vw, 200px), 1fr))',
                gap: 'clamp(8px, 2vw, 16px)'
              }}>
                {frames.map((frame) => (
                  <div
                    key={frame.id}
                    style={{
                      position: 'relative',
                      borderRadius: '8px',
                      border: '2px solid #8b0000',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      aspectRatio: '1',
                      backgroundColor: '#000'
                    }}
                    onClick={() => setSelectedFrame(frame)}
                  >
                    <Image
                      src={frame.imageUrl}
                      alt={frame.filmName}
                      fill
                      sizes="(max-width: 480px) 45vw, (max-width: 768px) 35vw, (max-width: 1024px) 25vw, 20vw"
                      style={{
                        objectFit: 'cover'
                      }}
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

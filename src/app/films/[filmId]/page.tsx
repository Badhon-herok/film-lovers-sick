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
      <div style={{ padding: '48px 24px', textAlign: 'center' }}>
        <p style={{ color: '#c0c0c0' }}>Loading film details...</p>
      </div>
    );
  }

  if (!film) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center' }}>
        <p style={{ color: '#c0c0c0' }}>Film not found</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Back Link */}
      <div style={{ padding: '24px 16px', backgroundColor: '#0a0a0a' }}>
        <div style={{ maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto' }}>
          <Link 
            href="/films"
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '2px solid #8b0000',
              color: '#c0c0c0',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            ← Back to Films
          </Link>
        </div>
      </div>

      {/* Film Header */}
      <section style={{ padding: '32px 16px', backgroundColor: '#1a1a1a' }}>
        <div style={{ maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', alignItems: 'start' }}>
            {/* Poster */}
            <div>
              <Image
                src={film.posterUrl}
                alt={film.name}
                width={300}
                height={450}
                style={{
                  width: '100%',
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
                  fontSize: '3rem',
                  marginBottom: '16px'
                }}
              >
                {film.name}
              </h1>

              {/* Release Year */}
              {film.releaseYear && (
                <p style={{ color: '#c0c0c0', fontSize: '1rem', marginBottom: '12px' }}>
                  <strong style={{ color: '#a40000' }}>Released:</strong> {film.releaseYear}
                </p>
              )}

              {/* Rating */}
              <p style={{ color: '#a40000', fontSize: '1.2rem', marginBottom: '16px' }}>
                ⭐ {film.letterboxdRating} / 5
              </p>

              {/* Director */}
              {film.director && (
                <p style={{ color: '#c0c0c0', fontSize: '0.95rem', marginBottom: '12px' }}>
                  <strong style={{ color: '#a40000' }}>Director:</strong> {film.director}
                </p>
              )}

              {/* Genre */}
              {film.genre && film.genre.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ color: '#a40000', fontSize: '0.9rem', marginBottom: '6px' }}>
                    <strong>Genres:</strong>
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {film.genre.map((g, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          backgroundColor: '#8b0000',
                          color: '#c0c0c0',
                          borderRadius: '20px',
                          fontSize: '0.85rem'
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
                <p style={{ color: '#c0c0c0', fontSize: '0.95rem', marginBottom: '12px' }}>
                  <strong style={{ color: '#a40000' }}>Cast:</strong> {film.cast.join(', ')}
                </p>
              )}

              {/* Plot */}
              {film.plot && (
                <p style={{ color: '#c0c0c0', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
                  {film.plot}
                </p>
              )}

              {/* Frames Count */}
              <p style={{ color: '#c0c0c0', marginBottom: '8px' }}>
                <strong style={{ color: '#a40000' }}>Frames in Collection:</strong>
              </p>
              <p style={{ color: '#c0c0c0', fontSize: '1.1rem', marginBottom: '16px' }}>
                {film.frameCount} frame{film.frameCount !== 1 ? 's' : ''}
              </p>

              {/* Explicit Warning */}
              {film.isExplicit && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    border: '2px solid #a40000',
                    backgroundColor: 'rgba(164, 0, 0, 0.2)',
                    color: '#a40000',
                    marginBottom: '16px'
                  }}
                >
                  <strong>⚠️ This film contains explicit content</strong>
                </div>
              )}

              {/* Letterboxd Link */}
              <a
                href={film.letterboxdLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  border: '2px solid #8b0000',
                  color: '#c0c0c0',
                  textDecoration: 'none',
                  fontWeight: 'bold',
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
      <section style={{ padding: '32px 16px', backgroundColor: '#0a0a0a' }}>
        <div style={{ maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto' }}>
          <h2 
            style={{ 
              fontFamily: 'var(--font-creepster)',
              color: '#a40000',
              fontSize: '2.5rem',
              marginBottom: '24px',
              textAlign: 'center'
            }}
          >
            Frame Collection
          </h2>

          {frames.length === 0 ? (
            <div 
              style={{
                padding: '32px',
                borderRadius: '8px',
                textAlign: 'center',
                backgroundColor: '#1a1a1a'
              }}
            >
              <p style={{ color: '#c0c0c0' }}>
                No frames available for this film yet.
              </p>
            </div>
          ) : (
            <>
              {/* Lightbox - Selected Frame */}
              {selectedFrame && (
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    backgroundColor: 'rgba(0, 0, 0, 0.95)'
                  }}
                  onClick={() => setSelectedFrame(null)}
                >
                  <div 
                    style={{
                      position: 'relative',
                      maxWidth: '90vw',
                      maxHeight: '90vh'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelectedFrame(null)}
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        fontSize: '32px',
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
                    <p 
                      style={{
                        textAlign: 'center',
                        marginTop: '16px',
                        color: '#c0c0c0'
                      }}
                    >
                      {selectedFrame.filmName}
                    </p>
                  </div>
                </div>
              )}

              {/* Grid of Frames */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px'
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
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      style={{
                        objectFit: 'cover'
                      }}
                    />
                    {frame.isExplicit && (
                      <span 
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          padding: '4px 8px',
                          backgroundColor: '#a40000',
                          color: 'white',
                          fontSize: '12px',
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

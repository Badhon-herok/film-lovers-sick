'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getRecentFrames, getAllFilms } from '@/lib/firebaseHelpers';
import { Frame, Film } from '@/lib/firestoreSchema';

export default function Home() {
  const [recentFrames, setRecentFrames] = useState<Frame[]>([]);
  const [recentFilms, setRecentFilms] = useState<Film[]>([]);
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

    const fetchData = async () => {
      try {
        const frames = await getRecentFrames(8, explicitMode);
        const films = await getAllFilms(explicitMode);
        setRecentFrames(frames);
        setRecentFilms(films.slice(0, 6));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => window.removeEventListener('explicitModeChanged', handleExplicitChange);
  }, [explicitMode]);

  if (loading) {
    return (
      <div style={{ width: '100%', padding: 'clamp(32px, 5vw, 48px)', textAlign: 'center' }}>
        <p 
          style={{ 
            fontFamily: 'var(--font-cinzel)',
            color: '#c0c0c0',
            fontSize: 'clamp(16px, 3vw, 20px)'
          }}
        >
          Loading the collection...
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Hero Section */}
      <section 
        style={{ 
          width: '100%',
          backgroundColor: '#0a0a0a',
          paddingTop: 'clamp(32px, 8vw, 48px)',
          paddingBottom: 'clamp(32px, 8vw, 48px)',
          paddingLeft: 'clamp(16px, 2vw, 24px)',
          paddingRight: 'clamp(16px, 2vw, 24px)'
        }}
      >
        <div style={{ 
          maxWidth: '1280px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
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
              Film Lovers
            </h1>
            
            <h2 
              style={{ 
                fontFamily: 'var(--font-cinzel)',
                color: '#c0c0c0',
                fontSize: 'clamp(1.2rem, 5vw, 2rem)',
                marginBottom: 'clamp(12px, 2vw, 16px)',
                fontStyle: 'italic'
              }}
            >
              Are Sick People
            </h2>

            <p 
              style={{ 
                color: '#a40000',
                fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                marginBottom: 'clamp(12px, 2vw, 16px)',
                lineHeight: '1.6',
                maxWidth: '600px'
              }}
            >
              A curated collection of cinematic moments that captivate and inspire.
            </p>

            <p 
              style={{ 
                color: 'rgba(192, 192, 192, 0.8)',
                fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)',
                marginBottom: 'clamp(16px, 3vw, 24px)',
                lineHeight: '1.6',
                maxWidth: '600px'
              }}
            >
              From indie films to blockbusters, documentaries to experimental cinema. Explore frames that tell stories.
            </p>

            {/* CTA Buttons */}
            <div style={{ 
              display: 'flex',
              flexDirection: 'row',
              gap: 'clamp(8px, 2vw, 12px)',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link
                href="/films"
                style={{
                  padding: 'clamp(8px, 1.5vw, 10px) clamp(16px, 3vw, 24px)',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: 'clamp(0.85rem, 2vw, 14px)',
                  border: '2px solid #a40000',
                  backgroundColor: '#a40000',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  display: 'inline-block'
                }}
              >
                Browse All Films
              </Link>
              <a
                href="#recent-films"
                style={{
                  padding: 'clamp(8px, 1.5vw, 10px) clamp(16px, 3vw, 24px)',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: 'clamp(0.85rem, 2vw, 14px)',
                  border: '2px solid #8b0000',
                  backgroundColor: 'transparent',
                  color: '#c0c0c0',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  display: 'inline-block'
                }}
              >
                ↓ Explore
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Films Section */}
      {recentFilms.length > 0 && (
        <section 
          id="recent-films"
          style={{ 
            width: '100%',
            backgroundColor: '#1a1a1a',
            paddingTop: 'clamp(24px, 5vw, 32px)',
            paddingBottom: 'clamp(24px, 5vw, 32px)',
            paddingLeft: 'clamp(16px, 2vw, 24px)',
            paddingRight: 'clamp(16px, 2vw, 24px)'
          }}
        >
          <div style={{ 
            maxWidth: '1400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(16px, 3vw, 24px)' }}>
              <h2 
                style={{ 
                  fontFamily: 'var(--font-creepster)',
                  color: '#a40000',
                  fontSize: 'clamp(1.2rem, 5vw, 2.5rem)',
                  marginBottom: 'clamp(6px, 1.5vw, 8px)'
                }}
              >
                Latest Films
              </h2>
              <div 
                style={{ 
                  width: '48px',
                  height: '3px',
                  backgroundColor: '#a40000',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginBottom: 'clamp(6px, 1.5vw, 8px)',
                  borderRadius: '2px'
                }}
              />
              <p 
                style={{ 
                  color: 'rgba(192, 192, 192, 0.8)',
                  fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)'
                }}
              >
                Recently added to our collection
              </p>
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(120px, 25vw, 220px), 1fr))',
              gap: 'clamp(8px, 2vw, 12px)',
              marginBottom: '24px'
            }}>
              {recentFilms.map((film) => (
                <Link key={film.id} href={`/films/${film.id}`} style={{ display: 'block' }}>
                  <div 
                    style={{ 
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '2px solid #8b0000',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      paddingBottom: '130%',
                      position: 'relative',
                      backgroundColor: '#1a1a1a'
                    }}
                  >
                    <div style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: '100%',
                      height: '100%'
                    }}>
                      <Image
                        src={film.posterUrl}
                        alt={film.name}
                        fill
                        sizes="(max-width: 480px) 40vw, (max-width: 768px) 30vw, (max-width: 1024px) 25vw, 20vw"
                        style={{
                          objectFit: 'contain',
                          padding: '4px',
                          pointerEvents: 'none'
                        }}
                      />
                    </div>
                    
                    {/* Hover Info */}
                    <div 
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '6px',
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        fontSize: '10px',
                        zIndex: 10,
                        pointerEvents: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0';
                      }}
                    >
                      <h3 
                        style={{ 
                          fontFamily: 'var(--font-cinzel)',
                          color: '#c0c0c0',
                          fontSize: '9px',
                          marginBottom: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {film.name}
                      </h3>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '8px'
                      }}>
                        <span style={{ color: '#a40000' }}>
                          ⭐ {film.letterboxdRating}
                        </span>
                        <span style={{ color: '#c0c0c0' }}>
                          {film.frameCount}f
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link
                href="/films"
                style={{
                  display: 'inline-block',
                  padding: 'clamp(6px, 1.5vw, 8px) clamp(16px, 2vw, 20px)',
                  borderRadius: '6px',
                  border: '2px solid #8b0000',
                  color: '#c0c0c0',
                  fontWeight: 'bold',
                  fontSize: 'clamp(0.8rem, 2vw, 14px)',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
              >
                View All Films →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recent Frames Section */}
      {recentFrames.length > 0 && (
        <section style={{ 
          width: '100%',
          backgroundColor: '#0a0a0a',
          paddingTop: 'clamp(32px, 8vw, 48px)',
          paddingBottom: 'clamp(32px, 8vw, 48px)',
          paddingLeft: 'clamp(16px, 2vw, 24px)',
          paddingRight: 'clamp(16px, 2vw, 24px)'
        }}>
          <div style={{ 
            maxWidth: '1280px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 5vw, 40px)' }}>
              <h2 
                style={{ 
                  fontFamily: 'var(--font-creepster)',
                  color: '#a40000',
                  fontSize: 'clamp(1.5rem, 6vw, 3rem)',
                  marginBottom: 'clamp(6px, 1.5vw, 8px)'
                }}
              >
                Latest Frames
              </h2>
              <div 
                style={{ 
                  width: '64px',
                  height: '4px',
                  backgroundColor: '#a40000',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginBottom: 'clamp(8px, 2vw, 12px)',
                  borderRadius: '2px'
                }}
              />
              <p 
                style={{ 
                  color: 'rgba(192, 192, 192, 0.8)',
                  fontSize: 'clamp(0.8rem, 2vw, 1rem)'
                }}
              >
                Recent frame captures
              </p>
            </div>

             <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(180px, 30vw, 350px), 1fr))',
              gap: 'clamp(12px, 3vw, 20px)'
            }}>

              {recentFrames.map((frame) => (
                <Link key={frame.id} href={`/films/${frame.filmId}`}>
                  <div 
                    style={{ 
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '56.25%',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '2px solid #2d2d2d',
                      cursor: 'pointer',
                      backgroundColor: '#000'
                    }}
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
                          top: '4px',
                          right: '4px',
                          fontSize: 'clamp(10px, 3vw, 14px)',
                          fontWeight: 'bold',
                          color: '#a40000',
                          zIndex: 10
                        }}
                      >
                        ⚠️
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {recentFilms.length === 0 && recentFrames.length === 0 && (
        <section style={{ 
          width: '100%',
          paddingTop: 'clamp(48px, 10vw, 80px)',
          paddingBottom: 'clamp(48px, 10vw, 80px)',
          paddingLeft: 'clamp(16px, 2vw, 24px)',
          paddingRight: 'clamp(16px, 2vw, 24px)'
        }}>
          <div style={{ 
            maxWidth: '1280px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center'
          }}>
            <h2 
              style={{ 
                fontFamily: 'var(--font-cinzel)',
                color: '#a40000',
                fontSize: 'clamp(1.2rem, 5vw, 2.5rem)',
                marginBottom: 'clamp(12px, 2vw, 16px)'
              }}
            >
              Coming Soon
            </h2>
            <p 
              style={{ 
                color: 'rgba(192, 192, 192, 0.8)',
                fontSize: 'clamp(0.8rem, 2vw, 1rem)'
              }}
            >
              Check back soon for amazing films and frames.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

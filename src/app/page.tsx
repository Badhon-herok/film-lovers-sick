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
      <div style={{ width: '100%', padding: '48px 24px', textAlign: 'center' }}>
        <p 
          style={{ 
            fontFamily: 'var(--font-cinzel)',
            color: '#c0c0c0',
            fontSize: '20px'
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
          paddingTop: '48px',
          paddingBottom: '48px',
          paddingLeft: '16px',
          paddingRight: '16px'
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
                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                marginBottom: '12px',
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
                fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                marginBottom: '16px',
                fontStyle: 'italic'
              }}
            >
              Are Sick People
            </h2>

            <p 
              style={{ 
                color: '#a40000',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                marginBottom: '16px',
                lineHeight: '1.6',
                maxWidth: '600px'
              }}
            >
              A curated collection of cinematic moments that captivate and inspire.
            </p>

            <p 
              style={{ 
                color: 'rgba(192, 192, 192, 0.8)',
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                marginBottom: '24px',
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
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link
                href="/films"
                style={{
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '14px',
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
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '14px',
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
            {/* Recent Films Section */}
      {recentFilms.length > 0 && (
        <section 
          id="recent-films"
          style={{ 
            width: '100%',
            backgroundColor: '#1a1a1a',
            paddingTop: '32px',
            paddingBottom: '32px',
            paddingLeft: '16px',
            paddingRight: '16px'
          }}
        >
          <div style={{ 
            maxWidth: '1400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 
                style={{ 
                  fontFamily: 'var(--font-creepster)',
                  color: '#a40000',
                  fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                  marginBottom: '8px'
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
                  marginBottom: '8px',
                  borderRadius: '2px'
                }}
              />
              <p 
                style={{ 
                  color: 'rgba(192, 192, 192, 0.8)',
                  fontSize: '0.875rem'
                }}
              >
                Recently added to our collection
              </p>
            </div>


            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '12px',
              marginBottom: '24px'
            }}>
              {recentFilms.map((film) => (
                <Link 
                  key={film.id} 
                  href={`/films/${film.id}`}
                  style={{ display: 'block' }}
                >
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
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
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
                        padding: '8px',
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        fontSize: '11px',
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
                          fontSize: '11px',
                          marginBottom: '4px',
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
                        fontSize: '10px'
                      }}>
                        <span style={{ color: '#a40000' }}>
                          ⭐ {film.letterboxdRating}/5
                        </span>
                        <span style={{ color: '#c0c0c0' }}>
                          {film.frameCount}f
                        </span>
                      </div>
                      {film.isExplicit && (
                        <span 
                          style={{ 
                            display: 'inline-block',
                            marginTop: '4px',
                            padding: '2px 4px',
                            fontSize: '9px',
                            fontWeight: 'bold',
                            borderRadius: '2px',
                            backgroundColor: '#a40000',
                            color: 'white'
                          }}
                        >
                          EXPLICIT
                        </span>
                      )}
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
                  padding: '8px 20px',
                  borderRadius: '6px',
                  border: '2px solid #8b0000',
                  color: '#c0c0c0',
                  fontWeight: 'bold',
                  fontSize: '14px',
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
          paddingTop: '48px',
          paddingBottom: '48px',
          paddingLeft: '16px',
          paddingRight: '16px'
        }}>
          <div style={{ 
            maxWidth: '1280px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 
                style={{ 
                  fontFamily: 'var(--font-creepster)',
                  color: '#a40000',
                  fontSize: 'clamp(2rem, 6vw, 3rem)',
                  marginBottom: '8px'
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
                  marginBottom: '12px',
                  borderRadius: '2px'
                }}
              />
              <p 
                style={{ 
                  color: 'rgba(192, 192, 192, 0.8)',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                }}
              >
                Recent frame captures
              </p>
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '16px'
            }}>
              {recentFrames.map((frame) => (
                <Link key={frame.id} href={`/films/${frame.filmId}`}>
                  <div 
                    style={{ 
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '100%',
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
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
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
                          fontSize: '14px',
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
          paddingTop: '80px',
          paddingBottom: '80px',
          paddingLeft: '16px',
          paddingRight: '16px'
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
                fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                marginBottom: '16px'
              }}
            >
              Coming Soon
            </h2>
            <p 
              style={{ 
                color: 'rgba(192, 192, 192, 0.8)',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)'
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

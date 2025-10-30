'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#0a0a0a',
      borderTop: '2px solid #8b0000',
      marginTop: 'clamp(40px, 8vw, 80px)',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1400px',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 'clamp(24px, 4vw, 40px) clamp(16px, 2vw, 24px)'
      }}>
        {/* Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(150px, 40vw, 250px), 1fr))',
          gap: 'clamp(20px, 4vw, 40px)',
          marginBottom: 'clamp(24px, 4vw, 32px)'
        }}>
          {/* About Section */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-creepster)',
              color: '#a40000',
              fontSize: 'clamp(1rem, 3vw, 1.3rem)',
              marginBottom: '12px'
            }}>
              Film Lovers
            </h3>
            <p style={{
              color: 'rgba(192, 192, 192, 0.7)',
              fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
              lineHeight: '1.6'
            }}>
              A curated collection of cinematic moments that captivate and inspire.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{
              color: '#c0c0c0',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              marginBottom: '12px',
              fontWeight: 'bold'
            }}>
              Navigation
            </h4>
            <ul style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <li>
                <Link href="/" style={{
                  color: 'rgba(192, 192, 192, 0.7)',
                  textDecoration: 'none',
                  fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#a40000'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(192, 192, 192, 0.7)'}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link href="/films" style={{
                  color: 'rgba(192, 192, 192, 0.7)',
                  textDecoration: 'none',
                  fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#a40000'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(192, 192, 192, 0.7)'}
                >
                  Films
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 style={{
              color: '#c0c0c0',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              marginBottom: '12px',
              fontWeight: 'bold'
            }}>
              Info
            </h4>
            <p style={{
              color: 'rgba(192, 192, 192, 0.7)',
              fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
              lineHeight: '1.6',
              margin: 0
            }}>
              Film posters are property of their respective studios. This is a fan appreciation site.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #8b0000',
          paddingTop: 'clamp(16px, 3vw, 24px)',
          textAlign: 'center'
        }}>
          <p style={{
            color: 'rgba(192, 192, 192, 0.6)',
            fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
            margin: 0,
            marginBottom: '8px'
          }}>
            © {currentYear} Film Lovers Are Sick People. All rights reserved.
          </p>
          <p style={{
            color: 'rgba(192, 192, 192, 0.5)',
            fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
            margin: 0
          }}>
            Made with 🎬 for cinema enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}

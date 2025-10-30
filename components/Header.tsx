'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [explicitMode, setExplicitMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('explicitMode');
    if (saved) setExplicitMode(JSON.parse(saved));
  }, []);

  const handleToggleExplicit = () => {
    const newMode = !explicitMode;
    setExplicitMode(newMode);
    localStorage.setItem('explicitMode', JSON.stringify(newMode));
    window.dispatchEvent(new Event('explicitModeChanged'));
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <header style={{
      backgroundColor: '#0a0a0a',
      borderBottom: '2px solid #8b0000',
      width: '100%',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1400px',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 'clamp(12px, 2vw, 16px) clamp(12px, 2vw, 24px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontFamily: 'var(--font-creepster)',
            color: '#a40000',
            fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
            margin: 0,
            cursor: 'pointer',
            textShadow: '0 0 10px rgba(164, 0, 0, 0.5)'
          }}>
            Film Lovers
          </h1>
        </Link>

        {/* Desktop/Mobile Controls */}
        <div style={{
          display: 'flex',
          gap: 'clamp(6px, 1.5vw, 12px)',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}>
          {/* Explicit Button - ALWAYS VISIBLE WITH CLEAR STATUS */}
          <button
            onClick={handleToggleExplicit}
            style={{
              padding: 'clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 14px)',
              backgroundColor: explicitMode ? '#a40000' : 'transparent',
              color: '#c0c0c0',
              border: '2px solid #8b0000',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#a40000';
              e.currentTarget.style.borderColor = '#ff0000';
            }}
            onMouseLeave={(e) => {
              if (!explicitMode) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
              e.currentTarget.style.borderColor = '#8b0000';
            }}
            title="Toggle explicit content"
          >
            <span>{explicitMode ? '🔴' : '⭕'}</span>
            <span>Explicit</span>
          </button>

          {/* Admin Button - ALWAYS VISIBLE */}
          <Link 
            href="/admin" 
            style={{
              padding: 'clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 14px)',
              color: '#c0c0c0',
              textDecoration: 'none',
              fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)',
              fontWeight: 'bold',
              border: '2px solid #a40000',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              display: 'inline-block',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#a40000';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#c0c0c0';
            }}
            title="Go to admin panel"
          >
            ⚙️ Admin
          </Link>

          {/* Logout Button - ONLY IF LOGGED IN */}
          {user && (
            <button
              onClick={handleLogout}
              style={{
                padding: 'clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 14px)',
                backgroundColor: '#8b0000',
                color: 'white',
                border: '2px solid #8b0000',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#a40000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#8b0000';
              }}
              title="Logout from admin"
            >
              Logout
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              marginLeft: 'clamp(4px, 1vw, 8px)'
            }}
            title="Toggle menu"
          >
            <div style={{ width: '20px', height: '2px', backgroundColor: '#a40000', transition: 'all 0.3s' }} />
            <div style={{ width: '20px', height: '2px', backgroundColor: '#a40000', transition: 'all 0.3s' }} />
            <div style={{ width: '20px', height: '2px', backgroundColor: '#a40000', transition: 'all 0.3s' }} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#1a1a1a',
          borderTop: '1px solid #8b0000',
          padding: 'clamp(12px, 2vw, 16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <Link 
            href="/films" 
            style={{
              color: '#c0c0c0',
              textDecoration: 'none',
              fontSize: 'clamp(12px, 2.5vw, 15px)',
              fontWeight: 'bold',
              padding: '8px',
              borderBottom: '1px solid #2d2d2d',
              display: 'block'
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            📽️ Browse Films
          </Link>

          <div style={{
            display: 'flex',
            gap: '8px',
            paddingTop: '8px'
          }}>
            <span style={{
              color: 'rgba(192, 192, 192, 0.5)',
              fontSize: 'clamp(10px, 2vw, 12px)',
              marginTop: '4px'
            }}>
              Status:
            </span>
            <span style={{
              color: user ? '#a40000' : '#c0c0c0',
              fontSize: 'clamp(10px, 2vw, 12px)',
              fontWeight: 'bold'
            }}>
              {user ? '🔓 Admin' : '🔒 Public'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}

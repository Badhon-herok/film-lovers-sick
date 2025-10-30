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

        {/* Desktop Controls (Always Visible) */}
        <div style={{
          display: 'flex',
          gap: 'clamp(8px, 1.5vw, 12px)',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Explicit Button - ALWAYS VISIBLE */}
          <button
            onClick={handleToggleExplicit}
            style={{
              padding: 'clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 14px)',
              backgroundColor: explicitMode ? '#a40000' : 'transparent',
              color: '#c0c0c0',
              border: '2px solid #8b0000',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s'
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
          >
            {explicitMode ? '👁️ Explicit' : '👁️ Hide'}
          </button>

          {/* Admin Link - ALWAYS VISIBLE IF LOGGED IN */}
          {user && (
            <Link 
              href="/admin" 
              style={{
                padding: 'clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 14px)',
                color: '#c0c0c0',
                textDecoration: 'none',
                fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
                fontWeight: 'bold',
                border: '2px solid #8b0000',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                display: 'inline-block',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#8b0000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ⚙️ Admin
            </Link>
          )}

          {/* Logout Button - ONLY VISIBLE IF LOGGED IN */}
          {user && (
            <button
              onClick={handleLogout}
              style={{
                padding: 'clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 14px)',
                backgroundColor: '#8b0000',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
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
              gap: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              marginLeft: 'clamp(8px, 1vw, 12px)'
            }}
          >
            <div style={{ width: '24px', height: '2px', backgroundColor: '#a40000' }} />
            <div style={{ width: '24px', height: '2px', backgroundColor: '#a40000' }} />
            <div style={{ width: '24px', height: '2px', backgroundColor: '#a40000' }} />
          </button>
        </div>
      </div>

      {/* Mobile Menu - Additional Options */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#1a1a1a',
          borderTop: '1px solid #8b0000',
          padding: 'clamp(12px, 2vw, 16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <Link 
            href="/films" 
            style={{
              color: '#c0c0c0',
              textDecoration: 'none',
              fontSize: 'clamp(13px, 2.5vw, 16px)',
              fontWeight: 'bold',
              padding: '10px',
              borderBottom: '1px solid #2d2d2d',
              display: 'block'
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            📽️ Browse Films
          </Link>

          {user && (
            <Link 
              href="/admin" 
              style={{
                color: '#a40000',
                textDecoration: 'none',
                fontSize: 'clamp(13px, 2.5vw, 16px)',
                fontWeight: 'bold',
                padding: '10px',
                borderBottom: '1px solid #2d2d2d',
                display: 'block'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              ⚙️ Admin Panel
            </Link>
          )}

          {user && (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              style={{
                padding: '10px',
                backgroundColor: '#8b0000',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: 'clamp(13px, 2.5vw, 16px)',
                fontWeight: 'bold',
                width: '100%',
                textAlign: 'left'
              }}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}

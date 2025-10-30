'use client';

import { useState } from 'react';
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

        {/* Desktop Navigation */}
        <nav style={{ display: 'none' }}>
          {/* Hidden on mobile, shown on desktop via CSS */}
        </nav>

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
            padding: '8px'
          }}
        >
          <div style={{ width: '24px', height: '2px', backgroundColor: '#a40000' }} />
          <div style={{ width: '24px', height: '2px', backgroundColor: '#a40000' }} />
          <div style={{ width: '24px', height: '2px', backgroundColor: '#a40000' }} />
        </button>

        {/* Desktop Controls */}
        <div style={{
          display: 'none',
          gap: 'clamp(8px, 2vw, 16px)',
          alignItems: 'center'
        }}>
          <button
            onClick={handleToggleExplicit}
            style={{
              padding: '6px 12px',
              backgroundColor: explicitMode ? '#a40000' : 'transparent',
              color: '#c0c0c0',
              border: '2px solid #8b0000',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {explicitMode ? '👁️ Explicit' : '👁️ Hide Explicit'}
          </button>
          {user && (
            <>
              <Link href="/admin" style={{ color: '#c0c0c0', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                Admin
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#8b0000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                Logout
              </button>
            </>
          )}
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
          gap: '12px'
        }}>
          <button
            onClick={handleToggleExplicit}
            style={{
              padding: '10px 16px',
              backgroundColor: explicitMode ? '#a40000' : 'transparent',
              color: '#c0c0c0',
              border: '2px solid #8b0000',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: 'clamp(12px, 2vw, 14px)',
              fontWeight: 'bold',
              width: '100%',
              textAlign: 'left'
            }}
          >
            {explicitMode ? '👁️ Explicit ON' : '👁️ Show Explicit'}
          </button>

          <Link 
            href="/films" 
            style={{
              color: '#c0c0c0',
              textDecoration: 'none',
              fontSize: 'clamp(13px, 2.5vw, 16px)',
              fontWeight: 'bold',
              padding: '8px 0',
              borderBottom: '1px solid #2d2d2d'
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Browse Films
          </Link>

          {user && (
            <>
              <Link 
                href="/admin" 
                style={{
                  color: '#a40000',
                  textDecoration: 'none',
                  fontSize: 'clamp(13px, 2.5vw, 16px)',
                  fontWeight: 'bold',
                  padding: '8px 0',
                  borderBottom: '1px solid #2d2d2d'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                style={{
                  padding: '10px 16px',
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
            </>
          )}
        </div>
      )}
    </header>
  );
}

'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaSkull } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [explicitMode, setExplicitMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('explicitMode');
    if (saved) setExplicitMode(JSON.parse(saved));
  }, []);

  const toggleExplicit = () => {
    const newMode = !explicitMode;
    setExplicitMode(newMode);
    localStorage.setItem('explicitMode', JSON.stringify(newMode));
    window.dispatchEvent(new Event('explicitModeChanged'));
  };

  return (
    <header 
      className="relative z-20 backdrop-blur-sm border-b-2 shadow-lg" 
      style={{ 
        backgroundColor: 'rgba(45, 45, 45, 0.9)',
        borderColor: '#8b0000'
      }}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <FaSkull 
              className="text-3xl transition-transform group-hover:rotate-12" 
              style={{ color: '#a40000' }} 
            />
            <h1 
              className="text-2xl md:text-3xl transition-colors group-hover:opacity-80"
              style={{ 
                fontFamily: 'var(--font-cinzel)',
                color: '#c0c0c0'
              }}
            >
              Film Lovers Are Sick People
            </h1>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="transition-colors font-semibold hover:opacity-80"
              style={{ color: '#c0c0c0' }}
            >
              Home
            </Link>
            <Link 
              href="/films" 
              className="transition-colors font-semibold hover:opacity-80"
              style={{ color: '#c0c0c0' }}
            >
              Films
            </Link>
            <Link 
              href="/about" 
              className="transition-colors font-semibold hover:opacity-80"
              style={{ color: '#c0c0c0' }}
            >
              About the Madness
            </Link>

            {/* Admin Link - Only show if logged in */}
            {user && (
              <Link 
                href="/admin/dashboard" 
                className="transition-colors font-semibold hover:opacity-80"
                style={{ color: '#a40000' }}
              >
                Admin
              </Link>
            )}

            {/* Explicit Mode Toggle */}
            <button
              onClick={toggleExplicit}
              className="px-4 py-2 rounded border-2 font-bold transition-all"
              style={{
                backgroundColor: explicitMode ? '#a40000' : 'transparent',
                borderColor: explicitMode ? '#dc143c' : '#c0c0c0',
                color: explicitMode ? 'white' : '#c0c0c0'
              }}
            >
              Explicit Mode: {explicitMode ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getFilmById, addFrame, uploadImage } from '@/lib/firebaseHelpers';
import { Film } from '@/lib/firestoreSchema';

export default function UploadFrames() {
  const { filmId } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [film, setFilm] = useState<Film | null>(null);
  const [frameFiles, setFrameFiles] = useState<File[]>([]);
  const [isExplicit, setIsExplicit] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filmLoading, setFilmLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchFilm = async () => {
      if (typeof filmId === 'string') {
        try {
          const filmData = await getFilmById(filmId);
          if (!filmData) {
            router.push('/admin/manage-films');
            return;
          }
          setFilm(filmData);
        } catch (error) {
          console.error('Error fetching film:', error);
          router.push('/admin/manage-films');
        } finally {
          setFilmLoading(false);
        }
      }
    };

    if (user) {
      fetchFilm();
    }
  }, [user, filmId, router]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFrameFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!film || frameFiles.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      for (let i = 0; i < frameFiles.length; i++) {
        const file = frameFiles[i];
        
        // Upload to Cloudinary
        const imageUrl = await uploadImage(file, 'frames');

        // Add frame to Firestore
        await addFrame({
          filmId: film.id,
          filmName: film.name,
          imageUrl,
          isExplicit,
          uploadedAt: new Date(),
          order: film.frameCount + i + 1,
        });

        setProgress(Math.round(((i + 1) / frameFiles.length) * 100));
      }

      alert('✅ Frames uploaded successfully!');
      router.push('/admin/manage-films');
    } catch (error) {
      console.error('Error uploading frames:', error);
      alert('Failed to upload frames');
    } finally {
      setUploading(false);
    }
  };

  if (loading || filmLoading || !film) {
    return (
      <div style={{ textAlign: 'center', padding: 'clamp(32px, 5vw, 48px)' }}>
        <p style={{ color: '#c0c0c0', fontSize: 'clamp(14px, 2vw, 16px)' }}>
          Loading film...
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ 
      maxWidth: '900px', 
      marginLeft: 'auto', 
      marginRight: 'auto', 
      padding: 'clamp(24px, 3vw, 48px) clamp(16px, 2vw, 24px)' 
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'clamp(24px, 4vw, 32px)' }}>
        <h1 
          style={{ 
            fontFamily: 'var(--font-creepster)',
            color: '#a40000',
            fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
            marginBottom: '8px'
          }}
        >
          Upload Frames
        </h1>
        <h2 
          style={{ 
            fontFamily: 'var(--font-cinzel)',
            color: '#c0c0c0',
            fontSize: 'clamp(1rem, 3vw, 1.3rem)',
            marginBottom: '4px'
          }}
        >
          For: {film.name}
        </h2>
        <p style={{ color: 'rgba(192, 192, 192, 0.6)', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
          Upload one or multiple frame images
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'clamp(16px, 3vw, 24px)' }}>
        {/* File Input */}
        <div>
          <label 
            style={{ 
              display: 'block',
              marginBottom: '8px',
              color: '#c0c0c0',
              fontWeight: 'bold',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)'
            }}
          >
            Select Frame Images (Multiple) *
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            required
            style={{
              width: '100%',
              padding: 'clamp(12px, 2vw, 16px)',
              borderRadius: '6px',
              border: '2px solid #8b0000',
              backgroundColor: '#2d2d2d',
              color: '#c0c0c0',
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
              cursor: 'pointer'
            }}
          />
          {frameFiles.length > 0 && (
            <p style={{ marginTop: '8px', color: '#a40000', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', fontWeight: 'bold' }}>
              ✓ {frameFiles.length} file{frameFiles.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Explicit Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="explicit"
            checked={isExplicit}
            onChange={(e) => setIsExplicit(e.target.checked)}
            style={{
              width: '20px',
              height: '20px',
              cursor: 'pointer',
              accentColor: '#a40000'
            }}
          />
          <label 
            htmlFor="explicit" 
            style={{ 
              color: '#c0c0c0', 
              cursor: 'pointer',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)'
            }}
          >
            Mark frames as Explicit
          </label>
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div>
            <div 
              style={{
                width: '100%',
                height: '16px',
                borderRadius: '8px',
                backgroundColor: '#0a0a0a',
                border: '2px solid #8b0000',
                overflow: 'hidden'
              }}
            >
              <div 
                style={{ 
                  height: '100%',
                  width: `${progress}%`,
                  backgroundColor: '#a40000',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <p 
              style={{ 
                textAlign: 'center',
                marginTop: '12px',
                color: '#c0c0c0',
                fontWeight: 'bold',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
              }}
            >
              Uploading: {progress}%
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || frameFiles.length === 0}
          style={{
            padding: 'clamp(12px, 2vw, 16px) 24px',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            backgroundColor: uploading || frameFiles.length === 0 ? '#666' : '#a40000',
            color: 'white',
            border: 'none',
            cursor: uploading || frameFiles.length === 0 ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.7 : 1,
            transition: 'all 0.3s'
          }}
        >
          {uploading ? `⏳ Uploading... ${progress}%` : '✓ Upload Frames'}
        </button>
      </form>

      {/* Back Link */}
      <div style={{ marginTop: 'clamp(24px, 4vw, 32px)', textAlign: 'center' }}>
        <button
          onClick={() => router.push('/admin/manage-films')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '2px solid #8b0000',
            backgroundColor: 'transparent',
            color: '#c0c0c0',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#8b0000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          ← Back to Manage Films
        </button>
      </div>
    </div>
  );
}

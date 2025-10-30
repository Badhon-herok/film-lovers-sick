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

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchFilm = async () => {
      if (typeof filmId === 'string') {
        const filmData = await getFilmById(filmId);
        setFilm(filmData);
      }
    };

    if (user) {
      fetchFilm();
    }
  }, [user, filmId]);

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

  if (loading || !film) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ color: '#c0c0c0' }}>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
      <h1 
        style={{ 
          fontFamily: 'var(--font-creepster)',
          color: '#a40000',
          fontSize: '2.5rem',
          marginBottom: '16px'
        }}
      >
        Upload Frames
      </h1>
      <h2 
        style={{ 
          fontFamily: 'var(--font-cinzel)',
          color: '#c0c0c0',
          fontSize: '1.5rem',
          marginBottom: '32px'
        }}
      >
        For: {film.name}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
        {/* File Input */}
        <div>
          <label 
            style={{ 
              display: 'block',
              marginBottom: '8px',
              color: '#c0c0c0',
              fontWeight: 'bold'
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
              padding: '12px',
              borderRadius: '6px',
              border: '2px solid #8b0000',
              backgroundColor: '#2d2d2d',
              color: '#c0c0c0',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          />
          {frameFiles.length > 0 && (
            <p style={{ marginTop: '8px', color: '#a40000', fontSize: '14px' }}>
              ✓ {frameFiles.length} file(s) selected
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
              cursor: 'pointer'
            }}
          />
          <label 
            htmlFor="explicit" 
            style={{ color: '#c0c0c0', cursor: 'pointer' }}
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
                fontWeight: 'bold'
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
            padding: '12px 24px',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '16px',
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
    </div>
  );
}

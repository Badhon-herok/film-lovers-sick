'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getFilmById, addFrame, uploadImage } from '@/lib/firebaseHelpers';
import { Film } from '@/lib/firestoreSchema';
import { Timestamp } from 'firebase/firestore';

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
          uploadedAt: Timestamp.now(),
          order: film.frameCount + i + 1,
        });

        setProgress(Math.round(((i + 1) / frameFiles.length) * 100));
      }

      alert('Frames uploaded successfully!');
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
      <div className="container mx-auto px-6 py-12 text-center">
        <p style={{ color: '#c0c0c0' }}>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <h1 
        className="text-5xl mb-4"
        style={{ 
          fontFamily: 'var(--font-cinzel)',
          color: '#a40000'
        }}
      >
        Upload Frames
      </h1>
      <h2 
        className="text-2xl mb-8"
        style={{ 
          fontFamily: 'var(--font-cinzel)',
          color: '#c0c0c0'
        }}
      >
        For: {film.name}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2" style={{ color: '#c0c0c0' }}>
            Select Frame Images (Multiple) *
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            required
            className="w-full px-4 py-3 rounded border-2"
            style={{
              backgroundColor: '#0a0a0a',
              borderColor: '#8b0000',
              color: '#c0c0c0'
            }}
          />
          {frameFiles.length > 0 && (
            <p className="mt-2" style={{ color: '#c0c0c0' }}>
              {frameFiles.length} file(s) selected
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="explicit"
            checked={isExplicit}
            onChange={(e) => setIsExplicit(e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="explicit" style={{ color: '#c0c0c0' }}>
            Mark frames as Explicit
          </label>
        </div>

        {uploading && (
          <div>
            <div 
              className="w-full h-4 rounded"
              style={{ backgroundColor: '#0a0a0a' }}
            >
              <div 
                className="h-full rounded transition-all"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: '#a40000'
                }}
              />
            </div>
            <p className="text-center mt-2" style={{ color: '#c0c0c0' }}>
              Uploading: {progress}%
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full py-3 rounded font-bold transition-all"
          style={{
            backgroundColor: '#a40000',
            color: 'white',
            opacity: uploading ? 0.7 : 1
          }}
        >
          {uploading ? `Uploading... ${progress}%` : 'Upload Frames'}
        </button>
      </form>
    </div>
  );
}

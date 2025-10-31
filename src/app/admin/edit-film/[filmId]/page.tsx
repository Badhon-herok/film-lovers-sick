'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getFilmById, updateFilm } from '@/lib/firebaseHelpers';
import { Film } from '@/lib/firestoreSchema';

export default function EditFilm() {
  const { filmId } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [film, setFilm] = useState<Film | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    releaseYear: '',
    director: '',
    genre: '',
    cast: '',
    plot: '',
    letterboxdRating: '',
    letterboxdLink: '',
    isExplicit: false,
    adminName: '',
    adminReview: ''
  });
  const [saving, setSaving] = useState(false);
  const [loadingFilm, setLoadingFilm] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchFilm = async () => {
      if (typeof filmId === 'string' && user) {
        try {
          const filmData = await getFilmById(filmId);
          if (!filmData) {
            router.push('/admin/manage-films');
            return;
          }
          setFilm(filmData);
          setFormData({
            name: filmData.name || '',
            releaseYear: filmData.releaseYear?.toString() || '',
            director: filmData.director || '',
            genre: filmData.genre?.join(', ') || '',
            cast: filmData.cast?.join(', ') || '',
            plot: filmData.plot || '',
            letterboxdRating: filmData.letterboxdRating?.toString() || '',
            letterboxdLink: filmData.letterboxdLink || '',
            isExplicit: filmData.isExplicit || false,
            adminName: filmData.adminName || '',
            adminReview: filmData.adminReview || ''
          });
        } catch (error) {
          console.error('Error fetching film:', error);
          router.push('/admin/manage-films');
        } finally {
          setLoadingFilm(false);
        }
      }
    };

    fetchFilm();
  }, [filmId, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!film) return;

    setSaving(true);
    try {
      const updates: Partial<Film> = {
        name: formData.name,
        releaseYear: formData.releaseYear ? parseInt(formData.releaseYear) : undefined,
        director: formData.director || undefined,
        genre: formData.genre ? formData.genre.split(',').map(g => g.trim()).filter(g => g) : [],
        cast: formData.cast ? formData.cast.split(',').map(c => c.trim()).filter(c => c) : [],
        plot: formData.plot || undefined,
        letterboxdRating: parseFloat(formData.letterboxdRating),
        letterboxdLink: formData.letterboxdLink,
        isExplicit: formData.isExplicit,
        adminName: formData.adminName || undefined,
        adminReview: formData.adminReview || undefined
      };

      await updateFilm(film.id, updates);
      alert('✓ Film updated successfully!');
      router.push('/admin/manage-films');
    } catch (error) {
      console.error('Error updating film:', error);
      alert('Failed to update film');
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingFilm) {
    return (
      <div style={{ textAlign: 'center', padding: 'clamp(32px, 5vw, 48px)' }}>
        <p style={{ color: '#c0c0c0', fontSize: 'clamp(14px, 2vw, 16px)' }}>
          Loading film...
        </p>
      </div>
    );
  }

  if (!user || !film) return null;

  return (
    <div style={{ 
      maxWidth: '900px', 
      marginLeft: 'auto', 
      marginRight: 'auto', 
      padding: 'clamp(24px, 3vw, 48px) clamp(16px, 2vw, 24px)' 
    }}>
      <h1 
        style={{ 
          fontFamily: 'var(--font-creepster)',
          color: '#a40000',
          fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
          marginBottom: 'clamp(16px, 3vw, 24px)'
        }}
      >
        Edit Film
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'clamp(16px, 3vw, 20px)' }}>
        {/* Film Name */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#c0c0c0', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
            Film Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{
              width: '100%',
              padding: 'clamp(10px, 2vw, 12px)',
              borderRadius: '6px',
              border: '2px solid #8b0000',
              backgroundColor: '#2d2d2d',
              color: '#c0c0c0',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Two Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {/* Release Year */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c0c0c0', fontWeight: 'bold', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
              Release Year
            </label>
            <input
              type="number"
              value={formData.releaseYear}
              onChange={(e) => setFormData({ ...formData, releaseYear: e.target.value })}
              style={{
                width: '100%',
                padding: 'clamp(10px, 2vw, 12px)',
                borderRadius: '6px',
                border: '2px solid #8b0000',
                backgroundColor: '#2d2d2d',
                color: '#c0c0c0',
                fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Rating */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c0c0c0', fontWeight: 'bold', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
              Rating (out of 5) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.letterboxdRating}
              onChange={(e) => setFormData({ ...formData, letterboxdRating: e.target.value })}
              required
              style={{
                width: '100%',
                padding: 'clamp(10px, 2vw, 12px)',
                borderRadius: '6px',
                border: '2px solid #8b0000',
                backgroundColor: '#2d2d2d',
                color: '#c0c0c0',
                fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Director */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#c0c0c0', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
            Director
          </label>
          <input
            type="text"
            value={formData.director}
            onChange={(e) => setFormData({ ...formData, director: e.target.value })}
            style={{
              width: '100%',
              padding: 'clamp(10px, 2vw, 12px)',
              borderRadius: '6px',
              border: '2px solid #8b0000',
              backgroundColor: '#2d2d2d',
              color: '#c0c0c0',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Genre */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#c0c0c0', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
            Genre (comma-separated)
          </label>
          <input
            type="text"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            placeholder="Horror, Thriller, Drama"
            style={{
              width: '100%',
              padding: 'clamp(10px, 2vw, 12px)',
              borderRadius: '6px',
              border: '2px solid #8b0000',
              backgroundColor: '#2d2d2d',
              color: '#c0c0c0',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Cast */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#c0c0c0', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
            Cast (comma-separated)
          </label>
          <input
            type="text"
            value={formData.cast}
            onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
            placeholder="Actor 1, Actor 2, Actor 3"
            style={{
              width: '100%',
              padding: 'clamp(10px, 2vw, 12px)',
              borderRadius: '6px',
              border: '2px solid #8b0000',
              backgroundColor: '#2d2d2d',
              color: '#c0c0c0',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Plot */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#c0c0c0', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
            Plot Summary
          </label>
          <textarea
            value={formData.plot}
            onChange={(e) => setFormData({ ...formData, plot: e.target.value })}
            rows={4}
            style={{
              width: '100%',
              padding: 'clamp(10px, 2vw, 12px)',
              borderRadius: '6px',
              border: '2px solid #8b0000',
              backgroundColor: '#2d2d2d',
              color: '#c0c0c0',
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Letterboxd Link */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#c0c0c0', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
            Letterboxd Link *
          </label>
          <input
            type="url"
            value={formData.letterboxdLink}
            onChange={(e) => setFormData({ ...formData, letterboxdLink: e.target.value })}
            required
            style={{
              width: '100%',
              padding: 'clamp(10px, 2vw, 12px)',
              borderRadius: '6px',
              border: '2px solid #8b0000',
              backgroundColor: '#2d2d2d',
              color: '#c0c0c0',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Admin Name */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#a40000', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
            Your Name (Admin)
          </label>
          <input
            type="text"
            value={formData.adminName}
            onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
            placeholder="Enter your name"
            style={{
              width: '100%',
              padding: 'clamp(10px, 2vw, 12px)',
              borderRadius: '6px',
              border: '2px solid #a40000',
              backgroundColor: '#2d2d2d',
              color: '#c0c0c0',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Admin Review */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#a40000', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
            Your Review / Thoughts (Admin)
          </label>
          <textarea
            value={formData.adminReview}
            onChange={(e) => setFormData({ ...formData, adminReview: e.target.value })}
            rows={6}
            placeholder="Write your personal review or thoughts about this film..."
            style={{
              width: '100%',
              padding: 'clamp(10px, 2vw, 12px)',
              borderRadius: '6px',
              border: '2px solid #a40000',
              backgroundColor: '#2d2d2d',
              color: '#c0c0c0',
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: '1.6',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Explicit Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="explicit"
            checked={formData.isExplicit}
            onChange={(e) => setFormData({ ...formData, isExplicit: e.target.checked })}
            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#a40000' }}
          />
          <label htmlFor="explicit" style={{ color: '#c0c0c0', cursor: 'pointer', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
            Mark as Explicit Content
          </label>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              flex: 1,
              minWidth: '150px',
              padding: 'clamp(12px, 2vw, 16px)',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              backgroundColor: saving ? '#666' : '#a40000',
              color: 'white',
              border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {saving ? 'Saving...' : '✓ Save Changes'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/manage-films')}
            style={{
              padding: 'clamp(12px, 2vw, 16px) clamp(20px, 3vw, 32px)',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              backgroundColor: 'transparent',
              color: '#c0c0c0',
              border: '2px solid #8b0000',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8b0000'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}


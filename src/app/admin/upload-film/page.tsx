'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { addFilm, uploadImage } from '@/lib/firebaseHelpers';

export default function UploadFilmPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    letterboxdLink: '',
    letterboxdRating: '5.0',
    isExplicit: false,
    director: '',
    genre: '',
    cast: '',
    plot: '',
    releaseYear: ''
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPosterPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Film name is required');
      }
      if (!formData.letterboxdLink.trim()) {
        throw new Error('Letterboxd link is required');
      }
      if (!posterFile) {
        throw new Error('Poster image is required');
      }

      // Upload poster to Cloudinary
      const posterUrl = await uploadImage(posterFile, 'posters');

      // Create film object - only include fields with values
      const newFilm: any = {
        name: formData.name.trim(),
        letterboxdLink: formData.letterboxdLink.trim(),
        letterboxdRating: parseFloat(formData.letterboxdRating),
        posterUrl,
        frameCount: 0,
        isExplicit: formData.isExplicit,
        uploadedAt: new Date()
      };

      // Add optional fields ONLY if they have values
      if (formData.director.trim()) {
        newFilm.director = formData.director.trim();
      }
      
      if (formData.genre.trim()) {
        newFilm.genre = formData.genre
          .split(',')
          .map((g: string) => g.trim())
          .filter((g: string) => g.length > 0);
      }
      
      if (formData.cast.trim()) {
        newFilm.cast = formData.cast
          .split(',')
          .map((c: string) => c.trim())
          .filter((c: string) => c.length > 0);
      }
      
      if (formData.plot.trim()) {
        newFilm.plot = formData.plot.trim();
      }
      
      if (formData.releaseYear.trim()) {
        const year = parseInt(formData.releaseYear);
        if (!isNaN(year)) {
          newFilm.releaseYear = year;
        }
      }

      await addFilm(newFilm);
      alert('✅ Film added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        letterboxdLink: '',
        letterboxdRating: '5.0',
        isExplicit: false,
        director: '',
        genre: '',
        cast: '',
        plot: '',
        releaseYear: ''
      });
      setPosterFile(null);
      setPosterPreview('');

      router.push('/admin/manage-films');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div style={{ padding: '24px', textAlign: 'center', color: '#c0c0c0' }}>Not authorized</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--font-creepster)',
          color: '#a40000',
          fontSize: '2rem',
          marginBottom: '24px'
        }}>
          Add New Film
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          {/* Film Name - Required */}
          <div>
            <label style={{ color: '#c0c0c0', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Film Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., The Shawshank Redemption"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '2px solid #8b0000',
                backgroundColor: '#2d2d2d',
                color: '#c0c0c0',
                fontSize: '14px'
              }}
              required
            />
          </div>

          {/* Letterboxd Link - Required */}
          <div>
            <label style={{ color: '#c0c0c0', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Letterboxd Link *
            </label>
            <input
              type="url"
              name="letterboxdLink"
              value={formData.letterboxdLink}
              onChange={handleInputChange}
              placeholder="https://letterboxd.com/film/..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '2px solid #8b0000',
                backgroundColor: '#2d2d2d',
                color: '#c0c0c0',
                fontSize: '14px'
              }}
              required
            />
          </div>

          {/* Letterboxd Rating - Required (Decimal) */}
          <div>
            <label style={{ color: '#c0c0c0', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Letterboxd Rating * (e.g., 4.5, 8.2, 9.0)
            </label>
            <input
              type="number"
              name="letterboxdRating"
              value={formData.letterboxdRating}
              onChange={handleInputChange}
              placeholder="5.0"
              min="0"
              max="10"
              step="0.1"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '2px solid #8b0000',
                backgroundColor: '#2d2d2d',
                color: '#c0c0c0',
                fontSize: '14px'
              }}
              required
            />
          </div>

          {/* Release Year - Optional */}
          <div>
            <label style={{ color: '#c0c0c0', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Release Year
            </label>
            <input
              type="number"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleInputChange}
              placeholder="2023"
              min="1800"
              max={new Date().getFullYear()}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '2px solid #8b0000',
                backgroundColor: '#2d2d2d',
                color: '#c0c0c0',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Director & Genre */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ color: '#c0c0c0', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                Director
              </label>
              <input
                type="text"
                name="director"
                value={formData.director}
                onChange={handleInputChange}
                placeholder="e.g., Christopher Nolan"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '2px solid #8b0000',
                  backgroundColor: '#2d2d2d',
                  color: '#c0c0c0',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ color: '#c0c0c0', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                Genre (comma-separated)
              </label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                placeholder="Drama, Crime, Thriller"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '2px solid #8b0000',
                  backgroundColor: '#2d2d2d',
                  color: '#c0c0c0',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Cast */}
          <div>
            <label style={{ color: '#c0c0c0', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Cast (comma-separated)
            </label>
            <input
              type="text"
              name="cast"
              value={formData.cast}
              onChange={handleInputChange}
              placeholder="Actor 1, Actor 2, Actor 3"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '2px solid #8b0000',
                backgroundColor: '#2d2d2d',
                color: '#c0c0c0',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Plot */}
          <div>
            <label style={{ color: '#c0c0c0', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Plot
            </label>
            <textarea
              name="plot"
              value={formData.plot}
              onChange={handleInputChange}
              placeholder="Brief plot description"
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '2px solid #8b0000',
                backgroundColor: '#2d2d2d',
                color: '#c0c0c0',
                fontFamily: 'inherit',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Poster Upload - Required */}
          <div>
            <label style={{ color: '#c0c0c0', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Poster Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePosterChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '2px solid #8b0000',
                backgroundColor: '#2d2d2d',
                color: '#c0c0c0',
                fontSize: '14px'
              }}
              required
            />
            {posterPreview && (
              <img
                src={posterPreview}
                alt="Poster preview"
                style={{
                  marginTop: '12px',
                  maxWidth: '200px',
                  height: 'auto',
                  borderRadius: '6px',
                  border: '2px solid #8b0000'
                }}
              />
            )}
          </div>

          {/* Explicit Content Warning */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              name="isExplicit"
              checked={formData.isExplicit}
              onChange={handleInputChange}
              id="isExplicit"
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label htmlFor="isExplicit" style={{ color: '#c0c0c0', cursor: 'pointer' }}>
              Mark as Explicit Content
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: 'rgba(164, 0, 0, 0.2)',
              border: '2px solid #a40000',
              color: '#a40000',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#a40000',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              fontSize: '16px',
              transition: 'all 0.3s'
            }}
          >
            {loading ? '⏳ Uploading...' : '✓ Add Film'}
          </button>
        </form>
      </div>
    </div>
  );
}

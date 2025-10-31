export interface Film {
  id: string;
  name: string;
  letterboxdLink: string;
  letterboxdRating: number;
  posterUrl: string;
  frameCount: number;
  isExplicit: boolean;
  uploadedAt: Date;
  // Optional fields
  director?: string;
  genre?: string[];
  cast?: string[];
  plot?: string;
  releaseYear?: number;
}

export interface Frame {
  id: string;
  filmId: string;
  filmName: string;
  imageUrl: string;
  isExplicit: boolean;
  order: number;
  uploadedAt: Date;
}

export interface Film {
  id: string;
  name: string;
  letterboxdLink: string;
  letterboxdRating: number;
  posterUrl: string;
  frameCount: number;
  uploadedAt: Date;
  isExplicit: boolean;
  
  // Optional fields
  releaseYear?: number;
  director?: string;
  genre?: string[];
  cast?: string[];
  plot?: string;
  
  // NEW FIELDS
  adminName?: string;      // Admin who added the film
  adminReview?: string;    // Admin's review/thoughts
}

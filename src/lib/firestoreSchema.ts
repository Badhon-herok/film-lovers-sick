import { Timestamp } from 'firebase/firestore';

export interface Film {
  id: string;
  name: string;
  letterboxdLink: string;
  letterboxdRating: number;
  posterUrl: string;
  frameCount: number;
  uploadedAt: Timestamp | Date;
  isExplicit: boolean;
  
  // Optional fields
  releaseYear?: number;
  director?: string;
  genre?: string[];
  cast?: string[];
  plot?: string;
  adminName?: string;
  adminReview?: string;
}

export interface Frame {
  id: string;
  filmId: string;
  filmName: string;
  imageUrl: string;
  uploadedAt: Timestamp | Date;
  isExplicit: boolean;
  order?: number;
}


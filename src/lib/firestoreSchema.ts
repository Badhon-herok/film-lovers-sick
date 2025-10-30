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

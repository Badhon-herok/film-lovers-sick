import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  query, 
  orderBy, 
  limit,
  where,
  Timestamp,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Film, Frame } from './firestoreSchema';

// Upload image to Cloudinary through the Next.js API route
export const uploadImage = async (
  file: File, 
  folder: string = 'film-lovers'
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Image upload failed');
  }

  const data = await response.json();

  const optimizedUrl = data.secure_url.replace(
    '/upload/',
    '/upload/q_95,f_auto,dpr_auto,c_fill,g_auto/'
  );

  return optimizedUrl;
};


// Add a new film (manual input version)
export const addFilm = async (filmData: Omit<Film, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'films'), {
    ...filmData,
    uploadedAt: Timestamp.now(),
    frameCount: 0,
  });
  return docRef.id;
};

// Get all films
export const getAllFilms = async (includeExplicit: boolean = false): Promise<Film[]> => {
  const querySnapshot = await getDocs(collection(db, 'films'));
  let films = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Film));

  if (!includeExplicit) {
    films = films.filter(film => !film.isExplicit);
  }

  films.sort((a, b) => {
    const aTime = a.uploadedAt instanceof Timestamp ? a.uploadedAt.toDate().getTime() : new Date(a.uploadedAt).getTime();
    const bTime = b.uploadedAt instanceof Timestamp ? b.uploadedAt.toDate().getTime() : new Date(b.uploadedAt).getTime();
    return bTime - aTime;
  });

  return films;
};

// Get single film by ID
export const getFilmById = async (filmId: string): Promise<Film | null> => {
  const docRef = doc(db, 'films', filmId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Film;
  }
  return null;
};

// Add a frame to a film
export const addFrame = async (frameData: Omit<Frame, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'frames'), {
    ...frameData,
    uploadedAt: Timestamp.now(),
  });
  
  return docRef.id;
};

// Get frames for a specific film
export const getFramesByFilmId = async (
  filmId: string, 
  includeExplicit: boolean = false
): Promise<Frame[]> => {
  const querySnapshot = await getDocs(collection(db, 'frames'));
  let frames = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Frame));

  frames = frames.filter(frame => frame.filmId === filmId);

  if (!includeExplicit) {
    frames = frames.filter(frame => !frame.isExplicit);
  }

  frames.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return frames;
};

// Get recent frames (for homepage)
export const getRecentFrames = async (
  limitCount: number = 12,
  includeExplicit: boolean = false
): Promise<Frame[]> => {
  let q = query(
    collection(db, 'frames'), 
    orderBy('uploadedAt', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  let frames = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Frame));
  
  if (!includeExplicit) {
    frames = frames.filter(frame => !frame.isExplicit);
  }
  
  return frames;
};

// Get all frames (useful for computing counts on index pages)
export const getAllFrames = async (includeExplicit: boolean = false): Promise<Frame[]> => {
  const querySnapshot = await getDocs(collection(db, 'frames'));
  let frames = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Frame));

  if (!includeExplicit) {
    frames = frames.filter(frame => !frame.isExplicit);
  }

  return frames;
};

// Delete a frame
export const deleteFrame = async (frameId: string, filmId: string): Promise<void> => {
  // Delete frame from collection
  await deleteDoc(doc(db, 'frames', frameId));
};

// Update film details - FIXED to handle null and empty values
export const updateFilm = async (
  filmId: string, 
  updates: Partial<Omit<Film, 'id'>>
): Promise<void> => {
  // Filter out undefined values but keep null and empty strings/arrays
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]) => value !== undefined)
  );
  
  const filmRef = doc(db, 'films', filmId);
  await updateDoc(filmRef, cleanUpdates);
};

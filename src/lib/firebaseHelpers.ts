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
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Film, Frame } from './firestoreSchema';


// Upload image to Cloudinary
export const uploadImage = async (
  file: File, 
  folder: string = 'film-lovers'
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'film_lovers_preset');
  formData.append('folder', folder);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Image upload failed');
  }

  const data = await response.json();
  return data.secure_url;
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
  let q = query(collection(db, 'films'), orderBy('uploadedAt', 'desc'));
  
  if (!includeExplicit) {
    q = query(collection(db, 'films'), where('isExplicit', '==', false), orderBy('uploadedAt', 'desc'));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Film));
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
  
  // Update film's frame count
  const filmRef = doc(db, 'films', frameData.filmId);
  const filmDoc = await getDoc(filmRef);
  if (filmDoc.exists()) {
    const currentCount = filmDoc.data().frameCount || 0;
    await updateDoc(filmRef, { frameCount: currentCount + 1 });
  }
  
  return docRef.id;
};


// Get frames for a specific film
export const getFramesByFilmId = async (
  filmId: string, 
  includeExplicit: boolean = false
): Promise<Frame[]> => {
  let q = query(
    collection(db, 'frames'), 
    where('filmId', '==', filmId),
    orderBy('order', 'asc')
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

import { deleteDoc } from 'firebase/firestore';

// Delete a frame
export const deleteFrame = async (frameId: string, filmId: string): Promise<void> => {
  // Delete frame from collection
  await deleteDoc(doc(db, 'frames', frameId));
  
  // Update film's frame count
  const filmRef = doc(db, 'films', filmId);
  const filmDoc = await getDoc(filmRef);
  if (filmDoc.exists()) {
    const currentCount = filmDoc.data().frameCount || 0;
    await updateDoc(filmRef, { frameCount: Math.max(0, currentCount - 1) });
  }
};


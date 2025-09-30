// src/utils.js
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

let usedMovieIds = new Set();

export const getMovies = async () => {
  const querySnapshot = await getDocs(collection(db, "movies"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getRandomMovie = async () => {
  const movies = await getMovies();
  const available = movies.filter(m => !m.watched && !usedMovieIds.has(m.id));

  if (available.length === 0) {
    usedMovieIds.clear();
    const allAvailable = movies.filter(m => !m.watched);
    if (allAvailable.length === 0) return null;
    const randomMovie = allAvailable[Math.floor(Math.random() * allAvailable.length)];
    usedMovieIds.add(randomMovie.id);
    return randomMovie;
  }

  const randomMovie = available[Math.floor(Math.random() * available.length)];
  usedMovieIds.add(randomMovie.id);
  return randomMovie;
};

export const addMovie = async (movieData) => {
  const docRef = await addDoc(collection(db, "movies"), {
    ...movieData,
    watched: false,
    createdAt: new Date()
  });
  return { id: docRef.id, ...movieData, watched: false };
};

export const markAsWatched = async (id) => {
  await updateDoc(doc(db, "movies", id), { watched: true });
};

export const deleteMovie = async (id) => {
  await deleteDoc(doc(db, "movies", id));
  usedMovieIds.delete(id);
};

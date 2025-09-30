// src/utils.js
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

// Хранит ID фильмов, уже показанных в текущей сессии (чтобы не повторялись)
let usedMovieIds = new Set();

/**
 * Получает все фильмы из Firestore
 */
export const getMovies = async () => {
  const querySnapshot = await getDocs(collection(db, "movies"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Возвращает случайный фильм, которого ещё не было в текущей сессии.
 * Если все фильмы использованы — сбрасывает историю и выбирает из всех.
 */
export const getRandomMovie = async () => {
  const movies = await getMovies();
  const available = movies.filter(m => !m.watched && !usedMovieIds.has(m.id));

  if (available.length === 0) {
    // Сбросить историю использованных фильмов
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

/**
 * Добавляет новый фильм в Firestore
 */
export const addMovie = async (movieData) => {
  const docRef = await addDoc(collection(db, "movies"), {
    ...movieData,
    watched: false,
    createdAt: new Date(),
  });
  return { id: docRef.id, ...movieData, watched: false };
};

/**
 * Помечает фильм как "уже посмотрели"
 */
export const markAsWatched = async (id) => {
  await updateDoc(doc(db, "movies", id), { watched: true });
};

/**
 * Удаляет фильм из Firestore
 */
export const deleteMovie = async (id) => {
  await deleteDoc(doc(db, "movies", id));
  usedMovieIds.delete(id); // Удаляем из локального кэша сессии
};

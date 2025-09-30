// src/utils.js
let usedMovieIds = new Set();

export const getMovies = () => {
  const data = localStorage.getItem('movies');
  return data ? JSON.parse(data) : [];
};

export const saveMovies = (movies) => {
  localStorage.setItem('movies', JSON.stringify(movies));
};

export const getRandomMovie = () => {
  const movies = getMovies().filter(m => !m.watched);
  const available = movies.filter(m => !usedMovieIds.has(m.id));

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

export const deleteMovie = (id) => {
  const movies = getMovies();
  const updated = movies.filter(m => m.id !== id);
  saveMovies(updated);
  usedMovieIds.delete(id);
};

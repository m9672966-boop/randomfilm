// src/utils.js
export const getMovies = () => {
  const data = localStorage.getItem('movies');
  return data ? JSON.parse(data) : [];
};

export const saveMovies = (movies) => {
  localStorage.setItem('movies', JSON.stringify(movies));
};

export const getRandomMovie = (excludeWatched = true) => {
  const movies = getMovies();
  const available = excludeWatched ? movies.filter(m => !m.watched) : movies;
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
};

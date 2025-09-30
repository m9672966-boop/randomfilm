// src/utils.js
let usedMovieIds = new Set();

export const getMovies = () => {
  const data = localStorage.getItem('movies');
  return data ? JSON.parse(data) : [];
};

export const saveMovies = (movies) => {
  localStorage.setItem('movies', JSON.stringify(movies));
};

// Сброс использованных фильмов, когда все просмотрены
export const resetUsedMovies = () => {
  usedMovieIds.clear();
};

// Получить случайный фильм, которого ещё не было в текущей сессии
export const getRandomMovie = () => {
  const movies = getMovies().filter(m => !m.watched);
  const available = movies.filter(m => !usedMovieIds.has(m.id));

  if (available.length === 0) {
    // Все фильмы использованы — сброс
    usedMovieIds.clear();
    return getRandomMovie();
  }

  const randomMovie = available[Math.floor(Math.random() * available.length)];
  usedMovieIds.add(randomMovie.id);
  return randomMovie;
};

// Удалить фильм по ID
export const deleteMovie = (id) => {
  const movies = getMovies();
  const updated = movies.filter(m => m.id !== id);
  saveMovies(updated);
  // Удаляем из истории использованных, если был там
  usedMovieIds.delete(id);
};

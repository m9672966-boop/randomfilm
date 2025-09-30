// src/App.jsx
import { useState, useEffect } from 'react';
import Login from './components/Login';
import ConfettiAnimation from './components/ConfettiAnimation';
import { getMovies, saveMovies, getRandomMovie, deleteMovie } from './utils';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [movies, setMovies] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const stored = getMovies();
    setMovies(stored);
    if (stored.length > 0) {
      setCurrentMovie(getRandomMovie());
    }
  }, []);
  const handleDelete = (id) => {
  deleteMovie(id);
  const updated = movies.filter(m => m.id !== id);
  setMovies(updated);
  if (currentMovie && currentMovie.id === id) {
    setCurrentMovie(getRandomMovie());
  }
};
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const generateMovie = () => {
    setShowAnimation(true);
  };

  const onAnimationComplete = () => {
    const movie = getRandomMovie();
    setCurrentMovie(movie);
    setShowAnimation(false);
  };

  const markAsWatched = () => {
    if (!currentMovie) return;
    const updatedMovies = movies.map(m =>
      m.id === currentMovie.id ? { ...m, watched: true } : m
    );
    setMovies(updatedMovies);
    saveMovies(updatedMovies);
    setCurrentMovie(getRandomMovie());
  };

  const addMovie = (movieData) => {
    const newMovie = {
      id: Date.now(),
      ...movieData,
      watched: false,
    };
    const updated = [...movies, newMovie];
    setMovies(updated);
    saveMovies(updated);
    if (!currentMovie) setCurrentMovie(newMovie);
    setIsAddModalOpen(false); // Закрываем форму после добавления
  };

  const handleDelete = (id) => {
    deleteMovie(id);
    const updated = movies.filter(m => m.id !== id);
    setMovies(updated);
    if (currentMovie && currentMovie.id === id) {
      setCurrentMovie(getRandomMovie());
    }
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  if (showAnimation) return <ConfettiAnimation onComplete={onAnimationComplete} />;

  // Дублируем для бесконечной ленты
  const duplicatedMovies = [...movies, ...movies];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🎬 Случайный фильм</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full transition font-medium"
            >
              Добавить фильм
            </button>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Выйти
            </button>
          </div>
        </header>

        {/* Main Card */}
        {currentMovie ? (
          <div className="bg-gray-800 rounded-2xl shadow-xl p-6 mb-10 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">{currentMovie.title}</h2>

            {currentMovie.cover ? (
              <img
                src={currentMovie.cover}
                alt={currentMovie.title}
                className="mx-auto rounded-lg my-4 w-[200px] h-[300px] object-cover border-2 border-gray-700"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
                }}
              />
            ) : (
              <div className="mx-auto w-[200px] h-[300px] bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                🎞️ Без обложки
              </div>
            )}

            <p className="text-gray-300 mb-2">
              {currentMovie.year && <span>Год: {currentMovie.year} • </span>}
              {currentMovie.genre && <span>Жанр: {currentMovie.genre}</span>}
            </p>

            {currentMovie.reason && (
              <p className="italic text-gray-400 mt-2">«{currentMovie.reason}»</p>
            )}

            {currentMovie.link && (
              <p className="mt-2">
                <a
                  href={currentMovie.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  🔗 Посмотреть фильм
                </a>
              </p>
            )}

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={generateMovie}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition font-medium"
              >
                Сгенерировать снова
              </button>
              <button
                onClick={markAsWatched}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-full transition font-medium"
              >
                Уже посмотрели ✅
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">Нет фильмов в списке!</p>
          </div>
        )}

        {/* Бегущая строка — одна лента */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Все фильмы</h3>
          <div className="overflow-hidden h-[340px]">
            <div className="flex space-x-6 animate-marquee">
              {duplicatedMovies.map((movie) => (
                <MovieItem key={movie.id} movie={movie} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Modal for Add Movie */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Добавить фильм</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              addMovie({
                title: e.target.title.value,
                cover: e.target.cover.value,
                genre: e.target.genre.value,
                year: e.target.year.value,
                reason: e.target.reason.value,
                link: e.target.link.value,
              });
            }} className="space-y-4">
              <input
                name="title"
                placeholder="Название *"
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                name="cover"
                placeholder="URL обложки (опционально)"
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="genre"
                placeholder="Жанр"
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="year"
                placeholder="Год"
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="link"
                placeholder="Ссылка на фильм (опционально)"
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="reason"
                placeholder="Почему рекомендуете?"
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition"
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Карточка фильма в ленте
const MovieItem = ({ movie, onDelete }) => {
  return (
    <div className={`flex-shrink-0 w-[200px] h-[300px] rounded-lg overflow-hidden shadow-md relative group ${
      movie.watched ? 'opacity-60' : ''
    }`}>
      {movie.cover ? (
        <img
          src={movie.cover}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">
          🎞️
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 text-xs truncate">
        {movie.title}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(movie.id);
        }}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
        title="Удалить фильм"
      >
        ✕
      </button>
    </div>
  );
};

export default App;

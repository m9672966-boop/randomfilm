// src/App.jsx
import { useState, useEffect } from 'react';
import Login from './components/Login';
import ConfettiAnimation from './components/ConfettiAnimation';
import { getMovies, saveMovies, getRandomMovie } from './utils';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const stored = getMovies();
    setMovies(stored);
    if (stored.length > 0) {
      setCurrentMovie(getRandomMovie());
    }
  }, []);

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
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  if (showAnimation) return <ConfettiAnimation onComplete={onAnimationComplete} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="flex justify-between items-center mb-8 pt-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            🎬 Случайный фильм
          </h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Выйти
          </button>
        </header>

        {/* Main Card — centered after animation */}
        {currentMovie && (
          <div className={`bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 text-center transform transition-all duration-500 ${showAnimation ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
            <h2 className="text-2xl font-bold mb-2">{currentMovie.title}</h2>

            {/* Cover Image — smaller size */}
            {currentMovie.cover ? (
              <img
                src={currentMovie.cover}
                alt={currentMovie.title}
                className="mx-auto rounded-lg my-4 max-h-64 object-cover border-2 border-gray-700 shadow-md w-[200px] h-[300px]"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
                  e.target.alt = 'Изображение недоступно';
                }}
              />
            ) : (
              <div className="mx-auto w-48 h-64 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                🎞️ Без обложки
              </div>
            )}

            <p className="text-gray-300 mb-2">
              {currentMovie.year && <span>Год: {currentMovie.year} • </span>}
              {currentMovie.genre && <span>Жанр: {currentMovie.genre} • </span>}
            </p>

            {currentMovie.reason && (
              <p className="italic text-gray-400 mt-2">«{currentMovie.reason}»</p>
            )}

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={generateMovie}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition text-sm font-medium"
              >
                Сгенерировать снова
              </button>
              <button
                onClick={markAsWatched}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-full transition text-sm font-medium"
              >
                Уже посмотрели ✅
              </button>
            </div>
          </div>
        )}

        {/* Marquee with all movies — floating right */}
        <div className="mb-8 overflow-hidden">
          <h3 className="text-xl font-semibold mb-4">Все фильмы</h3>
          <div className="flex space-x-4 animate-marquee">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className={`flex-shrink-0 w-[200px] h-[300px] rounded-lg overflow-hidden shadow-md border-2 ${
                  movie.watched ? 'border-gray-600 opacity-70' : 'border-gray-700'
                }`}
              >
                {movie.cover ? (
                  <img
                    src={movie.cover}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
                      e.target.alt = 'Изображение недоступно';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">
                    🎞️
                  </div>
                )}
                <div className="p-2 bg-gray-800 text-xs truncate">
                  {movie.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Movie Form */}
        <MovieForm onAdd={addMovie} />

      </div>
    </div>
  );
};

// Форма добавления фильма — оставим как есть, но можно стилизовать дополнительно
const MovieForm = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    cover: '',
    genre: '',
    year: '',
    reason: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onAdd(formData);
    setFormData({ title: '', cover: '', genre: '', year: '', reason: '' });
    setIsOpen(false);
  };

  return (
    <div className="mt-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full transition text-sm font-medium"
      >
        {isOpen ? 'Отмена' : 'Добавить фильм'}
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 p-6 bg-gray-800 rounded-xl shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Название фильма *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Название фильма *"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">URL обложки (опционально)</label>
            <input
              name="cover"
              value={formData.cover}
              onChange={handleChange}
              placeholder="https://example.com/poster.jpg"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Жанр</label>
            <input
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="Драма, Комедия, Боевик..."
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Год</label>
            <input
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="2024"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Почему рекомендуете?</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Опишите, почему стоит посмотреть этот фильм..."
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-full transition font-medium"
          >
            Добавить фильм
          </button>
        </form>
      )}
    </div>
  );
};

export default App;

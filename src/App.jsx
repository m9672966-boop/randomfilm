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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🎲 Случайный фильм</h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="text-sm text-gray-400 hover:text-white"
          >
            Выйти
          </button>
        </header>

        {currentMovie ? (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{currentMovie.title}</h2>
            {currentMovie.cover && (
              <img
                src={currentMovie.cover}
                alt={currentMovie.title}
                className="mx-auto rounded-lg my-4 max-h-64 object-cover"
              />
            )}
            <p className="text-gray-300 mb-2">
              {currentMovie.year && <span>Год: {currentMovie.year} • </span>}
              {currentMovie.genre && <span>Жанр: {currentMovie.genre} • </span>}
            </p>
            {currentMovie.reason && (
              <p className="italic text-gray-400">«{currentMovie.reason}»</p>
            )}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={generateMovie}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                Сгенерировать снова
              </button>
              <button
                onClick={markAsWatched}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
              >
                Уже посмотрели ✅
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl">Нет фильмов в списке!</p>
          </div>
        )}

        <MovieForm onAdd={addMovie} />
      </div>
    </div>
  );
};

// Форма добавления фильма
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
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
      >
        {isOpen ? 'Отмена' : 'Добавить фильм'}
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-800 rounded">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Название фильма *"
            className="w-full p-2 mb-2 rounded bg-gray-700"
            required
          />
          <input
            name="cover"
            value={formData.cover}
            onChange={handleChange}
            placeholder="URL обложки (опционально)"
            className="w-full p-2 mb-2 rounded bg-gray-700"
          />
          <input
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="Жанр"
            className="w-full p-2 mb-2 rounded bg-gray-700"
          />
          <input
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Год"
            className="w-full p-2 mb-2 rounded bg-gray-700"
          />
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Почему рекомендуете?"
            className="w-full p-2 mb-2 rounded bg-gray-700"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
          >
            Добавить
          </button>
        </form>
      )}
    </div>
  );
};

export default App;

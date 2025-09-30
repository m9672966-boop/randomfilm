// src/App.jsx
import { useState, useEffect } from 'react';
import Login from './components/Login';
import ConfettiAnimation from './components/ConfettiAnimation';
import { getMovies, saveMovies, getRandomMovie, deleteMovie, resetUsedMovies } from './utils';

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

  const handleDelete = (id) => {
    deleteMovie(id);
    const updated = movies.filter(m => m.id !== id);
    setMovies(updated);
    // Если удалили текущий фильм — сгенерировать новый
    if (currentMovie && currentMovie.id === id) {
      setCurrentMovie(getRandomMovie());
    }
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  if (showAnimation) return <ConfettiAnimation onComplete={onAnimationComplete} />;

  // Создаём удвоенный массив для бесконечной ленты
  const duplicatedMovies = [...movies, ...movies];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🎬 Случайный фильм</h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Выйти
          </button>
        </header>

        {/* Main Card */}
        {currentMovie ? (
          <div className="bg-gray-800 rounded-2xl shadow-xl p-6 mb-10 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">{currentMovie.title}</h2>
            {currentMovie.cover ? (
              <img
                src={currentMovie.cover}
                alt={currentMovie.title}
                className="mx-auto rounded-lg my-4 w-[200px] h-[300px] object-cover border-2 border-gray-700 shadow-md"
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

        {/* Marquee — 2 строки */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Все фильмы</h3>

          {/* Ряд 1 */}
          <div className="overflow-hidden mb-4 h-[340px]">
            <div className="flex space-x-6 animate-marquee-row1">
              {duplicatedMovies.map((movie) => (
                <MovieItem key={`row1-${movie.id}`} movie={movie} onDelete={handleDelete} />
              ))}
            </div>
          </div>

          {/* Ряд 2 */}
          <div className="overflow-hidden h-[340px]">
            <div className="flex space-x-6 animate-marquee-row2">
              {duplicatedMovies.map((movie) => (
                <MovieItem key={`row2-${movie.id}`} movie={movie} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        </div>

        <MovieForm onAdd={addMovie} />
      </div>
    </div>
  );
};

// Компонент карточки фильма с кнопкой удаления
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

// Форма добавления
const MovieForm = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    cover: '',
    genre: '',
    year: '',
    reason: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onAdd(formData);
    setFormData({ title: '', cover: '', genre: '', year: '', reason: '' });
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full transition font-medium"
      >
        {isOpen ? 'Отмена' : 'Добавить фильм'}
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 p-6 bg-gray-800 rounded-xl shadow-md max-w-2xl">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Название *" className="w-full p-2 mb-2 rounded bg-gray-700 border border-gray-600" required />
          <input name="cover" value={formData.cover} onChange={handleChange} placeholder="URL обложки" className="w-full p-2 mb-2 rounded bg-gray-700 border border-gray-600" />
          <input name="genre" value={formData.genre} onChange={handleChange} placeholder="Жанр" className="w-full p-2 mb-2 rounded bg-gray-700 border border-gray-600" />
          <input name="year" value={formData.year} onChange={handleChange} placeholder="Год" className="w-full p-2 mb-2 rounded bg-gray-700 border border-gray-600" />
          <textarea name="reason" value={formData.reason} onChange={handleChange} placeholder="Почему рекомендуете?" className="w-full p-2 mb-2 rounded bg-gray-700 border border-gray-600" rows="2" />
          <button type="submit" className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-full transition font-medium">
            Добавить
          </button>
        </form>
      )}
    </div>
  );
};

export default App;

// src/components/Login.jsx
import { useState } from 'react';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError('Неверный пароль');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-lg w-80">
        <h2 className="text-2xl mb-4">Доступ к панели</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-gray-700 border border-gray-600"
          placeholder="Пароль"
        />
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
        >
          Войти
        </button>
      </form>
    </div>
  );
};

export default Login;

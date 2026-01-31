import React, { useState,useEffect } from 'react';
import Header from '../components/Header';
import { useNavigate } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { getAuthToken } from '../utils/auth';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please log in.');
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-10">
            <div className="flex items-center">
              <span className="text-4xl font-black tracking-tighter">FITZDO</span>
              <span className="mx-2 text-gray-500">|</span>
              <span className="text-4xl font-light italic tracking-wide" style={{ fontFamily: 'cursive' }}>
                Circle
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-left">
            Register Account Here
          </h1>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email - ID <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-500 placeholder-gray-400 text-gray-700"
                placeholder="Create Your Email - ID"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Your Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-500 placeholder-gray-400 text-gray-700 pr-10"
                  placeholder="Enter Your Password"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <IoEyeOutline />
                  ) : (
                    <IoEyeOffOutline />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 text-black border border-gray-300 rounded focus:ring-black focus:ring-1"
                  required
                />
              </div>
              <div className="ml-2 text-sm">
                <label htmlFor="agree" className="text-gray-700">
                  By continuing, I agree to FITZDO's{' '}
                  <a href="#privacy" className="text-blue-600 underline font-medium hover:text-blue-800">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="#terms" className="text-blue-600 underline font-medium hover:text-blue-800">
                    Terms of Use
                  </a>
                  .
                </label>
              </div>
            </div>

            <div className="pt-1 flex justify-between gap-3">
              <button
                type="submit"
                disabled={loading || !agreed}
                className={`group inline-flex items-center justify-center px-4 py-3 bg-black text-white font-bold text-base relative overflow-hidden ${!agreed || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="relative z-10">
                  {loading ? 'Registering...' : 'Register'}
                </span>
                <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 border-2 border-black"></div>
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="group inline-flex items-center justify-center px-4 py-3 bg-white text-black font-bold text-base relative overflow-hidden border-2 border-black"
              >
                <span className="relative z-10">Already have an Account</span>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="h-2"></footer>
    </div>
  );
};

export default RegisterScreen;
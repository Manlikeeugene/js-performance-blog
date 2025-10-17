'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Mail, Lock, User, Eye, EyeOff, Zap, Github, Chrome } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function AuthPage({ mode = 'login' }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (session) {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  // If still loading, show a loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Zap className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit triggered:', { isLogin, formData }); // Add this
    setErrorMessage('');
    setSuccessMessage('');
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        if (isLogin) {
          console.log('Calling signIn with:', { email: formData.email }); // Add this

          const csrfRes = await fetch('/api/auth/csrf');
          const csrfData = await csrfRes.json();
          const result = await signIn('credentials', {
            ...csrfData, // Inject csrfToken
            email: formData.email,
            password: formData.password,
            redirect: false,
          });
          console.log('signIn result:', result); // Add this

          if (result?.error) {
            setErrorMessage(result.error || 'Login failed');
          } else {
            console.log('signIn success, refreshing...');
            router.refresh();
            window.location.href = result.url || '/dashboard';
            // setTimeout(() => {
            //   router.push('/dashboard');
            // }, 500);
          }
        } else {
          // Signup
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }),
          });

          console.log('Signup response status:', response.status);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            setErrorMessage(errorData.message || 'Signup failed');
            return;
          }

          // Success
          setSuccessMessage('Account created successfully! Please sign in.');
          setIsLogin(true);
          setFormData({ name: '', email: formData.email, password: '', confirmPassword: '' });
        }
      } catch (error) {
        console.error('signIn exception:', error); // Add this
        console.error('Auth network error:', error);
        setErrorMessage('Network error occurred. Please check your connection.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('Validation failed, errors:', errors); // Add this
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="w-full max-w-md relative z-10 mt-20">
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 p-8 sm:p-10 shadow-2xl">
        {/* Logo/Icon */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg shadow-emerald-500/30">
            <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 px-2">
            {isLogin 
              ? 'Sign in to continue to your account' 
              : 'Join our community of developers'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Sign Up Only) */}
          {!isLogin && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-slate-800/50 border ${
                    errors.name ? 'border-red-500' : 'border-slate-700'
                  } rounded-lg sm:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-slate-800/50 border ${
                  errors.email ? 'border-red-500' : 'border-slate-700'
                } rounded-lg sm:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base bg-slate-800/50 border ${
                  errors.password ? 'border-red-500' : 'border-slate-700'
                } rounded-lg sm:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field (Sign Up Only) */}
          {!isLogin && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-slate-800/50 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-700'
                  } rounded-lg sm:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Remember Me / Forgot Password (Login Only) */}
          {isLogin && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-slate-800 border-slate-700 rounded text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs sm:text-sm text-slate-400">Remember me</span>
              </label>
              <Link href="#" className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 transition">
                Forgot password?
              </Link>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-lg sm:rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>

          {/* Error Message (Red) */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Success Message (Green) */}
          {successMessage && (
            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
              {successMessage}
            </div>
          )}
        </form>

        {/* Toggle Mode */}
        <div className="mt-5 sm:mt-6 text-center">
          <p className="text-sm sm:text-base text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Terms (Sign Up Only) */}
        {!isLogin && (
          <p className="mt-5 sm:mt-6 text-xs text-center text-slate-500 leading-relaxed px-2">
            By signing up, you agree to our{' '}
            <Link href="#" className="text-emerald-400 hover:text-emerald-300">Terms of Service</Link>
            {' '}and{' '}
            <Link href="#" className="text-emerald-400 hover:text-emerald-300">Privacy Policy</Link>
          </p>
        )}
      </div>

      {/* Additional Info */}
      <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-slate-400 px-4">
        <p>Secured with industry-standard encryption</p>
      </div>
    </div>
  );
}
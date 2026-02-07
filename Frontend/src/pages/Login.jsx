import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ship, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    const credentials = {
      admin: { email: 'admin@apcs.dz', password: 'admin123' },
      operator: { email: 'operator@apcs.dz', password: 'operator123' },
      carrier: { email: 'carrier@apcs.dz', password: 'carrier123' },
    };

    const cred = credentials[role];
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
    setIsLoading(true);

    try {
      await login(cred.email, cred.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Quick login failed.');
      console.error('Quick login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-deep-ocean to-apcs-blue relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border border-white rounded-full"></div>
          <div className="absolute bottom-40 right-10 w-96 h-96 border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 border border-white rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <div className="flex items-center gap-4 mb-8">
            <Ship size={64} className="text-digital-cyan" />
            <div>
              <h1 className="text-5xl font-bold text-white">APCS</h1>
              <p className="text-digital-cyan text-lg">Algerian Port Community System</p>
            </div>
          </div>

          <div className="text-center max-w-md">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Digital Control of Physical Flow
            </h2>
            <p className="text-gray-300 text-lg">
              Streamline port operations with intelligent logistics management,
              real-time tracking, and AI-powered optimization.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-12">
            <div className="text-center">
              <p className="text-4xl font-bold text-digital-cyan">500+</p>
              <p className="text-gray-300">Daily Bookings</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-digital-cyan">12</p>
              <p className="text-gray-300">Terminals</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-digital-cyan">98%</p>
              <p className="text-gray-300">On-time Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Ship size={40} className="text-apcs-blue" />
            <div>
              <h1 className="text-2xl font-bold text-deep-ocean">APCS</h1>
              <p className="text-digital-cyan text-xs">Port Community System</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-deep-ocean">Welcome Back</h2>
              <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle size={20} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-apcs-blue border-gray-300 rounded focus:ring-apcs-blue"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-apcs-blue hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-apcs-blue hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Role Quick Access */}
            <div className="space-y-3">
              <p className="text-center text-sm text-gray-500 mb-3">Quick Demo Access</p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleQuickLogin('admin')}
                  className="py-2 px-3 border-2 border-red-500 rounded-lg text-sm text-gray-700 hover:bg-red-50 transition-colors"
                >
                  🔴 Admin
                </button>
                <button
                  onClick={() => handleQuickLogin('operator')}
                  className="py-2 px-3 border-2 border-yellow-500 rounded-lg text-sm text-gray-700 hover:bg-yellow-50 transition-colors"
                >
                  🟡 Operator
                </button>
                <button
                  onClick={() => handleQuickLogin('carrier')}
                  className="py-2 px-3 border-2 border-green-500 rounded-lg text-sm text-gray-700 hover:bg-green-50 transition-colors"
                >
                  🟢 Carrier
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-6">
            © 2026 APCS - Algerian Port Community System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

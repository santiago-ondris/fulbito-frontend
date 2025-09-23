import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import authService, { type LoginRequest, type RegisterRequest } from '../services/authService';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Form states
  const [loginForm, setLoginForm] = useState<LoginRequest>({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState<RegisterRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login(loginForm);
      
      if (response.success) {
        setSuccess('Login exitoso, redirigiendo...');
        // Redirigir después de un breve delay
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.register(registerForm);
      
      if (response.success) {
        setSuccess('Registro exitoso! Ahora podés iniciar sesión.');
        // Switch to login form
        setIsLogin(true);
        setRegisterForm({
          email: '',
          password: '',
          firstName: '',
          lastName: ''
        });
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch between login/register
  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="flex justify-center items-center space-x-2 mb-6">
          <Users className="h-10 w-10 text-purple-600" />
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Fulbito</h1>
            <p className="text-sm text-gray-500">Maestro Gringo</p>
          </div>
        </div>

        <h2 className="text-center text-3xl font-bold text-gray-900">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
          <button
            onClick={switchMode}
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            {isLogin ? 'Registrate' : 'Iniciá sesión'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow border border-gray-200 rounded-lg sm:px-10">
          
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-purple-50 border border-purple-200 rounded-md p-4">
              <p className="text-sm text-purple-600">{success}</p>
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Iniciar Sesión
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={registerForm.firstName}
                    onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Juan"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Apellido
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Pérez"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="mt-1 relative">
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Crear Cuenta
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
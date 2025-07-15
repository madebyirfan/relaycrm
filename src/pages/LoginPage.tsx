import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = (): boolean => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      if (!user.emailVerified) {
        toast.warning('Please verify your email before logging in.');
        return;
      }

      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err: any) {
      const errorMessage = err?.message || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a] px-4">
      <div className="bg-white dark:bg-[#2a2a2a] p-8 rounded-lg shadow w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Login</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 w-full border rounded dark:bg-[#333] dark:text-white"
          placeholder="Email"
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 w-full border rounded dark:bg-[#333] dark:text-white pr-10"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-300 space-y-2 sm:space-y-0">
          <p
            onClick={() => navigate('/forgot-password')}
            className="cursor-pointer text-blue-500 hover:underline"
          >
            Forgot password?
          </p>
          <p
            onClick={() => navigate('/signup')}
            className="cursor-pointer text-blue-500 hover:underline"
          >
            Create an account
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

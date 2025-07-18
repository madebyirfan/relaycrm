import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import LoginImage from '../assets/images/signin.png'; // Replace with your actual image if needed

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
        setLoading(false); // ✅ FIX: stop spinner
        return;
      }

      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Login failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Image */}
      <div className="hidden lg:block w-1/2 h-screen items-center justify-center bg-[#ffffff] dark:bg-[#0F1E3F]">
        <img
          src={LoginImage}
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-10 bg-white dark:bg-gray-900 relative">
        {/* Branding */}
        <div className="absolute top-6 left-6 text-xl font-semibold text-[#1677FF]">
          RealyCRM
        </div>

        <div className="max-w-md mx-auto w-full space-y-6">
          <h2 className="text-3xl font-bold text-black dark:text-white">
            Welcome back
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Sign in to your account</p>

          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 w-full border rounded-md dark:bg-[#333] dark:text-white"
              placeholder="Email address"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 w-full border rounded-md dark:bg-[#333] dark:text-white pr-10"
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
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-[#1677FF] hover:bg-[#146de2] text-white p-3 rounded-md w-full disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-300 space-y-2 sm:space-y-0">
            <p
              onClick={() => navigate('/forgot-password')}
              className="cursor-pointer text-[#1677FF] hover:underline"
            >
              Forgot password?
            </p>
            <p
              onClick={() => navigate('/signup')}
              className="cursor-pointer text-[#1677FF] hover:underline"
            >
              Create an account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset link sent to your email!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a] px-4">
      <div className="bg-white dark:bg-[#2a2a2a] p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Forgot Password
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-1">
            Enter your email to receive a password reset link.
          </p>
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md dark:bg-[#333] dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-[#1677FF] text-white font-semibold p-3 rounded-md hover:bg-[#0e65d2] transition disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <p
          onClick={() => window.history.back()}
          className="text-sm text-center text-[#1677FF] cursor-pointer hover:underline"
        >
          Back to Login
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

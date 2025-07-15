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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a]">
      <div className="bg-white dark:bg-[#2a2a2a] p-8 rounded-lg shadow w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Forgot Password
        </h2>

        <input
          className="p-2 w-full border rounded dark:bg-[#333] dark:text-white"
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <p className="text-sm text-center text-blue-500 mt-2 hover:underline cursor-pointer" onClick={() => window.history.back()}>
          Back to Login
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

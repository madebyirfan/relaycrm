import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Input, Button, message } from 'antd';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignup = async () => {
    if (!validateEmail(email)) {
      message.warning('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      message.warning('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);   

      // 🔐 Send verification email
      await sendEmailVerification(userCredential.user);
      setSuccess(true);
    } catch (error: any) {
      const errorMessage =
        error.code === 'auth/email-already-in-use'
          ? 'This email is already in use.'
          : error.code === 'auth/weak-password'
          ? 'Password is too weak.'
          : error.code === 'auth/invalid-email'
          ? 'Invalid email format.'
          : error.message || 'Signup failed.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="p-6 rounded shadow-md bg-white dark:bg-[#1f1f1f] w-full max-w-md space-y-6">
        {success ? (
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-500" size={48} />
            <h2 className="text-xl font-bold mt-4 text-black dark:text-white">
              Account Created
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              A verification email has been sent to <strong>{email}</strong>.
              <br />
              Please check your inbox to verify your account.
            </p>
            <Link to="/login">
              <Button type="primary" className="mt-4">
                Go to Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-black dark:text-white">
              Sign Up
            </h2>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              status={!email || validateEmail(email) ? '' : 'error'}
              aria-label="Email"
            />
            <Input.Password
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              status={!password || password.length >= 6 ? '' : 'error'}
              aria-label="Password"
            />
            <Button
              type="primary"
              block
              onClick={handleSignup}
              loading={loading}
              disabled={!email || !password}
            >
              Create Account
            </Button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;

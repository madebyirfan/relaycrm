import { auth } from '../firebase/config';
import { sendEmailVerification } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyEmailPage = () => {
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleResend = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      await sendEmailVerification(auth.currentUser);
      setSent(true);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a] px-4">
      <div className="bg-white dark:bg-[#2a2a2a] p-8 rounded-xl shadow-lg w-full max-w-md space-y-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Verify Your Email
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please check your inbox to verify your email address.
        </p>

        {!sent ? (
          <button
            onClick={handleResend}
            className="w-full bg-[#1677FF] text-white font-semibold p-3 rounded-md hover:bg-[#0e65d2] transition"
          >
            Resend Verification Email
          </button>
        ) : (
          <p className="text-green-600 dark:text-green-400 font-medium">
            Verification email sent!
          </p>
        )}

        <button
          onClick={handleLogout}
          className="w-full text-[#1677FF] hover:underline text-sm"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

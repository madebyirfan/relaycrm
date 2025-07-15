// File: src/pages/VerifyEmailPage.tsx
import { Button } from 'antd';
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
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="p-6 rounded shadow-md bg-white dark:bg-[#1f1f1f] w-full max-w-md text-center space-y-4">
        <h2 className="text-2xl font-bold text-black dark:text-white">Verify Your Email</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Please check your inbox to verify your email address.
        </p>
        {!sent ? (
          <Button onClick={handleResend}>Resend Verification Email</Button>
        ) : (
          <p className="text-green-600 dark:text-green-400">Verification email sent!</p>
        )}
        <Button type="link" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth } from '../firebase/config';
import { Input, Button, message } from 'antd';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import SignupImage from '../assets/images/signup.png';
import { FirebaseError } from 'firebase-admin';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async () => {
    if (!name.trim()) {
      message.warning('Please enter your full name.');
      return;
    }
    if (!validateEmail(email)) {
      message.warning('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      message.warning('Password must be at least 6 characters.');
      return;
    }
    if (password !== repeatPassword) {
      message.warning('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ User created:', userCredential);
      // Add name to user profile
      await updateProfile(userCredential.user, { displayName: name });

      // Create user document in Firestore
      const db = getFirestore();
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        role: 'admin',
        createdAt: serverTimestamp(),
      });

      await sendEmailVerification(userCredential.user);

      message.success('Signup successful! Please check your email to verify your account.');
      setSuccess(true);
    } catch (error: any) {
      const errorCode = (error as FirebaseError).code;

      let friendlyMessage = 'Something went wrong. Please try again.';
      if (errorCode === 'auth/email-already-in-use') {
        friendlyMessage = 'This email address is already in use.';
      } else if (errorCode === 'auth/invalid-email') {
        friendlyMessage = 'Invalid email address.';
      } else if (errorCode === 'auth/weak-password') {
        friendlyMessage = 'Password is too weak. Minimum 6 characters required.';
      } else if (errorCode === 'auth/network-request-failed') {
        friendlyMessage = 'Network error. Please check your internet connection.';
      }

      message.error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-10 bg-white dark:bg-gray-900">
        {/* Brand */}
        <div className="absolute top-6 left-6 text-xl font-semibold text-[#1677FF]">
          RealyCRM
        </div>

        <div className="max-w-md mx-auto w-full space-y-6">
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
                <Button type="primary" className="mt-4 bg-[#1677FF] hover:bg-[#146de2]">
                  Go to Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-black dark:text-white">
                Welcome back
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Create a free account
              </p>

              <div className="space-y-4">
                <Input
                  size="large"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-3 w-full border rounded-md dark:bg-[#333] dark:text-white"
                />
                <Input
                  size="large"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  status={!email || validateEmail(email) ? '' : 'error'}
                  className="p-3 w-full border rounded-md dark:bg-[#333] dark:text-white"
                />
                <Input.Password
                  size="large"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  status={!password || password.length >= 6 ? '' : 'error'}
                  className="p-3 w-full border rounded-md dark:bg-[#333] dark:text-white"
                />
                <Input.Password
                  size="large"
                  placeholder="Repeat password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  status={repeatPassword === password ? '' : 'error'}
                  className="p-3 w-full border rounded-md dark:bg-[#333] dark:text-white"
                />
              </div>
              <Button
                type="primary"
                size="large"
                block
                onClick={handleSignup}
                loading={loading}
                disabled={!email || !password || !repeatPassword || !name}
                className="!bg-[#1677FF] !hover:bg-[#146de2] !text-white rounded-md"
              >
                Sign up
              </Button>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-[#1677FF] hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-[#E6F0FF] dark:bg-[#0F1E3F]">
        <img
          src={SignupImage}
          alt="Signup Illustration"
          className="max-w-[500px] w-full object-contain"
        />
      </div>
    </div>
  );
};

export default SignUpPage;

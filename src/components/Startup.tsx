// src/components/Startup.tsx
import { useEffect } from 'react';
import { fetchUserAndRole } from '../store/authSlice';
import useAppDispatch from '../hooks/useAppDispatch';

const Startup = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserAndRole());
  }, [dispatch]);

  return null; // No UI
};

export default Startup;

// src/components/PageLoadingBar.tsx
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PageLoadingBar = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 700); // fake delay
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div
      className={`fixed top-0 left-0 h-1 bg-blue-500 z-[9999] transition-all duration-500 ${
        loading ? 'w-full opacity-100' : 'w-0 opacity-0'
      }`}
    />
  );
};

export default PageLoadingBar;

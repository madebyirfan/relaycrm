// src/pages/SearchPage.tsx
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const SearchPage = () => {
  const query = useSelector((state: RootState) => state.search.query);

  return (
    <div className="p-6 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Search results for: "{query}"</h2>
      {/* Add dynamic rendering of results */}
    </div>
  );
};

export default SearchPage;

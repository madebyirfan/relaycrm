// src/pages/SearchPage.tsx
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useEffect, useState } from 'react';
import { collection, getDocs, query as firestoreQuery, where } from 'firebase/firestore';
import { db } from '../firebase/config'; // Make sure you export `db` from your firebase.ts
import Loader from '../components/ui/Loader'; // Optional loading UI

type SearchResult = {
  id: string;
  name?: string;
  [key: string]: any;
};

const SearchPage = () => {
  const queryText = useSelector((state: RootState) => state.search.query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!queryText || queryText.trim() === '') {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const collectionsToSearch = ['clients', 'projects']; // Add your own
        const allResults: SearchResult[] = [];

        for (const col of collectionsToSearch) {
          const colRef = collection(db, col);
          const q = firestoreQuery(colRef, where('name', '>=', queryText), where('name', '<=', queryText + '\uf8ff'));
          const snap = await getDocs(q);

          snap.forEach(doc => {
            allResults.push({ id: doc.id, ...doc.data() });
          });
        }

        setResults(allResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [queryText]);

  return (
    <div className="p-6 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Search results for: "{queryText}"</h2>

      {loading ? (
        <Loader />
      ) : results.length > 0 ? (
        <ul className="space-y-4">
          {results.map((item) => (
            <li key={item.id} className="p-4 border rounded bg-gray-100 dark:bg-gray-800">
              <p className="font-semibold text-lg">{item.name}</p>
              <pre className="text-sm text-gray-600 dark:text-gray-300">{JSON.stringify(item, null, 2)}</pre>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No results found.</p>
      )}
    </div>
  );
};

export default SearchPage;

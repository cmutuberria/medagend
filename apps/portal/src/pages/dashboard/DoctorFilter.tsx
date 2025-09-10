import { Search } from 'lucide-react';
import { useRef, useState } from 'react';

type Timer = ReturnType<typeof setTimeout>;
interface DoctorFilterProps {
  setFilter: (filter: string) => void;
}
export const DoctorFilter: React.FC<DoctorFilterProps> = ({ setFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const timer = useRef<Timer>(null);

  // Debounce para la búsqueda - se ejecuta 300ms después del último cambio
  const debouncedSearch = (searchQuery: string) => {
    clearTimeout(timer.current!);
    const newTimer = setTimeout(() => {
      setFilter(searchQuery);
      timer.current = null;
    }, 500);
    timer.current = newTimer;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="mb-6">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-1.5 rounded-md hover:bg-blue-600 transition-colors">
          <Search className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

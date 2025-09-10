import { ChevronDown, Filter } from 'lucide-react';
import { useState } from 'react';
import { Specialty, SpecialtySchema } from '../../models/user.model';

interface EspecialityFilterProps {
  selectedSpecialties: Specialty[];
  setSelectedSpecialties: (specialties: Specialty[]) => void;
}
export const EspecialityFilter: React.FC<EspecialityFilterProps> = ({
  selectedSpecialties,
  setSelectedSpecialties,
}) => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const specialties = Object.values(SpecialtySchema.enum);

  const renderSpecialties = () => {
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {specialties.map((specialty) => (
          <button
            key={specialty}
            onClick={() =>
              selectedSpecialties.includes(specialty)
                ? setSelectedSpecialties(
                    selectedSpecialties.filter((s) => s !== specialty)
                  )
                : setSelectedSpecialties([...selectedSpecialties, specialty])
            }
            className={`px-3 py-2 rounded-lg text-sm transition-all ${
              selectedSpecialties.includes(specialty)
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {specialty.charAt(0) +
              specialty.slice(1).toLowerCase().replace(/_/g, ' ')}
          </button>
        ))}
      </div>
    );
  };
  return (
    <div className="mb-6">
      {/* Versión Mobile - Solo se ve en pantallas pequeñas */}
      <div className="w-full block sm:hidden">
        <button
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className="w-full flex items-center justify-between py-3 px-0 text-left focus:outline-none"
        >
          <div className="flex items-center gap-2 text-gray-800">
            <Filter className="w-4 h-4" />
            <span>Especialities filter</span>
            {selectedSpecialties.length > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {selectedSpecialties.length}
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
              isFilterExpanded ? 'transform rotate-180' : ''
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isFilterExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-3 pb-0 ">
            {renderSpecialties()}
            {selectedSpecialties.length > 0 && (
              <button
                onClick={() => setSelectedSpecialties([])}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Clear filters ({selectedSpecialties.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Versión Desktop - Solo se ve en pantallas medianas y grandes */}
      <div className="w-full hidden sm:block md:flex justify-between">
        {renderSpecialties()}{' '}
        {selectedSpecialties.length > 0 && (
          <button
            onClick={() => setSelectedSpecialties([])}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Clear filters ({selectedSpecialties.length})
          </button>
        )}
      </div>
    </div>
  );
};

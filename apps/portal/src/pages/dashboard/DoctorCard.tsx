import { Check, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { AvatarName } from '../../components/AvatarName';
import { useAvailabilities } from '../../hooks/useAvailability';
import { User } from '../../models/user.model';
import AvailabilitiesInline from './availabilitiesInline';

interface DoctorCardProps {
  doctor: User;
  isSelected: boolean;
  setSelectedDoctor: (id: string | null) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  isSelected,
  setSelectedDoctor,
}) => {
  const {
    availabilities,
    findAvailabilitiesByProfessionalAndDay,
    loadingAvailabilities,
  } = useAvailabilities();

  useEffect(() => {
    const today = new Date().getDay();
    findAvailabilitiesByProfessionalAndDay(doctor.id, today);
  }, [doctor]);

  const handleDoctorSelect = (id: string) => {
    isSelected ? setSelectedDoctor(null) : setSelectedDoctor(id);
  };
  const isAvailable = availabilities && availabilities.length > 0;
  return (
    <div
      // key={`${doctor.id}-doctorcard`}
      onClick={() => handleDoctorSelect(doctor.id)}
      className={`bg-white rounded-lg p-4 border transition-all cursor-pointer hover:shadow-md ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center gap-4 h-full">
        {/* Doctor Image */}
        <div className="relative">
          <AvatarName name={doctor.name} />
          {isAvailable ? (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          ) : (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-300 border-2 border-white rounded-full"></div>
          )}
        </div>

        {/* Doctor Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-800 truncate">{doctor.name}</h3>
          <p className="text-sm text-gray-600 truncate">
            {doctor.specialty} - {doctor.bio}
          </p>
          {/* {loadingAvailabilities && (
            <div className="text-sm text-gray-600 mt-1">
              <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
            </div>
          )} */}
          <AvailabilitiesInline
            availabilities={availabilities || []}
            loadingAvailabilities={loadingAvailabilities}
          />
        </div>

        {/* Selection Indicator */}
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
          }`}
        >
          {isSelected && <Check className="w-4 h-4 text-white" />}
        </div>
      </div>
    </div>
  );
};

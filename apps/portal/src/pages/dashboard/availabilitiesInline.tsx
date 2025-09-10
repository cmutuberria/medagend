import { Clock, Loader2 } from 'lucide-react';
import { Availability } from '../../models/availability.model';

interface AvailabilitiesInlineProps {
  availabilities: Availability[];
  loadingAvailabilities: boolean;
}

const AvailabilitiesInline: React.FC<AvailabilitiesInlineProps> = ({
  availabilities,
  loadingAvailabilities,
}) => {
  return (
    <div className="flex gap-2 items-center bg-blue-50/50 rounded-md py-1  px-2 w-fit ">
      <Clock className="w-4 h-4 text-sm text-blue-500 " />
      {loadingAvailabilities && (
        <div className="text-sm text-gray-600 mt-1">
          <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
        </div>
      )}
      {availabilities?.map((availability) => (
        <span key={availability.id} className="text-sm text-blue-500 ">
          {availability.startTime} - {availability.endTime}
        </span>
      ))}
    </div>
  );
};

export default AvailabilitiesInline;

import {
  AlertTriangle,
  ArrowLeft,
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  MapPin,
  Star,
  User as UserIcon,
  Video,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { appointmentClient } from '../../client/appointment.client';
import { availabilityClient } from '../../client/availability.client';
import { AvatarName } from '../../components/AvatarName';
import { Appointment } from '../../models/appointment.model';
import { Availability } from '../../models/availability.model';
import { User } from '../../models/user.model';
import AvailabilitiesInline from './availabilitiesInline';

const normalizeTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

interface DoctorDetailProps {
  doctor: User;
  onBack: () => void;
}

type ConsultationType = 'presencial' | 'online';

// TODO: refactorizar todo el componente
export const DoctorDetail: React.FC<DoctorDetailProps> = ({
  doctor,
  onBack,
}) => {
  const [consultationType, setConsultationType] =
    useState<ConsultationType>('presencial');

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [availableTimeSlots, setAvailableTimeSlots] = useState<
    { time: string; available: boolean }[]
  >([]);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // Para navegar por semanas
  const [isMobile, setIsMobile] = useState(false);

  const [todayAvailabilities, setTodayAvailabilities] = useState<
    Availability[] | null
  >(null);
  const [loadingAvailabilities, setLoadingAvailabilities] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const searchTodayAvailabilities = async () => {
      setLoadingAvailabilities(true);
      const availabilities =
        await availabilityClient.findAvailabilitiesByProfessionalAndDay(
          doctor.id,
          today.getDay()
        );
      setLoadingAvailabilities(false);
      if (availabilities) {
        setTodayAvailabilities(availabilities);
      }
    };
    searchTodayAvailabilities();

    getAvailableDates();
  }, [doctor]);

  useEffect(() => {
    setSelectedTime(null);
    setAvailableTimeSlots([]);
    if (selectedDate) {
      getAvailableTimeSlots();
    }
  }, [selectedDate]);

  // / Generar fechas disponibles para la semana actual + offset
  const getAvailableDates = () => {
    const totalDays = isMobile ? 5 : 7;
    const dates = [];
    // const today = new Date();
    const startOfWeek = currentWeekOffset * totalDays;
    const date1 = new Date(today);
    date1.setDate(today.getDate() + startOfWeek);
    // Empezar desde hoy la primera semana
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + startOfWeek + i);

      dates.push({
        value: date.toISOString().split('T')[0],
        fullDate: date,
      });
    }
    return dates;
  };

  // Horarios disponibles basados en el doctor
  const getAvailableTimeSlots = async () => {
    setLoadingAvailabilities(true);
    if (!selectedDate) {
      return [];
    }
    const availabilities =
      await availabilityClient.findAvailabilitiesByProfessionalAndDay(
        doctor.id,
        new Date(selectedDate).getDay()
      );
    setLoadingAvailabilities(false);
    if (!availabilities) {
      return [];
    }
    const slots: string[] = [];
    for (const availability of availabilities) {
      const slot = new Date(selectedDate + ' ' + availability.startTime);
      const slotEnd = new Date(selectedDate + ' ' + availability.endTime);
      while (slot <= slotEnd) {
        const slotTime =
          slot.getHours() +
          ':' +
          slot.getMinutes()?.toString().padStart(2, '0');

        slot.setMinutes(slot.getMinutes() + 30);

        if (slots.includes(slotTime)) {
          continue;
        }
        slots.push(slotTime);
      }
    }
    const appointments =
      await appointmentClient.findAppointmentsByProfessionalAndDay(
        doctor.id,
        new Date(selectedDate)
      );

    const availableTimeSlots: { time: string; available: boolean }[] =
      slots.map((slot) => {
        const available = !appointments?.some((appointment: Appointment) => {
          return normalizeTime(appointment.time) === normalizeTime(slot);
        });
        return {
          time: slot,
          available,
        };
      });
    console.log('availableTimeSlots', availableTimeSlots);
    setAvailableTimeSlots(availableTimeSlots);
  };

  const availableDates = getAvailableDates();

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona una fecha y hora');
      return;
    }
    console.log('selectedDate', selectedDate);
    console.log('selectedTime', selectedTime);
    console.log('consultationType', consultationType);
  };

  // Navegar a la semana anterior
  const handlePreviousWeek = () => {
    if (currentWeekOffset > 0) {
      setCurrentWeekOffset(currentWeekOffset - 1);
      setSelectedDate(null); // Limpiar selección al cambiar semana
    }
  };

  // Navegar a la siguiente semana (limitado a 8 semanas en el futuro)
  const handleNextWeek = () => {
    // Máximo 8 semanas
    setCurrentWeekOffset(currentWeekOffset + 1);
    setSelectedDate(null); // Limpiar selección al cambiar semana
  };

  // Obtener el rango de fechas de la semana actual
  const getCurrentWeekRange = () => {
    const dates = getAvailableDates();
    if (dates.length === 0) return '';

    const firstDate = new Date(dates[0].value);
    const lastDate = new Date(dates[dates.length - 1].value);

    const firstMonth = firstDate.toLocaleDateString('es-ES', {
      month: 'short',
    });
    const lastMonth = lastDate.toLocaleDateString('es-ES', { month: 'short' });

    if (firstMonth === lastMonth) {
      return `${firstDate.getDate()} - ${lastDate.getDate()} ${firstMonth} ${firstDate.getFullYear()}`;
    } else {
      return `${firstDate.getDate()} ${firstMonth} - ${lastDate.getDate()} ${lastMonth} ${firstDate.getFullYear()}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Go back to the list
        </button>

        {/* Doctor Info Card */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <AvatarName name={doctor.name} />
            <div className="flex-1 flex flex-col items-start">
              <h1 className="text-xl text-gray-800 mb-1">{doctor.name}</h1>
              <p className="text-blue-600 mb-2">{doctor.specialty}</p>
              <p className="text-gray-600 text-sm mb-2">{doctor.bio}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{4.5}</span>
                </div>
                <div className="flex items-center gap-1">
                  <AvailabilitiesInline
                    availabilities={todayAvailabilities || []}
                    loadingAvailabilities={loadingAvailabilities}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Doctor Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <UserIcon className="w-4 h-4" />
              <span className="text-sm">+500 patients</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm">15 years experience</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Award className="w-4 h-4" />
              <span className="text-sm">Certificate</span>
            </div>
          </div>
        </div>

        {/* Appointment Booking */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h1 className="text-xl text-gray-800 mb-6">Book Appointment</h1>

          {/* Consultation Type */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-3 text-lg">
              Consultation type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setConsultationType('presencial')}
                className={`flex items-center gap-3 p-4 border rounded-lg transition-all ${
                  consultationType === 'presencial'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <MapPin className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-gray-800">Presencial</div>
                  <div className="text-sm text-gray-600">In clinic</div>
                </div>
              </button>
              <button
                onClick={() => setConsultationType('online')}
                className={`flex items-center gap-3 p-4 border rounded-lg transition-all ${
                  consultationType === 'online'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Video className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-gray-800">Online</div>
                  <div className="text-sm text-gray-600">Video call</div>
                </div>
              </button>
            </div>
          </div>

          {/* Date Selection - Single Line */}
          <div className="my-10">
            {/* Date Selection Row */}
            <div className="flex justify-center items-center mb-4">
              {/* Month Label */}
              <span className=" text-lg text-gray-800 capitalize">
                {availableDates?.[0]?.fullDate.toLocaleDateString('en-EN', {
                  month: 'long',
                }) || ''}
              </span>
            </div>
            <div className="flex items-center gap-2 md:gap-4 mb-8">
              {/* Previous Arrow */}
              <button
                onClick={() => handlePreviousWeek()}
                disabled={currentWeekOffset === 0}
                className={`py-2 rounded-md transition-colors ${
                  currentWeekOffset === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Date Items */}
              <div
                className={`flex-1 flex items-center ${
                  isMobile ? 'justify-between gap-1' : 'justify-between gap-4'
                }`}
              >
                {availableDates.map((date) => (
                  <button
                    key={date.value}
                    onClick={() => setSelectedDate(date.value)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-all text-base ${
                      isMobile && selectedDate !== date.value
                        ? 'border-none'
                        : 'border'
                    }  ${
                      selectedDate === date.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700 px-2'
                        : 'border-gray-200 hover:border-gray-300 px-0'
                    } `}
                  >
                    <span>{date.fullDate.getDate()}</span>
                    <span>
                      {date.fullDate.toLocaleDateString('en-EN', {
                        weekday: isMobile ? 'short' : 'long',
                      })}
                    </span>
                  </button>
                ))}
              </div>

              {/* Next Arrow */}
              <button
                onClick={() => handleNextWeek()}
                className="py-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Time Selection */}
            <div className="mb-6 border border-gray-200 p-6 rounded-lg">
              <label className="block text-gray-700 mb-3 text-lg">
                <Clock className="w-4 h-4 inline mr-2" />
                Select time
              </label>
              <div className="flex flex-col gap-2">
                {availableTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {availableTimeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-2 text-sm border rounded-lg transition-all text-center ${
                          selectedTime === slot.time
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${
                          !slot.available ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 w-full bg-gray-100/50 p-4 rounded-lg">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    {selectedDate
                      ? "Sorry, we don't have any available times, please select another date."
                      : 'Please select a date.'}
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            {selectedDate && selectedTime && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-xl text-gray-800 mb-2">
                  Appointment Summary
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Doctor:</strong> {doctor.name}
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(selectedDate).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedTime}
                  </p>
                  <p>
                    <strong>Type:</strong>{' '}
                    {consultationType === 'presencial'
                      ? 'Consulta presencial'
                      : 'Videollamada'}
                  </p>
                  <p>
                    <strong>Specialty:</strong> {doctor.specialty}
                  </p>
                </div>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={handleBookAppointment}
              disabled={!selectedDate || !selectedTime}
              className={`w-full py-4 px-6 rounded-lg transition-all duration-200 ${
                selectedDate && selectedTime
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedDate && selectedTime
                ? 'Confirm Appointment'
                : 'Select date and time'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

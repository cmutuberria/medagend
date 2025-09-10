import React, { useEffect, useState } from 'react';
import { Specialty } from '../../models/user.model';
import { DoctorFilter } from './DoctorFilter';
import { EspecialityFilter } from './EspecialityFilter';
import { useProfesionals } from '../../hooks/useUser';
import { DoctorCard } from './DoctorCard';
import { Loader2, Search } from 'lucide-react';
import { DoctorDetail } from './DoctorDetail';

export const DashboardPage: React.FC = () => {
  const {
    professionals,
    findProfessionalsByQuery,
    loading: loadingProfessionals,
  } = useProfesionals();
  const [selectedSpecialties, setSelectedSpecialties] = useState<Specialty[]>(
    []
  );
  const [queryDoctor, setQueryDoctor] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  useEffect(() => {
    console.log('filter', queryDoctor);
    console.log('selectedSpecialties', selectedSpecialties);
    findProfessionalsByQuery(queryDoctor, selectedSpecialties);
  }, [queryDoctor, selectedSpecialties]);

  if (selectedDoctorId) {
    const doctor = professionals?.find(
      (doctor) => doctor.id === selectedDoctorId
    );
    if (doctor) {
      return (
        <DoctorDetail
          doctor={doctor}
          onBack={() => setSelectedDoctorId(null)}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      {/* Specialty Filter */}
      <EspecialityFilter
        selectedSpecialties={selectedSpecialties}
        setSelectedSpecialties={setSelectedSpecialties}
      />
      {/* Doctor Filter */}
      <DoctorFilter setFilter={setQueryDoctor} />

      {/* Loading professionals */}
      {loadingProfessionals && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        </div>
      )}

      {/* Professionals list */}
      {professionals ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {professionals.map((professional) => (
            <DoctorCard
              key={`${professional.id}-doctorcard`}
              doctor={professional}
              isSelected={selectedDoctorId === professional.id}
              setSelectedDoctor={setSelectedDoctorId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg text-gray-800 mb-2">
            Not found professionals
          </h3>
          <p className="text-gray-600">
            Try with other search terms or change the specialty
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

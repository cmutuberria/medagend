import React from 'react';
import { useParams } from 'react-router-dom';

export const DoctorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Detalle del Doctor</h1>
      <p>ID del doctor: {id}</p>
      {/* Aquí puedes agregar más contenido para mostrar los detalles del doctor */}
    </div>
  );
};

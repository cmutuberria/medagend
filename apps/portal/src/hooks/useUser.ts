import { useEffect, useState } from 'react';
import { userClient } from '../client/user.client';
import { User } from '../models/user.model';

interface profesionalContextType {
  professionals: User[] | null;
  loading: boolean;

  findProfessionalsByQuery: (
    name?: string,
    specialty?: string[]
  ) => Promise<void>;
}

export const useProfesionals = (): profesionalContextType => {
  const [professionals, setProfessionals] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    findProfessionalsByQuery();
  }, []);

  const findProfessionalsByQuery = async (
    name?: string,
    specialty?: string[]
  ) => {
    setLoading(true);
    console.log('findProfessionalsByQuery hook', name, specialty);
    const professionals = await userClient.findProfessionalsByQuery(
      name,
      specialty
    );
    setProfessionals(professionals);
    setLoading(false);
  };

  return { professionals, findProfessionalsByQuery, loading };
};

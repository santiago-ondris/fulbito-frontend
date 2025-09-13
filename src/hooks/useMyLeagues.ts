import { useState, useEffect } from 'react';
import adminService, { type GetMyLeaguesResponse, type MyLeagueSummary } from '../services/adminService';

interface UseMyLeaguesReturn {
  leagues: MyLeagueSummary[];
  isLoading: boolean;
  error: string;
  refetch: () => Promise<void>;
  isEmpty: boolean;
  hasError: boolean;
}

export function useMyLeagues(): UseMyLeaguesReturn {
  const [leagues, setLeagues] = useState<MyLeagueSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeagues = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response: GetMyLeaguesResponse = await adminService.getMyLeagues();
      setLeagues(response.leagues);
    } catch (error: any) {
      setError(error.message);
      setLeagues([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar ligas al montar el componente
  useEffect(() => {
    fetchLeagues();
  }, []);

  // Función para refrescar la lista (útil después de crear/eliminar ligas)
  const refetch = async () => {
    await fetchLeagues();
  };

  return {
    leagues,
    isLoading,
    error,
    refetch,
    isEmpty: !isLoading && leagues.length === 0 && !error,
    hasError: !isLoading && !!error
  };
}
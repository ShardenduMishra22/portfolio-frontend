import { useState, useEffect } from 'react';
import { Experience } from '@/data/types.data';
import { experiencesAPI } from '@/util/apiResponse.util';

export function useExperience(id: string) {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await experiencesAPI.getExperienceById(id);
        setExperience(response.data);
      } catch {
        setError('Failed to load experience');
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [id]);

  return { experience, loading, error };
}

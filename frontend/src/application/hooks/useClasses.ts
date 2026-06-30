import { useCallback, useEffect, useState } from 'react';

import type { Class } from '@/domain/types';
import { classesApi } from '@/infrastructure/api/adapters';

export function useClasses() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await classesApi.getAll();
      setClasses(data);
    } catch {
      setError('Erro ao carregar turmas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchClasses(); }, [fetchClasses]);

  const createClass = useCallback(async (data: { name: string; subject: string }) => {
    const created = await classesApi.create(data);
    setClasses((prev) => [...prev, created]);
    return created;
  }, []);

  const updateClass = useCallback(async (id: string, data: { name?: string; subject?: string }) => {
    const updated = await classesApi.update(id, data);
    setClasses((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const deleteClass = useCallback(async (id: string) => {
    await classesApi.delete(id);
    setClasses((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { classes, loading, error, createClass, updateClass, deleteClass, refetch: fetchClasses };
}

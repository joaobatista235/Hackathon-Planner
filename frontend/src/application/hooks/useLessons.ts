import { useCallback, useEffect, useState } from 'react';

import type { Lesson } from '@/domain/types';
import { lessonsApi } from '@/infrastructure/api/adapters';

export function useLessons(classId?: string) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = classId
        ? await lessonsApi.getByClass(classId)
        : await lessonsApi.getAll();
      setLessons(data);
    } catch {
      setError('Erro ao carregar aulas');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => { void fetchLessons(); }, [fetchLessons]);

  const createLesson = useCallback(
    async (data: { title: string; description: string; date: string; classId: string }) => {
      const created = await lessonsApi.create(data);
      setLessons((prev) => [...prev, created]);
      return created;
    },
    [],
  );

  const updateLesson = useCallback(
    async (id: string, data: Partial<{ title: string; description: string; date: string }>) => {
      const updated = await lessonsApi.update(id, data);
      setLessons((prev) => prev.map((l) => (l.id === id ? updated : l)));
      return updated;
    },
    [],
  );

  const deleteLesson = useCallback(async (id: string) => {
    await lessonsApi.delete(id);
    setLessons((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return { lessons, loading, error, createLesson, updateLesson, deleteLesson, refetch: fetchLessons };
}

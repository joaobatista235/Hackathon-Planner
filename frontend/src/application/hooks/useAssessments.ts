import { useCallback, useEffect, useState } from 'react';

import type { Assessment } from '@/domain/types';
import { assessmentsApi } from '@/infrastructure/api/adapters';

export function useAssessments(classId?: string) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = classId
        ? await assessmentsApi.getByClass(classId)
        : await assessmentsApi.getAll();
      setAssessments(data);
    } catch {
      setError('Erro ao carregar avaliações');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => { void fetchAssessments(); }, [fetchAssessments]);

  const createAssessment = useCallback(
    async (data: { title: string; description?: string; type: string; dueDate: string; classId: string }) => {
      const created = await assessmentsApi.create(data);
      setAssessments((prev) => [...prev, created]);
      return created;
    },
    [],
  );

  const updateAssessment = useCallback(
    async (id: string, data: Partial<{ title: string; description: string; type: string; dueDate: string; status: string }>) => {
      const updated = await assessmentsApi.update(id, data);
      setAssessments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      return updated;
    },
    [],
  );

  const deleteAssessment = useCallback(async (id: string) => {
    await assessmentsApi.delete(id);
    setAssessments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { assessments, loading, error, createAssessment, updateAssessment, deleteAssessment, refetch: fetchAssessments };
}

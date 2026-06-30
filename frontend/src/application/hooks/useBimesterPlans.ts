import { useCallback, useEffect, useState } from 'react';

import type { BimesterPlan } from '@/domain/types';
import { bimesterPlansApi } from '@/infrastructure/api/adapters';

export function useBimesterPlans(classId?: string) {
  const [plans, setPlans] = useState<BimesterPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = classId
        ? await bimesterPlansApi.getByClass(classId)
        : await bimesterPlansApi.getAll();
      setPlans(data);
    } catch {
      setError('Erro ao carregar planejamentos');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => { void fetchPlans(); }, [fetchPlans]);

  const createPlan = useCallback(
    async (data: { title: string; goals: string; startsAt: string; endsAt: string; classId: string }) => {
      const created = await bimesterPlansApi.create(data);
      setPlans((prev) => [...prev, created]);
      return created;
    },
    [],
  );

  const updatePlan = useCallback(
    async (id: string, data: Partial<{ title: string; goals: string; startsAt: string; endsAt: string; status: string }>) => {
      const updated = await bimesterPlansApi.update(id, data);
      setPlans((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    },
    [],
  );

  const completePlan = useCallback(async (id: string) => {
    const updated = await bimesterPlansApi.complete(id);
    setPlans((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }, []);

  const deletePlan = useCallback(async (id: string) => {
    await bimesterPlansApi.delete(id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { plans, loading, error, createPlan, updatePlan, completePlan, deletePlan, refetch: fetchPlans };
}

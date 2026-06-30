import { useCallback, useEffect, useState } from 'react';

import type { Alert } from '@/domain/types';
import { alertsApi } from '@/infrastructure/api/adapters';

export function useAlerts(onlyPending = false) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = onlyPending ? await alertsApi.getPending() : await alertsApi.getAll();
      setAlerts(data);
    } catch {
      setError('Erro ao carregar alertas');
    } finally {
      setLoading(false);
    }
  }, [onlyPending]);

  useEffect(() => { void fetchAlerts(); }, [fetchAlerts]);

  const createAlert = useCallback(
    async (data: { title: string; message: string; priority: string; dueDate?: string }) => {
      const created = await alertsApi.create(data);
      setAlerts((prev) => [...prev, created]);
      return created;
    },
    [],
  );

  const completeAlert = useCallback(async (id: string) => {
    const updated = await alertsApi.complete(id);
    setAlerts((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }, []);

  const deleteAlert = useCallback(async (id: string) => {
    await alertsApi.delete(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { alerts, loading, error, createAlert, completeAlert, deleteAlert, refetch: fetchAlerts };
}

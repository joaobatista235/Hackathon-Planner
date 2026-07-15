import { useState, useCallback } from 'react';
import { attachmentsApi } from '@/infrastructure/api/adapters';
import type { Attachment } from '@/domain/types';

export function useAttachments(lessonId: string | null) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!lessonId) return;
    try {
      const data = await attachmentsApi.getByLesson(lessonId);
      setAttachments(data);
    } catch {
      // non-fatal — lesson may have no attachments yet
    }
  }, [lessonId]);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!lessonId) return;
      setUploading(true);
      setError(null);
      try {
        const att = await attachmentsApi.upload(lessonId, file);
        setAttachments((prev) => [...prev, att]);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Erro ao enviar arquivo';
        setError(msg);
      } finally {
        setUploading(false);
      }
    },
    [lessonId],
  );

  const removeAttachment = useCallback(async (id: string) => {
    await attachmentsApi.delete(id);
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { attachments, setAttachments, uploading, error, load, uploadFile, removeAttachment };
}

import type { AuthUser } from '@/domain/types';

import api from '../http/api';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthUser> => {
    const { data } = await api.post('/users/login', { email, password });
    return { ...data.user, token: data.token };
  },

  register: async (name: string, email: string, password: string): Promise<AuthUser> => {
    const { data } = await api.post('/users', { name, email, password });
    return { ...data, token: '' };
  },
};

export const classesApi = {
  getAll: () => api.get('/classes').then((r) => r.data),
  getByAuthor: (authorId: string) => api.get(`/classes/author/${authorId}`).then((r) => r.data),
  getById: (id: string) => api.get(`/classes/${id}`).then((r) => r.data),
  create: (data: { name: string; subject: string }) =>
    api.post('/classes', data).then((r) => r.data),
  update: (id: string, data: { name?: string; subject?: string }) =>
    api.put(`/classes/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/classes/${id}`),
};

export const lessonsApi = {
  getAll: () => api.get('/lessons').then((r) => r.data),
  getByClass: (classId: string) => api.get(`/lessons/class/${classId}`).then((r) => r.data),
  getById: (id: string) => api.get(`/lessons/${id}`).then((r) => r.data),
  create: (data: { title: string; description: string; date: string; classId: string }) =>
    api.post('/lessons', data).then((r) => r.data),
  update: (id: string, data: Partial<{ title: string; description: string; date: string }>) =>
    api.put(`/lessons/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/lessons/${id}`),
};

export const assessmentsApi = {
  getAll: () => api.get('/assessments').then((r) => r.data),
  getByClass: (classId: string) =>
    api.get(`/assessments/class/${classId}`).then((r) => r.data),
  getById: (id: string) => api.get(`/assessments/${id}`).then((r) => r.data),
  create: (data: {
    title: string;
    description?: string;
    type: string;
    dueDate: string;
    classId: string;
  }) => api.post('/assessments', data).then((r) => r.data),
  update: (id: string, data: Partial<{ title: string; description: string; type: string; dueDate: string; status: string }>) =>
    api.put(`/assessments/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/assessments/${id}`),
};

export const alertsApi = {
  getAll: () => api.get('/alerts').then((r) => r.data),
  getPending: () => api.get('/alerts/pending').then((r) => r.data),
  create: (data: { title: string; message: string; priority: string; dueDate?: string }) =>
    api.post('/alerts', data).then((r) => r.data),
  update: (id: string, data: Partial<{ title: string; message: string; priority: string; dueDate: string }>) =>
    api.put(`/alerts/${id}`, data).then((r) => r.data),
  complete: (id: string) => api.patch(`/alerts/${id}/complete`).then((r) => r.data),
  delete: (id: string) => api.delete(`/alerts/${id}`),
};

export const bimesterPlansApi = {
  getAll: () => api.get('/bimester-plans').then((r) => r.data),
  getByClass: (classId: string) =>
    api.get(`/bimester-plans/class/${classId}`).then((r) => r.data),
  getById: (id: string) => api.get(`/bimester-plans/${id}`).then((r) => r.data),
  create: (data: { title: string; goals: string; startsAt: string; endsAt: string; classId: string }) =>
    api.post('/bimester-plans', data).then((r) => r.data),
  update: (id: string, data: Partial<{ title: string; goals: string; startsAt: string; endsAt: string; status: string }>) =>
    api.put(`/bimester-plans/${id}`, data).then((r) => r.data),
  complete: (id: string) => api.patch(`/bimester-plans/${id}/complete`).then((r) => r.data),
  delete: (id: string) => api.delete(`/bimester-plans/${id}`),
};

export const attachmentsApi = {
  getByLesson: (lessonId: string) =>
    api.get(`/lessons/${lessonId}/attachments`).then((r) => r.data),
  upload: (lessonId: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api
      .post(`/lessons/${lessonId}/attachments`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
  delete: (id: string) => api.delete(`/attachments/${id}`),
};

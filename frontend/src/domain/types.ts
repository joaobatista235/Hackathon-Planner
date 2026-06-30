export type UserRole = 'USER' | 'ADMIN';
export type AssessmentType = 'PROVA' | 'TRABALHO';
export type AssessmentStatus = 'PENDING' | 'DONE';
export type AlertPriority = 'URGENT' | 'NEAR' | 'OVERDUE';
export type AlertStatus = 'PENDING' | 'DONE';
export type PlanStatus = 'DRAFT' | 'DONE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

export interface Class {
  id: string;
  name: string;
  subject: string;
  authorId: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  classId: string;
  class?: Pick<Class, 'id' | 'name' | 'subject'>;
  authorId: string;
}

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  type: AssessmentType;
  dueDate: string;
  status: AssessmentStatus;
  createdAt: string;
  updatedAt: string;
  classId: string;
  class?: Pick<Class, 'id' | 'name' | 'subject'>;
  authorId: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  priority: AlertPriority;
  status: AlertStatus;
  dueDate?: string;
  createdAt: string;
  authorId: string;
}

export interface BimesterPlan {
  id: string;
  title: string;
  goals: string;
  startsAt: string;
  endsAt: string;
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
  classId: string;
  class?: Pick<Class, 'id' | 'name' | 'subject'>;
  authorId: string;
}

import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { AuthGuard } from '@/presentation/components/base/AuthGuard/AuthGuard';
import { AppLayout } from '@/presentation/layouts/AppLayout';
import { LoginPage } from '@/presentation/pages/LoginPage/LoginPage';
import { DashboardPage } from '@/presentation/pages/DashboardPage/DashboardPage';
import { ClassesPage } from '@/presentation/pages/ClassesPage/ClassesPage';
import { LessonsPage } from '@/presentation/pages/LessonsPage/LessonsPage';
import { CalendarPage } from '@/presentation/pages/CalendarPage/CalendarPage';
import { AssessmentsPage } from '@/presentation/pages/AssessmentsPage/AssessmentsPage';
import { AlertsPage } from '@/presentation/pages/AlertsPage/AlertsPage';
import { BimesterPlansPage } from '@/presentation/pages/BimesterPlansPage/BimesterPlansPage';
import {AiPage} from "@/presentation/pages/AiPage/AiPage";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  );
}

function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/dashboard"
        element={<ProtectedLayout><DashboardPage /></ProtectedLayout>}
      />
      <Route
        path="/classes"
        element={<ProtectedLayout><ClassesPage /></ProtectedLayout>}
      />
      <Route
        path="/lessons"
        element={<ProtectedLayout><LessonsPage /></ProtectedLayout>}
      />
      <Route
        path="/calendar"
        element={<ProtectedLayout><CalendarPage /></ProtectedLayout>}
      />
      <Route
        path="/assessments"
        element={<ProtectedLayout><AssessmentsPage /></ProtectedLayout>}
      />
      <Route
        path="/alerts"
        element={<ProtectedLayout><AlertsPage /></ProtectedLayout>}
      />
      <Route
        path="/bimester-plans"
        element={<ProtectedLayout><BimesterPlansPage /></ProtectedLayout>}
      />
      <Route
        path="/ai"
        element={<ProtectedLayout><AiPage /></ProtectedLayout>}
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

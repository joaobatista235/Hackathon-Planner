import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar/Sidebar';
import { AiChatWidget } from '@/presentation/components/base/AiChatWidget/AiChatWidget';
import './AppLayout.css';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-layout__main">
        {children}
      </main>
      <AiChatWidget />
    </div>
  );
}

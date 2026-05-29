import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-carbon-950 flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <StatusBar />
    </div>
  );
};

import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans pt-16 md:pt-20">
      <aside className="w-64 hidden md:block flex-shrink-0 overflow-y-auto">
        <AdminSidebar />
      </aside>
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
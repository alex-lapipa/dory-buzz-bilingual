import { lazy, Suspense } from 'react';

const AdminShell = lazy(() => import('@/components/admin/AdminShell'));

const Admin = () => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-bee-bounce">🐝</div>
          <p className="text-sm text-muted-foreground">Loading Admin...</p>
        </div>
      </div>
    }
  >
    <AdminShell />
  </Suspense>
);

export default Admin;

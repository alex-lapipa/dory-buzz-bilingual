import { lazy, Suspense } from 'react';
import "@/styles/mochi-tokens.css";

const AdminShell = lazy(() => import('@/components/admin/AdminShell'));

const Admin = () => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <img
            src="/lovable-uploads/mochi-clean-200.webp"
            alt=""
            width={64}
            height={64}
            className="mx-auto animate-bee-bounce"
            style={{ filter: 'drop-shadow(0 6px 14px rgba(217,119,6,0.18))' }}
          />
          <p
            className="text-muted-foreground"
            style={{
              fontFamily: "var(--mochi-font-hand, 'Caveat', cursive)",
              fontSize: '1.1rem',
            }}
          >
            · loading admin · cargando ·
          </p>
        </div>
      </div>
    }
  >
    <AdminShell />
  </Suspense>
);

export default Admin;

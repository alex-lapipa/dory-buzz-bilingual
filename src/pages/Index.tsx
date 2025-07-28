import { DoryInterface } from '@/components/DoryInterface';
import { AuthGate } from '@/components/AuthGate';

const Index = () => {
  return (
    <AuthGate>
      <DoryInterface />
    </AuthGate>
  );
};

export default Index;

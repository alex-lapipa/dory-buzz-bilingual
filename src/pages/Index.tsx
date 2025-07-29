import { MochiInterface } from '@/components/MochiInterface';
import { useTab } from '@/App';

const Index = () => {
  const { activeTab } = useTab();

  return <MochiInterface activeTab={activeTab} />;
};

export default Index;

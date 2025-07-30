import { MochiInterface } from '@/components/MochiInterface';
import { useTab } from '@/App';

const Index = () => {
  const { activeTab } = useTab();

  return (
    <div className="relative">
      <MochiInterface activeTab={activeTab} />
      
      {/* Production Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-green-200 rounded-full px-3 py-1 shadow-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-green-700">LIVE</span>
        </div>
      </div>
    </div>
  );
};

export default Index;

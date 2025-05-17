
import AppHeader from '@/components/AppHeader';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AppHeader />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to DELL Parking Management</h1>
          <p className="text-xl text-gray-600">Use the options above to manage parking spaces</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

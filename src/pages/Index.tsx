
import AppHeader from '@/components/AppHeader';
import { useTranslation } from '@/hooks/useTranslation';

const Index = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AppHeader />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t('welcome')}</h1>
          <p className="text-xl text-gray-600">{t('useOptions')}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

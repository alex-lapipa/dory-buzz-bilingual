import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NatureLeaf } from '@/components/icons';

/**
 * Round 13 — NotFound page is now translated to EN / ES / FR via i18next.
 * Adds an explanation paragraph and keeps the original 🐝 + 404 visual.
 */
const NotFound: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-full bg-gradient-nature safe-area-top safe-area-bottom flex items-center justify-center p-4">
      <Card className="card-nature shadow-honey max-w-md w-full">
        <CardContent className="p-6 text-center">
          <div className="text-6xl mb-4 animate-bee-bounce" aria-hidden="true">
            🐝
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-bee bg-clip-text text-transparent">
            {t('notFound.code')}
          </h1>
          <p className="text-lg text-foreground mb-3">
            {t('notFound.lostInGarden')}
          </p>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {t('notFound.explanation')}
          </p>
          <Button asChild className="w-full">
            <Link to="/">
              <NatureLeaf className="h-4 w-4 mr-2" />
              {t('notFound.returnHome')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

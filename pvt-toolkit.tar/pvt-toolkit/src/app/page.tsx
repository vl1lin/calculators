'use client';

import SiteHeader from '@/components/shared/site-header';
import { usePageRouter, PageTransition } from '@/lib/router';
import HomePage from '@/components/pages/home-page';
import RsPage from '@/components/pages/rs-page';
import BoPage from '@/components/pages/bo-page';
import PbPage from '@/components/pages/pb-page';
import PythonPage from '@/components/pages/python-page';
import AboutPage from '@/components/pages/about-page';

function CurrentPage({ page }: { page: string }) {
  switch (page) {
    case 'rs': return <RsPage />;
    case 'bo': return <BoPage />;
    case 'pb': return <PbPage />;
    case 'python': return <PythonPage />;
    case 'about': return <AboutPage />;
    default: return <HomePage />;
  }
}

export default function AppRouter() {
  const { page } = usePageRouter();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <PageTransition pageKey={page}>
        <CurrentPage page={page} />
      </PageTransition>
    </div>
  );
}

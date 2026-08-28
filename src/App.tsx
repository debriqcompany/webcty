import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { DataProvider, useData } from './context/DataContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/public/Navbar';
import { Footer } from './components/public/Footer';
import { QuoteModal } from './components/public/QuoteModal';
import { DrawingViewerModal } from './components/public/DrawingViewerModal';
import { IntroSplash } from './components/public/IntroSplash';
import { FloatingContactWidget } from './components/public/FloatingContactWidget';
import { PromoPopupModal } from './components/public/PromoPopupModal';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { ArticlesPage } from './pages/public/ArticlesPage';
import { ArticleDetailPage } from './pages/public/ArticleDetailPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { PartnersPage } from './pages/public/PartnersPage';
import { AboutPage } from './pages/public/AboutPage';
import { JoinDebriqPage } from './pages/public/JoinDebriqPage';
import { ContactPage } from './pages/public/ContactPage';

// Admin CMS Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Main Application Inner Shell
const AppContent: React.FC = () => {
  // Client-side routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path && path !== '' ? path : '/';
    }
    return '/';
  });

  // Modal States
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteServicePrefill, setQuoteServicePrefill] = useState<string | undefined>(undefined);
  const [drawingViewerOpen, setDrawingViewerOpen] = useState(false);
  const [drawingViewerCategory, setDrawingViewerCategory] = useState<string>('all');

  const { isAuthenticated, loading: checkingAuth } = useAdminAuth();
  const { loading: dataLoading, settings } = useData();

  // Sync Favicon from Admin Settings
  useEffect(() => {
    if (settings?.faviconUrl) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = settings.faviconUrl;
      }
    }
  }, [settings?.faviconUrl]);

  // Handle browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigate helper function
  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openQuoteModal = (servicePrefill?: string) => {
    setQuoteServicePrefill(servicePrefill);
    setQuoteModalOpen(true);
  };

  const openDrawingViewer = (category: string = 'all') => {
    setDrawingViewerCategory(category);
    setDrawingViewerOpen(true);
  };

  // Determine if on Admin route
  const isAdminRoute = currentPath.startsWith('/admin');

  // Match Project Detail route: /projects/:slug
  let projectSlug: string | null = null;
  if (currentPath.startsWith('/projects/') && currentPath !== '/projects/') {
    projectSlug = currentPath.replace('/projects/', '').split('/')[0];
  }

  // Match Article Detail route: /insights/:slug or /articles/:slug
  let articleSlug: string | null = null;
  if (currentPath.startsWith('/insights/') && currentPath !== '/insights/') {
    articleSlug = currentPath.replace('/insights/', '').split('/')[0];
  } else if (currentPath.startsWith('/articles/') && currentPath !== '/articles/') {
    articleSlug = currentPath.replace('/articles/', '').split('/')[0];
  }

  // Render Page Content
  const renderCurrentPage = () => {
    // Admin Route
    if (isAdminRoute) {
      if (checkingAuth) {
        return (
          <div className="min-h-screen bg-[#111] flex items-center justify-center font-mono-tech text-xs text-[#888]">
            <div className="animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 bg-[#F27D26]"></span>
              <span>VERIFYING ADMIN SECURITY SESSION...</span>
            </div>
          </div>
        );
      }

      if (!isAuthenticated) {
        return (
          <AdminLoginPage
            onSuccess={() => navigate('/admin')}
            navigate={navigate}
          />
        );
      }

      return <AdminDashboard navigate={navigate} />;
    }

    // Public Routes
    if (projectSlug) {
      return (
        <ProjectDetailPage
          slug={projectSlug}
          navigate={navigate}
          openQuoteModal={openQuoteModal}
        />
      );
    }

    if (articleSlug) {
      return (
        <ArticleDetailPage
          slug={articleSlug}
          navigate={navigate}
          openQuoteModal={openQuoteModal}
        />
      );
    }

    switch (currentPath) {
      case '/projects':
        return (
          <ProjectsPage
            navigate={navigate}
            openQuoteModal={openQuoteModal}
          />
        );

      case '/insights':
      case '/articles':
        return (
          <ArticlesPage
            navigate={navigate}
            openQuoteModal={openQuoteModal}
          />
        );

      case '/services':
        return (
          <ServicesPage
            navigate={navigate}
            openQuoteModal={openQuoteModal}
          />
        );

      case '/partners':
        return (
          <PartnersPage
            navigate={navigate}
            openQuoteModal={openQuoteModal}
          />
        );

      case '/about':
        return (
          <AboutPage
            navigate={navigate}
            openQuoteModal={openQuoteModal}
          />
        );

      case '/join-debriq':
        return (
          <JoinDebriqPage
            navigate={navigate}
          />
        );

      case '/contact':
        return (
          <ContactPage
            navigate={navigate}
          />
        );

      case '/':
      default:
        return (
          <HomePage
            navigate={navigate}
            openQuoteModal={openQuoteModal}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F2EE] text-[#151515] antialiased selection:bg-[#F27D26] selection:text-white">
      
      {/* Cinematic Architectural Splash Intro for initial entrance */}
      {!isAdminRoute && <IntroSplash />}

      {/* Public Navbar (Hidden on Admin pages) */}
      {!isAdminRoute && (
        <Navbar
          currentPath={currentPath}
          navigate={navigate}
          openQuoteModal={openQuoteModal}
        />
      )}

      {/* Main Page Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Public Footer (Hidden on Admin pages) */}
      {!isAdminRoute && (
        <Footer
          navigate={navigate}
          openQuoteModal={openQuoteModal}
        />
      )}

      {/* Modals */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        servicePrefill={quoteServicePrefill}
      />

      <DrawingViewerModal
        isOpen={drawingViewerOpen}
        onClose={() => setDrawingViewerOpen(false)}
        initialCategory={drawingViewerCategory}
      />

      {/* Floating Quick Contact / Zalo Widget (Public Website) */}
      {!isAdminRoute && (
        <FloatingContactWidget openQuoteModal={openQuoteModal} />
      )}

      {/* Promotional & Notice Popup (Public Website) */}
      {!isAdminRoute && (
        <PromoPopupModal navigate={navigate} openQuoteModal={openQuoteModal} />
      )}

    </div>
  );
};

// Top Root App with all Providers
export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <DataProvider>
          <AdminAuthProvider>
            <AppContent />
          </AdminAuthProvider>
        </DataProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

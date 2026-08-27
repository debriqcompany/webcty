import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, Article, ServiceItem, Partner, PageContent, CompanySettings } from '../types';

interface DataContextType {
  projects: Project[];
  articles: Article[];
  services: ServiceItem[];
  partners: Partner[];
  pages: Record<string, PageContent>;
  settings: CompanySettings | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  getProjectBySlug: (slug: string) => Project | undefined;
  getArticleBySlug: (slug: string) => Article | undefined;
  getServiceBySlug: (slug: string) => ServiceItem | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [pages, setPages] = useState<Record<string, PageContent>>({});
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/public/data');
      if (!res.ok) {
        throw new Error(`Failed to load data: ${res.statusText}`);
      }
      const data = await res.json();
      setProjects(data.projects || []);
      setArticles(data.articles || []);
      setServices(data.services || []);
      setPartners(data.partners || []);
      setPages(data.pages || {});
      setSettings(data.settings || null);
    } catch (err: any) {
      console.error('Error loading DEBRIQ data:', err);
      setError(err.message || 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getProjectBySlug = (slug: string) => {
    return projects.find(p => p.slug === slug);
  };

  const getArticleBySlug = (slug: string) => {
    return articles.find(a => a.slug === slug);
  };

  const getServiceBySlug = (slug: string) => {
    return services.find(s => s.slug === slug);
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        articles,
        services,
        partners,
        pages,
        settings,
        loading,
        error,
        refreshData: fetchData,
        getProjectBySlug,
        getArticleBySlug,
        getServiceBySlug
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};


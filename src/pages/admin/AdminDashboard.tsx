import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useData } from '../../context/DataContext';
import { 
  Building2, 
  Layers, 
  Users, 
  Mail, 
  Settings, 
  Image as ImageIcon, 
  FileText, 
  LogOut, 
  ExternalLink,
  LayoutDashboard,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Plus,
  BookOpen,
  FolderGit2
} from 'lucide-react';
import { AdminProjects } from './AdminProjects';
import { AdminArticles } from './AdminArticles';
import { AdminServices } from './AdminServices';
import { AdminPartners } from './AdminPartners';
import { AdminInquiries } from './AdminInquiries';
import { AdminSettings } from './AdminSettings';
import { AdminMedia } from './AdminMedia';
import { AdminPages } from './AdminPages';

interface AdminDashboardProps {
  navigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const { user, logout } = useAdminAuth();
  const { projects, articles, services, partners, pages, settings, refreshData } = useData();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'articles' | 'projects' | 'services' | 'partners' | 'inquiries' | 'media' | 'pages' | 'settings'
  >('overview');

  const token = typeof window !== 'undefined' ? localStorage.getItem('debriq_admin_token') : null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'articles', label: `Bài viết (${articles?.length || 0})`, icon: BookOpen },
    { id: 'projects', label: `Dự án (${projects?.length || 0})`, icon: Building2 },
    { id: 'pages', label: 'Trang tĩnh', icon: FileText },
    { id: 'media', label: 'Media & Tệp', icon: ImageIcon },
    { id: 'services', label: `Dịch vụ (${services?.length || 0})`, icon: Layers },
    { id: 'partners', label: `Đối tác (${partners?.length || 0})`, icon: Users },
    { id: 'inquiries', label: 'Hộp thư tiếp nhận', icon: Mail },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f11] text-[#e4e4e7] font-sans antialiased flex flex-col selection:bg-[#f27d26] selection:text-white">
      
      {/* Top CMS Header */}
      <header className="bg-[#18181b] border-b border-[#27272a] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-tight">
                DEBRIQ
              </span>
              <span className="text-[11px] font-semibold text-[#f27d26] bg-[#f27d26]/10 px-2 py-0.5 rounded border border-[#f27d26]/20">
                CMS
              </span>
            </div>
            <span className="text-neutral-500 text-xs hidden sm:inline-block border-l border-[#27272a] pl-3">
              Hệ thống Quản trị Nội dung Kỹ thuật
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg border border-[#3f3f46] hover:bg-[#27272a] text-neutral-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Xem trang web công khai"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#f27d26]" />
              <span className="font-medium">Xem Website</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 border-l border-[#27272a] pl-3 text-neutral-400">
              <div className="w-6 h-6 rounded-full bg-[#27272a] flex items-center justify-center text-[10px] font-bold text-white">
                AD
              </div>
              <span className="font-medium text-neutral-300">{user?.name || 'Admin'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 px-3 rounded-lg border border-red-900/40 hover:bg-red-950/60 text-red-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">Đăng xuất</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap gap-1.5 bg-[#18181b] p-1.5 rounded-xl border border-[#27272a]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium inline-flex items-center gap-2 transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#f27d26] text-white shadow-sm font-semibold' 
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#27272a]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Views */}
        <div>
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Metric Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div 
                  onClick={() => setActiveTab('articles')}
                  className="bg-[#18181b] border border-[#27272a] hover:border-[#f27d26] p-5 rounded-xl space-y-2 cursor-pointer transition-all shadow-sm group"
                >
                  <div className="flex justify-between items-start text-neutral-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Bài viết & Insights</span>
                    <BookOpen className="w-5 h-5 text-[#f27d26] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl font-black text-white">
                    {articles?.length || 0}
                  </div>
                  <p className="text-xs text-neutral-500">Tiêu chuẩn Shopdrawing & Phân tích kỹ thuật</p>
                </div>

                <div 
                  onClick={() => setActiveTab('projects')}
                  className="bg-[#18181b] border border-[#27272a] hover:border-[#f27d26] p-5 rounded-xl space-y-2 cursor-pointer transition-all shadow-sm group"
                >
                  <div className="flex justify-between items-start text-neutral-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Dự án Case Studies</span>
                    <Building2 className="w-5 h-5 text-[#f27d26] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl font-black text-white">
                    {projects?.length || 0}
                  </div>
                  <p className="text-xs text-neutral-500">Long Thành, The Global City, The One World...</p>
                </div>

                <div 
                  onClick={() => setActiveTab('media')}
                  className="bg-[#18181b] border border-[#27272a] hover:border-[#f27d26] p-5 rounded-xl space-y-2 cursor-pointer transition-all shadow-sm group"
                >
                  <div className="flex justify-between items-start text-neutral-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Media & Tệp tin</span>
                    <ImageIcon className="w-5 h-5 text-[#f27d26] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl font-black text-white">
                    Thư viện
                  </div>
                  <p className="text-xs text-neutral-500">Hình ảnh, bản vẽ kỹ thuật trong /uploads</p>
                </div>

                <div 
                  onClick={() => setActiveTab('inquiries')}
                  className="bg-[#18181b] border border-[#27272a] hover:border-[#f27d26] p-5 rounded-xl space-y-2 cursor-pointer transition-all shadow-sm group"
                >
                  <div className="flex justify-between items-start text-neutral-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Tiếp nhận hồ sơ</span>
                    <Mail className="w-5 h-5 text-[#f27d26] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl font-black text-[#f27d26]">
                    Hộp thư
                  </div>
                  <p className="text-xs text-neutral-500">Yêu cầu báo giá & Hồ sơ ứng tuyển kỹ sư</p>
                </div>

              </div>

              {/* Quick Actions & System Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="bg-[#18181b] border border-[#27272a] p-6 rounded-xl space-y-4">
                  <h3 className="font-semibold text-white text-sm border-b border-[#27272a] pb-3">
                    Thao tác nhanh
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setActiveTab('articles')}
                      className="p-3 bg-[#121215] hover:bg-[#202024] border border-[#27272a] rounded-lg text-left space-y-1 transition-colors cursor-pointer"
                    >
                      <span className="text-white font-medium text-xs block">+ Viết bài phân tích mới</span>
                      <span className="text-[11px] text-neutral-500">Trình soạn thảo Block editor</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="p-3 bg-[#121215] hover:bg-[#202024] border border-[#27272a] rounded-lg text-left space-y-1 transition-colors cursor-pointer"
                    >
                      <span className="text-white font-medium text-xs block">+ Thêm hồ sơ dự án</span>
                      <span className="text-[11px] text-neutral-500">Cập nhật hồ sơ & hình ảnh</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('media')}
                      className="p-3 bg-[#121215] hover:bg-[#202024] border border-[#27272a] rounded-lg text-left space-y-1 transition-colors cursor-pointer"
                    >
                      <span className="text-white font-medium text-xs block">+ Tải ảnh lên thư viện</span>
                      <span className="text-[11px] text-neutral-500">Lưu trữ local trên VPS</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="p-3 bg-[#121215] hover:bg-[#202024] border border-[#27272a] rounded-lg text-left space-y-1 transition-colors cursor-pointer"
                    >
                      <span className="text-white font-medium text-xs block">Đổi Hotline & Email</span>
                      <span className="text-[11px] text-neutral-500">Cập nhật liên hệ toàn website</span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#18181b] border border-[#27272a] p-6 rounded-xl space-y-4">
                  <h3 className="font-semibold text-white text-sm border-b border-[#27272a] pb-3">
                    Thông số hệ thống DEBRIQ
                  </h3>
                  <div className="space-y-2.5 text-xs text-neutral-400">
                    <div className="flex justify-between py-1 border-b border-[#27272a]/50">
                      <span className="text-neutral-500">Doanh nghiệp:</span>
                      <span className="text-white font-medium">CÔNG TY TNHH KỸ THUẬT DEBRIQ</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#27272a]/50">
                      <span className="text-neutral-500">Cơ sở dữ liệu:</span>
                      <span className="text-white">JSON Database Persistent Storage</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#27272a]/50">
                      <span className="text-neutral-500">Lưu trữ tệp Media:</span>
                      <span className="text-white">Local VPS Filesystem (/uploads)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-neutral-500">Bảo mật Admin:</span>
                      <span className="text-emerald-400 font-medium">Session Auth + SHA256 Hashing Active</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'articles' && (
            <AdminArticles articles={articles} token={token} onRefresh={refreshData} />
          )}

          {activeTab === 'projects' && (
            <AdminProjects projects={projects} refreshData={refreshData} token={token} />
          )}

          {activeTab === 'services' && (
            <AdminServices services={services} refreshData={refreshData} token={token} />
          )}

          {activeTab === 'partners' && (
            <AdminPartners partners={partners} refreshData={refreshData} token={token} />
          )}

          {activeTab === 'inquiries' && (
            <AdminInquiries token={token} />
          )}

          {activeTab === 'media' && (
            <AdminMedia token={token} />
          )}

          {activeTab === 'pages' && (
            <AdminPages pages={pages} refreshData={refreshData} token={token} />
          )}

          {activeTab === 'settings' && (
            <AdminSettings settings={settings} refreshData={refreshData} token={token} />
          )}
        </div>

      </div>

    </div>
  );
};

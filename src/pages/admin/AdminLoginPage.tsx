import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

interface AdminLoginPageProps {
  onSuccess: () => void;
  navigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, navigate }) => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Email hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex flex-col justify-center items-center p-4 font-sans select-none">
      
      {/* Background CAD grid */}
      <div className="absolute inset-0 bg-blueprint-dark opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#181818] border border-[#333] p-8 shadow-2xl space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2 border-b border-[#2A2A2A] pb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#F27D26]/10 border border-[#F27D26] text-[#F27D26] mb-2 rounded-lg">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-bold text-2xl text-[#F3F2EE] tracking-tight">
            DEBRIQ CMS
          </h1>
          <p className="text-xs text-[#888]">
            Hệ thống Quản trị Nội dung Nội bộ
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2 rounded">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-[#AAA] font-medium mb-1">
              Email quản trị
            </label>
            <div className="relative">
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] text-[#EEE] px-3 py-2.5 pl-9 focus:ring-0 focus:outline-none rounded"
              />
              <Mail className="w-4 h-4 text-[#666] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[#AAA] font-medium mb-1">
              Mật khẩu bảo mật
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] text-[#EEE] px-3 py-2.5 pl-9 focus:ring-0 focus:outline-none rounded"
              />
              <Lock className="w-4 h-4 text-[#666] absolute left-3 top-3" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F27D26] hover:bg-[#D86616] text-white py-3 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-lg rounded"
            >
              <span>{loading ? 'Đang xác thực...' : 'Đăng nhập vào CMS'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-[#888] hover:text-[#DDD] underline cursor-pointer"
          >
            ← Quay lại trang chủ DEBRIQ
          </button>
        </div>

      </div>
    </div>
  );
};

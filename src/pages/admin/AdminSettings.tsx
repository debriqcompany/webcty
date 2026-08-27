import React, { useState, useEffect } from 'react';
import { CompanySettings } from '../../types';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Save, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  UserPlus, 
  Users, 
  Trash2, 
  KeyRound, 
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminSettingsProps {
  settings: CompanySettings | null;
  refreshData: () => Promise<void>;
  token: string | null;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, refreshData, token }) => {
  const { user: currentSessionUser } = useAdminAuth();

  const [formData, setFormData] = useState<CompanySettings>({
    companyName: settings?.companyName || 'CÔNG TY TNHH KỸ THUẬT DEBRIQ',
    displayName: settings?.displayName || 'DEBRIQ',
    tagline: settings?.tagline || 'KỸ THUẬT THI CÔNG & SHOPDRAWING CHUYÊN NGHIỆP',
    hotline: settings?.hotline || '0983 147 456',
    zalo: settings?.zalo || '0983 147 456',
    email: settings?.email || 'contact@debriq.vn',
    address: settings?.address || '71 Quốc Lộ 13, Tổ 2, Khu Phố Bàu Bàng, Xã Bàu Bàng, Thành phố Hồ Chí Minh',
    tools: settings?.tools || ['AutoCAD', 'Revit', 'KataPro'],
    teamCount: settings?.teamCount || '5+ Kỹ sư nòng cốt',
    collaboratorCount: settings?.collaboratorCount || '25+ Cộng tác viên chuyên môn',
    activeSince: settings?.activeSince || '2022'
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync state if settings prop changes
  useEffect(() => {
    if (settings) {
      setFormData(prev => ({
        ...prev,
        ...settings
      }));
    }
  }, [settings]);

  // Admin Users List State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // New User Creation State
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserConfirmPassword, setNewUserConfirmPassword] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  const [userMsg, setUserMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password Change State for Current User
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const authHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Lỗi lưu cài đặt');

      await refreshData();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserMsg(null);

    if (!newUserEmail || !newUserPassword) {
      setUserMsg({ type: 'error', text: 'Vui lòng nhập đầy đủ Email và Mật khẩu.' });
      return;
    }

    if (newUserPassword.length < 8) {
      setUserMsg({ type: 'error', text: 'Mật khẩu phải có tối thiểu 8 ký tự.' });
      return;
    }

    if (newUserPassword !== newUserConfirmPassword) {
      setUserMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
      return;
    }

    setCreatingUser(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          email: newUserEmail,
          name: newUserName,
          password: newUserPassword
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Tạo tài khoản thất bại.');
      }

      setUserMsg({ type: 'success', text: `Tạo tài khoản quản trị "${newUserEmail}" thành công!` });
      setNewUserEmail('');
      setNewUserName('');
      setNewUserPassword('');
      setNewUserConfirmPassword('');
      await fetchUsers();
      setTimeout(() => setUserMsg(null), 5000);
    } catch (err: any) {
      setUserMsg({ type: 'error', text: err.message || 'Lỗi khi tạo tài khoản.' });
    } finally {
      setCreatingUser(false);
    }
  };

  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const handleDeleteUser = async (userId: string, email: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể xóa tài khoản.');
      }

      await fetchUsers();
      setUserMsg({ type: 'success', text: `Đã xóa tài khoản "${email}".` });
      setDeletingUserId(null);
    } catch (err: any) {
      setUserMsg({ type: 'error', text: err.message || 'Lỗi khi xóa tài khoản.' });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Mật khẩu mới phải có tối thiểu 8 ký tự.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
      return;
    }

    setPasswordUpdating(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Đổi mật khẩu thất bại.');
      }

      setPasswordMsg({ type: 'success', text: 'Đổi mật khẩu thành công! Mật khẩu mới đã được băm PBKDF2 và cập nhật an toàn.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 5000);
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Lỗi kết nối máy chủ.' });
    } finally {
      setPasswordUpdating(false);
    }
  };

  return (
    <div className="space-y-8 font-sans text-xs">
      
      {/* Top Banner Alert */}
      {success && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 p-4 rounded flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-sm">Cài đặt thông tin doanh nghiệp đã được lưu thành công!</span>
          </div>
          <span className="text-xs text-emerald-400 font-mono">200 OK</span>
        </div>
      )}

      {/* =========================================================================
          GENERAL COMPANY SETTINGS
          ========================================================================= */}
      <form onSubmit={handleSave} className="space-y-8">
        
        <div className="bg-[#181818] border border-[#2D2D2D] rounded-lg overflow-hidden shadow-xl">
          
          <div className="bg-[#202020] p-5 border-b border-[#2D2D2D] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F27D26]/10 border border-[#F27D26]/30 flex items-center justify-center text-[#F27D26]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F3F2EE]">
                Cài đặt Thông tin Doanh nghiệp & Liên hệ
              </h2>
              <p className="text-xs text-[#888] mt-0.5">
                Cập nhật pháp nhân, hotline, email, địa chỉ trụ sở và thông số hiển thị toàn trang.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[#AAA] font-medium mb-1.5">Tên pháp nhân đầy đủ *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#AAA] font-medium mb-1.5">Tên hiển thị thương hiệu *</label>
                <input
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-[#AAA] font-medium mb-1.5">Hotline liên hệ *</label>
                <input
                  type="text"
                  required
                  value={formData.hotline}
                  onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                  className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#AAA] font-medium mb-1.5">Zalo tư vấn</label>
                <input
                  type="text"
                  value={formData.zalo}
                  onChange={(e) => setFormData({ ...formData, zalo: e.target.value })}
                  className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#AAA] font-medium mb-1.5">Email chính thức *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#AAA] font-medium mb-1.5">Địa chỉ trụ sở đăng ký *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border-t border-[#2D2D2D] pt-5">
              <div>
                <label className="block text-[#AAA] font-medium mb-1.5">Quy mô kỹ sư nòng cốt</label>
                <input
                  type="text"
                  value={formData.teamCount}
                  onChange={(e) => setFormData({ ...formData, teamCount: e.target.value })}
                  className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#AAA] font-medium mb-1.5">Quy mô cộng tác viên</label>
                <input
                  type="text"
                  value={formData.collaboratorCount}
                  onChange={(e) => setFormData({ ...formData, collaboratorCount: e.target.value })}
                  className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#AAA] font-medium mb-1.5">Năm bắt đầu hoạt động</label>
                <input
                  type="text"
                  value={formData.activeSince}
                  onChange={(e) => setFormData({ ...formData, activeSince: e.target.value })}
                  className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded focus:outline-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-[#2D2D2D]">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#F27D26] hover:bg-[#D86616] text-white px-8 py-3 font-semibold rounded inline-flex items-center gap-2 cursor-pointer shadow-lg transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Đang lưu cài đặt...' : 'Lưu tất cả thay đổi'}</span>
              </button>
            </div>

          </div>

        </div>

      </form>

      {/* =========================================================================
          SECURITY ARCHITECTURE ASSURANCE BADGE
          ========================================================================= */}
      <div className="bg-gradient-to-r from-[#18181b] via-[#1a1714] to-[#18181b] border border-[#F27D26]/40 p-5 rounded-lg shadow-xl space-y-3">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#F27D26]/20 border border-[#F27D26] flex items-center justify-center text-[#F27D26] shrink-0 mt-0.5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-[#F3F2EE] uppercase tracking-wide">
                BẢO MẬT & MÃ HÓA MẬT KHẨU CHUẨN DOANH NGHIỆP
              </h4>
              <span className="bg-emerald-950 border border-emerald-600 text-emerald-400 font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                PBKDF2-SHA512 / 100K ITERATIONS
              </span>
            </div>
            <p className="text-xs text-[#AAA] leading-relaxed">
              Toàn bộ mật khẩu tài khoản quản trị viên được băm một chiều (one-way cryptographic hash) bằng thuật toán 
              <strong className="text-[#EEE]"> PBKDF2 (HMAC-SHA512)</strong> kết hợp chuỗi <strong className="text-[#EEE]">Salt ngẫu nhiên 16-byte</strong> với <strong className="text-[#EEE]">100,000 vòng lặp</strong>. 
              Máy chủ <strong className="text-emerald-400">tuyệt đối KHÔNG BAO GIỜ lưu mật khẩu thô (plain text)</strong>. Không ai, kể cả quản trị hệ thống, có thể đọc được mật khẩu gốc.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ADMIN ACCOUNTS MANAGEMENT
          ========================================================================= */}
      <div className="bg-[#181818] border border-[#2D2D2D] rounded-lg overflow-hidden shadow-xl">
        
        <div className="bg-[#202020] p-5 border-b border-[#2D2D2D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F27D26]/10 border border-[#F27D26]/30 flex items-center justify-center text-[#F27D26]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F3F2EE]">
                Quản lý Tài khoản Quản trị ({adminUsers.length})
              </h3>
              <p className="text-xs text-[#888] mt-0.5">
                Tạo mới, phân quyền và quản lý danh sách quản trị viên có quyền truy cập CMS
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Create New Admin User Form */}
          <div className="bg-[#121214] border border-[#333] p-5 rounded-lg space-y-4">
            <h4 className="font-bold text-xs text-[#F27D26] uppercase flex items-center gap-1.5 tracking-wider">
              <UserPlus className="w-4 h-4" />
              TẠO TÀI KHOẢN QUẢN TRỊ MỚI
            </h4>

            {userMsg && (
              <div className={`p-3 text-xs flex items-center gap-2 border rounded ${
                userMsg.type === 'success' 
                  ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300' 
                  : 'bg-red-950/70 border-red-800 text-red-300'
              }`}>
                {userMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                <span>{userMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#AAA] font-medium mb-1">Email đăng nhập *</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="vd: engineer@debriq.vn"
                    className="w-full bg-[#1A1A1E] border border-[#444] focus:border-[#F27D26] p-2 text-white rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#AAA] font-medium mb-1">Tên hiển thị / Họ tên</label>
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="vd: Kỹ sư Nguyễn Văn A"
                    className="w-full bg-[#1A1A1E] border border-[#444] focus:border-[#F27D26] p-2 text-white rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#AAA] font-medium mb-1">Mật khẩu khởi tạo (Tối thiểu 8 ký tự) *</label>
                  <input
                    type="password"
                    required
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#1A1A1E] border border-[#444] focus:border-[#F27D26] p-2 text-white rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#AAA] font-medium mb-1">Xác nhận mật khẩu *</label>
                  <input
                    type="password"
                    required
                    value={newUserConfirmPassword}
                    onChange={(e) => setNewUserConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#1A1A1E] border border-[#444] focus:border-[#F27D26] p-2 text-white rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="bg-[#F27D26] hover:bg-[#D86616] text-white px-5 py-2 font-semibold text-xs rounded inline-flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{creatingUser ? 'Đang tạo...' : 'Tạo tài khoản & Mã hóa PBKDF2'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Admin Users Table */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-[#AAA] uppercase tracking-wider">
              DANH SÁCH TÀI KHOẢN HIỆN CÓ
            </h4>

            <div className="border border-[#333] rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#202022] border-b border-[#333] text-[#AAA] uppercase font-mono">
                  <tr>
                    <th className="p-3">Email Quản trị</th>
                    <th className="p-3">Họ tên / Tên hiển thị</th>
                    <th className="p-3">Trạng thái mã hóa</th>
                    <th className="p-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2E] bg-[#141416]">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-[#777]">Đang tải danh sách tài khoản...</td>
                    </tr>
                  ) : adminUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-[#777]">Chưa có tài khoản nào.</td>
                    </tr>
                  ) : (
                    adminUsers.map((u) => {
                      const isCurrent = currentSessionUser?.email?.toLowerCase() === u.email.toLowerCase();
                      return (
                        <tr key={u.id} className="hover:bg-[#1A1A1E] transition-colors">
                          <td className="p-3 font-medium text-white flex items-center gap-2">
                            <KeyRound className="w-3.5 h-3.5 text-[#F27D26]" />
                            <span>{u.email}</span>
                            {isCurrent && (
                              <span className="bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/50 text-[9px] px-1.5 py-0.5 rounded font-bold">
                                BẠN
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-[#BBB]">{u.name}</td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Mã hóa PBKDF2 (SHA-512)</span>
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {!isCurrent && adminUsers.length > 1 && (
                              deletingUserId === u.id ? (
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(u.id, u.email)}
                                    className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded cursor-pointer"
                                  >
                                    Xóa?
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingUserId(null)}
                                    className="px-1.5 py-0.5 bg-[#333] text-[#AAA] text-[10px] rounded cursor-pointer"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDeletingUserId(u.id)}
                                  className="p-1.5 border border-red-900/50 hover:bg-red-950 text-red-400 rounded cursor-pointer transition-colors"
                                  title="Xóa tài khoản"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          PASSWORD CHANGE FOR CURRENT SESSION
          ========================================================================= */}
      <div className="bg-[#181818] border border-[#2D2D2D] rounded-lg overflow-hidden shadow-xl">
        
        <div className="bg-[#202020] p-5 border-b border-[#2D2D2D] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F27D26]/10 border border-[#F27D26]/30 flex items-center justify-center text-[#F27D26]">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F3F2EE]">
              Đổi Mật khẩu Tài khoản Hiện tại ({currentSessionUser?.email || 'Admin'})
            </h3>
            <p className="text-xs text-[#888] mt-0.5">
              Cập nhật mật khẩu cá nhân của bạn. Mật khẩu mới sẽ được mã hóa và áp dụng ngay lập tức.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="p-6 sm:p-8 space-y-5 max-w-2xl">
          {passwordMsg && (
            <div className={`p-3 text-xs flex items-center gap-2 border rounded ${
              passwordMsg.type === 'success' 
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' 
                : 'bg-red-950/60 border-red-800 text-red-300'
            }`}>
              {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-red-400" />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <div>
            <label className="block text-[#AAA] font-medium mb-1.5">Mật khẩu hiện tại của bạn *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
              className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#AAA] font-medium mb-1.5">Mật khẩu mới (Tối thiểu 8 ký tự) *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#AAA] font-medium mb-1.5">Xác nhận mật khẩu mới *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordUpdating}
              className="bg-[#2A2A2A] hover:bg-[#383838] border border-[#555] hover:border-[#F27D26] text-white px-6 py-2.5 font-semibold rounded inline-flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>{passwordUpdating ? 'Đang cập nhật...' : 'Cập nhật mật khẩu mới'}</span>
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};

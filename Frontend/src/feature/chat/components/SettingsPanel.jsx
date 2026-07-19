import { Link } from "react-router-dom";
import Avatar from "./Avatar";

export default function SettingsPanel({ onClose, onLogout, currentUser }) {
  const menuItems = [
    { label: "Account", desc: "Security notifications, account info", icon: "🔐" },
    { label: "Privacy", desc: "Blocked contacts, disappearing messages", icon: "🛡️" },
    { label: "Chats", desc: "Theme, wallpaper, chat settings", icon: "💬" },
    { label: "Notifications", desc: "Messages, groups, sounds", icon: "🔔" },
    { label: "Help & Feedback", desc: "Help center, contact us, privacy policy", icon: "❓" },
  ];

  const userInitials = currentUser?.name ? currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "U";

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#0a1628]/80">
      <div className="flex items-center justify-between px-4 h-16 border-b border-[#60A5FA]/10 bg-[#0a1628]/60 backdrop-blur-sm shrink-0">
        <div>
          <p className="text-sm font-bold text-[#F8FAFC]">Settings</p>
          <p className="text-xs text-[#94A3B8]">Manage your account and preferences</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-all" title="Close settings">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
        <div className="rounded-2xl border border-[#60A5FA]/10 bg-[#1E293B]/60 p-4 flex items-center gap-3">
          <Avatar initials={userInitials} gradient="from-[#2563EB] to-[#60A5FA]" size="md" status="online" profilePic={currentUser?.profilePicture} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#F8FAFC] truncate">{currentUser?.name || "Loading..."}</p>
            <p className="text-xs text-[#94A3B8]">Your profile and account settings</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#60A5FA]/10 bg-[#1E293B]/50 overflow-hidden">
          {menuItems.map((item) => (
            <Link to="/profile" key={item.label} onClick={onClose} className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors">
              <span className="text-xl w-8 text-center">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#F8FAFC]">{item.label}</p>
                <p className="text-xs text-[#94A3B8]">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <button onClick={onLogout} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
          <span className="text-lg">⏻</span>
          <span className="text-sm font-semibold">Log out</span>
        </button>
      </div>
    </div>
  );
}

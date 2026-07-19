import { Link } from "react-router-dom";
import Avatar from "./Avatar";

export default function Sidebar({ contacts, activeId, onSelect, search, setSearch, collapsed, setCollapsed, currentUser, onOpenSettings }) {
  const filtered = contacts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const userInitials = currentUser?.name ? currentUser.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : 'U';

  return (
    <aside className={`flex flex-col bg-[#0a1628] border-r border-[#60A5FA]/10 transition-all duration-300 shrink-0 ${collapsed ? "w-0 overflow-hidden md:w-17" : "w-full md:w-70 lg:w-75"}`}>
      <div className="flex items-center justify-between px-4 h-16 border-b border-[#60A5FA]/10 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-linear-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span className="text-[#F8FAFC] font-bold text-base tracking-tight">Chat<span className="text-[#60A5FA]">Sphere</span></span>
          </div>
        )}
        <button onClick={() => setCollapsed((v) => !v)} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-all shrink-0">
          {collapsed ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>}
        </button>
      </div>

      {!collapsed && (
        <div className="px-3 py-3 border-b border-[#60A5FA]/08 shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by username or name…" className="w-full bg-[#1E293B]/60 border border-[#60A5FA]/10 focus:border-[#3B82F6]/40 focus:ring-1 focus:ring-[#3B82F6]/20 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition-all duration-200" />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
        {!collapsed && (<p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#475569]">Messages {filtered.length > 0 && `· ${filtered.length}`}</p>)}
        {filtered.map((c) => (
          <button key={c.id} onClick={() => onSelect(c)} className={`w-full flex items-center gap-3 px-3 py-2.5 mx-1 rounded-xl transition-all duration-150 group ${activeId === c.id ? "bg-[#2563EB]/15 border border-[#2563EB]/20" : "hover:bg-white/5 border border-transparent"}`} style={{ width: "calc(100% - 8px)" }}>
            <Avatar initials={c.initials} gradient={c.gradient} size="md" status={c.status} profilePic={c.profilePic} />
            {!collapsed && (
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-0.5">
                  <p className={`text-sm font-semibold truncate ${activeId === c.id ? "text-[#F8FAFC]" : "text-[#CBD5E1] group-hover:text-[#F8FAFC]"}`}>{c.name}</p>
                  <span className="text-[10px] text-[#475569] shrink-0 ml-2">{c.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#475569] truncate">{c.lastMsg}</p>
                  {c.unread > 0 && (<span className="ml-2 shrink-0 w-5 h-5 bg-[#22C55E] rounded-full text-[10px] font-bold text-white flex items-center justify-center">{c.unread}</span>)}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className={`relative border-t border-[#60A5FA]/10 p-3 shrink-0 ${collapsed ? "flex justify-center" : ""}`}>
        {collapsed ? (
          <Link to="/profile" title="Go to Profile">
            <Avatar initials={userInitials} gradient="from-[#2563EB] to-[#60A5FA]" size="md" status="online" profilePic={currentUser?.profilePicture} />
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/profile" title="Go to Profile" className="flex items-center gap-3 flex-1 min-w-0 group">
              <Avatar initials={userInitials} gradient="from-[#2563EB] to-[#60A5FA]" size="md" status="online" profilePic={currentUser?.profilePicture} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#F8FAFC] truncate group-hover:text-[#60A5FA] transition-colors">{currentUser?.name || "Loading..."}</p>
                <p className="text-xs text-[#22C55E]">● Online</p>
              </div>
            </Link>
            <button onClick={onOpenSettings} className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-all" title="Settings">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

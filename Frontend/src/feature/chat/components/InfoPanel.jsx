import { STATUS_LABEL } from "../constants";

export default function InfoPanel({ contact, onClose }) {
  if (!contact) return null;
  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col border-l border-[#60A5FA]/10 bg-[#0a1628]/80">
      <div className="flex items-center justify-between px-5 h-16 border-b border-[#60A5FA]/10 shrink-0">
        <p className="text-sm font-bold text-[#F8FAFC]">Contact Info</p>
        <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-all"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide py-6 px-5 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className={`w-20 h-20 rounded-2xl bg-linear-to-br ${contact.gradient} flex items-center justify-center text-2xl font-bold text-white shadow-xl overflow-hidden`}>
            {contact.profilePic ? <img src={contact.profilePic} alt="avatar" className="w-full h-full object-cover" /> : contact.initials}
          </div>
          <div><h3 className="text-[#F8FAFC] font-bold text-lg">{contact.name}</h3><p className={`text-sm font-medium mt-0.5 ${contact.status === "online" ? "text-[#22C55E]" : contact.status === "away" ? "text-amber-400" : "text-[#475569]"}`}>● {STATUS_LABEL[contact.status]}</p></div>
          <div className="flex gap-2 mt-1">
            <button className="flex items-center gap-1.5 text-xs font-semibold text-[#60A5FA] border border-[#60A5FA]/20 hover:bg-[#2563EB]/10 px-3 py-1.5 rounded-lg transition-all"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 6.37 6.37l.92-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Call</button>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-[#60A5FA] border border-[#60A5FA]/20 hover:bg-[#2563EB]/10 px-3 py-1.5 rounded-lg transition-all"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>Video</button>
          </div>
        </div>
        <div className="bg-[#1E293B]/50 border border-[#60A5FA]/08 rounded-xl p-4 flex flex-col gap-3">
          <div><p className="text-[10px] font-bold uppercase tracking-widest text-[#475569] mb-0.5">Username</p><p className="text-sm text-[#CBD5E1]">@{contact.username || contact.name.split(" ")[0].toLowerCase()}</p></div>
          <div><p className="text-[10px] font-bold uppercase tracking-widest text-[#475569] mb-0.5">Messages</p><p className="text-sm text-[#CBD5E1]">{contact.messages.length} in this chat</p></div>
        </div>
        <div><p className="text-xs font-bold uppercase tracking-widest text-[#475569] mb-3">Shared Media</p><div className="grid grid-cols-3 gap-1.5">{[...Array(6)].map((_, i) => (<div key={i} className="aspect-square rounded-xl bg-[#1E293B] border border-[#60A5FA]/08 flex items-center justify-center text-[#475569]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>))}</div></div>
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl hover:bg-white/5 text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-all text-left"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>Search in conversation</button>
          <button className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl hover:bg-white/5 text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-all text-left"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>Mute notifications</button>
          <button className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-sm text-red-400/70 hover:text-red-400 transition-all text-left"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>Delete conversation</button>
        </div>
      </div>
    </aside>
  );
}

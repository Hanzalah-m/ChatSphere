import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

// ── Mock Data ─────────────────────────────────────────────────────────────────
const CONTACTS = [
  { id: 1, name: "Sarah Johnson", initials: "SJ", gradient: "from-violet-500 to-pink-500", status: "online", lastMsg: "Are we still meeting at 5 PM?", time: "2:47 PM", unread: 2, messages: [{ id: 1, from: "them", text: "Hey! How's the project going? 👋", time: "2:30 PM" }, { id: 2, from: "me", text: "Going really well! Almost done with the frontend.", time: "2:32 PM" }, { id: 3, from: "them", text: "That's awesome! Can't wait to see it.", time: "2:35 PM" }, { id: 4, from: "me", text: "I'll share a preview soon 🚀", time: "2:40 PM" }, { id: 5, from: "them", text: "Are we still meeting at 5 PM?", time: "2:47 PM" }] },
  { id: 2, name: "John Doe", initials: "JD", gradient: "from-emerald-500 to-teal-500", status: "online", lastMsg: "I'll be there in 10 minutes!", time: "2:51 PM", unread: 0, messages: [{ id: 1, from: "them", text: "Did you check the latest designs?", time: "1:10 PM" }, { id: 2, from: "me", text: "Yes! They look clean. A few tweaks needed.", time: "1:15 PM" }, { id: 3, from: "them", text: "Agree. I'll update them by EOD.", time: "1:18 PM" }, { id: 4, from: "me", text: "Perfect. See you at standup!", time: "1:20 PM" }, { id: 5, from: "them", text: "I'll be there in 10 minutes!", time: "2:51 PM" }] },
  { id: 3, name: "Alex Kim", initials: "AK", gradient: "from-amber-500 to-orange-500", status: "away", lastMsg: "Can you review my PR?", time: "1:20 PM", unread: 1, messages: [{ id: 1, from: "them", text: "Hey, just pushed the new feature branch.", time: "12:45 PM" }, { id: 2, from: "me", text: "Nice! I'll take a look.", time: "12:50 PM" }, { id: 3, from: "them", text: "Can you review my PR?", time: "1:20 PM" }] },
  { id: 4, name: "Maria Garcia", initials: "MG", gradient: "from-rose-500 to-red-500", status: "online", lastMsg: "The client loved the demo 🎉", time: "12:05 PM", unread: 0, messages: [{ id: 1, from: "them", text: "Demo went really well!", time: "11:50 AM" }, { id: 2, from: "me", text: "That's amazing! What did they say?", time: "11:55 AM" }, { id: 3, from: "them", text: "The client loved the demo 🎉", time: "12:05 PM" }] },
  { id: 5, name: "David Chen", initials: "DC", gradient: "from-blue-500 to-indigo-500", status: "offline", lastMsg: "Talk tomorrow 👍", time: "Yesterday", unread: 0, messages: [{ id: 1, from: "me", text: "Are you free for a quick call?", time: "Yesterday" }, { id: 2, from: "them", text: "Not right now, swamped with tickets.", time: "Yesterday" }, { id: 3, from: "me", text: "No worries, tomorrow works!", time: "Yesterday" }, { id: 4, from: "them", text: "Talk tomorrow 👍", time: "Yesterday" }] },
  { id: 6, name: "Priya Patel", initials: "PP", gradient: "from-purple-500 to-violet-500", status: "offline", lastMsg: "Sent you the report.", time: "Mon", unread: 0, messages: [{ id: 1, from: "them", text: "Just finished the Q3 report.", time: "Mon" }, { id: 2, from: "me", text: "Great, can you send it over?", time: "Mon" }, { id: 3, from: "them", text: "Sent you the report.", time: "Mon" }] },
];

const STATUS_COLOR = { online: "bg-[#22C55E]", away: "bg-amber-400", offline: "bg-slate-500" };
const STATUS_LABEL = { online: "Online", away: "Away", offline: "Offline" };

// ── Small Components ──────────────────────────────────────────────────────────
// UPDATED: Added profilePic prop and overflow-hidden for image
function Avatar({ initials, gradient, size = "md", status, profilePic }) {
  const sizes = { sm: "w-8 h-8 text-[10px]", md: "w-10 h-10 text-xs", lg: "w-12 h-12 text-sm" };
  const dotSizes = { sm: "w-2.5 h-2.5 border-[1.5px]", md: "w-3 h-3 border-2", lg: "w-3.5 h-3.5 border-2" };
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white overflow-hidden`}>
        {profilePic 
          ? <img src={profilePic} alt="avatar" className="w-full h-full object-cover" />
          : initials
        }
      </div>
      {status && <span className={`absolute bottom-0 right-0 ${dotSizes[size]} rounded-full ${STATUS_COLOR[status]} border-[#0F172A]`} />}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 px-4 py-1">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">SJ</div>
      <div className="bg-[#1E293B] border border-[#60A5FA]/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (<span key={i} className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1s" }} />))}
      </div>
    </div>
  );
}

// ── Settings Panel ───────────────────────────────────────────────────────────
function SettingsPanel({ onClose, onLogout, currentUser }) {
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
      <div className="flex items-center justify-between px-4 h-16 border-b border-[#60A5FA]/10 bg-[#0a1628]/60 backdrop-blur-sm flex-shrink-0">
        <div>
          <p className="text-sm font-bold text-[#F8FAFC]">Settings</p>
          <p className="text-xs text-[#94A3B8]">Manage your account and preferences</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-all" title="Close settings">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
        {/* UPDATED: Passed profilePicture prop */}
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

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ contacts, activeId, onSelect, search, setSearch, collapsed, setCollapsed, currentUser, onOpenSettings }) {
  const filtered = contacts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const userInitials = currentUser?.name ? currentUser.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : 'U';

  return (
    <aside className={`flex flex-col bg-[#0a1628] border-r border-[#60A5FA]/10 transition-all duration-300 flex-shrink-0 ${collapsed ? "w-0 overflow-hidden md:w-[68px]" : "w-full md:w-[280px] lg:w-[300px]"}`}>
      
      <div className="flex items-center justify-between px-4 h-16 border-b border-[#60A5FA]/10 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span className="text-[#F8FAFC] font-bold text-base tracking-tight">Chat<span className="text-[#60A5FA]">Sphere</span></span>
          </div>
        )}
        <button onClick={() => setCollapsed((v) => !v)} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-all flex-shrink-0">
          {collapsed ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>}
        </button>
      </div>

      {!collapsed && (
        <div className="px-3 py-3 border-b border-[#60A5FA]/08 flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations…" className="w-full bg-[#1E293B]/60 border border-[#60A5FA]/10 focus:border-[#3B82F6]/40 focus:ring-1 focus:ring-[#3B82F6]/20 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition-all duration-200" />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
        {!collapsed && (<p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#475569]">Messages {filtered.length > 0 && `· ${filtered.length}`}</p>)}
        {filtered.map((c) => (
          <button key={c.id} onClick={() => onSelect(c)} className={`w-full flex items-center gap-3 px-3 py-2.5 mx-1 rounded-xl transition-all duration-150 group ${activeId === c.id ? "bg-[#2563EB]/15 border border-[#2563EB]/20" : "hover:bg-white/5 border border-transparent"}`} style={{ width: "calc(100% - 8px)" }}>
            <Avatar initials={c.initials} gradient={c.gradient} size="md" status={c.status} />
            {!collapsed && (
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-0.5">
                  <p className={`text-sm font-semibold truncate ${activeId === c.id ? "text-[#F8FAFC]" : "text-[#CBD5E1] group-hover:text-[#F8FAFC]"}`}>{c.name}</p>
                  <span className="text-[10px] text-[#475569] flex-shrink-0 ml-2">{c.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#475569] truncate">{c.lastMsg}</p>
                  {c.unread > 0 && (<span className="ml-2 flex-shrink-0 w-5 h-5 bg-[#2563EB] rounded-full text-[10px] font-bold text-white flex items-center justify-center">{c.unread}</span>)}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className={`relative border-t border-[#60A5FA]/10 p-3 flex-shrink-0 ${collapsed ? "flex justify-center" : ""}`}>
        {collapsed ? (
          <Link to="/profile" title="Go to Profile">
            {/* UPDATED: Passed profilePicture prop (Collapsed) */}
            <Avatar initials={userInitials} gradient="from-[#2563EB] to-[#60A5FA]" size="md" status="online" profilePic={currentUser?.profilePicture} />
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/profile" title="Go to Profile" className="flex items-center gap-3 flex-1 min-w-0 group">
              {/* UPDATED: Passed profilePicture prop (Expanded) */}
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

// ── Message Bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg, showAvatar, contact }) {
  const isMe = msg.from === "me";
  return (
    <div className={`flex items-end gap-2.5 px-4 py-0.5 group ${isMe ? "flex-row-reverse" : ""}`}>
      <div className="w-8 flex-shrink-0">{!isMe && showAvatar && <Avatar initials={contact.initials} gradient={contact.gradient} size="sm" />}</div>
      <div className={`flex flex-col max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${isMe ? "bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white rounded-br-sm" : "bg-[#1E293B] border border-[#60A5FA]/10 text-[#F8FAFC] rounded-bl-sm"}`}>{msg.text}</div>
        <div className={`flex items-center gap-1.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isMe ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-[#475569]">{msg.time}</span>
          {isMe && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
        </div>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#2563EB]/20 to-[#60A5FA]/10 border border-[#60A5FA]/15 flex items-center justify-center text-4xl shadow-xl shadow-blue-500/10">💬</div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center shadow-lg shadow-blue-500/30"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
      </div>
      <div>
        <h3 className="text-[#F8FAFC] font-bold text-xl mb-2">No conversation selected</h3>
        <p className="text-[#94A3B8] text-sm leading-relaxed max-w-xs">Pick someone from the left to start chatting, or send a new message.</p>
      </div>
    </div>
  );
}

// ── Chat Area ─────────────────────────────────────────────────────────────────
function ChatArea({ contact, messages, onSend, showInfo, setShowInfo, mobileBack }) {
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimer = useRef(null);

  const EMOJIS = ["😊", "😂", "❤️", "👍", "🔥", "🎉", "🙏", "😍", "🤔", "👋", "✅", "🚀"];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
    inputRef.current?.focus();
    setIsTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setIsTyping(false), 2500);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  if (!contact) return <EmptyState />;

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      <div className="flex items-center justify-between px-4 h-16 border-b border-[#60A5FA]/10 bg-[#0a1628]/60 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={mobileBack} className="md:hidden w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#94A3B8] mr-1"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
          <Avatar initials={contact.initials} gradient={contact.gradient} size="md" status={contact.status} />
          <div>
            <p className="text-sm font-bold text-[#F8FAFC]">{contact.name}</p>
            <p className={`text-xs font-medium ${contact.status === "online" ? "text-[#22C55E]" : contact.status === "away" ? "text-amber-400" : "text-[#475569]"}`}>{isTyping && contact.status === "online" ? "typing…" : `● ${STATUS_LABEL[contact.status]}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-all" title="Voice call"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 6.37 6.37l.92-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></button>
          <button className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-all" title="Video call"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></button>
          <button onClick={() => setShowInfo((v) => !v)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${showInfo ? "bg-[#2563EB]/20 text-[#60A5FA]" : "hover:bg-white/5 text-[#94A3B8] hover:text-[#F8FAFC]"}`} title="Contact info"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-0.5 scrollbar-hide">
        <div className="flex items-center gap-3 px-6 py-3"><div className="flex-1 h-px bg-[#60A5FA]/08" /><span className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider">Today</span><div className="flex-1 h-px bg-[#60A5FA]/08" /></div>
        {messages.map((msg, i) => { const prev = messages[i - 1]; const showAvatar = !prev || prev.from !== msg.from; return <MessageBubble key={msg.id} msg={msg} showAvatar={showAvatar} contact={contact} />; })}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[#60A5FA]/10 px-4 py-3 bg-[#0a1628]/60 backdrop-blur-sm flex-shrink-0">
        {showEmoji && (<div className="mb-3 p-3 bg-[#1E293B] border border-[#60A5FA]/15 rounded-2xl flex flex-wrap gap-2">{EMOJIS.map((e) => (<button key={e} onClick={() => { setInput((v) => v + e); setShowEmoji(false); inputRef.current?.focus(); }} className="text-xl hover:scale-125 transition-transform duration-150">{e}</button>))}</div>)}
        <div className="flex items-end gap-2">
          <button className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-[#60A5FA] transition-all flex-shrink-0" title="Attach file"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></button>
          <div className="flex-1 relative"><textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} placeholder={`Message ${contact.name.split(" ")[0]}…`} rows={1} className="w-full bg-[#1E293B]/80 border border-[#60A5FA]/15 focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/15 rounded-2xl px-4 py-2.5 pr-10 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition-all duration-200 resize-none leading-relaxed" style={{ maxHeight: 120 }} /></div>
          <button onClick={() => setShowEmoji((v) => !v)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${showEmoji ? "bg-[#2563EB]/20 text-[#60A5FA]" : "hover:bg-white/5 text-[#94A3B8] hover:text-[#60A5FA]"}`} title="Emoji"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></button>
          <button onClick={handleSend} disabled={!input.trim()} className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-px transition-all duration-200 flex-shrink-0"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
        </div>
        <p className="text-[10px] text-[#475569] mt-2 text-center">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}

// ── Info Panel ────────────────────────────────────────────────────────────────
function InfoPanel({ contact, onClose }) {
  if (!contact) return null;
  return (
    <aside className="hidden lg:flex w-72 flex-shrink-0 flex-col border-l border-[#60A5FA]/10 bg-[#0a1628]/80">
      <div className="flex items-center justify-between px-5 h-16 border-b border-[#60A5FA]/10 flex-shrink-0">
        <p className="text-sm font-bold text-[#F8FAFC]">Contact Info</p>
        <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-all"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide py-6 px-5 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${contact.gradient} flex items-center justify-center text-2xl font-bold text-white shadow-xl overflow-hidden`}>
            {contact.initials}
          </div>
          <div><h3 className="text-[#F8FAFC] font-bold text-lg">{contact.name}</h3><p className={`text-sm font-medium mt-0.5 ${contact.status === "online" ? "text-[#22C55E]" : contact.status === "away" ? "text-amber-400" : "text-[#475569]"}`}>● {STATUS_LABEL[contact.status]}</p></div>
          <div className="flex gap-2 mt-1">
            <button className="flex items-center gap-1.5 text-xs font-semibold text-[#60A5FA] border border-[#60A5FA]/20 hover:bg-[#2563EB]/10 px-3 py-1.5 rounded-lg transition-all"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 6.37 6.37l.92-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Call</button>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-[#60A5FA] border border-[#60A5FA]/20 hover:bg-[#2563EB]/10 px-3 py-1.5 rounded-lg transition-all"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>Video</button>
          </div>
        </div>
        <div className="bg-[#1E293B]/50 border border-[#60A5FA]/08 rounded-xl p-4 flex flex-col gap-3">
          {[{ label: "Username", value: `@${contact.name.split(" ")[0].toLowerCase()}` }, { label: "Member since", value: "Jan 2024" }, { label: "Messages", value: `${contact.messages.length} in this chat` }].map((row) => (<div key={row.label}><p className="text-[10px] font-bold uppercase tracking-widest text-[#475569] mb-0.5">{row.label}</p><p className="text-sm text-[#CBD5E1]">{row.value}</p></div>))}
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

// ── Main ChatPage ─────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  
  const [contacts, setContacts] = useState(CONTACTS);
  const [activeContact, setActiveContact] = useState(null);
  const [search, setSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showSettingsView, setShowSettingsView] = useState(false);

  const activeMessages = activeContact ? contacts.find((c) => c.id === activeContact.id)?.messages || [] : [];

  const handleSelectContact = (contact) => {
    setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, unread: 0 } : c)));
    setActiveContact(contact);
    setShowSettingsView(false);
    setShowMobileChat(true);
  };

  const handleSend = (text) => {
    const newMsg = { id: Date.now(), from: "me", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setContacts((prev) => prev.map((c) => (c.id === activeContact.id ? { ...c, messages: [...c.messages, newMsg], lastMsg: text, time: "Now" } : c)));
    setActiveContact((prev) => prev ? { ...prev } : prev);
  };

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  const openSettings = () => {
    setShowSettingsView(true);
    setShowMobileChat(true);
    setShowInfo(false);
  };

  return (
    <div className="h-screen bg-[#0F172A] flex flex-col overflow-hidden">
      <div className="pointer-events-none fixed -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#2563EB]/10 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#3B82F6]/08 blur-[100px]" />

      <div className="flex flex-1 min-h-0 relative">
        <div className={`${showMobileChat ? "hidden md:flex" : "flex"} flex-col h-full`} style={{ flexShrink: 0 }}>
          <Sidebar
            contacts={contacts}
            activeId={activeContact?.id}
            onSelect={handleSelectContact}
            search={search}
            setSearch={setSearch}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            currentUser={user}
            onOpenSettings={openSettings}
          />
        </div>

        <div className={`${showMobileChat ? "flex" : "hidden md:flex"} flex-1 flex-col min-w-0 min-h-0`}>
          {showSettingsView ? (
            <SettingsPanel onClose={() => setShowSettingsView(false)} onLogout={onLogout} currentUser={user} />
          ) : (
            <ChatArea contact={activeContact} messages={activeMessages} onSend={handleSend} showInfo={showInfo} setShowInfo={setShowInfo} mobileBack={() => setShowMobileChat(false)} />
          )}
        </div>

        {showInfo && activeContact && (<InfoPanel contact={activeContact} onClose={() => setShowInfo(false)} />)}
      </div>
    </div>
  );
}
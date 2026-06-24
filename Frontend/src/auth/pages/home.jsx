import { memo } from 'react';

import { useState, useEffect, useRef } from "react";

// ── Utility ──────────────────────────────────────────────────────────────────
const Avatar = ({ initials, gradient, size = "md", online, away }) => {
  const sizes = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-11 h-11 text-sm" };
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white ${gradient}`}>
        {initials}
      </div>
      {(online || away) && (
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0F172A] ${online ? "bg-[#22C55E]" : "bg-amber-400"}`} />
      )}
    </div>
  );
};

const TypingDots = () => (
  <span className="inline-flex items-center gap-[3px] px-1">
    {[0, 1, 2].map((i) => (
      <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce"
        style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1s" }} />
    ))}
  </span>
);

// ── Sections ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "py-3 bg-[#0F172A]/85 backdrop-blur-xl border-b border-[#60A5FA]/10 shadow-lg shadow-black/20" : "py-5 bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span className="text-[#F8FAFC] font-bold text-lg tracking-tight">Chat<span className="text-[#60A5FA]">Sphere</span></span>
        </a>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "About", "Pricing", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="text-[#94A3B8] hover:text-[#F8FAFC] text-sm font-medium transition-colors duration-200">
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a href="#" className="hidden sm:block text-[#94A3B8] hover:text-[#F8FAFC] text-sm font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
            Login
          </a>
          <a href="#"
            className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-px">
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}

function ChatMockup() {
  const conversations = [
    { initials: "SJ", gradient: "bg-gradient-to-br from-violet-500 to-pink-500", name: "Sarah J.", preview: "Meeting at 5?", badge: 2, online: true },
    { initials: "JD", gradient: "bg-gradient-to-br from-emerald-500 to-teal-500", name: "John D.", preview: "I'll be there!", online: true },
    { initials: "AK", gradient: "bg-gradient-to-br from-amber-500 to-orange-500", name: "Alex K.", preview: "Joined the chat", away: true },
    { initials: "MR", gradient: "bg-gradient-to-br from-slate-500 to-slate-600", name: "Mike R.", preview: "See you later!" },
  ];

  return (
    <div className="relative">
      {/* Glow behind mockup */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-transparent rounded-3xl scale-110" />
      <div className="bg-gradient-to-br from-[#1E293B] to-[#0d1b2e] rounded-2xl border border-[#60A5FA]/15 shadow-2xl shadow-black/60 overflow-hidden">
        {/* Titlebar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#0d1b2e]/80 border-b border-[#60A5FA]/10">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 text-center text-[10px] font-medium text-[#94A3B8]">ChatSphere — Workspace</div>
        </div>

        <div className="flex" style={{ minHeight: 360 }}>
          {/* Sidebar */}
          <div className="w-48 bg-[#0a1628]/80 border-r border-[#60A5FA]/10 flex flex-col py-3">
            <p className="px-4 text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] mb-2">Direct Messages</p>
            {conversations.map((c) => (
              <div key={c.name}
                className={`flex items-center gap-2 px-3 py-2 mx-2 rounded-lg cursor-pointer transition-colors ${c.name === "Sarah J." ? "bg-[#2563EB]/20" : "hover:bg-white/5"}`}>
                <Avatar initials={c.initials} gradient={c.gradient} size="sm" online={c.online} away={c.away} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#F8FAFC] truncate">{c.name}</p>
                  <p className="text-[10px] text-[#94A3B8] truncate">{c.preview}</p>
                </div>
                {c.badge && (
                  <span className="text-[9px] font-bold bg-[#2563EB] text-white rounded-full w-4 h-4 flex items-center justify-center">{c.badge}</span>
                )}
              </div>
            ))}
            <p className="px-4 text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] mt-4 mb-2">Channels</p>
            {["# general", "# design", "# dev"].map((ch) => (
              <div key={ch} className="px-5 py-1.5 mx-2 rounded-lg hover:bg-white/5 cursor-pointer">
                <p className="text-[11px] text-[#94A3B8]">{ch}</p>
              </div>
            ))}
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
              {/* Received */}
              <div className="flex items-end gap-2">
                <Avatar initials="SJ" gradient="bg-gradient-to-br from-violet-500 to-pink-500" size="sm" />
                <div>
                  <p className="text-[10px] text-[#94A3B8] mb-1 ml-0.5">Sarah · 2:47 PM</p>
                  <div className="bg-[#1E293B] border border-[#60A5FA]/10 rounded-2xl rounded-bl-sm px-3 py-2 text-xs text-[#F8FAFC] max-w-[180px]">
                    Are we still meeting at 5 PM? 📅
                  </div>
                </div>
              </div>
              {/* Sent */}
              <div className="flex items-end gap-2 flex-row-reverse">
                <Avatar initials="Me" gradient="bg-gradient-to-br from-[#2563EB] to-[#60A5FA]" size="sm" />
                <div className="flex flex-col items-end">
                  <p className="text-[10px] text-[#94A3B8] mb-1 mr-0.5">You · 2:48 PM</p>
                  <div className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-2xl rounded-br-sm px-3 py-2 text-xs text-white max-w-[180px]">
                    Yes! I'll be there in 10 minutes 👍
                  </div>
                  <p className="text-[10px] text-[#60A5FA] mt-1 mr-0.5">✓✓ Seen</p>
                </div>
              </div>
              {/* Typing */}
              <div className="flex items-end gap-2">
                <Avatar initials="JD" gradient="bg-gradient-to-br from-emerald-500 to-teal-500" size="sm" />
                <div>
                  <p className="text-[10px] text-[#94A3B8] mb-1 ml-0.5">John is typing…</p>
                  <div className="bg-[#1E293B] border border-[#60A5FA]/10 rounded-2xl rounded-bl-sm px-3 py-2.5">
                    <TypingDots />
                  </div>
                </div>
              </div>
            </div>
            {/* Input bar */}
            <div className="border-t border-[#60A5FA]/10 px-4 py-3 flex items-center gap-2 bg-[#0d1b2e]/60">
              <div className="flex-1 bg-[#1E293B] border border-[#60A5FA]/15 rounded-xl px-3 py-2 text-[11px] text-[#94A3B8]">
                Message #general…
              </div>
              <button className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 px-6 overflow-hidden bg-[#0F172A]">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#2563EB]/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/15 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-[#60A5FA]/10 blur-[90px]" />
      {/* Floating shapes */}
      <div className="pointer-events-none absolute top-32 right-1/4 w-3 h-3 rounded-full bg-[#60A5FA]/40 animate-pulse" />
      <div className="pointer-events-none absolute bottom-40 left-1/4 w-2 h-2 rounded-full bg-[#3B82F6]/60 animate-pulse" style={{ animationDelay: "0.8s" }} />
      <div className="pointer-events-none absolute top-1/2 left-12 w-1.5 h-1.5 rounded-full bg-[#60A5FA]/50 animate-pulse" style={{ animationDelay: "1.4s" }} />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 border border-[#2563EB]/25 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[#60A5FA] text-xs font-semibold tracking-wide">Real-time messaging, reinvented</span>
          </div>
          <h1 className="text-5xl xl:text-6xl font-extrabold leading-[1.08] tracking-tight text-[#F8FAFC] mb-6">
            Connect{" "}
            <span className="bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent">Instantly.</span>
            <br />
            Communicate<br />
            <span className="bg-gradient-to-r from-[#F8FAFC] to-[#94A3B8] bg-clip-text text-transparent">Without Limits.</span>
          </h1>
          <p className="text-[#94A3B8] text-lg leading-relaxed mb-10 max-w-lg">
            ChatSphere delivers lightning-fast real-time messaging with secure authentication, online presence tracking, typing indicators, file sharing, and seamless conversations across devices.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-semibold px-7 py-3.5 rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/45 transition-all duration-200 hover:-translate-y-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Get Started
            </a>
            <a href="#"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-[#F8FAFC] font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/></svg>
              Watch Demo
            </a>
          </div>
          
        </div>

        {/* Right — Mockup */}
        <div className="w-full">
          <ChatMockup />
        </div>
      </div>
    </section>
  );
}

function LiveChatPreview() {
  const [step, setStep] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setStep((s) => (s + 1) % 5);
    }, 1800);
    return () => clearInterval(timerRef.current);
  }, []);

  const messages = [
    { id: 0, from: "Sarah", initials: "SJ", gradient: "bg-gradient-to-br from-violet-500 to-pink-500", text: "Are we still meeting at 5 PM? 📅", sent: false },
    { id: 1, typing: true, from: "John", initials: "JD", gradient: "bg-gradient-to-br from-emerald-500 to-teal-500" },
    { id: 2, from: "John", initials: "JD", gradient: "bg-gradient-to-br from-emerald-500 to-teal-500", text: "Yes, I'll be there in 10 minutes! 🚗", sent: false, seen: true },
    { id: 3, join: true, name: "Alex" },
    { id: 4, from: "Alex", initials: "AK", gradient: "bg-gradient-to-br from-amber-500 to-orange-500", text: "Awesome! I'm joining too 🙌", sent: false },
  ];

  const visible = messages.slice(0, step + 1);

  return (
    <section id="about" className="bg-gradient-to-b from-[#0F172A] via-[#0a1628] to-[#0F172A] py-28 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left copy */}
        <div>
          <p className="text-[#60A5FA] text-xs font-bold uppercase tracking-[3px] mb-4">Live Preview</p>
          <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight text-[#F8FAFC] mb-6">
            Real-Time Communication<br />
            <span className="bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent">That Feels Instant</span>
          </h2>
          <p className="text-[#94A3B8] text-lg leading-relaxed mb-8 max-w-md">
            Experience smooth, reliable messaging powered by modern real-time technologies. Every message arrives the moment it's sent.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { icon: "⚡", label: "Sub-50ms delivery via WebSocket" },
              { icon: "🔒", label: "End-to-end encrypted conversations" },
              { icon: "👁️", label: "Live read receipts & typing status" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 text-sm text-[#94A3B8]">
                <span className="text-base">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right — animated chat */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0d1b2e] rounded-2xl border border-[#60A5FA]/15 shadow-2xl shadow-black/60 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#60A5FA]/10 bg-[#0d1b2e]/70">
            <div className="flex -space-x-1.5">
              {["bg-gradient-to-br from-violet-500 to-pink-500", "bg-gradient-to-br from-emerald-500 to-teal-500", "bg-gradient-to-br from-amber-500 to-orange-500"].map((g, i) => (
                <div key={i} className={`w-7 h-7 rounded-full border-2 border-[#0d1b2e] ${g} flex items-center justify-center text-[9px] font-bold text-white`}>
                  {["S", "J", "A"][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC]">Team Chat</p>
              <p className="text-[10px] text-[#22C55E]">● 3 members · 2 online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="p-5 flex flex-col gap-4 min-h-[260px]">
            {visible.map((m) =>
              m.join ? (
                <div key={m.id} className="text-center">
                  <span className="bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-full px-3 py-1 text-[10px] text-[#60A5FA]">
                    🟢 {m.name} joined the conversation
                  </span>
                </div>
              ) : m.typing ? (
                <div key={m.id} className="flex items-end gap-2">
                  <Avatar initials={m.initials} gradient={m.gradient} size="sm" />
                  <div>
                    <p className="text-[10px] text-[#94A3B8] mb-1">{m.from} is typing…</p>
                    <div className="bg-[#1E293B] border border-[#60A5FA]/10 rounded-2xl rounded-bl-sm px-3 py-2.5">
                      <TypingDots />
                    </div>
                  </div>
                </div>
              ) : (
                <div key={m.id} className={`flex items-end gap-2 ${m.sent ? "flex-row-reverse" : ""}`}>
                  <Avatar initials={m.initials} gradient={m.gradient} size="sm" />
                  <div className={m.sent ? "items-end flex flex-col" : ""}>
                    <p className={`text-[10px] text-[#94A3B8] mb-1 ${m.sent ? "mr-0.5 text-right" : "ml-0.5"}`}>{m.from}</p>
                    <div className={`rounded-2xl px-4 py-2.5 text-sm max-w-xs ${
                      m.sent
                        ? "bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white rounded-br-sm"
                        : "bg-[#1E293B] border border-[#60A5FA]/10 text-[#F8FAFC] rounded-bl-sm"
                    }`}>{m.text}</div>
                    {m.seen && <p className="text-[10px] text-[#60A5FA] mt-1 mr-0.5">✓✓ Seen</p>}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: "⚡", title: "Real-Time Messaging", desc: "Messages appear instantly with no refresh required. Powered by WebSocket for sub-50ms delivery." },
    { icon: "🔐", title: "Secure Authentication", desc: "Protected user accounts with JWT authentication and encrypted passwords using bcrypt." },
    { icon: "👁️", title: "Online Presence", desc: "Know exactly who is online and available with live status indicators that update in real time." },
    { icon: "⌨️", title: "Typing Indicators", desc: "See when someone is actively responding with animated typing indicators that appear live." },
    { icon: "📎", title: "File Sharing", desc: "Share images, documents, and attachments effortlessly with drag-and-drop and instant previews." },
    { icon: "👥", title: "Group Conversations", desc: "Create communities and collaborate with multiple users in organized channels and group chats." },
  ];

  return (
    <section id="features" className="bg-[#0F172A] py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#60A5FA] text-xs font-bold uppercase tracking-[3px] mb-4">Features</p>
          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-[#F8FAFC] mb-5">
            Everything You Need To<br />
            <span className="bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent">Stay Connected</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">Powerful features built for individuals, teams, and communities of any scale.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title}
              className="group relative bg-gradient-to-br from-[#1E293B] to-[#0d1b2e] border border-[#60A5FA]/10 rounded-2xl p-7 hover:border-[#60A5FA]/30 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden">
              {/* Top shimmer line on hover */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#60A5FA]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB]/20 to-[#60A5FA]/10 border border-[#60A5FA]/20 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="text-[#F8FAFC] font-bold text-lg mb-3">{f.title}</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section className="bg-[#080e1a] py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#60A5FA] text-xs font-bold uppercase tracking-[3px] mb-4">Product</p>
          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-[#F8FAFC] mb-5">
            Designed For<br />
            <span className="bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent">Modern Conversations</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Desktop — spans 2 cols */}
          <div className="lg:col-span-2 relative group">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#2563EB]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="bg-gradient-to-br from-[#1E293B] to-[#0d1b2e] rounded-2xl border border-[#60A5FA]/15 shadow-2xl shadow-black/50 overflow-hidden h-full">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0d1b2e]/80 border-b border-[#60A5FA]/10">
                <div className="flex gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500/70"/><span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"/><span className="w-2.5 h-2.5 rounded-full bg-green-500/70"/></div>
                <span className="text-[10px] text-[#94A3B8] ml-2">ChatSphere — Desktop</span>
              </div>
              <div className="p-5 flex gap-4">
                <div className="w-36 flex flex-col gap-1">
                  {["# general ✓", "# design", "# engineering", "# random"].map((ch, i) => (
                    <div key={ch} className={`px-3 py-1.5 rounded-lg text-[11px] ${i === 0 ? "bg-[#2563EB]/20 text-[#F8FAFC] font-semibold" : "text-[#94A3B8] hover:bg-white/5 cursor-pointer"}`}>{ch}</div>
                  ))}
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  {[
                    { initials: "SJ", g: "bg-gradient-to-br from-violet-500 to-pink-500", name: "Sarah", text: "Design review at 3 PM! 🎨", sent: false },
                    { initials: "Me", g: "bg-gradient-to-br from-[#2563EB] to-[#60A5FA]", name: "You", text: "Mockups are ready ✅", sent: true },
                  ].map((m, i) => (
                    <div key={i} className={`flex items-end gap-2 ${m.sent ? "flex-row-reverse" : ""}`}>
                      <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white ${m.g}`}>{m.initials}</div>
                      <div className={`rounded-xl px-3 py-2 text-[11px] max-w-[200px] ${m.sent ? "bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white" : "bg-[#0d1b2e] border border-[#60A5FA]/10 text-[#F8FAFC]"}`}>{m.text}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-3 left-5">
                <span className="bg-[#1E293B] border border-[#60A5FA]/20 text-[#60A5FA] text-[10px] font-semibold px-2.5 py-1 rounded-lg">Desktop Interface</span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            {/* Mobile */}
            <div className="relative group bg-gradient-to-br from-[#1E293B] to-[#0d1b2e] rounded-2xl border border-[#60A5FA]/15 shadow-xl shadow-black/50 overflow-hidden p-5">
              <span className="absolute top-3 right-3 bg-[#1E293B] border border-[#60A5FA]/20 text-[#60A5FA] text-[10px] font-semibold px-2.5 py-1 rounded-lg">Mobile</span>
              <div className="flex flex-col gap-2.5 mt-6">
                <div className="bg-[#0d1b2e] border border-[#60A5FA]/10 rounded-xl rounded-bl-sm px-3 py-2 text-xs text-[#F8FAFC] max-w-[75%]">Are you free now? 👋</div>
                <div className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-xl rounded-br-sm px-3 py-2 text-xs text-white max-w-[75%] self-end">Yes, one sec! 😊</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-[9px] font-bold text-white">J</div>
                  <div className="bg-[#0d1b2e] border border-[#60A5FA]/10 rounded-xl rounded-bl-sm px-3 py-2">
                    <TypingDots />
                  </div>
                </div>
              </div>
            </div>

            {/* Group */}
            <div className="relative group bg-gradient-to-br from-[#1E293B] to-[#0d1b2e] rounded-2xl border border-[#60A5FA]/15 shadow-xl shadow-black/50 overflow-hidden p-5">
              <span className="absolute top-3 right-3 bg-[#1E293B] border border-[#60A5FA]/20 text-[#60A5FA] text-[10px] font-semibold px-2.5 py-1 rounded-lg">Group</span>
              <div className="flex -space-x-1.5 mt-6 mb-3">
                {["bg-gradient-to-br from-violet-500 to-pink-500", "bg-gradient-to-br from-emerald-500 to-teal-500", "bg-gradient-to-br from-amber-500 to-orange-500"].map((g, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full border-2 border-[#1E293B] ${g} flex items-center justify-center text-[9px] font-bold text-white`}>
                    {["S","J","A"][i]}
                  </div>
                ))}
                <div className="w-7 h-7 rounded-full border-2 border-[#1E293B] bg-[#0d1b2e] flex items-center justify-center text-[9px] font-semibold text-[#60A5FA]">+8</div>
              </div>
              <p className="text-xs font-semibold text-[#F8FAFC] mb-1">Team Alpha</p>
              <p className="text-[10px] text-[#22C55E]">● 3 online right now</p>
              <div className="mt-3 bg-[#0d1b2e] border border-[#60A5FA]/10 rounded-xl px-3 py-2 text-[11px] text-[#F8FAFC]">
                Welcome Alex! 🎉
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChoose() {
  const pillars = [
    { icon: "⚡", title: "Fast", desc: "Built on WebSocket technology for instant communication. Messages are delivered in under 50ms anywhere in the world." },
    { icon: "🛡️", title: "Secure", desc: "Industry-standard authentication and data protection. JWT tokens, bcrypt hashing, and encrypted data at rest and in transit." },
    { icon: "🌐", title: "Scalable", desc: "Designed to grow from personal chats to large communities. Architecture that scales horizontally to millions of users." },
  ];

  return (
    <section className="bg-gradient-to-b from-[#080e1a] to-[#0F172A] py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#60A5FA] text-xs font-bold uppercase tracking-[3px] mb-4">Why ChatSphere</p>
          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-[#F8FAFC] mb-5">
            Built Different,{" "}
            <span className="bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent">Built Better</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div key={p.title}
              className="bg-gradient-to-br from-[#1E293B]/80 to-[#2563EB]/5 border border-[#60A5FA]/10 rounded-2xl p-8 text-center hover:border-[#60A5FA]/25 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-5">{p.icon}</div>
              <h3 className="text-[#F8FAFC] font-extrabold text-2xl mb-3">{p.title}</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  const categories = [
    { label: "Frontend", techs: [{ icon: "⚛️", name: "React" }, { icon: "🎨", name: "Tailwind CSS" }] },
    { label: "Backend", techs: [{ icon: "🟢", name: "Node.js" }, { icon: "🚂", name: "Express.js" }] },
    { label: "Database", techs: [{ icon: "🍃", name: "MongoDB" }] },
    { label: "Real-Time", techs: [{ icon: "🔌", name: "Socket.IO" }] },
    { label: "Auth", techs: [{ icon: "🔑", name: "JWT" }] },
    { label: "Deployment", techs: [{ icon: "▲", name: "Vercel" }, { icon: "🎯", name: "Render" }] },
  ];

  return (
    <section id="pricing" className="bg-[#0F172A] py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#60A5FA] text-xs font-bold uppercase tracking-[3px] mb-4">Technology</p>
          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-[#F8FAFC] mb-5">
            Built With Modern{" "}
            <span className="bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent">Technologies</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">A battle-tested, modern stack for maximum performance and developer experience.</p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((cat) => (
            <div key={cat.label} className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">{cat.label}</span>
              <div className="flex gap-3">
                {cat.techs.map((t) => (
                  <div key={t.name}
                    className="flex items-center gap-2.5 bg-[#1E293B] border border-[#60A5FA]/15 hover:border-[#60A5FA]/35 rounded-full px-5 py-2.5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 cursor-default">
                    <span className="text-lg">{t.icon}</span>
                    <span className="text-[#F8FAFC] text-sm font-semibold">{t.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-28 px-6 overflow-hidden bg-[#0F172A]">
      {/* Background gradient card */}
      <div className="pointer-events-none absolute inset-6 rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0d1b2e] to-[#1E293B] border border-[#2563EB]/20" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[400px] rounded-full bg-[#2563EB]/15 blur-[100px]" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 border border-[#2563EB]/25 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-[#60A5FA] text-xs font-semibold tracking-wide">Free to get started · No credit card required</span>
        </div>
        <h2 className="text-5xl xl:text-6xl font-extrabold tracking-tight text-[#F8FAFC] mb-6">
          Ready To Start{" "}
          <span className="bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent">Chatting?</span>
        </h2>
        <p className="text-[#94A3B8] text-lg mb-10 max-w-lg mx-auto">
          Join ChatSphere today and experience real-time communication built for the modern web.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="#"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-semibold px-8 py-4 rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200 hover:-translate-y-0.5 text-base">
            🚀 Create Free Account
          </a>
          <a href="#"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-[#F8FAFC] font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-base">
            🔑 Login
          </a>
        </div>
        <div className="flex items-center justify-center gap-8 mt-10 flex-wrap">
          {["No credit card required", "Free forever plan", "Set up in 2 minutes"].map((t) => (
            <div key={t} className="flex items-center gap-2 text-sm text-[#94A3B8]">
              <span className="text-[#22C55E]">✓</span> {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-[#050a14] border-t border-[#60A5FA]/10 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <span className="text-[#F8FAFC] font-bold text-lg">Chat<span className="text-[#60A5FA]">Sphere</span></span>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-xs mb-6">
              Modern real-time messaging built with React, Node.js, MongoDB, and Socket.IO. Connecting people instantly, securely, and at scale.
            </p>
            <div className="flex gap-3">
              {[
                { label: "GitHub", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg> },
                { label: "LinkedIn", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg> },
                { label: "Twitter", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg> },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-[#1E293B] border border-[#60A5FA]/15 hover:border-[#60A5FA]/35 flex items-center justify-center text-[#94A3B8] hover:text-[#60A5FA] transition-all duration-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[#F8FAFC] font-semibold text-sm uppercase tracking-widest mb-5">Product</h4>
            <ul className="flex flex-col gap-3">
              {["Features", "About", "Pricing", "Changelog"].map((l) => (
                <li key={l}><a href="#" className="text-[#94A3B8] hover:text-[#F8FAFC] text-sm transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[#F8FAFC] font-semibold text-sm uppercase tracking-widest mb-5">Legal</h4>
            <ul className="flex flex-col gap-3">
              {["Contact", "Privacy Policy", "Terms of Service", "Security"].map((l) => (
                <li key={l}><a href="#" className="text-[#94A3B8] hover:text-[#F8FAFC] text-sm transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#60A5FA]/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#94A3B8] text-xs">© 2025 ChatSphere. All rights reserved.</p>
          <p className="text-[#94A3B8] text-xs">Built with ❤️ using React & Node.js</p>
        </div>
      </div>
    </footer>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="font-sans antialiased">
      <Navbar />
      <Hero />
      <LiveChatPreview />
      <Features />
      <Showcase />
      <WhyChoose />
      <TechStack />
      <CTA />
      <Footer />
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { getSocket } from "../socket";
import Avatar from "./Avatar";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import EmptyState from "./EmptyState";
import { STATUS_LABEL, EMOJIS } from "../constants";

export default function ChatArea({ contact, messages, onSend, showInfo, setShowInfo, mobileBack }) {
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
    inputRef.current?.focus();
    // stop typing locally and notify server
    setIsTyping(false);
    clearTimeout(typingTimer.current);
    try { const s = getSocket(); s.emit("stop typing", contact.chatId); } catch (e) {}
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    try { const s = getSocket(); s.emit("typing", contact.chatId); } catch (err) {}
    setIsTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      setIsTyping(false);
      try { const s = getSocket(); s.emit("stop typing", contact.chatId); } catch (err) {}
    }, 2000);
  };

  if (!contact) return <EmptyState />;

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      <div className="flex items-center justify-between px-4 h-16 border-b border-[#60A5FA]/10 bg-[#0a1628]/60 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={mobileBack} className="md:hidden w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#94A3B8] mr-1"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
          <Avatar initials={contact.initials} gradient={contact.gradient} size="md" status={contact.status} profilePic={contact.profilePic} />
          <div>
            <p className="text-sm font-bold text-[#F8FAFC]">{contact.name}</p>
            <p className={`text-xs font-medium ${contact.status === "online" ? "text-[#22C55E]" : contact.status === "away" ? "text-amber-400" : "text-[#475569]"}`}>{contact?.remoteTyping && contact.status === "online" ? "typing…" : `● ${STATUS_LABEL[contact.status]}`}</p>
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
        {contact?.remoteTyping && <TypingIndicator contact={contact} />}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[#60A5FA]/10 px-4 py-3 bg-[#0a1628]/60 backdrop-blur-sm shrink-0">
        {showEmoji && (<div className="mb-3 p-3 bg-[#1E293B] border border-[#60A5FA]/15 rounded-2xl flex flex-wrap gap-2">{EMOJIS.map((e) => (<button key={e} onClick={() => { setInput((v) => v + e); setShowEmoji(false); inputRef.current?.focus(); }} className="text-xl hover:scale-125 transition-transform duration-150">{e}</button>))}</div>)}
        <div className="flex items-end gap-2">
          <button className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-[#60A5FA] transition-all shrink-0" title="Attach file"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></button>
          <div className="flex-1 relative"><textarea ref={inputRef} value={input} onChange={handleInputChange} onKeyDown={handleKey} placeholder={`Message ${contact.name.split(" ")[0]}…`} rows={1} className="w-full bg-[#1E293B]/80 border border-[#60A5FA]/15 focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/15 rounded-2xl px-4 py-2.5 pr-10 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition-all duration-200 resize-none leading-relaxed" style={{ maxHeight: 120 }} /></div>
          <button onClick={() => setShowEmoji((v) => !v)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${showEmoji ? "bg-[#2563EB]/20 text-[#60A5FA]" : "hover:bg-white/5 text-[#94A3B8] hover:text-[#60A5FA]"}`} title="Emoji"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></button>
          <button onClick={handleSend} disabled={!input.trim()} className="w-9 h-9 rounded-xl bg-linear-to-br from-[#2563EB] to-[#3B82F6] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-px transition-all duration-200 shrink-0"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
        </div>
        <p className="text-[10px] text-[#475569] mt-2 text-center">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}

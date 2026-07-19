import Avatar from "./Avatar";

export default function MessageBubble({ msg, showAvatar, contact }) {
  const isMe = msg.from === "me";
  return (
    <div className={`flex items-end gap-2.5 px-4 py-0.5 group ${isMe ? "flex-row-reverse" : ""}`}>
      <div className="w-8 shrink-0">{!isMe && showAvatar && <Avatar initials={contact.initials} gradient={contact.gradient} size="sm" profilePic={contact.profilePic} />}</div>
      <div className={`flex flex-col max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed wrap-break-words ${isMe ? "bg-linear-to-br from-[#2563EB] to-[#3B82F6] text-white rounded-br-sm" : "bg-[#1E293B] border border-[#60A5FA]/10 text-[#F8FAFC] rounded-bl-sm"}`}>{msg.text}</div>
        <div className={`flex items-center gap-1.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isMe ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-[#475569]">{msg.time}</span>
          {isMe && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
        </div>
      </div>
    </div>
  );
}

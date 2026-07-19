import Avatar from "./Avatar";

export default function TypingIndicator({ contact }) {
  return (
    <div className="flex items-end gap-2 px-4 py-1">
      <Avatar initials={contact?.initials} gradient={contact?.gradient} size="sm" status={contact?.status} profilePic={contact?.profilePic} />
      <div className="bg-[#1E293B] border border-[#60A5FA]/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (<span key={i} className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1s" }} />))}
      </div>
    </div>
  );
}

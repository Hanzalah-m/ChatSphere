export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-[#2563EB]/20 to-[#60A5FA]/10 border border-[#60A5FA]/15 flex items-center justify-center text-4xl shadow-xl shadow-blue-500/10">💬</div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-linear-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center shadow-lg shadow-blue-500/30"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
      </div>
      <div>
        <h3 className="text-[#F8FAFC] font-bold text-xl mb-2">No conversation selected</h3>
        <p className="text-[#94A3B8] text-sm leading-relaxed max-w-xs">Pick someone from the left to start chatting, or send a new message.</p>
      </div>
    </div>
  );
}

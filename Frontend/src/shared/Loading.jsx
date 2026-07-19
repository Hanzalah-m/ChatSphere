export default function Loading({ message = "Loading your workspace", subtext = "Please wait while we prepare your experience.", className = "" }) {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-[#0F172A] text-white ${className}`}>
      <div className="flex flex-col items-center gap-5 text-center px-4">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-[#1E293B]/80" />
          <div className="absolute inset-0 rounded-full border-4 border-[#3B82F6]/20 animate-pulse" />
          <div className="absolute inset-3 rounded-full border-4 border-[#2563EB]/10 border-t-[#60A5FA] animate-spin" />
          <div className="absolute inset-6 rounded-full bg-[#0F172A]" />
        </div>
        <div className="max-w-xs">
          <p className="text-xl font-semibold text-white">{message}</p>
          <p className="mt-2 text-sm text-[#94A3B8] leading-6">{subtext}</p>
        </div>
      </div>
    </div>
  );
}

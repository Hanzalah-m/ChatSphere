import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added Link and useNavigate
import { useAuth } from "../../auth/hooks/useAuth"; // Adjust path if needed

// ── Shared helpers ────────────────────────────────────────────────────────────
function SectionCard({ title, description, children }) {
  return (
    <div className="bg-gradient-to-br from-[#1E293B]/90 to-[#0d1b2e]/90 backdrop-blur-xl border border-[#60A5FA]/15 rounded-2xl p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-[#F8FAFC] font-bold text-lg mb-1">{title}</h2>
        {description && <p className="text-[#94A3B8] text-sm">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function InputField({ label, name, type = "text", value, onChange, placeholder, icon, error, hint, readOnly }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">{icon}</div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full bg-[#0d1b2e]/80 border ${error ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20" : readOnly ? "border-[#60A5FA]/08 opacity-50 cursor-not-allowed" : "border-[#60A5FA]/15 focus:border-[#3B82F6]/60 focus:ring-[#3B82F6]/20"} focus:ring-2 rounded-xl ${icon ? "pl-10" : "pl-4"} pr-4 py-3 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition-all duration-200`}
        />
      </div>
      {hint && !error && <p className="text-[#475569] text-xs">{hint}</p>}
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${checked ? "bg-gradient-to-r from-[#2563EB] to-[#3B82F6] shadow-lg shadow-blue-500/30" : "bg-[#1E293B] border border-[#60A5FA]/20"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function SaveButton({ loading, label = "Save Changes" }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-px text-sm"
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Saving…
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

function Toast({ message, type = "success" }) {
  if (!message) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium animate-bounce-in
      ${type === "success" ? "bg-[#0d1b2e] border-[#22C55E]/30 text-[#22C55E]" : "bg-[#0d1b2e] border-red-500/30 text-red-400"}`}>
      {type === "success" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
      )}
      {message}
    </div>
  );
}

// ── Sidebar Nav ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "profile",   label: "Profile",        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { id: "account",   label: "Account",        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M19.07 19.07A10 10 0 0 0 4.93 4.93"/></svg> },
  { id: "security",  label: "Security",       icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
  { id: "notifs",    label: "Notifications",  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  { id: "privacy",   label: "Privacy",        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { id: "appearance",label: "Appearance",     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></svg> },
  { id: "danger",    label: "Danger Zone",    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, danger: true },
];

// ── Tab: Profile ──────────────────────────────────────────────────────────────
function ProfileTab({ toast, currentUser }) {
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileRef = useRef();
  
  // Initialize form with current user data if available
  const [form, setForm] = useState({
    displayName: currentUser?.name || "John Doe",
    username: currentUser?.username || "johndoe",
    bio: "Full-stack developer. Building cool stuff with React & Node.js. 🚀",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    pronouns: "",
  });

  // Calculate initials for avatar
  const userInitials = form.displayName ? form.displayName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "U";

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); toast("Profile updated successfully!"); }, 1500);
  };

  const STATUS_OPTIONS = ["🟢 Online", "🌙 Do Not Disturb", "🕐 Away", "⚫ Invisible"];

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar card */}
      <SectionCard title="Profile Picture" description="Click the avatar to upload a new photo. JPG, PNG or GIF. Max 5MB.">
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer" onClick={() => fileRef.current.click()}>
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-blue-500/30 overflow-hidden">
              {avatarPreview ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" /> : userInitials}
            </div>
            <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#22C55E] rounded-full border-2 border-[#0F172A]" />
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>
          <div>
            <button onClick={() => fileRef.current.click()} className="block text-sm font-semibold text-[#60A5FA] hover:text-[#3B82F6] transition-colors mb-1">Upload new photo</button>
            {avatarPreview && (
              <button onClick={() => setAvatarPreview(null)} className="block text-xs text-red-400 hover:text-red-300 transition-colors">Remove photo</button>
            )}
            <p className="text-[#475569] text-xs mt-2">Recommended: 400×400px or larger</p>
          </div>
        </div>
      </SectionCard>

      {/* Status picker */}
      <SectionCard title="Status" description="Let others know what you're up to right now.">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATUS_OPTIONS.map((s) => (
            <button key={s} className="px-3 py-2.5 rounded-xl text-sm font-medium border border-[#60A5FA]/15 hover:border-[#60A5FA]/35 bg-[#0d1b2e]/60 hover:bg-[#0d1b2e] text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-200 text-left">
              {s}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Info form */}
      <SectionCard title="Personal Information" description="This information is visible to other ChatSphere users.">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField label="Display Name" name="displayName" value={form.displayName} onChange={handleChange} placeholder="Your full name"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
            <InputField label="Username" name="username" value={form.username} onChange={handleChange} placeholder="johndoe" hint="Only lowercase letters, numbers and underscores"
              icon={<span className="text-[#94A3B8] text-sm font-bold">@</span>} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider">Bio</label>
            <textarea
              name="bio" value={form.bio} onChange={handleChange} rows={3} maxLength={160}
              placeholder="Tell people a little about yourself…"
              className="w-full bg-[#0d1b2e]/80 border border-[#60A5FA]/15 focus:border-[#3B82F6]/60 focus:ring-2 focus:ring-[#3B82F6]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition-all duration-200 resize-none"
            />
            <p className="text-[#475569] text-xs text-right">{form.bio.length}/160</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField label="Location" name="location" value={form.location} onChange={handleChange} placeholder="City, Country"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>} />
            <InputField label="Website" name="website" type="url" value={form.website} onChange={handleChange} placeholder="https://yoursite.com"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>} />
          </div>
          <InputField label="Pronouns" name="pronouns" value={form.pronouns} onChange={handleChange} placeholder="e.g. they/them, she/her, he/him" />
          <div className="flex justify-end pt-2">
            <SaveButton loading={loading} />
          </div>
        </form>
      </SectionCard>
    </div>
  );
}

// ── Tab: Account ──────────────────────────────────────────────────────────────
function AccountTab({ toast }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "john@example.com", phone: "" });
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); toast("Account details updated!"); }, 1500); };

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Account Details" description="Manage your login email and contact information.">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <InputField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange}
            hint="Changing your email will require re-verification."
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />
          <InputField label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000"
            hint="Optional. Used for account recovery only."
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 6.37 6.37l.91-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.98 16.92z"/></svg>} />
          <div className="flex justify-end pt-2"><SaveButton loading={loading} /></div>
        </form>
      </SectionCard>

      <SectionCard title="Linked Accounts" description="Connect your social accounts for quicker sign-in.">
        {[
          { name: "Google", icon: <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>, linked: true },
          { name: "GitHub", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#94A3B8"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>, linked: false },
        ].map((acc) => (
          <div key={acc.name} className="flex items-center justify-between py-4 border-b border-[#60A5FA]/08 last:border-0">
            <div className="flex items-center gap-3">
              {acc.icon}
              <div>
                <p className="text-sm font-semibold text-[#F8FAFC]">{acc.name}</p>
                <p className="text-xs text-[#94A3B8]">{acc.linked ? "Connected" : "Not connected"}</p>
              </div>
            </div>
            <button className={`text-xs font-semibold px-4 py-1.5 rounded-lg border transition-all duration-200 ${acc.linked ? "border-red-500/25 text-red-400 hover:bg-red-500/10" : "border-[#60A5FA]/25 text-[#60A5FA] hover:bg-[#2563EB]/10"}`}>
              {acc.linked ? "Disconnect" : "Connect"}
            </button>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

// ── Tab: Security ─────────────────────────────────────────────────────────────
function SecurityTab({ toast }) {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState({ current: false, newP: false, confirm: false });
  const [form, setForm] = useState({ current: "", newP: "", confirm: "" });
  const [twoFA, setTwoFA] = useState(false);
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); setForm({ current: "", newP: "", confirm: "" }); toast("Password changed successfully!"); }, 1500); };

  const sessions = [
    { device: "MacBook Pro", location: "San Francisco, CA", time: "Active now", current: true, icon: "💻" },
    { device: "iPhone 14 Pro", location: "San Francisco, CA", time: "2 hours ago", current: false, icon: "📱" },
    { device: "Chrome · Windows", location: "New York, NY", time: "3 days ago", current: false, icon: "🖥️" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Change Password" description="Use a strong password with at least 8 characters, a number, and a symbol.">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {[
            { key: "current", label: "Current Password", placeholder: "Enter current password" },
            { key: "newP",    label: "New Password",     placeholder: "Enter new password" },
            { key: "confirm", label: "Confirm New Password", placeholder: "Repeat new password" },
          ].map((f) => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <label className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider">{f.label}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input
                  type={show[f.key] ? "text" : "password"} name={f.key} value={form[f.key]} onChange={handleChange} placeholder={f.placeholder}
                  className="w-full bg-[#0d1b2e]/80 border border-[#60A5FA]/15 focus:border-[#3B82F6]/60 focus:ring-2 focus:ring-[#3B82F6]/20 rounded-xl pl-10 pr-11 py-3 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition-all duration-200"
                />
                <button type="button" onClick={() => setShow((p) => ({ ...p, [f.key]: !p[f.key] }))}
                  className="absolute inset-y-0 right-3.5 flex items-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
                  {show[f.key]
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end pt-2"><SaveButton loading={loading} label="Update Password" /></div>
        </form>
      </SectionCard>

      <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-xl">🔐</div>
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC]">Authenticator App</p>
              <p className="text-xs text-[#94A3B8]">{twoFA ? "2FA is enabled on your account" : "Not yet configured"}</p>
            </div>
          </div>
          <ToggleSwitch checked={twoFA} onChange={(v) => { setTwoFA(v); toast(v ? "2FA enabled!" : "2FA disabled."); }} />
        </div>
      </SectionCard>

      <SectionCard title="Active Sessions" description="Manage devices currently signed in to your account.">
        <div className="flex flex-col gap-1">
          {sessions.map((s) => (
            <div key={s.device} className="flex items-center justify-between py-3.5 border-b border-[#60A5FA]/08 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#F8FAFC]">{s.device}</p>
                    {s.current && <span className="text-[9px] font-bold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/25 px-2 py-0.5 rounded-full">Current</span>}
                  </div>
                  <p className="text-xs text-[#94A3B8]">{s.location} · {s.time}</p>
                </div>
              </div>
              {!s.current && (
                <button className="text-xs font-semibold text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-red-500/10">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ── Tab: Notifications ────────────────────────────────────────────────────────
function NotificationsTab({ toast }) {
  const [settings, setSettings] = useState({
    directMessages: true, mentions: true, groupMessages: false,
    emailDigest: true, emailMentions: false,
    desktopSound: true, mobileNotifs: true,
  });
  const toggle = (key) => setSettings((p) => ({ ...p, [key]: !p[key] }));

  const groups = [
    {
      title: "In-App Notifications",
      items: [
        { key: "directMessages", label: "Direct Messages", desc: "Notify when you receive a private message" },
        { key: "mentions",       label: "Mentions",        desc: "Notify when someone @mentions you" },
        { key: "groupMessages",  label: "Group Messages",  desc: "Notify for all group chat activity" },
        { key: "desktopSound",   label: "Sound",           desc: "Play a sound for incoming notifications" },
      ],
    },
    {
      title: "Email Notifications",
      items: [
        { key: "emailDigest",   label: "Daily Digest",    desc: "A summary of activity while you're away" },
        { key: "emailMentions", label: "Direct Mentions", desc: "Email when someone mentions you" },
      ],
    },
    {
      title: "Push Notifications",
      items: [
        { key: "mobileNotifs", label: "Mobile Push", desc: "Send push notifications to your mobile device" },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {groups.map((g) => (
        <SectionCard key={g.title} title={g.title}>
          <div className="flex flex-col gap-1">
            {g.items.map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3.5 border-b border-[#60A5FA]/08 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">{item.label}</p>
                  <p className="text-xs text-[#94A3B8]">{item.desc}</p>
                </div>
                <ToggleSwitch checked={settings[item.key]} onChange={() => { toggle(item.key); toast(`${item.label} ${!settings[item.key] ? "enabled" : "disabled"}.`); }} />
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

// ── Tab: Privacy ──────────────────────────────────────────────────────────────
function PrivacyTab({ toast }) {
  const [settings, setSettings] = useState({ showOnline: true, showLastSeen: true, readReceipts: true, allowSearch: true, publicProfile: false });
  const toggle = (key) => setSettings((p) => ({ ...p, [key]: !p[key] }));

  const items = [
    { key: "showOnline",    label: "Online Status",       desc: "Let others see when you're online" },
    { key: "showLastSeen",  label: "Last Seen",           desc: "Show when you were last active" },
    { key: "readReceipts",  label: "Read Receipts",       desc: "Let senders know when you've read their message" },
    { key: "allowSearch",   label: "Searchable Profile",  desc: "Allow others to find you by username or email" },
    { key: "publicProfile", label: "Public Profile",      desc: "Make your profile visible to non-members" },
  ];

  return (
    <SectionCard title="Privacy Controls" description="Manage who can see your information and activity.">
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between py-4 border-b border-[#60A5FA]/08 last:border-0">
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC]">{item.label}</p>
              <p className="text-xs text-[#94A3B8]">{item.desc}</p>
            </div>
            <ToggleSwitch checked={settings[item.key]} onChange={() => { toggle(item.key); toast(`${item.label} updated.`); }} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ── Tab: Appearance ───────────────────────────────────────────────────────────
function AppearanceTab({ toast }) {
  const [theme, setTheme] = useState("dark");
  const [accent, setAccent] = useState("#2563EB");
  const [fontSize, setFontSize] = useState("md");
  const [compact, setCompact] = useState(false);

  const accents = ["#2563EB", "#7C3AED", "#059669", "#DC2626", "#D97706", "#EC4899"];
  const themes = [
    { id: "dark",    label: "Dark",     preview: "bg-[#0F172A]" },
    { id: "darker",  label: "Darker",   preview: "bg-[#020817]" },
    { id: "midnight",label: "Midnight", preview: "bg-[#0a0a1a]" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Theme" description="Choose how ChatSphere looks for you.">
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <button key={t.id} onClick={() => { setTheme(t.id); toast(`${t.label} theme applied.`); }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${theme === t.id ? "border-[#2563EB]/60 bg-[#2563EB]/10" : "border-[#60A5FA]/15 hover:border-[#60A5FA]/30 bg-[#0d1b2e]/40"}`}>
              <div className={`w-12 h-8 rounded-lg ${t.preview} border border-[#60A5FA]/20`} />
              <span className="text-xs font-semibold text-[#94A3B8]">{t.label}</span>
              {theme === t.id && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Accent Color" description="Personalise buttons and highlights.">
        <div className="flex gap-3 flex-wrap">
          {accents.map((c) => (
            <button key={c} onClick={() => { setAccent(c); toast("Accent color updated."); }}
              style={{ background: c }}
              className={`w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 ${accent === c ? "ring-2 ring-white/50 ring-offset-2 ring-offset-[#0d1b2e]" : ""}`} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Message Display" description="Adjust how messages appear in conversations.">
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-semibold text-[#F8FAFC] mb-3">Font Size</p>
            <div className="flex gap-3">
              {[{ id: "sm", label: "Small" }, { id: "md", label: "Medium" }, { id: "lg", label: "Large" }].map((f) => (
                <button key={f.id} onClick={() => { setFontSize(f.id); toast(`Font size set to ${f.label}.`); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${fontSize === f.id ? "border-[#2563EB]/60 bg-[#2563EB]/15 text-[#60A5FA]" : "border-[#60A5FA]/15 text-[#94A3B8] hover:border-[#60A5FA]/30"}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC]">Compact Mode</p>
              <p className="text-xs text-[#94A3B8]">Reduce spacing between messages</p>
            </div>
            <ToggleSwitch checked={compact} onChange={(v) => { setCompact(v); toast(`Compact mode ${v ? "on" : "off"}.`); }} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ── Tab: Danger Zone ──────────────────────────────────────────────────────────
function DangerTab() {
  const [confirmText, setConfirmText] = useState("");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Deactivate */}
      <div className="bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-6 md:p-8">
        <h2 className="text-amber-400 font-bold text-lg mb-1">Deactivate Account</h2>
        <p className="text-[#94A3B8] text-sm mb-5">Temporarily disable your account. Your data is preserved and you can reactivate at any time.</p>
        <button className="text-sm font-semibold text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 px-5 py-2.5 rounded-xl transition-all duration-200">
          Deactivate my account
        </button>
      </div>

      {/* Delete */}
      <div className="bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/20 rounded-2xl p-6 md:p-8">
        <h2 className="text-red-400 font-bold text-lg mb-1">Delete Account</h2>
        <p className="text-[#94A3B8] text-sm mb-5">
          Permanently delete your account and all associated data. <span className="text-red-400 font-semibold">This action is irreversible.</span>
        </p>
        <button onClick={() => setShowModal(true)} className="text-sm font-semibold text-red-400 border border-red-500/30 hover:bg-red-500/10 px-5 py-2.5 rounded-xl transition-all duration-200">
          Delete my account
        </button>
      </div>

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="bg-gradient-to-br from-[#1E293B] to-[#0d1b2e] border border-red-500/25 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-2xl mb-5">⚠️</div>
            <h3 className="text-[#F8FAFC] font-extrabold text-xl mb-2">Delete your account?</h3>
            <p className="text-[#94A3B8] text-sm mb-6">This will permanently delete your account, all messages, files, and settings. This cannot be undone.</p>
            <p className="text-[#94A3B8] text-xs mb-2">Type <span className="text-red-400 font-bold font-mono">DELETE</span> to confirm:</p>
            <input
              type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE"
              className="w-full bg-[#0d1b2e] border border-red-500/30 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition-all duration-200 mb-6 font-mono"
            />
            <div className="flex gap-3">
              <button onClick={() => { setShowModal(false); setConfirmText(""); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#94A3B8] border border-[#60A5FA]/15 hover:bg-white/5 transition-all duration-200">
                Cancel
              </button>
              <button disabled={confirmText !== "DELETE"}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ProfilePage ──────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, handleLogout } = useAuth(); // Fetch user and logout
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  const userInitials = user?.name ? user.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "U";

  const TABS = {
    profile:    <ProfileTab toast={showToast} currentUser={user} />,
    account:    <AccountTab toast={showToast} />,
    security:   <SecurityTab toast={showToast} />,
    notifs:     <NotificationsTab toast={showToast} />,
    privacy:    <PrivacyTab toast={showToast} />,
    appearance: <AppearanceTab toast={showToast} />,
    danger:     <DangerTab />,
  };

  const activeItem = NAV_ITEMS.find((n) => n.id === activeTab);

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#2563EB]/15 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#3B82F6]/10 blur-[100px]" />

      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-[#0F172A]/85 backdrop-blur-xl border-b border-[#60A5FA]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Updated to Link */}
          <Link to="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span className="text-[#F8FAFC] font-bold text-lg tracking-tight">Chat<span className="text-[#60A5FA]">Sphere</span></span>
          </Link>

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-[#94A3B8]">
            <Link to="/dashboard" className="hover:text-[#F8FAFC] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#F8FAFC] font-medium">Settings</span>
            <span>/</span>
            <span className="text-[#60A5FA] font-medium">{activeItem?.label}</span>
          </div>

          {/* User pill */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 bg-[#1E293B]/60 border border-[#60A5FA]/15 rounded-xl px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-[11px] font-bold text-white">{userInitials}</div>
              <span className="text-sm font-medium text-[#F8FAFC]">{user?.name || "Loading..."}</span>
            </div>
            {/* Updated to Button for Logout */}
            <button onClick={onLogout} className="text-xs font-semibold text-[#94A3B8] hover:text-red-400 border border-[#60A5FA]/15 hover:border-red-500/30 px-3 py-2 rounded-xl transition-all duration-200">
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6 lg:gap-8 relative">

          {/* ── Sidebar ── */}
          <aside className="hidden lg:flex flex-col gap-1 w-56 flex-shrink-0 sticky top-24 self-start">
            <p className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest px-3 mb-3">Settings</p>
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left
                  ${activeTab === item.id
                    ? item.danger ? "bg-red-500/15 border border-red-500/25 text-red-400" : "bg-[#2563EB]/15 border border-[#2563EB]/25 text-[#60A5FA]"
                    : item.danger ? "text-red-400/70 hover:bg-red-500/10 hover:text-red-400" : "text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]"}`}>
                {item.icon}
                {item.label}
              </button>
            ))}
          </aside>

          {/* ── Mobile nav pill ── */}
          <div className="lg:hidden w-full mb-4 flex flex-col gap-2">
            <button onClick={() => setMobileNavOpen((v) => !v)}
              className="flex items-center justify-between w-full bg-[#1E293B]/80 border border-[#60A5FA]/15 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3 text-sm font-medium text-[#F8FAFC]">
                {activeItem?.icon}
                {activeItem?.label}
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={`transition-transform duration-200 ${mobileNavOpen ? "rotate-180" : ""}`}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {mobileNavOpen && (
              <div className="bg-[#1E293B]/90 border border-[#60A5FA]/15 rounded-xl overflow-hidden">
                {NAV_ITEMS.map((item) => (
                  <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileNavOpen(false); }}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium border-b border-[#60A5FA]/08 last:border-0 transition-colors
                      ${activeTab === item.id
                        ? item.danger ? "text-red-400 bg-red-500/10" : "text-[#60A5FA] bg-[#2563EB]/10"
                        : item.danger ? "text-red-400/70" : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"}`}>
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0 lg:min-w-0">
            {/* Page header */}
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">{activeItem?.label}</h1>
              <p className="text-[#94A3B8] text-sm mt-1">
                {({
                  profile:    "Manage how others see you on ChatSphere.",
                  account:    "Update your email, phone, and connected accounts.",
                  security:   "Keep your account safe with a strong password and 2FA.",
                  notifs:     "Choose what to be notified about and how.",
                  privacy:    "Control who can see your profile and activity.",
                  appearance: "Personalise your ChatSphere experience.",
                  danger:     "Irreversible actions related to your account.",
                }[activeTab])}
              </p>
            </div>
            {TABS[activeTab]}
          </main>
        </div>
      </div>

      {/* Toast */}
      <Toast message={toast} type="success" />
    </div>
  );
}
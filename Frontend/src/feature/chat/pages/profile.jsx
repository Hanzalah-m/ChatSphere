import { useState, useRef, useEffect } from "react"; // 1. ADDED useEffect HERE
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

// ── Shared helpers ────────────────────────────────────────────────────────────
function SectionCard({ title, description, children }) {
  return (
    <div className="bg-linear-to-br from-[#1E293B]/90 to-[#0d1b2e]/90 backdrop-blur-xl border border-[#60A5FA]/15 rounded-2xl p-6 md:p-8">
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
          className={`w-full bg-[#0d1b2e]/80 border ${
            error
              ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20"
              : readOnly
              ? "border-[#60A5FA]/08 opacity-50 cursor-not-allowed"
              : "border-[#60A5FA]/15 focus:border-[#3B82F6]/60 focus:ring-[#3B82F6]/20"
          } focus:ring-2 rounded-xl ${icon ? "pl-10" : "pl-4"} pr-4 py-3 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition-all duration-200`}
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
      className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 ${
        checked
          ? "bg-linear-to-r from-[#2563EB] to-[#3B82F6] shadow-lg shadow-blue-500/30"
          : "bg-[#1E293B] border border-[#60A5FA]/20"
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function SaveButton({ loading, label = "Save Changes", onClick }) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 bg-linear-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-px text-sm"
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
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium
      ${type === "success"
        ? "bg-[#0d1b2e] border-[#22C55E]/30 text-[#22C55E]"
        : "bg-[#0d1b2e] border-red-500/30 text-red-400"}`}>
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
  { id: "profile",   label: "Profile",       icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { id: "account",   label: "Account",       icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M19.07 19.07A10 10 0 0 0 4.93 4.93"/></svg> },
  { id: "security",  label: "Security",      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
  { id: "notifs",    label: "Notifications", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  { id: "privacy",   label: "Privacy",       icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { id: "appearance",label: "Appearance",    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></svg> },
  { id: "danger",    label: "Danger Zone",   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, danger: true },
];

// ── Tab: Profile ──────────────────────────────────────────────────────────────
function ProfileTab({ toast, currentUser }) {
  const { handleUpdateProfile, handleUpdateProfilePicture } = useAuth();

  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarLoading,  setAvatarLoading]  = useState(false);

  const [avatarFile,    setAvatarFile]    = useState(null);
  
  // 2. FIXED: Changed profilePic to profilePicture
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.profilePicture || null);
  const fileRef = useRef();

  // 3. ADDED: Syncs local state with Redux/Context state on refresh
  useEffect(() => {
    if (currentUser?.profilePicture) {
      setAvatarPreview(currentUser.profilePicture);
    }
  }, [currentUser?.profilePicture]);

  const [form, setForm] = useState({
    name:     currentUser?.name     || "",
    username: currentUser?.username || "",
  });

  const userInitials = form.name
    ? form.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast("Image must be under 5 MB.", "error");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUploadPicture = async () => {
    if (!avatarFile) {
      toast("Please select an image first.", "error");
      return;
    }
    setAvatarLoading(true);
    try {
      const result = await handleUpdateProfilePicture(avatarFile);
      toast(result?.message || "Profile picture updated!");
      
      // 4. FIXED: Replace blob URL with actual Cloudinary URL from backend response
      if (result?.user?.profilePicture) {
        setAvatarPreview(result.user.profilePicture);
      }

      setAvatarFile(null); 
    } catch (err) {
      toast(err?.message || "Failed to upload picture.", "error");
      // 5. FIXED: Correct fallback name
      setAvatarPreview(currentUser?.profilePicture || null);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleRemovePhoto = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const result = await handleUpdateProfile({ name: form.name, username: form.username });
      toast(result?.message || "Profile updated successfully!");
    } catch (err) {
      toast(err?.message || "Failed to update profile.", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Profile Picture" description="Upload a new photo. JPG, PNG or GIF · Max 5 MB.">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative group cursor-pointer shrink-0" onClick={() => fileRef.current?.click()}>
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-blue-500/30 overflow-hidden">
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                : userInitials}
            </div>
            <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#22C55E] rounded-full border-2 border-[#0F172A]" />
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="flex flex-col gap-2.5">
            <button type="button" onClick={() => fileRef.current?.click()} className="text-sm font-semibold text-[#60A5FA] hover:text-[#3B82F6] transition-colors text-left">
              Choose new photo
            </button>

            {avatarFile && (
              <SaveButton loading={avatarLoading} label="Upload Photo" onClick={handleUploadPicture} />
            )}

            {avatarPreview && (
              <button type="button" onClick={handleRemovePhoto} className="text-xs text-red-400 hover:text-red-300 transition-colors text-left">
                Remove photo
              </button>
            )}

            <p className="text-[#475569] text-xs">Recommended: 400×400 px or larger</p>

            {avatarFile && (
              <p className="text-xs text-amber-400 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Not saved yet — click "Upload Photo" to save
              </p>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Personal Information" description="This information is visible to other ChatSphere users.">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField label="Display Name" name="name" value={form.name} onChange={handleChange} placeholder="Your full name"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
            <InputField label="Username" name="username" value={form.username} onChange={handleChange} placeholder="johndoe" hint="Lowercase letters, numbers and underscores only"
              icon={<span className="text-[#94A3B8] text-sm font-bold">@</span>} />
          </div>
          <div className="flex justify-end pt-2">
            <SaveButton loading={profileLoading} />
          </div>
        </form>
      </SectionCard>
    </div>
  );
}

// ── Tab: Account ──────────────────────────────────────────────────────────────
function AccountTab({ toast, currentUser }) {
  const { handleUpdateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({ email: currentUser?.email || "" });
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await handleUpdateProfile({ email: form.email });
      toast(result?.message || "Account details updated!");
    } catch (err) {
      toast(err?.message || "Failed to update email.", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Account Details" description="Manage your login email.">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <InputField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} hint="Changing your email will require re-verification."
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />
          <div className="flex justify-end pt-2"><SaveButton loading={loading} label="Update Email" /></div>
        </form>
      </SectionCard>
      <SectionCard title="Linked Accounts" description="Connect social accounts for quicker sign-in.">
        {[{ name: "Google", linked: true }, { name: "GitHub", linked: false }].map((acc) => (
          <div key={acc.name} className="flex items-center justify-between py-4 border-b border-[#60A5FA]/08 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1E293B] border border-[#60A5FA]/15 flex items-center justify-center text-sm font-bold text-[#94A3B8]">{acc.name[0]}</div>
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
  const [show, setShow]       = useState({ current: false, newP: false, confirm: false });
  const [form, setForm]       = useState({ current: "", newP: "", confirm: "" });
  const [twoFA, setTwoFA]     = useState(false);
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.current)              return toast("Enter your current password.", "error");
    if (form.newP.length < 8)      return toast("New password must be at least 8 characters.", "error");
    if (form.newP !== form.confirm) return toast("Passwords do not match.", "error");
    setLoading(true);
    setTimeout(() => { setLoading(false); setForm({ current: "", newP: "", confirm: "" }); toast("Password changed successfully!"); }, 1500);
  };
  const sessions = [
    { device: "MacBook Pro",   location: "San Francisco, CA", time: "Active now",  current: true,  icon: "💻" },
    { device: "iPhone 14 Pro", location: "San Francisco, CA", time: "2 hours ago", current: false, icon: "📱" },
  ];
  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Change Password" description="Use a strong password with at least 8 characters.">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {[{ key: "current", label: "Current Password" }, { key: "newP", label: "New Password" }, { key: "confirm", label: "Confirm New Password" }].map((f) => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <label className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider">{f.label}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input type={show[f.key] ? "text" : "password"} name={f.key} value={form[f.key]} onChange={handleChange} placeholder={`Enter ${f.label.toLowerCase()}`}
                  className="w-full bg-[#0d1b2e]/80 border border-[#60A5FA]/15 focus:border-[#3B82F6]/60 focus:ring-2 focus:ring-[#3B82F6]/20 rounded-xl pl-10 pr-11 py-3 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition-all duration-200" />
                <button type="button" onClick={() => setShow((p) => ({ ...p, [f.key]: !p[f.key] }))} className="absolute inset-y-0 right-3.5 flex items-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
                  {show[f.key] ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end pt-2"><SaveButton loading={loading} label="Update Password" /></div>
        </form>
      </SectionCard>
      <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security.">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-xl">🔐</div>
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC]">Authenticator App</p>
              <p className="text-xs text-[#94A3B8]">{twoFA ? "Enabled" : "Not configured"}</p>
            </div>
          </div>
          <ToggleSwitch checked={twoFA} onChange={(v) => { setTwoFA(v); toast(v ? "2FA enabled!" : "2FA disabled."); }} />
        </div>
      </SectionCard>
      <SectionCard title="Active Sessions" description="Manage devices currently signed in.">
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
              {!s.current && <button className="text-xs font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all">Revoke</button>}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ── Tab: Notifications ────────────────────────────────────────────────────────
function NotificationsTab({ toast }) {
  const [settings, setSettings] = useState({ directMessages: true, mentions: true, groupMessages: false });
  const toggle = (key) => setSettings((p) => ({ ...p, [key]: !p[key] }));
  const items = [
    { key: "directMessages", label: "Direct Messages", desc: "Notify for private messages" },
    { key: "mentions",       label: "Mentions",        desc: "Notify when @mentioned" },
    { key: "groupMessages",  label: "Group Messages",  desc: "Notify for all group activity" },
  ];
  return (
    <SectionCard title="In-App Notifications" description="Choose what to be notified about.">
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3.5 border-b border-[#60A5FA]/08 last:border-0">
            <div><p className="text-sm font-semibold text-[#F8FAFC]">{item.label}</p><p className="text-xs text-[#94A3B8]">{item.desc}</p></div>
            <ToggleSwitch checked={settings[item.key]} onChange={() => { toggle(item.key); toast(`${item.label} updated.`); }} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ── Tab: Privacy ──────────────────────────────────────────────────────────────
function PrivacyTab({ toast }) {
  const [settings, setSettings] = useState({ showOnline: true, readReceipts: true });
  const toggle = (key) => setSettings((p) => ({ ...p, [key]: !p[key] }));
  const items = [
    { key: "showOnline",   label: "Online Status",  desc: "Let others see when you're online" },
    { key: "readReceipts", label: "Read Receipts",  desc: "Let senders know you read their message" },
  ];
  return (
    <SectionCard title="Privacy Controls" description="Manage who can see your activity.">
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between py-4 border-b border-[#60A5FA]/08 last:border-0">
            <div><p className="text-sm font-semibold text-[#F8FAFC]">{item.label}</p><p className="text-xs text-[#94A3B8]">{item.desc}</p></div>
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
  const themes = [{ id: "dark", label: "Dark" }, { id: "darker", label: "Darker" }];
  return (
    <SectionCard title="Theme" description="Choose how ChatSphere looks.">
      <div className="grid grid-cols-2 gap-3">
        {themes.map((t) => (
          <button key={t.id} onClick={() => { setTheme(t.id); toast(`${t.label} theme applied.`); }}
            className={`p-4 rounded-xl border transition-all duration-200 ${theme === t.id ? "border-[#2563EB]/60 bg-[#2563EB]/10 text-[#60A5FA]" : "border-[#60A5FA]/15 text-[#94A3B8] hover:border-[#60A5FA]/30"}`}>
            {t.label}
          </button>
        ))}
      </div>
    </SectionCard>
  );
}

// ── Tab: Danger Zone ──────────────────────────────────────────────────────────
function DangerTab() {
  const [confirmText, setConfirmText] = useState("");
  const [showModal,   setShowModal]   = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/20 rounded-2xl p-6 md:p-8">
        <h2 className="text-red-400 font-bold text-lg mb-1">Delete Account</h2>
        <p className="text-[#94A3B8] text-sm mb-5">Permanently delete your account. <span className="text-red-400 font-semibold">This action is irreversible.</span></p>
        <button onClick={() => setShowModal(true)} className="text-sm font-semibold text-red-400 border border-red-500/30 hover:bg-red-500/10 px-5 py-2.5 rounded-xl transition-all duration-200">Delete my account</button>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="bg-[#1E293B] border border-red-500/25 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-[#F8FAFC] font-extrabold text-xl mb-2">Delete your account?</h3>
            <p className="text-[#94A3B8] text-sm mb-6">This cannot be undone.</p>
            <p className="text-[#94A3B8] text-xs mb-2">Type <span className="text-red-400 font-bold font-mono">DELETE</span> to confirm:</p>
            <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE"
              className="w-full bg-[#0d1b2e] border border-red-500/30 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] outline-none mb-6 font-mono" />
            <div className="flex gap-3">
              <button onClick={() => { setShowModal(false); setConfirmText(""); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#94A3B8] border border-[#60A5FA]/15 hover:bg-white/5 transition-all">Cancel</button>
              <button disabled={confirmText !== "DELETE"} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">Delete Forever</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ProfilePage ──────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const [activeTab,     setActiveTab]     = useState("profile");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const TABS = {
    profile:    <ProfileTab    toast={showToast} currentUser={user} />,
    account:    <AccountTab    toast={showToast} currentUser={user} />,
    security:   <SecurityTab   toast={showToast} />,
    notifs:     <NotificationsTab toast={showToast} />,
    privacy:    <PrivacyTab    toast={showToast} />,
    appearance: <AppearanceTab toast={showToast} />,
    danger:     <DangerTab />,
  };

  const TAB_DESCRIPTIONS = {
    profile:    "Manage how others see you on ChatSphere.",
    account:    "Update your email and connected accounts.",
    security:   "Keep your account safe with a strong password and 2FA.",
    notifs:     "Choose what to be notified about.",
    privacy:    "Control who can see your activity.",
    appearance: "Personalise your experience.",
    danger:     "Irreversible actions related to your account.",
  };

  const activeItem = NAV_ITEMS.find((n) => n.id === activeTab);

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      <div className="pointer-events-none fixed -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#2563EB]/15 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#3B82F6]/10 blur-[100px]" />

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#0F172A]/85 backdrop-blur-xl border-b border-[#60A5FA]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span className="text-[#F8FAFC] font-bold text-lg tracking-tight">Chat<span className="text-[#60A5FA]">Sphere</span></span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-sm text-[#94A3B8]">
            <Link to="/dashboard" className="hover:text-[#F8FAFC] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#F8FAFC] font-medium">Settings</span>
            <span>/</span>
            <span className="text-[#60A5FA] font-medium">{activeItem?.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 bg-[#1E293B]/60 border border-[#60A5FA]/15 rounded-xl px-3 py-2">
              {/* BONUS FIX: Show actual picture in the top right navbar! */}
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-[11px] font-bold text-white overflow-hidden">
                {user?.profilePicture 
                  ? <img src={user.profilePicture} alt="User" className="w-full h-full object-cover" />
                  : userInitials
                }
              </div>
              <span className="text-sm font-medium text-[#F8FAFC]">{user?.name || "Loading…"}</span>
            </div>
            <button onClick={onLogout} className="text-xs font-semibold text-[#94A3B8] hover:text-red-400 border border-[#60A5FA]/15 hover:border-red-500/30 px-3 py-2 rounded-xl transition-all duration-200">Sign out</button>
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6 lg:gap-8 relative">
          <aside className="hidden lg:flex flex-col gap-1 w-56 shrink-0 sticky top-24 self-start">
            <p className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest px-3 mb-3">Settings</p>
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left
                  ${activeTab === item.id
                    ? item.danger ? "bg-red-500/15 border border-red-500/25 text-red-400" : "bg-[#2563EB]/15 border border-[#2563EB]/25 text-[#60A5FA]"
                    : item.danger ? "text-red-400/70 hover:bg-red-500/10 hover:text-red-400" : "text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]"}`}>
                {item.icon}{item.label}
              </button>
            ))}
          </aside>

          <div className="lg:hidden w-full mb-4 flex flex-col gap-2">
            <button onClick={() => setMobileNavOpen((v) => !v)} className="flex items-center justify-between w-full bg-[#1E293B]/80 border border-[#60A5FA]/15 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3 text-sm font-medium text-[#F8FAFC]">{activeItem?.icon}{activeItem?.label}</div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${mobileNavOpen ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {mobileNavOpen && (
              <div className="bg-[#1E293B]/90 border border-[#60A5FA]/15 rounded-xl overflow-hidden">
                {NAV_ITEMS.map((item) => (
                  <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileNavOpen(false); }}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium border-b border-[#60A5FA]/08 last:border-0 transition-colors
                      ${activeTab === item.id ? (item.danger ? "text-red-400 bg-red-500/10" : "text-[#60A5FA] bg-[#2563EB]/10") : (item.danger ? "text-red-400/70" : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5")}`}>
                    {item.icon}{item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <main className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">{activeItem?.label}</h1>
              <p className="text-[#94A3B8] text-sm mt-1">{TAB_DESCRIPTIONS[activeTab]}</p>
            </div>
            {TABS[activeTab]}
          </main>
        </div>
      </div>

      <Toast message={toast?.msg} type={toast?.type} />
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import SettingsPanel from "../components/SettingsPanel";
import InfoPanel from "../components/InfoPanel";
import useChatContacts from "../hooks/useChatContacts";

export default function ChatPage() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const {
    displayList,
    search,
    setSearch,
    activeContact,
    activeMessages,
    handleSelectContact,
    handleSend,
  } = useChatContacts(user);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showSettingsView, setShowSettingsView] = useState(false);

  const onSelectContact = async (contact) => {
    const selected = await handleSelectContact(contact);
    if (selected) {
      setShowSettingsView(false);
      setShowMobileChat(true);
    }
  };

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  const openSettings = () => {
    setShowSettingsView(true);
    setShowMobileChat(true);
    setShowInfo(false);
  };

  return (
    <div className="h-screen bg-[#0F172A] flex flex-col overflow-hidden">
      <div className="pointer-events-none fixed -top-40 -left-40 w-125 h-125 rounded-full bg-[#2563EB]/10 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-100 h-100 rounded-full bg-[#3B82F6]/08 blur-[100px]" />

      <div className="flex flex-1 min-h-0 relative">
        <div className={`${showMobileChat ? "hidden md:flex" : "flex"} flex-col h-full`} style={{ flexShrink: 0 }}>
          <Sidebar
            contacts={displayList}
            activeId={activeContact?.id}
            onSelect={onSelectContact}
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
            <ChatArea
              contact={activeContact}
              messages={activeMessages}
              onSend={handleSend}
              showInfo={showInfo}
              setShowInfo={setShowInfo}
              mobileBack={() => setShowMobileChat(false)}
            />
          )}
        </div>

        {showInfo && activeContact && (<InfoPanel contact={activeContact} onClose={() => setShowInfo(false)} />)}
      </div>
    </div>
  );
}
export const getInitials = (name) =>
  name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "U";

export const formatTime = (dateString) =>
  dateString
    ? new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

const DEFAULT_GRADIENT = "from-[#2563EB] to-[#60A5FA]";

// Maps a raw user object from search results into the contact shape the UI expects
export const mapUserToContact = (u) => ({
  id: u._id,
  name: u.name,
  username: u.username,
  initials: getInitials(u.name),
  profilePic: u.profilePicture || null,
  gradient: DEFAULT_GRADIENT,
  status: "offline",
  lastMsg: "Start a conversation...",
  time: "Now",
  unread: 0,
  messages: [],
});

// Maps a raw chat object from GET /api/chats into the contact shape the UI expects
export const mapChatToContact = (chat, currentUserId) => {
  const otherUser = chat.members?.find((u) => u._id?.toString() !== currentUserId?.toString()) || {};
  const latestMessage = chat.latestMessage;

  return {
    id: otherUser._id,
    chatId: chat._id,
    name: otherUser.name || "Unknown",
    username: otherUser.username,
    initials: getInitials(otherUser.name),
    profilePic: otherUser.profilePicture || null,
    gradient: DEFAULT_GRADIENT,
    status: "offline",
    lastMsg: latestMessage?.text || "Start a conversation...",
    time: formatTime(latestMessage?.createdAt),
    unread: chat.unreadCount || 0,
    messages: [],
  };
};

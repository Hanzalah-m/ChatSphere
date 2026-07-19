import { useState, useEffect } from "react";
import { searchUsersApi } from "../../users/user.api";
import { accessChatApi, fetchMessagesApi, sendMessageApi, fetchChatsApi, markAsReadApi } from "../chat.api";
import { mapUserToContact, mapChatToContact, formatTime } from "../utils";
import { initSocket, getSocket } from "../socket";

export default function useChatContacts(user) {
  const [contacts, setContacts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [activeContact, setActiveContact] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadChats = async () => {
      if (!user?.id) return;

      setContactsLoading(true);
      try {
        const chats = await fetchChatsApi();
        setContacts((chats || []).map((chat) => mapChatToContact(chat, user.id)));
      } catch (error) {
        console.error("Failed to load chats:", error);
      } finally {
        setContactsLoading(false);
      }
    };

    loadChats();
    // initialize socket for this user
    const s = initSocket();
    const onMessage = (message) => {
      try {
        const chatId = message.chatId || message.chat || message.chat_id;
        if (!chatId) return;

        // determine sender id (support object or raw id)
        const senderId = message?.sender?._id || message?.sender || message?.senderId;

        // ignore messages that originated from this client (they are appended locally)
        if (senderId && user?.id && senderId.toString() === user.id.toString()) return;

        const newMsg = {
          id: message._id || message.id || Date.now(),
          from: senderId && user?.id && senderId.toString() === user.id.toString() ? "me" : "other",
          text: message.content || message.text,
          time: formatTime(message.createdAt || Date.now()),
        };

        setContacts((prev) => {
          return prev.map((c) => {
            if (c.chatId !== chatId) return c;
            // dedupe by message id
            if (c.messages?.some((m) => m.id === newMsg.id)) return c;
            return {
              ...c,
              messages: [...(c.messages || []), newMsg],
              lastMsg: newMsg.text,
              time: "Now",
              unread: (c.unread || 0) + (activeContact?.chatId === c.chatId ? 0 : 1),
            };
          });
        });

        // if active contact is the chat, append to active messages (unless duplicate)
        setActiveContact((prev) => {
          if (!prev || prev.chatId !== chatId) return prev;
          if (prev.messages?.some((m) => m.id === newMsg.id)) return prev;
          return { ...prev, messages: [...prev.messages, newMsg] };
        });
      } catch (err) {
        console.error("Error processing incoming message", err);
      }
    };

    const onTyping = (payload) => {
      const chatId = payload?.chatId || payload;
      const sender = payload?.sender;
      // ignore typing events originating from this client
      if (sender && sender === user?.id) return;
      setContacts((prev) => prev.map((c) => (c.chatId === chatId ? { ...c, remoteTyping: true } : c)));
      setActiveContact((prev) => (prev && prev.chatId === chatId ? { ...prev, remoteTyping: true } : prev));
    };

    const onStopTyping = (payload) => {
      const chatId = payload?.chatId || payload;
      const sender = payload?.sender;
      if (sender && sender === user?.id) return;
      setContacts((prev) => prev.map((c) => (c.chatId === chatId ? { ...c, remoteTyping: false } : c)));
      setActiveContact((prev) => (prev && prev.chatId === chatId ? { ...prev, remoteTyping: false } : prev));
    };

    s.on("message received", onMessage);
    s.on("typing", onTyping);
    s.on("stop typing", onStopTyping);

    return () => {
      s.off("message received", onMessage);
      s.off("typing", onTyping);
      s.off("stop typing", onStopTyping);
    };
  }, [user?.id]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (search.trim().length === 0) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const realUsers = await searchUsersApi(search);
        setSearchResults(realUsers.map(mapUserToContact));
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const activeMessages = activeContact
    ? contacts.find((c) => c.id === activeContact.id)?.messages || []
    : [];

  const handleSelectContact = async (contact) => {
    if (!contact?.id) return null;

    setChatLoading(true);
    try {
      const chat = await accessChatApi(contact.id);
      const messages = await fetchMessagesApi(chat?._id);
      await markAsReadApi(chat?._id);

      const formattedMessages = (messages || []).map((msg) => ({
        id: msg._id,
        from: msg.sender?._id === user?.id ? "me" : "other",
        text: msg.content,
        time: formatTime(msg.createdAt),
      }));

      const selectedContact = {
        ...contact,
        chatId: chat?._id,
        messages: formattedMessages,
        lastMsg: formattedMessages[formattedMessages.length - 1]?.text || "Start a conversation...",
        time: "Now",
        unread: 0,
      };

      setContacts((prev) => {
        const exists = prev.find((c) => c.id === contact.id);
        if (!exists) return [selectedContact, ...prev];
        return prev.map((c) => (c.id === contact.id ? selectedContact : c));
      });

      setActiveContact(selectedContact);
      setSearch("");
      // join the chat room on the socket
      try {
        const s = getSocket();
        if (selectedContact.chatId) s.emit("join chat", selectedContact.chatId);
      } catch (err) {
        console.warn("Socket not available to join chat", err.message || err);
      }
      return selectedContact;
    } catch (error) {
      console.error("Failed to open chat:", error);
      return null;
    } finally {
      setChatLoading(false);
    }
  };

  const handleSend = async (text) => {
    if (!activeContact?.chatId) return;

    try {
      const savedMessage = await sendMessageApi(activeContact.chatId, text);
      const newMsg = {
        id: savedMessage._id || Date.now(),
        from: "me",
        text: savedMessage.content || text,
        time: formatTime(savedMessage.createdAt || Date.now()),
      };

      setContacts((prev) => prev.map((c) => (c.id === activeContact.id ? {
        ...c,
        messages: [...c.messages, newMsg],
        lastMsg: text,
        time: "Now",
      } : c)));

      setActiveContact((prev) => prev ? { ...prev, messages: [...prev.messages, newMsg], lastMsg: text, time: "Now" } : prev);

      // notify server we stopped typing (and server will broadcast message)
      try {
        const s = getSocket();
        s.emit("stop typing", activeContact.chatId);
      } catch (err) {
        /* ignore */
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const displayList = search.trim().length > 0 ? searchResults : contacts;

  return {
    displayList,
    search,
    setSearch,
    isSearching,
    contactsLoading,
    chatLoading,
    activeContact,
    activeMessages,
    handleSelectContact,
    handleSend,
  };
}

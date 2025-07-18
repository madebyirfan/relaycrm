'use client';

import { useEffect, useRef, useState } from 'react';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { db } from '../firebase/config';
import { Button, Input, Spin, Empty } from 'antd';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Timestamp;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Track auth state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Listen to messages
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: Message[] = snapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data() as Omit<Message, 'id'>;
            return { id: doc.id, ...data };
          }
        );
        setMessages(msgs);
        setLoading(false);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      },
      (error) => {
        console.error('Snapshot listener error:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim() || !currentUser) return;

    setSending(true);
    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage.trim(),
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Anonymous',
        timestamp: Timestamp.now(),
      });
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-2xl mx-auto p-4 border rounded-xl shadow bg-white dark:bg-gray-900 dark:border-gray-700 transition-colors">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Secure Chat</h2>

      <div className="flex-1 overflow-y-auto space-y-3 px-2">
        {loading ? (
          <div className="flex justify-center py-4">
            <Spin />
          </div>
        ) : messages.length === 0 ? (
          <Empty description="No messages yet" />
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded-md text-sm max-w-[80%] ${msg.senderId === currentUser?.uid
                  ? 'ml-auto bg-blue-100 dark:bg-blue-700 text-blue-900 dark:text-white text-right'
                  : 'mr-auto bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 text-left'
                }`}
            >
              <div className="font-medium">{msg.senderName}</div>
              <div>{msg.text}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {msg.timestamp?.toDate().toLocaleString()}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef}></div>
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onPressEnter={handleSend}
          placeholder={currentUser ? 'Type a message...' : 'Sign in to send a message'}
          disabled={!currentUser}
          className="dark:bg-gray-800 dark:text-white"
        />
        <Button
          type="primary"
          onClick={handleSend}
          loading={sending}
          disabled={!newMessage.trim() || !currentUser}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;

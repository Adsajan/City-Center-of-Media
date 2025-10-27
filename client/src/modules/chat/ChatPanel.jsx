import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000');

export default function ChatPanel({ room = 'general', from }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    socket.emit('join', { room });
    const onMsg = (msg) => setMessages((m) => [...m, msg]);
    socket.on('message', onMsg);
    socket.on('system', onMsg);
    return () => {
      socket.off('message', onMsg);
      socket.off('system', onMsg);
    };
  }, [room]);

  const send = () => {
    if (!text.trim()) return;
    socket.emit('message', { room, text, from });
    setText('');
  };

  return (
    <div className="card">
      <div className="font-medium mb-2">Live Chat – {room}</div>
      <div className="h-56 overflow-auto border rounded p-2 bg-gray-50 mb-2">
        {messages.map((m, i) => (
          <div key={i} className="text-sm text-gray-700"><b>{m.from || 'system'}:</b> {m.text}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 border rounded p-2" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" />
        <button className="btn btn-primary" onClick={send}>Send</button>
      </div>
    </div>
  );
}


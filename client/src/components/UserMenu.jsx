import React, { useEffect, useRef, useState } from 'react';

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v=>!v)} className="flex items-center gap-3 rounded-md border border-gray-200 dark:border-gray-700 px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800">
        <img className="h-8 w-8 rounded-full" src={`https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(user?.email||'user')}`} alt="avatar" />
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium leading-4">{user?.name || 'User'}</div>
          <div className="text-xs text-gray-500">{user?.email || 'user@example.com'}</div>
        </div>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md p-2 z-50">
          <div className="flex items-center gap-3 p-2">
            <img className="h-10 w-10 rounded-full" src={`https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(user?.email||'user')}`} alt="avatar" />
            <div>
              <div className="text-sm font-medium">{user?.name || 'User'}</div>
              <div className="text-xs text-gray-500">{user?.email || 'user@example.com'}</div>
            </div>
          </div>
          <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
          <MenuItem icon="👤" label="Account" />
          <MenuItem icon="💳" label="Billing" />
          <MenuItem icon="🔔" label="Notifications" />
          <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
          <button className="w-full text-left rounded-md px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" onClick={onLogout}>Log out</button>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label }) {
  return (
    <button className="w-full text-left rounded-md px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 inline-flex items-center gap-2">
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}


import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../../ThemeToggle.jsx';
import Avatar from '../../ui/Avatar.jsx';
import logo from '../../../assets/ccm-logo.svg';

function Sidebar({ sections }) {
  const loc = useLocation();
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col justify-between border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div>
        <div className="h-14 px-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-800">
          <img src={logo} alt="City Center of Media" className="h-7 w-7" />
          <span className="font-semibold">City Center of Media</span>
        </div>
        <nav className="p-3 space-y-6">
          {sections.map((s) => (
            <div key={s.title}>
              <div className="px-3 pb-1 text-xs uppercase tracking-wider text-gray-500">{s.title}</div>
              <div className="space-y-1">
                {s.links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={[
                      'block rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800',
                      loc.pathname === l.to ? 'bg-[var(--brand-100)] text-[var(--brand-700)] dark:bg-[var(--brand-900)] dark:text-[var(--brand-200)]' : ''
                    ].join(' ')}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <ThemeToggle className="w-full" />
      </div>
    </aside>
  );
}

function Header({ title, user, onLogout, onOpen }) {
  return (
    <header className="sticky top-0 z-10 h-14 w-full border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/40">
      <div className="h-full px-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className="md:hidden rounded-md border border-gray-200 dark:border-gray-700 px-2 py-1" onClick={onOpen} aria-label="Open menu">☰</button>
          <span className="font-medium">{title}</span>
        </div>
        <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
          <Avatar size={20} src={`https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(user?.email||'user')}`} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default function ShadDashboardLayout({ sections, title, user, onLogout, children }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const sidebarWidth = collapsed ? '4rem' : '16rem';

  return (
    <div className={`min-h-screen w-full grid grid-cols-1 md:grid-cols-[${sidebarWidth}_1fr] transition-[grid-template-columns] duration-300`}>
      <aside className={`hidden md:flex ${collapsed ? 'w-16' : 'w-64'} shrink-0 flex-col justify-between border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-[width] duration-300`}>
        <div>
          <div className="h-14 px-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <img src={logo} alt="City Center of Media" className="h-7 w-7" />
              {!collapsed && <span className="font-semibold">City Center of Media</span>}
            </div>
            <button className="hidden md:inline text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" onClick={()=>setCollapsed(v=>!v)} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              {collapsed ? '»' : '«'}
            </button>
          </div>
          <nav className="p-3 space-y-6">
            {sections.map((s) => (
              <div key={s.title}>
                {!collapsed && <div className="px-3 pb-1 text-xs uppercase tracking-wider text-gray-500">{s.title}</div>}
                <div className="space-y-1">
                  {s.links.map((l) => (
                    <Link key={l.to} to={l.to} className={`block rounded-md ${collapsed ? 'px-2 text-center' : 'px-3'} py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800`}>{collapsed ? '•' : l.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <ThemeToggle className="w-full" />
        </div>
      </aside>
      {/* Mobile Sidebar */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex" onClick={()=>setOpen(false)}>
          <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-3" onClick={(e)=>e.stopPropagation()}>
            <nav className="space-y-6">
              {sections.map((s) => (
                <div key={s.title}>
                  <div className="px-3 pb-1 text-xs uppercase tracking-wider text-gray-500">{s.title}</div>
                  <div className="space-y-1">
                    {s.links.map((l) => (
                      <Link key={l.to} to={l.to} className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800" onClick={()=>setOpen(false)}>{l.label}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
          <div className="flex-1 bg-black/30" />
        </div>
      )}
      <section className="min-h-screen">
        <div className="sticky top-0 z-10 h-14 w-full border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] text-white">
          <div className="h-full px-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button className="rounded-md border border-white/30 px-2 py-1 md:hidden" onClick={()=>setOpen(true)} aria-label="Open menu">☰</button>
              <button className="hidden md:inline rounded-md border border-white/30 px-2 py-1" onClick={()=>setCollapsed(v=>!v)} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
                {collapsed ? '»' : '«'}
              </button>
              <span className="font-medium">{title}</span>
            </div>
            <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-md border border-white/30 px-2 py-1 text-sm">Logout</button>
          </div>
        </div>
        <main className="p-4 md:p-6 bg-white dark:bg-gray-900">{children}</main>
      </section>
    </div>
  );
}

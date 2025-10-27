import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils.js';
import ThemeToggle from '../ThemeToggle.jsx';
import Avatar from '../ui/Avatar.jsx';
import logo from '../../assets/ccm-logo.svg';
import { Plus, Minus, ChevronLeft, ChevronRight, Shield, School, GraduationCap } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu.jsx';

export function Sidebar({ items, collapsed, role }) {
  const loc = useLocation();
  const [openGroups, setOpenGroups] = useState(() => Object.fromEntries(items.map(s => [s.title, true])));
  const toggle = (title) => setOpenGroups((p) => ({ ...p, [title]: !p[title] }));
  const roleLabel = role === 'admin' ? 'Admin Panel' : role === 'teacher' ? 'Teacher Panel' : role === 'student' ? 'Student Panel' : 'Dashboard';
  return (
    <aside
      className="hidden md:flex fixed md:inset-y-0 md:left-0 w-64 shrink-0 flex-col justify-between bg-blue-600 text-white h-screen overflow-y-auto"
      style={{ transform: collapsed ? 'translateX(-100%)' : 'translateX(0)', transition: 'transform 300ms ease' }}
    >
      <div>
        <div className="h-14 px-4 flex items-center gap-2 bg-blue-700">
          <img src={logo} alt="City Center of Media" className="h-7 w-7" />
          <span className="font-semibold">{roleLabel}</span>
        </div>
        <nav className="p-3 space-y-2">
          {items.map((section, i) => (
            <div key={i} className="rounded-md">
              <button
                type="button"
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-blue-700 rounded-md"
                onClick={() => toggle(section.title)}
              >
                <span>{section.title}</span>
                {openGroups[section.title] ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </button>
              {openGroups[section.title] && (
                <div className="mt-1 space-y-1">
                  {section.links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className={cn(
                        'block rounded-md px-4 py-2 text-sm text-white/90 hover:bg-blue-700',
                        loc.pathname === l.to && 'bg-blue-800 text-white'
                      )}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="p-3">
        <ThemeToggle className="w-full bg-white/10 hover:bg-white/20 text-white" />
      </div>
    </aside>
  );
}

export function Header({ title, user, onLogout, onOpenSidebar, onToggleCollapse, collapsed, role }) {
  const navigate = useNavigate();
  const roleNow = role || user?.role;
  const RoleIcon = roleNow === 'admin' ? Shield : roleNow === 'teacher' ? School : GraduationCap;
  const goProfile = () => {
    if (roleNow === 'teacher') navigate('/teacher/profile');
    else if (roleNow === 'student') navigate('/student/profile');
    else navigate('/admin');
  };
  return (
    <header className="sticky top-0 z-10 h-14 w-full border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/40">
      <div className="h-full px-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className="md:hidden rounded-md border border-gray-200 dark:border-gray-700 px-2 py-1" onClick={onOpenSidebar} aria-label="Open menu">☰</button>
          <button type="button" className="hidden md:inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 h-8 w-8 text-sm hover:bg-gray-50 dark:hover:bg-gray-800" onClick={onToggleCollapse} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Show menu" : "Hide menu"}>{collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}</button><span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <RoleIcon className="h-4 w-4" />
            <span className="truncate max-w-[200px]">Signed in as {user?.name || user?.email || 'User'}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full border border-gray-200 dark:border-gray-700 h-9 w-9 overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800">
                <Avatar size={36} src={`https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(user?.email||'user')}`} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="cursor-pointer" onClick={goProfile}>Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => { if (onLogout) onLogout(); navigate('/'); }}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default function AppShell({ sidebarItems, title, children, user, onLogout, role }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onEsc); return () => window.removeEventListener('keydown', onEsc);
  }, []);

  return (
    <div className="min-h-screen w-full">
      {/* Desktop sidebar (fixed) */}
      <Sidebar items={sidebarItems} collapsed={collapsed} role={role || user?.role} />
      {/* Mobile Sidebar Overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex" onClick={()=>setOpen(false)}>
          <div className="w-64 h-full bg-blue-600 text-white p-3 overflow-y-auto" onClick={(e)=>e.stopPropagation()}>
            <nav className="space-y-2">
              {sidebarItems.map((section, i) => (
                <div key={i} className="rounded-md">
                  <div className="px-3 pb-1 text-sm font-medium">{section.title}</div>
                  <div className="space-y-1">
                    {section.links.map((l) => (
                      <Link key={l.to} to={l.to} className="block rounded-md px-3 py-2 text-sm hover:bg-blue-700" onClick={()=>setOpen(false)}>{l.label}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
          <div className="flex-1 bg-black/30" />
        </div>
      )}
      <section className={cn("min-h-screen transition-[margin] duration-300", collapsed ? "md:ml-0" : "md:ml-64")}> 
        <Header title={title} user={user} onLogout={onLogout} onOpenSidebar={()=>setOpen(true)} onToggleCollapse={()=>setCollapsed(v=>!v)} collapsed={collapsed} role={role} />
        
        <main className="p-4 md:p-6">{children}</main>
      </section>
    </div>
  );
}






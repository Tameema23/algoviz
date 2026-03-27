import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NAV = [
  { to: '/sorting', label: 'Sorting', icon: '▦', color: '#00D9FF' },
  { to: '/pathfinding', label: 'Pathfinding', icon: '◈', color: '#7C3AED' },
  { to: '/graph', label: 'Graph', icon: '⬡', color: '#F59E0B' },
  { to: '/tree', label: 'Trees', icon: '⌥', color: '#10B981' },
  { to: '/searching', label: 'Searching', icon: '⊕', color: '#EC4899' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 md:w-52 glass border-r border-border flex flex-col shrink-0">
        {/* Logo */}
        <NavLink to="/" className="px-3 md:px-5 py-5 flex items-center gap-3 border-b border-border group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(0,217,255,0.15)', border: '1px solid rgba(0,217,255,0.3)' }}>
            <span className="text-accent text-sm font-bold">AV</span>
          </div>
          <span className="hidden md:block font-display font-bold text-sm text-text">AlgoViz</span>
        </NavLink>

        {/* Nav */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2 md:px-3 py-2.5 rounded-xl transition-all group ${isActive ? 'text-text' : 'text-dim hover:text-text'}`
              }
              style={({ isActive }) => ({
                background: isActive ? `rgba(${item.color === '#00D9FF' ? '0,217,255' : item.color === '#7C3AED' ? '124,58,237' : item.color === '#F59E0B' ? '245,158,11' : item.color === '#10B981' ? '16,185,129' : '236,72,153'},0.1)` : 'transparent',
                border: `1px solid ${isActive ? item.color + '40' : 'transparent'}`,
              })}>
              <span className="text-base shrink-0" style={{ color: item.color }}>{item.icon}</span>
              <span className="hidden md:block font-body text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 md:p-4 border-t border-border">
          <p className="hidden md:block text-xs text-muted font-mono text-center">v1.0.0</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full p-4 md:p-6 flex flex-col">
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

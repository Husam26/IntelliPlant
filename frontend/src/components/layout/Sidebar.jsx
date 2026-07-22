/**
 * Sidebar — Main navigation component.
 * 
 * Uses react-router-dom's NavLink for automatic active state.
 * Icons from lucide-react for consistent styling.
 * 
 * The sidebar is fixed on the left side and provides navigation
 * to all major sections of IntelliPlant.
 */

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquareText,
  FileStack,
  Cog,
  ShieldCheck,
  TrendingUp,
  Factory,
  Map,
} from 'lucide-react';
import '../../styles/Layout.css';

const navigation = [
  {
    section: 'Main',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'AI Copilot', path: '/dashboard/copilot', icon: MessageSquareText },
      { name: 'Documents', path: '/dashboard/documents', icon: FileStack },
    ],
  },
  {
    section: 'Intelligence',
    items: [
      { name: 'Digital Twin', path: '/dashboard/plant-map', icon: Map },
      { name: 'Assets', path: '/dashboard/assets', icon: Cog },
      { name: 'Compliance', path: '/dashboard/compliance', icon: ShieldCheck },
      { name: 'Insights', path: '/dashboard/insights', icon: TrendingUp },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Factory size={22} />
        </div>
        <div className="logo-text">
          <span className="logo-name">IntelliPlant</span>
          <span className="logo-sub">Registry Control</span>
        </div>
        {/* We use an invisible overlay link so the whole area is clickable and routes home */}
        <NavLink to="/" className="sidebar-logo-link" />
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navigation.map((group) => (
          <div key={group.section}>
            <div className="sidebar-section">{group.section}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                end={item.path === '/' || item.path === '/dashboard'}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="version">IntelliPlant v1.0.0</div>
      </div>
    </aside>
  );
}

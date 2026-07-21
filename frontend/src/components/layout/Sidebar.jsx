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
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'AI Copilot', path: '/copilot', icon: MessageSquareText },
      { name: 'Documents', path: '/documents', icon: FileStack },
    ],
  },
  {
    section: 'Intelligence',
    items: [
      { name: 'Digital Twin', path: '/plant-map', icon: Map },
      { name: 'Assets', path: '/assets', icon: Cog },
      { name: 'Compliance', path: '/compliance', icon: ShieldCheck },
      { name: 'Insights', path: '/insights', icon: TrendingUp },
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
        <div>
          <h1>IntelliPlant</h1>
          <div className="logo-subtitle">Knowledge Intelligence</div>
        </div>
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
                end={item.path === '/'}
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

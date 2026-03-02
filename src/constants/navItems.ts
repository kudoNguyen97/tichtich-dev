import {
  Home,
  Gem,
  User,
  Map,
  Settings,
  LayoutDashboard,
  Users,
  BarChart2,
} from 'lucide-react'

export interface NavItem {
  labelKey: string
  to: string
  icon: React.ElementType
}

// Child profile — URL: /  /treasury  /character  /journey  /settings
export const CHILD_NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.home', to: '/', icon: Home },
  { labelKey: 'nav.treasury', to: '/treasury', icon: Gem },
  { labelKey: 'nav.character', to: '/character', icon: User },
  { labelKey: 'nav.journey', to: '/journey', icon: Map },
  { labelKey: 'nav.settings', to: '/settings', icon: Settings },
]

// Parent profile — URL: /parent/  /parent/manage  /parent/reports  /parent/settings
export const PARENT_NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.overview', to: '/parent', icon: LayoutDashboard },
  { labelKey: 'nav.manage', to: '/parent/manage', icon: Users },
  { labelKey: 'nav.reports', to: '/parent/reports', icon: BarChart2 },
  { labelKey: 'nav.settings', to: '/parent/settings', icon: Settings },
]

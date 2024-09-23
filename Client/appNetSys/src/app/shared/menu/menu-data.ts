// menu-data.ts
export interface NavItem {
  displayName: string;
  route: string;
}

export const navItems: NavItem[] = [
  {
    displayName: 'DASHBOARD',
    route: '/dashboard',
  },
  {
    displayName: 'OLT',
    route: '/olt',
  },
  {
    displayName: 'FTTH',
    route: '/ftth',
  },
  {
    displayName: 'ROUTER',
    route: '/rtr',
  },
  {
    displayName: 'REPORTES',
    route: '/reportes',
  },
];

import type { Path } from 'react-router';

export type Breadcrumb = Readonly<{
  route: Path['pathname'];
  label: string;
}>;

type SidebarItem = Readonly<{
  altText: string;
}> &
  Breadcrumb;

export const sidebarItem: Array<SidebarItem> = [
  { route: '/provider/risk-audit', label: 'Risk & Audit', altText: 'Analyze provider risks' },
];

export const breadcrumbMap = new Map<string, Breadcrumb>([
  ['/provider', { route: '/provider/risk-audit', label: 'Provider Services' }],
  ['/provider/risk-audit', { route: '/provider/risk-audit', label: 'Risk & Audit' }],
  [
    '/provider/risk-audit/:providerId',
    { route: '/provider/risk-audit/:id', label: 'Provider Details' },
  ],
]);

export const ROUTE_PATTERNS: Array<Array<Path['pathname']>> = sidebarItem.map(opt => [opt.route]);

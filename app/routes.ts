import { type RouteConfig, index, route, prefix, layout } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('about', './routes/about.tsx'),
  route('dashboard', './routes/dashboard.tsx', [
    route('details', './routes/details.tsx'),
    route('settings/:id', './routes/settings.tsx'),
  ]),

  layout('./routes/providerData/providerData.tsx', [
    ...prefix('providerData', [
      index('routes/providerData/redirect.tsx'), // 👈 redirect from /providerData
      route('annual', './routes/providerData/annualProviderData.tsx'),
      route('monthly/:date', './routes/providerData/monthlyProviderData.tsx'),
    ]),
  ]),
] satisfies RouteConfig;

import { type RouteConfig, index, route, prefix, layout } from '@react-router/dev/routes';

export default [
  // index('routes/home.tsx'),
  // route('about', './routes/about.tsx'),
  // route('dashboard', './routes/dashboard.tsx', [
  //   route('details', './routes/details.tsx'),
  //   route('settings/:id', './routes/settings.tsx'),
  // ]),

  layout('./routes/providerData/index.tsx', [
    ...prefix('provider/risk-audit', [
      index('routes/providerData/redirect.tsx'),

      route('annual/:date', './routes/providerData/providerMode.tsx', {
        id: 'provider-annual',
      }),
      route('monthly/:date', './routes/providerData/providerMode.tsx', {
        id: 'provider-monthly',
      }),
    ]),
  ]),

  layout('./routes/providerDetails/index.tsx', [
    ...prefix('provider/risk-audit/:providerId', [
      index('routes/providerDetails/redirect.tsx'),
      // tabs ----
      route('/:view', './routes/providerDetails/ProviderScenarioTable.tsx'),
      // add more sub-views here later
    ]),
  ]),

  // route('provider/risk-audit/:providerId', 'routes/providerData/providerDetails.tsx'),
] satisfies RouteConfig;

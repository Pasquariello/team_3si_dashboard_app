export const scenarioConfig = [
  {
    id: 1,
    label: 'Overall Score',
    tooltip:
      "A composite score reflecting the provider's overall risk level based on multiple factors including capacity, billing, and compliance patterns.",
    path: 'overall',
  },
  {
    id: 2,
    label: 'Children Placed Over Capacity',
    tooltip:
      "Measures the number of unique children who have placements at a provider site relative to the provider's licensed capacity in a service week. A provider is flagged if the number of placements exceeds the licensed capacity in any week in a given month.",
    path: 'cpoc',
  },
  {
    id: 3,
    label: 'Children Billed Over Capacity',
    tooltip:
      "Measures the number of unique children billed by a provider relative to the provider's capacity in a service week. A provider is flagged if the number of billed placements exceeds the licensed capacity in any week in a given month.",
    path: 'cboc',
  },
  {
    id: 4,
    label: 'Providers with Same Address',
    tooltip:
      'Tracks whether a provider shares the same physical address with one or more other providers in a service week. A provider is flagged if they are co-located with at least one other provider that has a different licensing ID in the same service week in a given month.',
    path: 'psa',
  },
  {
    id: 5,
    label: 'Distance Traveled',
    tooltip:
      'Tracks child-to-provider distances for children placed at a provider in a service week. A provider is flagged if the average distance traveled by children placed at that provider exceeds 20 miles in any service week in a given month.',
    path: 'dt',
  },
];

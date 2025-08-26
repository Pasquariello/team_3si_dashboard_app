import type { ProviderFilters } from "~/contexts/providerFilterContext";

export function checkedFilter({ flagged, unflagged }: ProviderFilters): boolean | null {
  if (flagged && !unflagged) return true;
  if (!flagged && unflagged) return false;
  return null;
}

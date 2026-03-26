import type { HealthFacility } from '../types';
import { facilities as fallbackFacilities } from '../utils/data';
import type { HealthFacilityDto } from './contracts';
import { toHealthFacilityDomain } from './contracts';
import { requestJson } from './httpClient';

export async function fetchFacilities(): Promise<HealthFacility[]> {
  try {
    const facilityDtos = await requestJson<HealthFacilityDto[]>('/facilities');
    return facilityDtos.map(toHealthFacilityDomain);
  } catch {
    // Keep app usable when backend is unavailable.
    return fallbackFacilities;
  }
}

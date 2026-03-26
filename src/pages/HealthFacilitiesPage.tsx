import { useEffect, useState } from 'react';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { fetchFacilities } from '../api/facilityService';
import Card from '../components/Card';
import type { HealthFacility } from '../types';

export default function HealthFacilitiesPage() {
  const [facilities, setFacilities] = useState<HealthFacility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchFacilities().then((items) => {
      if (!mounted) {
        return;
      }

      setFacilities(items);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4 animate-fadeInUp">
      <h1 className="font-heading text-2xl font-semibold text-textBase">Health Facilities</h1>
      <p className="text-sm text-slate-600">Reach trusted centers for support and reproductive health services.</p>

      {loading ? (
        <Card>
          <p className="text-sm text-slate-600">Loading facilities...</p>
        </Card>
      ) : null}

      <div className="grid gap-3">
        {facilities.map((facility) => (
          <Card key={facility.id}>
            <h2 className="font-heading text-lg font-semibold text-textBase">{facility.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{facility.location}</p>
            <p className="mt-2 inline-flex items-center gap-1 text-sm text-primary">
              <PhoneIcon className="h-4 w-4" />
              {facility.contact}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

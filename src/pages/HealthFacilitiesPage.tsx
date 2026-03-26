import { useEffect, useState, useMemo } from 'react';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { fetchFacilities } from '../api/facilityService';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import { searchFacilities } from '../utils/search';
import type { HealthFacility } from '../types';

export default function HealthFacilitiesPage() {
  const [facilities, setFacilities] = useState<HealthFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFacilities = useMemo(
    () => searchFacilities(facilities, searchQuery),
    [facilities, searchQuery]
  );

  useEffect(() => {
    let mounted = true;

    fetchFacilities()
      .then((items) => {
        if (!mounted) return;
        setFacilities(items);
        setError(null);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setError('Failed to load facilities. Please try again.');
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4 pb-20 animate-fadeInUp">
      <div>
        <h1 className="font-heading text-2xl font-bold text-textBase dark:text-slate-100">Health Facilities</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Reach trusted centers for support and reproductive health services.</p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </Card>
      )}

      {!loading && facilities.length > 0 && (
        <SearchBar
          placeholder="Search facilities by name or location..."
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      )}

      {loading ? (
        <Card>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-slate-600 dark:text-slate-300">Loading facilities...</p>
          </div>
        </Card>
      ) : filteredFacilities.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {facilities.length === 0
              ? 'No health facilities available at the moment.'
              : 'No facilities match your search. Try different keywords.'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFacilities.map((facility) => (
            <Card key={facility.id}>
              <h2 className="font-heading text-lg font-bold text-textBase dark:text-slate-100">{facility.name}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{facility.location}</p>
              <a
                href={`tel:${facility.contact}`}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-secondary to-[#f9a13a] px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-soft dark:shadow-secondary/20"
              >
                <PhoneIcon className="h-4 w-4" />
                {facility.contact}
              </a>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

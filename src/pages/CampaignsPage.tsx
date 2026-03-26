import Card from '../components/Card';
import { campaignItems } from '../utils/data';

const focusAreaLabel: Record<(typeof campaignItems)[number]['focusArea'], string> = {
  'pregnancy-prevention': 'Pregnancy Prevention',
  'menstrual-health': 'Menstrual Health',
  'safe-relationships': 'Safe Relationships',
};

export default function CampaignsPage() {
  return (
    <div className="space-y-4 animate-fadeInUp">
      <h1 className="font-heading text-2xl font-semibold text-textBase">Awareness Campaigns</h1>
      <p className="text-sm text-slate-600">
        Community-focused campaigns that promote early pregnancy prevention and youth empowerment.
      </p>

      <div className="grid gap-3">
        {campaignItems.map((campaign) => (
          <Card key={campaign.id}>
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-heading text-lg font-semibold text-textBase">{campaign.title}</h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {focusAreaLabel[campaign.focusArea]}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{campaign.message}</p>
            <p className="mt-3 rounded-xl bg-secondary/10 px-3 py-2 text-sm text-slate-700">
              <span className="font-semibold text-secondary">Action:</span> {campaign.callToAction}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

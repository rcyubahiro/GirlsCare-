import { MegaphoneIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Card from '../components/Card';
import IconBadge from '../components/IconBadge';
import PageIllustration from '../components/PageIllustration';
import { campaignItems } from '../utils/data';

const focusAreaLabel: Record<(typeof campaignItems)[number]['focusArea'], string> = {
  'pregnancy-prevention': 'Pregnancy Prevention',
  'menstrual-health': 'Menstrual Health',
  'safe-relationships': 'Safe Relationships',
};

export default function CampaignsPage() {
  return (
    <div className="space-y-4 animate-fadeInUp">
      <PageIllustration
        badge="Community"
        title="Awareness Campaigns"
        subtitle="Community-focused actions that promote early pregnancy prevention and youth empowerment."
        icon={MegaphoneIcon}
      />

      <div className="grid gap-3">
        {campaignItems.map((campaign) => (
          <Card key={campaign.id}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <IconBadge icon={SparklesIcon} />
                <h2 className="font-heading text-lg font-semibold text-textBase dark:text-slate-100">{campaign.title}</h2>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:bg-primary/20">
                {focusAreaLabel[campaign.focusArea]}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{campaign.message}</p>
            <p className="mt-3 rounded-xl bg-secondary/10 px-3 py-2 text-sm text-slate-700 dark:bg-secondary/20 dark:text-slate-200">
              <span className="font-semibold text-secondary">Action:</span> {campaign.callToAction}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

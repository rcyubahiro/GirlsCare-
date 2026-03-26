import { LightBulbIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Card from '../components/Card';
import IconBadge from '../components/IconBadge';
import PageIllustration from '../components/PageIllustration';
import { lifeSkillTopics } from '../utils/data';

export default function LifeSkillsPage() {
  return (
    <div className="space-y-4 animate-fadeInUp">
      <PageIllustration
        badge="Skills"
        title="Life Skills and Digital Literacy"
        subtitle="Practical skills to support confident choices, healthy relationships, and safe use of digital tools."
        icon={LightBulbIcon}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {lifeSkillTopics.map((topic) => (
          <Card key={topic.id}>
            <div className="flex items-center gap-3">
              <IconBadge icon={ShieldCheckIcon} tone="secondary" />
              <h2 className="font-heading text-lg font-semibold text-textBase dark:text-slate-100">{topic.title}</h2>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{topic.summary}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
              {topic.practicalSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}

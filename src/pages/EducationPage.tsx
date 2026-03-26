import { useState } from 'react';
import { AcademicCapIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Card from '../components/Card';
import IconBadge from '../components/IconBadge';
import PageIllustration from '../components/PageIllustration';
import { educationTopics } from '../utils/data';

export default function EducationPage() {
  const [activeId, setActiveId] = useState(educationTopics[0].id);
  const activeTopic = educationTopics.find((topic) => topic.id === activeId) ?? educationTopics[0];

  return (
    <div className="space-y-4 pb-20 animate-fadeInUp">
      <PageIllustration
        badge="Learn"
        title="Education Topics"
        subtitle="Explore trusted, practical guidance on reproductive health and informed choices."
        icon={AcademicCapIcon}
      />

      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <h2 className="font-heading text-xl font-semibold text-textBase dark:text-slate-100">Choose a topic</h2>
        <ul className="mt-4 space-y-2">
          {educationTopics.map((topic) => {
            const active = topic.id === activeId;
            return (
              <li key={topic.id}>
                <button
                  className={[
                    'w-full rounded-2xl border px-3 py-3 text-left transition',
                    active
                      ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20'
                      : 'border-slate-200 bg-white text-textBase hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
                  ].join(' ')}
                  onClick={() => setActiveId(topic.id)}
                >
                  <div className="flex items-start gap-3">
                    <IconBadge icon={BookOpenIcon} />
                    <div>
                      <p className="font-semibold">{topic.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{topic.summary}</p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="bg-gradient-to-b from-white to-primary/5 dark:from-slate-900 dark:to-primary/10">
        <div className="flex items-center gap-3">
          <IconBadge icon={AcademicCapIcon} tone="secondary" />
          <h2 className="font-heading text-xl font-semibold text-textBase dark:text-slate-100">{activeTopic.title}</h2>
        </div>
        <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">{activeTopic.details}</p>
      </Card>
      </div>
    </div>
  );
}

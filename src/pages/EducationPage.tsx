import { useState } from 'react';
import Card from '../components/Card';
import { educationTopics } from '../utils/data';

export default function EducationPage() {
  const [activeId, setActiveId] = useState(educationTopics[0].id);
  const activeTopic = educationTopics.find((topic) => topic.id === activeId) ?? educationTopics[0];

  return (
    <div className="grid gap-4 pb-20 md:grid-cols-[0.9fr_1.1fr] animate-fadeInUp">
      <Card>
        <h1 className="font-heading text-xl font-semibold">Education Topics</h1>
        <ul className="mt-4 space-y-2">
          {educationTopics.map((topic) => {
            const active = topic.id === activeId;
            return (
              <li key={topic.id}>
                <button
                  className={[
                    'w-full rounded-xl border px-3 py-3 text-left transition',
                    active
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 bg-white text-textBase hover:bg-slate-50',
                  ].join(' ')}
                  onClick={() => setActiveId(topic.id)}
                >
                  <p className="font-medium">{topic.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{topic.summary}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="bg-gradient-to-b from-white to-primary/5">
        <h2 className="font-heading text-xl font-semibold text-textBase">{activeTopic.title}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">{activeTopic.details}</p>
      </Card>
    </div>
  );
}

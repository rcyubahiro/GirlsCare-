import Card from '../components/Card';
import { lifeSkillTopics } from '../utils/data';

export default function LifeSkillsPage() {
  return (
    <div className="space-y-4 animate-fadeInUp">
      <h1 className="font-heading text-2xl font-semibold text-textBase">Life Skills and Digital Literacy</h1>
      <p className="text-sm text-slate-600">
        Practical skills to support confident choices, healthy relationships, and safe use of digital tools.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {lifeSkillTopics.map((topic) => (
          <Card key={topic.id}>
            <h2 className="font-heading text-lg font-semibold text-textBase">{topic.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{topic.summary}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
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

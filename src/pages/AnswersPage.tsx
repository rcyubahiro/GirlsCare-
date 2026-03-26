import Card from '../components/Card';
import type { Question } from '../types';

interface AnswersPageProps {
  questions: Question[];
}

export default function AnswersPage({ questions }: AnswersPageProps) {
  const moderationColors: Record<Question['moderation']['status'], string> = {
    pending: 'bg-slate-100 text-slate-700',
    approved: 'bg-emerald-100 text-emerald-700',
    'needs-follow-up': 'bg-amber-100 text-amber-700',
    escalated: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-4 animate-fadeInUp">
      <h1 className="font-heading text-2xl font-semibold text-textBase">Answers</h1>

      {questions.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-600">No questions yet. Submit one from the Ask Question page.</p>
        </Card>
      ) : (
        questions
          .slice()
          .reverse()
          .map((question) => (
            <Card key={question.id}>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Asked on {new Date(question.askedAt).toLocaleDateString()}
                </p>
                <span
                  className={[
                    'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                    moderationColors[question.moderation.status],
                  ].join(' ')}
                >
                  {question.moderation.status}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-textBase">Q: {question.content}</p>

              <div className="mt-3 space-y-2">
                {question.mentorResponses.map((response) => (
                  <div key={response.id} className="rounded-xl bg-primary/5 p-3 text-sm text-slate-700">
                    <p className="mb-1 text-xs text-primary">
                      {response.mentor.name} ({response.mentor.role}) - {response.guidanceType}
                    </p>
                    <p>{response.message}</p>
                  </div>
                ))}
              </div>

              {question.moderation.flags.length > 0 ? (
                <p className="mt-3 text-xs text-slate-500">Flags: {question.moderation.flags.join(', ')}</p>
              ) : null}
            </Card>
          ))
      )}
    </div>
  );
}

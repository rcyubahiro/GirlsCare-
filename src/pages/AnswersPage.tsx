import { useState, useMemo } from 'react';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import { searchQuestions } from '../utils/search';
import type { MentorResponse, Question } from '../types';

interface AnswersPageProps {
  questions: Question[];
}

export default function AnswersPage({ questions }: AnswersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestions = useMemo(
    () => searchQuestions(questions, searchQuery),
    [questions, searchQuery]
  );
  const moderationColors: Record<Question['moderation']['status'], string> = {
    pending: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    'needs-follow-up': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    escalated: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  };

  return (
    <div className="space-y-4 pb-20 animate-fadeInUp">
      <div>
        <h1 className="font-heading text-2xl font-bold text-textBase dark:text-slate-100">Answers</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Search through questions and mentor responses.</p>
      </div>

      <SearchBar
        placeholder="Search questions and answers..."
        value={searchQuery}
        onChange={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />

      {filteredQuestions.length === 0 ? (
        <Card>
          {questions.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">No questions yet. Submit one from the Ask Question page.</p>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">No questions match your search. Try different keywords.</p>
          )}
        </Card>
      ) : (
        filteredQuestions
          .slice()
          .reverse()
          .map((question) => (
            <Card key={question.id}>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Asked on {new Date(question.askedAt).toLocaleDateString()}
                </p>
                <span
                  className={[
                    'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                    moderationColors[question.moderation.status] || 'bg-slate-100 text-slate-700',
                  ].join(' ')}
                >
                  {question.moderation.status}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-textBase dark:text-slate-100">Q: {question.content}</p>

              <div className="mt-3 space-y-2">
                {question.mentorResponses.map((response: MentorResponse) => (
                  <div key={response.id} className="rounded-2xl border border-primary/20 bg-primary/5 p-3 text-sm text-slate-700 transition hover:bg-primary/10 dark:border-primary/30 dark:bg-primary/10 dark:text-slate-200">
                    <p className="mb-1 text-xs font-semibold text-primary dark:text-primary/80">
                      {response.mentor.name} ({response.mentor.role}) · {response.guidanceType}
                    </p>
                    <p className="leading-6">{response.message}</p>
                  </div>
                ))}
              </div>

              {question.moderation.flags.length > 0 ? (
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Flags: {question.moderation.flags.join(', ')}</p>
              ) : null}
            </Card>
          ))
      )}
    </div>
  );
}

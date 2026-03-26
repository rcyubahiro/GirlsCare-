import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';

interface AskQuestionPageProps {
  onSubmitQuestion: (questionText: string) => Promise<void>;
}

export default function AskQuestionPage({ onSubmitQuestion }: AskQuestionPageProps) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    await onSubmitQuestion(question.trim());
    setQuestion('');
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl animate-fadeInUp pb-20">
      <Card>
        <h1 className="font-heading text-2xl font-bold text-textBase dark:text-slate-100">Ask a Question</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Type your question privately and receive guidance.</p>

        <textarea
          className="mt-4 h-32 w-full rounded-2xl border border-slate-200 bg-white/90 p-3 text-sm outline-none ring-primary/30 transition placeholder:text-slate-400 focus:border-primary focus:ring dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 md:h-40"
          placeholder="Write your question here..."
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button onClick={handleSubmit} disabled={loading || !question.trim()}>
            {loading ? 'Submitting...' : 'Submit Question'}
          </Button>
          {submitted ? (
            <span className="inline-flex items-center gap-2 animate-fadeInUp text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              ✓ Question submitted
            </span>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

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
    <div className="mx-auto max-w-2xl animate-fadeInUp">
      <Card>
        <h1 className="font-heading text-2xl font-semibold text-textBase">Ask a Question</h1>
        <p className="mt-1 text-sm text-slate-600">Type your question privately and receive guidance.</p>

        <textarea
          className="mt-4 h-36 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none ring-primary/30 transition focus:ring"
          placeholder="Write your question here..."
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />

        <div className="mt-4 flex items-center gap-3">
          <Button onClick={handleSubmit} disabled={loading || !question.trim()}>
            {loading ? 'Submitting...' : 'Submit Question'}
          </Button>
          {submitted ? <span className="text-sm text-emerald-600">Question submitted.</span> : null}
        </div>
      </Card>
    </div>
  );
}

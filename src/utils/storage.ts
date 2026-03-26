import type { MentorResponse, ModerationSummary, Question, QueuedQuestion, UserSession } from '../types';

const SESSION_KEY = 'girlcare-session';
const QUESTIONS_KEY = 'girlcare-questions';
const QUEUED_QUESTIONS_KEY = 'girlcare-queued-questions';

export function loadSession(): UserSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function saveSession(session: UserSession | null): void {
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadQuestions(): Question[] {
  const raw = localStorage.getItem(QUESTIONS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Array<Partial<Question>>;

    return parsed
      .filter((item) => Boolean(item.id && item.content && item.askedAt))
      .map((item) => ({
        id: item.id as string,
        content: item.content as string,
        askedAt: item.askedAt as string,
        moderation: normalizeModeration(item.moderation),
        mentorResponses: normalizeMentorResponses(item.mentorResponses),
      }));
  } catch {
    return [];
  }
}

export function saveQuestions(questions: Question[]): void {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
}

export function loadQueuedQuestions(): QueuedQuestion[] {
  const raw = localStorage.getItem(QUEUED_QUESTIONS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Array<Partial<QueuedQuestion>>;

    return parsed
      .filter((item) => Boolean(item.localId && item.content && item.queuedAt))
      .map((item) => ({
        localId: item.localId as string,
        content: item.content as string,
        queuedAt: item.queuedAt as string,
      }));
  } catch {
    return [];
  }
}

export function saveQueuedQuestions(questions: QueuedQuestion[]): void {
  localStorage.setItem(QUEUED_QUESTIONS_KEY, JSON.stringify(questions));
}

export function enqueueQuestion(question: QueuedQuestion): void {
  const queue = loadQueuedQuestions();
  queue.push(question);
  saveQueuedQuestions(queue);
}

function normalizeModeration(moderation: Partial<ModerationSummary> | undefined): ModerationSummary {
  return {
    status: moderation?.status ?? 'pending',
    reviewedAt: moderation?.reviewedAt ?? new Date().toISOString(),
    flags: Array.isArray(moderation?.flags) ? moderation.flags : [],
  };
}

function normalizeMentorResponses(mentorResponses: Partial<MentorResponse>[] | undefined): MentorResponse[] {
  if (!Array.isArray(mentorResponses)) {
    return [];
  }

  return mentorResponses
    .filter((response) => Boolean(response.id && response.message && response.createdAt && response.mentor))
    .map((response) => ({
      id: response.id as string,
      createdAt: response.createdAt as string,
      message: response.message as string,
      guidanceType: response.guidanceType ?? 'education',
      mentor: {
        id: response.mentor!.id ?? 'mentor-unknown',
        name: response.mentor!.name ?? 'Mentor',
        role: response.mentor!.role ?? 'Peer Mentor',
      },
    }));
}

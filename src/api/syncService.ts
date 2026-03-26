import type { Question, QueuedQuestion } from '../types';
import { loadQueuedQuestions, saveQueuedQuestions } from '../utils/storage';
import { submitQuestionOnline } from './questionService';

export interface SyncedQuestionResult {
  localId: string;
  serverQuestion: Question;
}

export async function syncQueuedQuestions(): Promise<SyncedQuestionResult[]> {
  const queue = loadQueuedQuestions();
  if (queue.length === 0) {
    return [];
  }

  const remaining: QueuedQuestion[] = [];
  const synced: SyncedQuestionResult[] = [];

  for (const queued of queue) {
    try {
      const serverQuestion = await submitQuestionOnline({ content: queued.content });
      synced.push({ localId: queued.localId, serverQuestion });
    } catch {
      remaining.push(queued);
    }
  }

  saveQueuedQuestions(remaining);
  return synced;
}

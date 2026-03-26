import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../httpClient', () => ({
  requestJson: vi.fn(),
}));

import { requestJson } from '../httpClient';
import { fetchQuestions, submitQuestion } from '../questionService';

const mockRequestJson = vi.mocked(requestJson);

describe('questionService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockRequestJson.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('maps backend question DTO when submit succeeds', async () => {
    mockRequestJson.mockResolvedValueOnce({
      id: 'q-1',
      content: 'How can I track my cycle?',
      askedAt: '2026-03-23T08:00:00.000Z',
      moderation: {
        status: 'approved',
        reviewedAt: '2026-03-23T08:05:00.000Z',
        flags: [],
      },
      mentorResponses: [
        {
          id: 'r-1',
          mentor: { id: 'm-1', name: 'Claudine M.', role: 'Peer Mentor' },
          message: 'You can start by writing dates in a notebook.',
          guidanceType: 'education',
          createdAt: '2026-03-23T08:06:00.000Z',
        },
      ],
    });

    const result = await submitQuestion({ content: 'How can I track my cycle?' });

    expect(result.id).toBe('q-1');
    expect(result.moderation.status).toBe('approved');
    expect(result.mentorResponses[0].mentor.name).toBe('Claudine M.');
  });

  it('falls back to local generated question when submit fails', async () => {
    mockRequestJson.mockRejectedValueOnce(new Error('Network unavailable'));

    const submitPromise = submitQuestion({ content: 'I need advice' });
    await vi.runAllTimersAsync();
    const result = await submitPromise;

    expect(result.content).toBe('I need advice');
    expect(result.moderation.status).toBeTypeOf('string');
    expect(result.mentorResponses.length).toBeGreaterThan(0);
  });

  it('maps question list DTOs from backend', async () => {
    mockRequestJson.mockResolvedValueOnce([
      {
        id: 'q-2',
        content: 'Where can I find a nearby clinic?',
        askedAt: '2026-03-23T09:00:00.000Z',
        moderation: {
          status: 'needs-follow-up',
          reviewedAt: '2026-03-23T09:03:00.000Z',
          flags: ['medical-check'],
        },
        mentorResponses: [],
      },
    ]);

    const result = await fetchQuestions();

    expect(result).toHaveLength(1);
    expect(result[0].moderation.flags).toContain('medical-check');
  });

  it('returns empty list when fetch fails', async () => {
    mockRequestJson.mockRejectedValueOnce(new Error('Timeout'));

    const fetchPromise = fetchQuestions();
    await vi.runAllTimersAsync();
    const result = await fetchPromise;

    expect(result).toEqual([]);
  });
});

import type { Question } from '../types';
import { generateMentorPackage } from './mentorResponseService';
import type { QuestionDto } from './contracts';
import { toCreateQuestionRequestDto, toQuestionDomain } from './contracts';
import { requestJson } from './httpClient';

interface CreateQuestionInput {
  content: string;
}

const SIMULATED_NETWORK_DELAY = 350;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createLocalQuestion(content: string, id: string = String(Date.now())): Question {
  const mentorPackage = generateMentorPackage(content);

  return {
    id,
    content,
    askedAt: new Date().toISOString(),
    moderation: {
      status: mentorPackage.moderationStatus,
      reviewedAt: new Date().toISOString(),
      flags: mentorPackage.flags,
    },
    mentorResponses: mentorPackage.responses,
  };
}

export async function submitQuestionOnline(input: CreateQuestionInput): Promise<Question> {
  const createdQuestionDto = await requestJson<QuestionDto>('/questions', {
    method: 'POST',
    body: toCreateQuestionRequestDto(input.content),
  });

  return toQuestionDomain(createdQuestionDto);
}

export async function submitQuestion(input: CreateQuestionInput): Promise<Question> {
  try {
    return await submitQuestionOnline(input);
  } catch {
    await delay(SIMULATED_NETWORK_DELAY);
    return createLocalQuestion(input.content);
  }
}

export async function fetchQuestions(): Promise<Question[]> {
  try {
    const questionDtos = await requestJson<QuestionDto[]>('/questions');
    return questionDtos.map(toQuestionDomain);
  } catch {
    await delay(200);
    return [];
  }
}

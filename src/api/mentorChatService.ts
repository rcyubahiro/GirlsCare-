import type { EncryptedMessagePayload, Mentor } from '../types';
import { mentors as fallbackMentors } from '../utils/data';
import { requestJson } from './httpClient';

interface MentorDto {
  id: string;
  name: string;
  specialty: string;
  availability: 'Online' | 'Away';
}

interface MentorMessageDto {
  id: string;
  mentorId: string;
  sender: 'user' | 'mentor';
  encryptedContent: EncryptedMessagePayload;
  createdAt: string;
  deliveredAt?: string;
  readAt?: string;
}

interface SendMentorMessageInput {
  mentorId: string;
  encryptedContent: EncryptedMessagePayload;
  alias: string;
}

interface TypingStatusDto {
  mentorTyping: boolean;
}

function toMentorDomain(dto: MentorDto): Mentor {
  return {
    id: dto.id,
    name: dto.name,
    specialty: dto.specialty,
    availability: dto.availability,
  };
}

export async function fetchMentors(): Promise<Mentor[]> {
  try {
    const mentorDtos = await requestJson<MentorDto[]>('/mentors');
    return mentorDtos.map(toMentorDomain);
  } catch {
    return fallbackMentors;
  }
}

export async function fetchMentorMessages(mentorId: string): Promise<MentorMessageDto[]> {
  return requestJson<MentorMessageDto[]>(`/mentors/${mentorId}/messages`);
}

export async function sendMentorMessage(input: SendMentorMessageInput): Promise<void> {
  await requestJson<{ status: string }>(`/mentors/${input.mentorId}/messages`, {
    method: 'POST',
    body: {
      alias: input.alias,
      encryptedContent: input.encryptedContent,
    },
  });
}

export async function markMentorMessagesRead(mentorId: string, lastMessageId: string): Promise<void> {
  await requestJson<{ status: string }>(`/mentors/${mentorId}/read`, {
    method: 'POST',
    body: { lastMessageId },
  });
}

export async function sendTypingStatus(mentorId: string, isTyping: boolean): Promise<void> {
  await requestJson<{ status: string }>(`/mentors/${mentorId}/typing`, {
    method: 'POST',
    body: { isTyping },
  });
}

export async function fetchTypingStatus(mentorId: string): Promise<boolean> {
  const dto = await requestJson<TypingStatusDto>(`/mentors/${mentorId}/typing`);
  return Boolean(dto.mentorTyping);
}

export type { MentorMessageDto };

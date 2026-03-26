import type { HealthFacility, MentorResponse, ModerationSummary, Question } from '../types';

export interface CreateQuestionRequestDto {
  content: string;
}

export interface MentorResponseDto {
  id: string;
  mentor: {
    id: string;
    name: string;
    role: 'Peer Mentor' | 'Health Counselor' | 'Nurse Educator';
  };
  message: string;
  guidanceType: 'education' | 'referral' | 'emotional-support';
  createdAt: string;
}

export interface ModerationSummaryDto {
  status: 'pending' | 'approved' | 'needs-follow-up' | 'escalated';
  reviewedAt: string;
  flags: string[];
}

export interface QuestionDto {
  id: string;
  content: string;
  askedAt: string;
  moderation: ModerationSummaryDto;
  mentorResponses: MentorResponseDto[];
}

export interface HealthFacilityDto {
  id: string;
  name: string;
  location: string;
  contact: string;
}

export function toCreateQuestionRequestDto(content: string): CreateQuestionRequestDto {
  return { content };
}

export function toQuestionDomain(dto: QuestionDto): Question {
  return {
    id: dto.id,
    content: dto.content,
    askedAt: dto.askedAt,
    moderation: toModerationDomain(dto.moderation),
    mentorResponses: dto.mentorResponses.map(toMentorResponseDomain),
  };
}

export function toHealthFacilityDomain(dto: HealthFacilityDto): HealthFacility {
  return {
    id: dto.id,
    name: dto.name,
    location: dto.location,
    contact: dto.contact,
  };
}

function toModerationDomain(dto: ModerationSummaryDto): ModerationSummary {
  return {
    status: dto.status,
    reviewedAt: dto.reviewedAt,
    flags: dto.flags,
  };
}

function toMentorResponseDomain(dto: MentorResponseDto): MentorResponse {
  return {
    id: dto.id,
    mentor: {
      id: dto.mentor.id,
      name: dto.mentor.name,
      role: dto.mentor.role,
    },
    message: dto.message,
    guidanceType: dto.guidanceType,
    createdAt: dto.createdAt,
  };
}

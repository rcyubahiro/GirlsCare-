 import type { MentorResponse, MentorProfile, ModerationStatus } from '../types';

const mentors: MentorProfile[] = [
  { id: 'm-1', name: 'Claudine M.', role: 'Peer Mentor' },
  { id: 'm-2', name: 'Jeanne U.', role: 'Health Counselor' },
  { id: 'm-3', name: 'Dr. Aline N.', role: 'Nurse Educator' },
];

interface GeneratedMentorPackage {
  moderationStatus: ModerationStatus;
  flags: string[];
  responses: MentorResponse[];
}

function selectMentor(questionText: string): MentorProfile {
  const index = questionText.length % mentors.length;
  return mentors[index];
}

export function generateMentorPackage(questionText: string): GeneratedMentorPackage {
  const lowerQuestion = questionText.toLowerCase();
  const hasUrgencyWord = /abuse|violence|forced|danger/.test(lowerQuestion);
  const hasMedicalWord = /pain|bleeding|infection|fever/.test(lowerQuestion);

  const moderationStatus: ModerationStatus = hasUrgencyWord
    ? 'escalated'
    : hasMedicalWord
      ? 'needs-follow-up'
      : 'approved';

  const flags = [
    ...(hasUrgencyWord ? ['urgent-safety'] : []),
    ...(hasMedicalWord ? ['medical-check'] : []),
  ];

  const mentor = selectMentor(questionText);

  const responses: MentorResponse[] = [
    {
      id: `resp-${Date.now()}-1`,
      mentor,
      guidanceType: hasMedicalWord ? 'referral' : 'education',
      createdAt: new Date().toISOString(),
      message: hasUrgencyWord
        ? 'Your safety matters first. Please reach out to a trusted adult, local leader, or nearby health center immediately.'
        : hasMedicalWord
          ? 'Thank you for sharing. Based on your symptoms, please visit a health facility for a confidential check-up.'
          : 'Thank you for your question. You are making a strong choice by seeking accurate information and support.',
    },
  ];

  if (!hasUrgencyWord) {
    responses.push({
      id: `resp-${Date.now()}-2`,
      mentor,
      guidanceType: 'emotional-support',
      createdAt: new Date().toISOString(),
      message: 'You are not alone. Keep learning, ask follow-up questions, and connect with trusted mentors in your community.',
    });
  }

  return {
    moderationStatus,
    flags,
    responses,
  };
}

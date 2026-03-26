export interface UserSession {
  email: string;
  name: string;
  loggedInAt: string;
}

export interface Question {
  id: string;
  content: string;
  askedAt: string;
  moderation: ModerationSummary;
  mentorResponses: MentorResponse[];
}

export type ModerationStatus = 'pending' | 'approved' | 'needs-follow-up' | 'escalated';

export interface ModerationSummary {
  status: ModerationStatus;
  reviewedAt: string;
  flags: string[];
}

export interface MentorProfile {
  id: string;
  name: string;
  role: 'Peer Mentor' | 'Health Counselor' | 'Nurse Educator';
}

export interface MentorResponse {
  id: string;
  mentor: MentorProfile;
  message: string;
  guidanceType: 'education' | 'referral' | 'emotional-support';
  createdAt: string;
}

export interface EducationTopic {
  id: string;
  title: string;
  summary: string;
  details: string;
}

export interface HealthFacility {
  id: string;
  name: string;
  location: string;
  contact: string;
}

export interface LifeSkillTopic {
  id: string;
  title: string;
  summary: string;
  practicalSteps: string[];
}

export interface CampaignItem {
  id: string;
  title: string;
  message: string;
  callToAction: string;
  focusArea: 'pregnancy-prevention' | 'menstrual-health' | 'safe-relationships';
}

export interface DashboardCardItem {
  title: string;
  description: string;
  route: string;
}

export interface QueuedQuestion {
  localId: string;
  content: string;
  queuedAt: string;
}

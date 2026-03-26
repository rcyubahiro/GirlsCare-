import type { CampaignItem, DashboardCardItem, EducationTopic, HealthFacility, LifeSkillTopic } from '../types';

export const educationTopics: EducationTopic[] = [
  {
    id: 'pregnancy',
    title: 'Understanding Pregnancy',
    summary: 'Learn how pregnancy happens and ways to plan your future safely.',
    details:
      'Pregnancy starts when a sperm fertilizes an egg. Understanding body changes, fertile periods, and contraception options can help you make informed decisions and avoid unplanned pregnancies.',
  },
  {
    id: 'relationships',
    title: 'Safe Relationships',
    summary: 'Build healthy relationships rooted in respect and communication.',
    details:
      'Safe relationships include mutual respect, consent, and open communication. You have the right to say no, seek support, and make choices that protect your health and goals.',
  },
  {
    id: 'menstrual-health',
    title: 'Menstrual Health',
    summary: 'Understand your cycle and practical hygiene practices.',
    details:
      'Tracking your cycle helps you understand your body. Use clean menstrual products, maintain hygiene, and seek medical support for severe pain or irregular periods.',
  },
];

export const facilities: HealthFacility[] = [
  {
    id: 'f1',
    name: 'Nyagatare Youth Health Center',
    location: 'Nyagatare District, Rwanda',
    contact: '+250 788 123 456',
  },
  {
    id: 'f2',
    name: 'Kayonza Community Clinic',
    location: 'Kayonza District, Rwanda',
    contact: '+250 788 555 102',
  },
  {
    id: 'f3',
    name: 'Gatsibo Family Health Post',
    location: 'Gatsibo District, Rwanda',
    contact: '+250 788 334 220',
  },
];

export const dashboardCards: DashboardCardItem[] = [
  {
    title: 'Education',
    description: 'Read practical learning topics and guidance.',
    route: '/education',
  },
  {
    title: 'Ask Question',
    description: 'Submit private questions and seek mentorship.',
    route: '/ask',
  },
  {
    title: 'Health Centers',
    description: 'Find nearby health facilities and contacts.',
    route: '/facilities',
  },
  {
    title: 'Life Skills',
    description: 'Build confidence, communication, and digital literacy skills.',
    route: '/life-skills',
  },
  {
    title: 'Campaigns',
    description: 'Join local awareness actions on early pregnancy prevention.',
    route: '/campaigns',
  },
];

export const lifeSkillTopics: LifeSkillTopic[] = [
  {
    id: 'goal-setting',
    title: 'Goal Setting and Decision Making',
    summary: 'Plan your future and make informed choices in school, health, and relationships.',
    practicalSteps: [
      'Write one short-term and one long-term goal every month.',
      'Discuss your plan with a trusted mentor or family member.',
      'Review progress weekly and adjust when needed.',
    ],
  },
  {
    id: 'communication',
    title: 'Healthy Communication',
    summary: 'Learn how to express boundaries, ask for help, and seek trusted information.',
    practicalSteps: [
      'Use clear “I feel / I need” sentences in difficult conversations.',
      'Practice saying no respectfully in role-play situations.',
      'Keep contacts of two trusted adults for quick support.',
    ],
  },
  {
    id: 'digital-literacy',
    title: 'Digital Literacy and Safety',
    summary: 'Use phones and internet safely to find credible health and education resources.',
    practicalSteps: [
      'Verify health information from clinics, health workers, or known organizations.',
      'Protect privacy by using strong passwords and not sharing private details.',
      'Report harmful online messages to a trusted adult or moderator.',
    ],
  },
];

export const campaignItems: CampaignItem[] = [
  {
    id: 'c1',
    title: 'Stay in School, Stay Empowered',
    message: 'Early pregnancy prevention starts with knowledge, support, and confidence in your goals.',
    callToAction: 'Share one prevention tip with a friend this week.',
    focusArea: 'pregnancy-prevention',
  },
  {
    id: 'c2',
    title: 'Know Your Cycle, Know Your Health',
    message: 'Menstrual awareness helps youth make informed health decisions and seek help early.',
    callToAction: 'Track your cycle for one month and ask questions in the app.',
    focusArea: 'menstrual-health',
  },
  {
    id: 'c3',
    title: 'Respect, Consent, and Safe Relationships',
    message: 'Healthy relationships are built on consent, respect, and open communication.',
    callToAction: 'Discuss consent and boundaries with your peer group.',
    focusArea: 'safe-relationships',
  },
];


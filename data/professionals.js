'use strict';

const professionals = [
  {
    id: 'pro-1',
    name: 'Dr. Amina Ndikumana',
    specialty: 'Gynaecology',
    credentials: 'MBChB, MMed (Obs & Gynae)',
    bio: 'Dr. Amina specialises in adolescent gynaecology and reproductive health. She provides a safe, non-judgmental space for young women.',
    available: true,
    contact: { type: 'Book online', url: '#book-pro-1' },
  },
  {
    id: 'pro-2',
    name: 'Dr. Cynthia Uwase',
    specialty: 'Mental Health',
    credentials: 'BSc Psychology, MPhil Clinical Psychology',
    bio: 'Dr. Cynthia is a clinical psychologist with a focus on adolescent mental health, anxiety, and trauma recovery.',
    available: true,
    contact: { type: 'Book online', url: '#book-pro-2' },
  },
  {
    id: 'pro-3',
    name: 'Nurse Grace Mukamana',
    specialty: 'General Health',
    credentials: 'BSc Nursing, Certified Adolescent Health Nurse',
    bio: 'Grace is a registered nurse passionate about providing holistic care and health education to young women in the community.',
    available: true,
    contact: { type: 'Book online', url: '#book-pro-3' },
  },
  {
    id: 'pro-4',
    name: 'Dr. Jeanne Ingabire',
    specialty: 'Nutrition',
    credentials: 'BSc Nutrition & Dietetics, MSc Public Health',
    bio: 'Dr. Jeanne offers personalised nutrition counselling for young women, focusing on wellness, energy, and hormonal balance.',
    available: false,
    contact: { type: 'Book online', url: '#book-pro-4' },
  },
];

module.exports = { professionals };

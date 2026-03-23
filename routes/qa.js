'use strict';

const express = require('express');
const router = express.Router();
const qaData = require('../data/qa');

// GET /qa – list all approved questions (anonymous)
router.get('/', (req, res) => {
  res.json({ questions: qaData.questions });
});

// POST /qa – submit an anonymous question
router.post('/', (req, res) => {
  const { question, category } = req.body;
  if (!question || typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({ error: 'Question text is required' });
  }
  const newQuestion = {
    id: `q${Date.now()}`,
    question: question.trim(),
    category: category && typeof category === 'string' ? category.trim() : 'General',
    answer: null,
    submittedAt: new Date().toISOString(),
  };
  qaData.questions.push(newQuestion);
  res.status(201).json({ message: 'Question submitted anonymously', question: newQuestion });
});

module.exports = router;

'use strict';

const express = require('express');
const router = express.Router();
const educationData = require('../data/education');

// GET /education – list all topics
router.get('/', (req, res) => {
  res.json({ topics: educationData.topics });
});

// GET /education/:id – get a single topic
router.get('/:id', (req, res) => {
  const topic = educationData.topics.find(t => t.id === req.params.id);
  if (!topic) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  res.json(topic);
});

module.exports = router;

'use strict';

const express = require('express');
const router = express.Router();
const resourcesData = require('../data/resources');

// GET /resources – list all decision-making resources
router.get('/', (req, res) => {
  const { tag } = req.query;
  let resources = resourcesData.resources;
  if (tag) {
    resources = resources.filter(r => r.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase()));
  }
  res.json({ resources });
});

// GET /resources/:id – get a single resource
router.get('/:id', (req, res) => {
  const resource = resourcesData.resources.find(r => r.id === req.params.id);
  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  res.json(resource);
});

module.exports = router;

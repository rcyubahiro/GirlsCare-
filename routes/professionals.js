'use strict';

const express = require('express');
const router = express.Router();
const professionalsData = require('../data/professionals');

// GET /professionals – list all health professionals
router.get('/', (req, res) => {
  const { specialty } = req.query;
  let professionals = professionalsData.professionals;
  if (specialty) {
    professionals = professionals.filter(
      p => p.specialty.toLowerCase() === specialty.toLowerCase()
    );
  }
  res.json({ professionals });
});

// GET /professionals/:id – get a single professional's profile
router.get('/:id', (req, res) => {
  const professional = professionalsData.professionals.find(p => p.id === req.params.id);
  if (!professional) {
    return res.status(404).json({ error: 'Professional not found' });
  }
  res.json(professional);
});

module.exports = router;

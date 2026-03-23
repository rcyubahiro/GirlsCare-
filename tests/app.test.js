'use strict';

const request = require('supertest');
const app = require('../app');

describe('GirlsCare API', () => {

  // ──────────────────────────────────────────────
  // Home
  // ──────────────────────────────────────────────
  describe('GET /', () => {
    it('should return 200 and the home page HTML', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/html/);
      expect(res.text).toContain('GirlsCare');
    });
  });

  // ──────────────────────────────────────────────
  // Education
  // ──────────────────────────────────────────────
  describe('GET /education', () => {
    it('should return an array of topics', async () => {
      const res = await request(app).get('/education');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('topics');
      expect(Array.isArray(res.body.topics)).toBe(true);
      expect(res.body.topics.length).toBeGreaterThan(0);
    });

    it('each topic should have id, title, summary, content, and tags', async () => {
      const res = await request(app).get('/education');
      const topic = res.body.topics[0];
      expect(topic).toHaveProperty('id');
      expect(topic).toHaveProperty('title');
      expect(topic).toHaveProperty('summary');
      expect(topic).toHaveProperty('content');
      expect(Array.isArray(topic.tags)).toBe(true);
    });
  });

  describe('GET /education/:id', () => {
    it('should return a specific topic by id', async () => {
      const res = await request(app).get('/education/menstrual-health');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe('menstrual-health');
    });

    it('should return 404 for unknown topic id', async () => {
      const res = await request(app).get('/education/nonexistent-topic');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ──────────────────────────────────────────────
  // Anonymous Q&A
  // ──────────────────────────────────────────────
  describe('GET /qa', () => {
    it('should return a list of questions', async () => {
      const res = await request(app).get('/qa');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('questions');
      expect(Array.isArray(res.body.questions)).toBe(true);
    });
  });

  describe('POST /qa', () => {
    it('should submit an anonymous question and return 201', async () => {
      const res = await request(app)
        .post('/qa')
        .send({ question: 'Is it safe to exercise during menstruation?', category: 'Menstrual Health' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('question');
      expect(res.body.question.question).toBe('Is it safe to exercise during menstruation?');
      expect(res.body.question.category).toBe('Menstrual Health');
      expect(res.body.question.answer).toBeNull();
    });

    it('should default category to General if not provided', async () => {
      const res = await request(app)
        .post('/qa')
        .send({ question: 'What vitamins should I take?' });
      expect(res.status).toBe(201);
      expect(res.body.question.category).toBe('General');
    });

    it('should return 400 if question is empty', async () => {
      const res = await request(app)
        .post('/qa')
        .send({ question: '   ' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if question is missing', async () => {
      const res = await request(app)
        .post('/qa')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ──────────────────────────────────────────────
  // Health Professionals
  // ──────────────────────────────────────────────
  describe('GET /professionals', () => {
    it('should return a list of professionals', async () => {
      const res = await request(app).get('/professionals');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('professionals');
      expect(Array.isArray(res.body.professionals)).toBe(true);
      expect(res.body.professionals.length).toBeGreaterThan(0);
    });

    it('each professional should have required fields', async () => {
      const res = await request(app).get('/professionals');
      const pro = res.body.professionals[0];
      expect(pro).toHaveProperty('id');
      expect(pro).toHaveProperty('name');
      expect(pro).toHaveProperty('specialty');
      expect(pro).toHaveProperty('bio');
    });

    it('should filter professionals by specialty', async () => {
      const res = await request(app).get('/professionals?specialty=Gynaecology');
      expect(res.status).toBe(200);
      res.body.professionals.forEach(p => {
        expect(p.specialty.toLowerCase()).toBe('gynaecology');
      });
    });

    it('should return empty array for unknown specialty', async () => {
      const res = await request(app).get('/professionals?specialty=Dentistry');
      expect(res.status).toBe(200);
      expect(res.body.professionals).toHaveLength(0);
    });
  });

  describe('GET /professionals/:id', () => {
    it('should return a specific professional by id', async () => {
      const res = await request(app).get('/professionals/pro-1');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe('pro-1');
    });

    it('should return 404 for unknown professional id', async () => {
      const res = await request(app).get('/professionals/nonexistent');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ──────────────────────────────────────────────
  // Resources
  // ──────────────────────────────────────────────
  describe('GET /resources', () => {
    it('should return a list of resources', async () => {
      const res = await request(app).get('/resources');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('resources');
      expect(Array.isArray(res.body.resources)).toBe(true);
      expect(res.body.resources.length).toBeGreaterThan(0);
    });

    it('each resource should have required fields', async () => {
      const res = await request(app).get('/resources');
      const resource = res.body.resources[0];
      expect(resource).toHaveProperty('id');
      expect(resource).toHaveProperty('title');
      expect(resource).toHaveProperty('type');
      expect(resource).toHaveProperty('description');
      expect(Array.isArray(resource.tags)).toBe(true);
    });

    it('should filter resources by tag', async () => {
      const res = await request(app).get('/resources?tag=nutrition');
      expect(res.status).toBe(200);
      res.body.resources.forEach(r => {
        expect(r.tags.map(t => t.toLowerCase())).toContain('nutrition');
      });
    });
  });

  describe('GET /resources/:id', () => {
    it('should return a specific resource by id', async () => {
      const res = await request(app).get('/resources/res-1');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe('res-1');
    });

    it('should return 404 for unknown resource id', async () => {
      const res = await request(app).get('/resources/nonexistent');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ──────────────────────────────────────────────
  // 404 Handler
  // ──────────────────────────────────────────────
  describe('GET /unknown-route', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/unknown-route');
      expect(res.status).toBe(404);
    });
  });

});

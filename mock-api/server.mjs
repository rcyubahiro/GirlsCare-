import { createServer } from 'node:http';

const PORT = Number(process.env.PORT ?? 8080);

/** @type {Array<{
 * id: string,
 * content: string,
 * askedAt: string,
 * moderation: { status: 'pending' | 'approved' | 'needs-follow-up' | 'escalated', reviewedAt: string, flags: string[] },
 * mentorResponses: Array<{ id: string, mentor: { id: string, name: string, role: 'Peer Mentor' | 'Health Counselor' | 'Nurse Educator' }, message: string, guidanceType: 'education' | 'referral' | 'emotional-support', createdAt: string }>
 * }>} */
const questions = [];

const facilities = [
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

const mentors = [
  { id: 'm-1', name: 'Claudine M.', role: 'Peer Mentor' },
  { id: 'm-2', name: 'Jeanne U.', role: 'Health Counselor' },
  { id: 'm-3', name: 'Dr. Aline N.', role: 'Nurse Educator' },
];

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-User-Email',
  });
  res.end(JSON.stringify(body));
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function buildModerationAndResponses(content) {
  const lowerQuestion = content.toLowerCase();
  const hasUrgencyWord = /abuse|violence|forced|danger/.test(lowerQuestion);
  const hasMedicalWord = /pain|bleeding|infection|fever/.test(lowerQuestion);

  const status = hasUrgencyWord ? 'escalated' : hasMedicalWord ? 'needs-follow-up' : 'approved';
  const flags = [
    ...(hasUrgencyWord ? ['urgent-safety'] : []),
    ...(hasMedicalWord ? ['medical-check'] : []),
  ];

  const mentor = mentors[content.length % mentors.length];
  const now = new Date().toISOString();

  const mentorResponses = [
    {
      id: `resp-${Date.now()}-1`,
      mentor,
      guidanceType: hasMedicalWord ? 'referral' : 'education',
      createdAt: now,
      message: hasUrgencyWord
        ? 'Your safety matters first. Please reach out to a trusted adult or nearby health center immediately.'
        : hasMedicalWord
          ? 'Thanks for sharing. Please visit a health facility for confidential follow-up support.'
          : 'Thank you for your question. You are making a strong choice by seeking trusted information.',
    },
  ];

  if (!hasUrgencyWord) {
    mentorResponses.push({
      id: `resp-${Date.now()}-2`,
      mentor,
      guidanceType: 'emotional-support',
      createdAt: now,
      message: 'You are not alone. Keep asking questions and stay connected with trusted mentors.',
    });
  }

  return {
    moderation: {
      status,
      reviewedAt: now,
      flags,
    },
    mentorResponses,
  };
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, { ok: true, service: 'girlcare-mock-api' });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/questions') {
    sendJson(res, 200, questions);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/facilities') {
    sendJson(res, 200, facilities);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/questions') {
    const body = await parseBody(req);

    if (!body || typeof body.content !== 'string' || !body.content.trim()) {
      sendJson(res, 400, { message: 'Question content is required.' });
      return;
    }

    const content = body.content.trim();
    const now = new Date().toISOString();
    const generated = buildModerationAndResponses(content);

    const createdQuestion = {
      id: String(Date.now()),
      content,
      askedAt: now,
      moderation: generated.moderation,
      mentorResponses: generated.mentorResponses,
    };

    questions.push(createdQuestion);
    sendJson(res, 201, createdQuestion);
    return;
  }

  sendJson(res, 404, { message: 'Not found.' });
});

server.listen(PORT, () => {
  console.log(`[girlcare-mock-api] running on http://localhost:${PORT}`);
});

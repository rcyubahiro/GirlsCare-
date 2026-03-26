# GIRLCARE

Clean, modern, mobile-first React + TypeScript app for education, mentorship, and access to health support services.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- React Router
- Vitest + Testing Library

## Pages

- `/` Landing Page
- `/login` Login/Register
- `/dashboard` Dashboard
- `/education` Education
- `/ask` Ask Question
- `/answers` Answers
- `/facilities` Health Facilities
- `/profile` Profile

## Reusable Components

- `Navbar`
- `Card`
- `Button`
- `InputField`
- `Layout`
- `ProtectedRoute`

## API Layer

The frontend uses a service layer under `src/api` with DTO contracts in `src/api/contracts.ts`.

### Endpoints expected by frontend

- `GET /api/questions`
- `POST /api/questions`
- `GET /api/facilities`
- `GET /api/health` (optional health check)

### Question DTO shape

```json
{
  "id": "string",
  "content": "string",
  "askedAt": "ISO date string",
  "moderation": {
    "status": "pending | approved | needs-follow-up | escalated",
    "reviewedAt": "ISO date string",
    "flags": ["string"]
  },
  "mentorResponses": [
    {
      "id": "string",
      "mentor": {
        "id": "string",
        "name": "string",
        "role": "Peer Mentor | Health Counselor | Nurse Educator"
      },
      "message": "string",
      "guidanceType": "education | referral | emotional-support",
      "createdAt": "ISO date string"
    }
  ]
}
```

## Environment Variables

Copy `.env.example` to `.env` and update values if needed.

```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TOKEN=
```

## Local Development

### Option A: Frontend + Mock API (recommended)

```bash
npm install
npm run dev:full
```

- Frontend: `http://localhost:5173`
- Mock API: `http://localhost:8080`

### Option B: Frontend only

```bash
npm install
npm run dev
```

### Mock API only

```bash
npm run mock:api
```

## Quality Checks

```bash
npm run lint
npm run test:run
npm run build
```

## Notes

- Protected routes are enabled for dashboard and authenticated pages.
- Session and questions are persisted in `localStorage`.
- If backend is unavailable, question submission falls back to a local structured moderation/mentor model.

## Offline Use (Rural Connectivity)

- The app ships with a service worker and app manifest for offline-first usage.
- After opening the app once with internet, key app files are cached for later offline access.
- Users can continue browsing core pages and viewing previously saved data when offline.
- Questions submitted offline are added to a local queue and shown immediately in the app.
- When internet returns, queued questions are auto-synced to backend and replaced by server records.
- In-app status badge shows `Online` or `Offline` so users know current connectivity mode.

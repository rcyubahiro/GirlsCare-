# Mentor Encrypted Chat API Contract and Server Checklist

## Overview

This document defines backend contracts for mentors, encrypted messages, read receipts, typing status, and reminder push integration.

## Base Assumptions

- Base URL: /api
- Auth: Bearer token and/or X-User-Email header
- User identity in chat UI remains anonymous through alias only
- Backend stores only encrypted payload for message body

## Encrypted Chat Payload

Message content must be ciphertext and never plain text.

Request field:

- encryptedContent.iv: base64
- encryptedContent.cipherText: base64

Example:
{
"encryptedContent": {
"iv": "base64-iv",
"cipherText": "base64-ciphertext"
}
}

## Endpoints

### 1) Get mentors

GET /mentors

Response 200:
[
{
"id": "mentor-1",
"name": "Aline Mukamana",
"specialty": "Menstrual Health Educator",
"availability": "Online"
}
]

### 2) Get encrypted messages for mentor thread

GET /mentors/:mentorId/messages

Response 200:
[
{
"id": "msg-1",
"mentorId": "mentor-1",
"sender": "mentor",
"encryptedContent": {
"iv": "base64-iv",
"cipherText": "base64-ciphertext"
},
"createdAt": "2026-03-26T12:00:00.000Z",
"deliveredAt": "2026-03-26T12:00:02.000Z",
"readAt": "2026-03-26T12:01:20.000Z"
}
]

### 3) Send encrypted message

POST /mentors/:mentorId/messages

Request:
{
"alias": "Anonymous-1234",
"encryptedContent": {
"iv": "base64-iv",
"cipherText": "base64-ciphertext"
}
}

Response 200:
{
"status": "ok"
}

### 4) Mark messages as read

POST /mentors/:mentorId/read

Request:
{
"lastMessageId": "msg-100"
}

Response 200:
{
"status": "ok"
}

### 5) Send typing status

POST /mentors/:mentorId/typing

Request:
{
"isTyping": true
}

Response 200:
{
"status": "ok"
}

### 6) Get mentor typing status

GET /mentors/:mentorId/typing

Response 200:
{
"mentorTyping": false
}

## Push Reminder Endpoints

### 7) Save push subscription

POST /reminders/push-subscriptions

Request: Web Push subscription JSON from browser PushManager
Response 200:
{
"status": "ok"
}

### 8) Save reminder schedule

POST /reminders/schedule

Request:
{
"reminderTime": "19:00",
"daysToNotify": 2,
"remindersEnabled": true
}

Response 200:
{
"status": "ok"
}

## Server Checklist

### Chat and mentor operations

- [ ] Implement mentor listing endpoint
- [ ] Implement encrypted message fetch endpoint
- [ ] Implement encrypted send endpoint
- [ ] Store only encrypted payload, never plain text
- [ ] Validate encrypted payload shape and size
- [ ] Persist deliveredAt and readAt timestamps
- [ ] Implement read receipt update endpoint
- [ ] Implement typing publish endpoint
- [ ] Implement typing fetch endpoint
- [ ] Add rate limiting for send and typing endpoints

### Privacy and security

- [ ] Alias-only exposure on mentor dashboards where required
- [ ] Encrypt transport via HTTPS only
- [ ] Restrict CORS to approved origins
- [ ] Add request auth and tenant/user isolation
- [ ] Add audit logs without message plaintext
- [ ] Add data retention policy for encrypted chat records

### Push reminders

- [ ] Store valid browser push subscriptions per user
- [ ] Handle subscription updates and expired endpoints
- [ ] Schedule jobs at user reminder time and timezone
- [ ] Send Web Push payload with reminder title/body
- [ ] Retry failed push sends and log failures
- [ ] Support disabling reminders and deleting subscriptions

### Reliability and observability

- [ ] Add health checks for mentor and reminder services
- [ ] Add structured logs for all chat/reminder endpoints
- [ ] Add metrics for delivery, read rates, push success rates
- [ ] Add integration tests for each endpoint

## Suggested Future Upgrade for Full E2EE

Current payload encryption can be upgraded to full multi-device E2EE with:

- Per-user key pairs (X25519)
- Server-managed public-key directory
- Session key derivation (ECDH + HKDF)
- Forward secrecy and key rotation
- Device revocation and key backup strategy

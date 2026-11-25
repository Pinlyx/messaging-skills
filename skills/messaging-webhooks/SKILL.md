---
name: messaging-webhooks
description: "Set up and debug webhooks for WhatsApp, Instagram and Messenger (Meta) and for Telegram and X: the subscribe challenge, signature verification on the raw body, fast 200 responses, retries, idempotency and storing the last inbound time. Use for 'webhook verification failed', 'invalid signature', 'receive WhatsApp messages', 'Telegram setWebhook', 'X CRC check', 'duplicate webhook events', or 'normalize incoming messages'."
metadata:
  version: "0.1.0"
  channels: "whatsapp, instagram, messenger, telegram, x"
---

# Messaging webhooks

Incoming messages arrive as HTTP callbacks. Most "webhook not working" problems are one of five things: the challenge answered wrongly, the signature computed over parsed JSON instead of the raw bytes, a slow response that triggers retries, duplicates processed twice, or the wrong app secret. Details per platform: [references/webhook-setup.md](references/webhook-setup.md).

## When to use this skill

- Registering a webhook URL with Meta, Telegram or X.
- A signature check fails, a subscription does not verify, or messages arrive twice or never.
- Designing the inbound pipeline: verify, parse, dedupe, store, process.

## Context to collect

1. Which channels, and which products (WhatsApp Cloud API, Instagram messaging, Messenger, Telegram Bot API, X Account Activity).
2. Hosting: a public HTTPS endpoint, framework, runtime (Node, edge, Python).
3. Where secrets live (app secret, verify token, Telegram secret token, X consumer secret).
4. What happens after receipt: queue, database, replies.

## Workflow

### 1. Endpoint shape

One route per channel, each accepting a GET for the handshake where the platform needs one and a POST for events. Behind a reverse proxy, make sure the proxy passes the body unmodified: do not let a framework re-encode it before you verify.

### 2. Handshake

| Platform | Handshake |
| --- | --- |
| Meta (WhatsApp, Instagram, Messenger) | GET with `hub.mode`, `hub.verify_token`, `hub.challenge`. If the mode is subscribe and the token equals the one you configured, answer 200 with the `hub.challenge` value as plain text. Otherwise 403. |
| Telegram | No handshake. You call `setWebhook` with the URL and a `secret_token` of your choice. Telegram then sends the secret in `X-Telegram-Bot-Api-Secret-Token` on every update. |
| X (Account Activity) | GET with `crc_token`. Answer JSON `{ "response_token": "sha256=<base64 HMAC-SHA256 of crc_token with the consumer secret>" }`. |

### 3. Verify every POST on the raw body

| Platform | Header | Computation |
| --- | --- | --- |
| Meta | `X-Hub-Signature-256: sha256=<hex>` | HMAC-SHA256 of the raw body with the app secret, hex |
| Telegram | `X-Telegram-Bot-Api-Secret-Token` | Constant-time compare with your secret |
| X | `x-twitter-webhooks-signature: sha256=<base64>` | HMAC-SHA256 of the raw body with the consumer secret, base64 |

Rules: capture the body bytes before any JSON middleware; compare in constant time; reject with 401 on a missing or malformed header; never log the secret. If you re-serialize parsed JSON, whitespace, key order and unicode escaping change and every valid request fails.

### 4. Respond fast, work later

Answer 200 immediately after verification and enqueue the work. Meta and X retry slow or failing endpoints, so slow handlers create duplicates. The sourced rules data does not publish retry counts or schedules: do not assume one; build for at-least-once delivery.

### 5. Normalize and dedupe

- One request can contain several messages and statuses (WhatsApp always returns an array of entries and changes). Loop, never read just the first.
- Message ids are the dedupe key. Telegram message ids are only unique within a chat, so key on chat id plus message id (or use the `update_id`).
- Distinguish echoes (your own messages), delivery and read statuses, reactions, postbacks and edits from customer messages. Do not auto-reply to an echo or a status.
- Keep the raw payload for debugging but treat it as personal data: restrict access, set a retention period, never log it blindly.

The open source library [unified-message](https://github.com/Pinlyx/unified-message) does the parsing and the checks for all five channels with zero runtime dependencies: `npm install unified-message`. Example with Express:

```ts
import express from 'express';
import { parse, verifyMetaChallenge, verifyMetaSignature, verifyTelegramSecret } from 'unified-message';

const app = express();
app.use(express.raw({ type: '*/*' })); // req.body is a Buffer of the exact bytes sent

app.get('/hooks/whatsapp', (req, res) => {
  const challenge = verifyMetaChallenge(req.query, process.env.META_VERIFY_TOKEN!);
  challenge === null ? res.sendStatus(403) : res.send(challenge);
});

app.post('/hooks/whatsapp', (req, res) => {
  if (!verifyMetaSignature(req.body, req.get('x-hub-signature-256'), process.env.META_APP_SECRET!)) {
    return res.sendStatus(401);
  }
  res.sendStatus(200);                       // answer first
  for (const item of parse('whatsapp', req.body)) queue.push(item); // then process
});

app.post('/hooks/telegram', (req, res) => {
  if (!verifyTelegramSecret(req.get('x-telegram-bot-api-secret-token'), process.env.TELEGRAM_SECRET!)) {
    return res.sendStatus(401);
  }
  res.sendStatus(200);
  for (const item of parse('telegram', req.body)) queue.push(item);
});
```

Without the library, the Meta check is: `crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex')` compared in constant time (`crypto.timingSafeEqual`) with the header value after `sha256=`.

### 6. Store the last inbound time

For Meta channels, save `last_inbound_at` per conversation from each customer message (not from echoes or statuses). It drives `can-i-message`, window countdowns and `inbox-triage`.

### 7. Test

- Send a sample payload with a correct and an incorrect signature and expect 200 and 401.
- Send the same payload twice and verify one processing.
- Send a slow-handler simulation and confirm the response still returns quickly.
- Check the platform's webhook tools or logs for delivery failures after going live.

## Checklist

- [ ] HTTPS endpoint reachable from the internet.
- [ ] Handshake implemented per platform and tested.
- [ ] Signature verified on the raw body; secret from configuration, not code.
- [ ] 200 returned before heavy work; processing is asynchronous.
- [ ] Dedupe key defined per channel; retries are harmless.
- [ ] Echoes and status events are not treated as customer messages.
- [ ] `last_inbound_at` stored per conversation.
- [ ] Raw payload retention and access limited.
- [ ] Old tokens rotated; separate secrets per environment.

## Output template

```
Channels and products: <...>
Endpoints: <method path -> purpose>
Verification: <header -> secret name -> where verified>
Pipeline: verify -> 200 -> enqueue -> parse -> dedupe(<key>) -> store -> handle
Idempotency and retries: <what happens on duplicate, on failure>
Stored fields: <conversation id, last_inbound_at, ...>
Open risks: <retry behaviour not documented, access levels, secrets handling>
```

## Common mistakes

- Verifying `JSON.stringify(req.body)` instead of the received bytes.
- Using the page or access token where the app secret is needed (or the reverse).
- Returning the challenge as JSON instead of plain text.
- Doing the reply inside the request handler and timing out.
- Replying to echoes, which loops the bot with itself.
- Using Telegram message ids as global ids.
- Assuming one message per request.

## Related

`can-i-message`, `instagram-dm-automation`, `telegram-bot-builder`, `inbox-triage`.

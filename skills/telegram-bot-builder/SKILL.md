---
name: telegram-bot-builder
description: "Take a Telegram bot from BotFather to production: create the bot, choose webhook or long polling, design commands and inline keyboards, respect the documented limits and rate limits, handle errors and deploy. Use for 'build a Telegram bot', 'Telegram bot for customer support/orders', 'webhook or polling', 'inline keyboard buttons', 'bot is hitting limits / 429', or 'broadcast to my bot subscribers'."
metadata:
  version: "0.1.0"
  channels: "telegram"
---

# Telegram bot builder

Telegram is the most permissive channel for bots: no approval, no template system, no messaging window. The constraints are different: a bot never starts a conversation, files and messages have size limits, and sending too fast gets you throttled. Sourced numbers: [references/telegram-limits.md](references/telegram-limits.md).

## When to use this skill

- Building a customer-facing bot (support, orders, booking, notifications, lead capture).
- Choosing between webhook and polling, or moving a bot to production.
- Fixing rate limit errors, oversized files or broken keyboards.

## Rules that shape the design

- A bot cannot start a conversation. A user must message it (for example `/start`) or add it to a group first. There is no window after that.
- Text: 1 to 4,096 characters after entity parsing (formatting markup does not count). Captions: up to 1,024.
- Rate guidance: about 1 message per second per chat, no more than 20 per minute in a group, about 30 per second for bulk notifications overall. Paid broadcasts, if enabled in @BotFather, allow up to 1,000 per second.
- Inline keyboard callback data: 1 to 64 bytes. The notification text of `answerCallbackQuery`: up to 200 characters.
- Files: upload up to 50 MB (photos 10 MB), by URL 20 MB (photos 5 MB); bots download up to 20 MB with `getFile`; a self-hosted Local Bot API Server raises uploads to 2,000 MB. Files already on Telegram can be re-sent by `file_id` with no size limit.
- The maximum number of inline keyboard buttons or rows is not published in the rules data. Check the current Bot API reference instead of guessing.

## Context to collect

1. What the bot does, and for whom (customers, staff, a group).
2. Where it runs and how it is deployed (server, container, serverless).
3. Languages and tone.
4. Data it reads and writes (orders, calendar, CRM); privacy requirements.
5. Expected volume, including peak broadcasts.

## Workflow

### 1. Create the bot

1. Open @BotFather, send `/newbot`, choose a name and a username ending in `bot`.
2. Store the token as a secret. Anyone with the token controls the bot; rotate it with BotFather if it leaks. Never commit it.
3. Set the description, about text, profile picture and commands (`/setcommands`). Decide group behavior (`/setjoingroups`, `/setprivacy`) if the bot will live in groups.

### 2. Webhook or long polling

| Choice | Pick it when |
| --- | --- |
| Long polling (`getUpdates`) | Development, a single always-on process, no public HTTPS endpoint. Simple and works behind NAT. |
| Webhook (`setWebhook`) | Production, serverless, scaling horizontally, lower latency. Needs a public HTTPS URL. Set a `secret_token` and verify `X-Telegram-Bot-Api-Secret-Token`. |

Only one mode at a time: with a webhook set, `getUpdates` does not work. Use `getWebhookInfo` to see errors and pending updates. See `messaging-webhooks` for verification and idempotency; dedupe on `update_id`.

### 3. Design commands and flows

- A small command set: `/start`, `/help`, plus two to five task commands. Keep names short and lowercase. Register them with BotFather so they appear in the menu.
- `/start` should greet in one sentence, say what the bot can do, and show the first action as a button. Accept a deep-link payload (`/start <payload>`) to attribute where the user came from.
- Prefer inline keyboards over typed commands for choices. Buttons carry `callback_data` (up to 64 bytes): use short codes or ids and look the details up server side. Always call `answerCallbackQuery` so the spinner stops.
- State: keep conversation state server side keyed by chat id; make each step idempotent so a repeated tap does nothing harmful.
- Every flow has a way out: `/cancel`, a Back button, a handoff to a person.
- Keep messages short. Edit the previous message when a button changes the view instead of posting a new one each time.

### 4. Send responsibly

- Queue outgoing messages and pace them per chat (about 1 per second) and globally. Broadcasts: rate-limit to the documented ceiling with margin; spread large sends over time.
- On an HTTP 429 response, wait the number of seconds Telegram returns in the error parameters before retrying. Do not retry in a tight loop.
- Handle blocked-bot and deactivated-user errors by marking the user inactive; stop messaging them.
- Validate length before sending: text 4,096, caption 1,024; split long messages at paragraph boundaries.
- Use `file_id` re-sends for repeated media; they are not size limited.

### 5. Deploy

- Run as a service with automatic restart, health check and structured logs without tokens or message bodies by default.
- Secrets from environment or a secret store; separate bots (tokens) for development and production.
- HTTPS with a valid certificate for webhooks; respond 200 quickly; process asynchronously.
- Monitor: error rate, 429 count, queue depth, `getWebhookInfo` last error.
- Plan the handoff: how a person takes over a chat, and how the bot stays quiet while they do.

### 6. Test

Unit-test the command router and keyboard builders; run an end-to-end test with a real test bot and account; test a long message, an oversized file, a repeated button tap, a blocked user and a burst of messages.

## Checklist

- [ ] Token stored as a secret; rotation plan known.
- [ ] Mode chosen (polling or webhook) and consistent in every environment.
- [ ] Webhook secret token set and checked.
- [ ] Commands registered; `/start`, `/help`, `/cancel` work.
- [ ] Callback data under 64 bytes; `answerCallbackQuery` always called.
- [ ] Outgoing queue honors per-chat and global rates; 429 handled.
- [ ] Message and caption lengths validated; file sizes within limits.
- [ ] Blocked users handled; no messaging people who never started the bot.
- [ ] Handoff path and monitoring in place.

## Output template

```
Purpose and audience: <...>
Mode: <polling | webhook> because <...>
Commands: </start ...> with one line each
Flows: <flow -> steps -> end states>
Keyboards: <buttons, callback_data scheme>
Sending policy: <per-chat pace, global pace, 429 handling, broadcast plan>
Deployment: <runtime, secrets, monitoring>
Limits not in the data: <inline keyboard size, ...> verified against <Bot API reference>
```

## Common mistakes

- Trying to message a user from a list of usernames: the bot cannot start the chat.
- Long `callback_data` strings with JSON blobs.
- Not answering callback queries, so buttons look stuck.
- Running both polling and a webhook.
- Broadcasting to everyone at once and hitting 429s that delay all other traffic.
- Posting tokens in logs or a public repository.

## Related

`messaging-webhooks`, `broadcast-compliance`, `dm-reply-writer`, `telegram-channel-growth` (for channels rather than bots).

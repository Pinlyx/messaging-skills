---
name: instagram-dm-automation
description: "Design and review Instagram DM automation that stays inside Meta's rules: the 24-hour window, HUMAN_AGENT, private replies to comments, story replies, quick replies, rate limits and human handoff. Use for 'automate Instagram DMs', 'Instagram chatbot', 'reply to story replies automatically', 'why did my Instagram message fail', or 'is my IG automation allowed'."
metadata:
  version: "0.1.0"
  channels: "instagram"
---

# Instagram DM automation

Instagram is the most restrictive of the big messaging channels: the person must write first, replies have a clock, and most "marketing blast" ideas simply do not exist there. A good automation is built around those limits instead of fighting them. Sourced rules with official URLs: [references/instagram-rules.md](references/instagram-rules.md).

## When to use this skill

- Designing a new Instagram DM bot or auto-reply flow.
- Auditing an existing automation that sends late, sends too much, or gets errors.
- Deciding what an automation may do on story replies, reactions and comments.

For the comment keyword to DM pattern in particular, use `comment-to-dm-funnel`. For the per-message yes/no, use `can-i-message`.

## Rules that shape every design

- The conversation must be initiated by the person. Exception: one private reply to a comment on your post, ads post or reel.
- Standard window: 24 hours from the person's last message, reaction, comment or click-to-message tap. A conversation opened by a Click-to-Direct ad can last up to 7 days.
- After the window, only a person (not an automation) may reply, with the HUMAN_AGENT tag, within 7 days of the person's last message, and not with promotional content. It needs the Human Agent permission via App Review and business verification.
- Apps must offer an escalation path to a human agent. Where the law requires it (for example California or Germany), automated chats must disclose that the person is talking to an automated service.
- Not available on Instagram: one-time notifications, sponsored messages, news messaging. Group messaging is not supported: one customer per conversation.
- Apps with Standard Access can only message people who have a role on the app, so test with team accounts until Advanced Access is granted.
- A private reply goes to the person's Inbox if they follow the account, otherwise to Requests. Conversations in the Requests folder inactive for 30 days are not returned by the API.

Limits (all sourced in the reference file): text must be under 1,000 characters and 1,000 bytes of UTF-8; up to 10 image attachments in one message; quick replies up to 13, 20 characters each, plain text only, not shown on desktop; 300 calls per second per account for text, 10 for audio or video; 750 private replies per hour for posts and reels, 100 per second for Live; Conversations API 2 calls per second.

## Context to collect

1. What jobs should the automation do: FAQ, order status, lead capture, booking, post-purchase, support?
2. Who answers after hours, and who owns a handoff?
3. Which languages do customers write in?
4. Where do conversations come from: organic DMs, story replies, comments, click-to-message ads?
5. Which systems hold the answers (catalog, orders, calendar)? The bot may only state facts it can read there.
6. App status: development mode, Standard Access, Advanced Access, Human Agent permission, business verification?

## Workflow

### 1. Map entry points to rules

| Entry point | What it opens | Design consequence |
| --- | --- | --- |
| Person sends a DM | 24-hour window (restarts on each message) | Reply fast; track the window end per conversation. |
| Story reply | Arrives as an inbound message, so treat it as the person writing first. The rules data does not list story replies separately: confirm on the current Instagram messaging pages. | Use the story as context (the webhook carries the story id), then answer normally. |
| Reaction or tap on a click-to-message ad | Window opens or restarts; ads can allow up to 7 days | Welcome message that offers the next step. |
| Comment | One private reply within 7 days; conversation continues only if the person answers | See `comment-to-dm-funnel`. |

### 2. Design the conversation flow

- Start with what the person asked, not with a menu. Offer quick replies (at most 13, 20 characters each, plain text) for the likely next steps.
- Every flow ends in one of: answered, handed to a human, or scheduled follow-up inside the window.
- Put a visible human option in the first answers ("Type AGENT to talk to a person").
- Keep each message well under the limit; leave room for non-Latin scripts (see the byte rule below).
- Ask for personal data only when needed and never card or password data in chat.

### 3. Handle the clock

- Store `last_inbound_at` per conversation from the webhook (see `messaging-webhooks`).
- Before every automated send, run the check from `can-i-message`. If the window is closed, the automation stops. It may queue a task for a human, who can use HUMAN_AGENT within 7 days if an unresolved issue justifies it.
- Do not schedule "follow-up in 3 days" messages from automation. They are outside the standard window and are not eligible for HUMAN_AGENT.

### 4. Human handoff

- Hand off on: explicit request for a person, anger or complaint, refund or payment dispute, medical, legal or safety topics, repeated failure to understand, anything the knowledge base does not cover.
- On handoff: tell the person in words, mark the conversation, notify an owner with context (last messages, extracted fields), and pause automated replies in that thread until a human releases it.
- Measure handoff quality with `messaging-kpis`.

### 5. Respect the pipes

- Send rate is far below the platform limits for normal traffic; queue anyway and back off on errors.
- Handle the volume caveat: if an account sends and receives more than 72,000 messages, new messages stop showing and sending until volume decreases (no period is stated in the source).
- Deduplicate webhooks by message id; reply only once per inbound.

### 6. Test before launch

Run the agent against `dm-bench` scenarios (hallucination, handoff, platform rules, prompt injection, privacy). See `ai-dm-agent-prompt`. Then test with accounts that have a role on the app.

## Checklist

- [ ] Entry points mapped; each has a rule-compliant first message.
- [ ] Window end tracked per conversation; closed window blocks automation.
- [ ] No promotional content in tagged messages; HUMAN_AGENT only by a person.
- [ ] Escalation to a human available in the first replies; disclosure where required.
- [ ] Messages under 1,000 bytes UTF-8; quick replies within limits.
- [ ] No scheduled follow-ups outside the window.
- [ ] App access level and permissions verified (Standard vs Advanced, Human Agent).
- [ ] Webhooks deduplicated; handoff pauses the bot.
- [ ] dm-bench or equivalent test run recorded.

## Output template

```
Automation summary: <jobs, entry points>
Flow: <entry point> -> <first message> -> <branches> -> <end states: answered | handoff | window expires>
Clock handling: <where last_inbound_at is stored, what happens at T-2h and T+0>
Handoff rules: <triggers, owner, notification, bot pause>
Rule risks: <each risk and the rule behind it>
Open questions: <access level, permissions, languages, data sources>
```

## Common mistakes

- Sending a "we have a sale" DM to people who messaged last week. It is outside the window and promotional.
- Building the bot with the HUMAN_AGENT tag so it can answer late. The tag is for a person.
- Forgetting UTF-8 bytes: Turkish, Cyrillic or Arabic text uses more than one byte per character, so a 600-character reply can exceed 1,000 bytes.
- No pause on handoff: bot and human answer the same message.
- Testing only with accounts that are not on the app, then seeing failures in production (or the reverse under Standard Access).

## Related

`can-i-message`, `comment-to-dm-funnel`, `ai-dm-agent-prompt`, `messaging-webhooks`, `dm-reply-writer`.

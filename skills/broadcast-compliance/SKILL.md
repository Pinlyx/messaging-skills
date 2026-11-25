---
name: broadcast-compliance
description: "Audit a bulk message or campaign plan across WhatsApp, Instagram, Messenger, Telegram and X for opt-in, channel rules, send pacing, frequency and quality risk, and produce a go, fix or stop verdict with a compliant send schedule. Use for 'review my broadcast', 'can I send this campaign to my list', 'WhatsApp marketing campaign check', 'newsletter by DM', 'how fast can I send', or before any mass message."
metadata:
  version: "0.1.0"
  channels: "whatsapp, instagram, messenger, telegram, x"
---

# Broadcast compliance

A broadcast is any message sent to many people at once. Messaging platforms let you do that on some channels with conditions, on others not at all. This skill audits a plan before it is sent. It does not give legal advice: for consent law in your market, ask a lawyer. Sourced channel rules: [references/broadcast-rules.md](references/broadcast-rules.md).

## When to use this skill

- A campaign, announcement, promotion, reminder run or re-engagement list is about to be sent.
- Someone asks "can I message everyone who ...".
- A previous send caused blocks, errors, a quality drop or a restriction.

## Context to collect

1. Message text, purpose and category (promotion, transactional, news, reminder).
2. The audience: how many people, where the list came from, and how each person opted in (when, where, wording, what they agreed to receive).
3. Channel per segment and the person's last inbound time on that channel.
4. Planned volume, timing, frequency and who else messages the same people.
5. What happens on replies and opt-outs: who answers, how fast, how opt-out is honored.

## Workflow

### 1. Evidence of opt-in

For each segment, name the opt-in source and what it covered. Mark it:

- **Solid:** the person explicitly agreed to this kind of message on this channel, and you can show it.
- **Partial:** they are a customer or wrote to you, but did not agree to promotions.
- **None:** purchased lists, scraped contacts, contacts from another channel.

No opt-in means no broadcast on WhatsApp (opt-in is required), Messenger marketing messages (the person must accept a request) and any other proactive send. See `can-i-message`.

### 2. Channel by channel

| Channel | What a broadcast can be |
| --- | --- |
| WhatsApp | Approved template to opted-in people; marketing category for promotions. Outside a window each new recipient counts toward the portfolio limit (250 unique recipients per 24 hours for new portfolios, then 2,000, 10,000, 100,000, unlimited). Inside a window, free-form replies are allowed but a campaign is not a reply. |
| Instagram | The rules data describes no broadcast mechanism. Only replies inside the 24-hour window, one private reply to a comment, or a person using HUMAN_AGENT for an unresolved issue. Instagram marketing messages are not covered by the data: check the current official pages before planning one, and do not plan a list promotion as a DM blast. |
| Messenger | Marketing messages to people who accepted a request, utility templates for transactions, sponsored messages as paid ads to existing conversations. Message tags cannot carry promotions; three tags were retired on 2026-04-27. |
| Telegram | Only to users who started the bot. About 30 messages per second overall, 1 per second per chat, 20 per minute per group. Paid broadcasts can reach 1,000 per second. |
| X | DM delivery depends on each recipient's DM settings and blocks. 15 sends per 15 minutes and 1,440 per 24 hours per user. Delivery to people who restrict DMs from unknown senders will fail, so a mass cold DM list will have unpredictable delivery. |

### 3. Pace the send

Compute the time before you press send.

- Telegram: users divided by 30 gives seconds at the overall ceiling; also keep each chat to about one message per second. For 90,000 users at 30 per second that is 3,000 seconds. Leave margin below the ceiling.
- WhatsApp: days needed outside windows is unique recipients divided by the current tier. A list of 2,000 with a 250 limit takes at least 8 days if every recipient is outside a window.
- X: at 15 per 15 minutes, 1,440 per 24 hours is the daily ceiling, and 96 intervals of 15 minutes allow 1,440 sends at the interval cap.
- Add jitter, queue retries with back-off, and stop on repeated rate-limit errors instead of hammering.

### 4. Frequency and quality

The rules data publishes no frequency cap and no quality rating thresholds. Do not invent them. Use the principles below, then read the live quality indicators in each platform's business tools (for WhatsApp, the quality rating and messaging tier in WhatsApp Manager):

- Send the least frequent cadence that serves the purpose. Start with the most engaged segment and watch blocks, reports and replies before widening.
- One message per person per campaign. No automatic reminders to non-responders unless the person agreed to a series.
- Relevance beats reach: segment by what the person bought, asked or agreed to.
- Honor opt-out immediately and visibly (a stop keyword or button), on the same channel.
- Stop and investigate when block or report signals rise or delivery errors spike.

### 5. Content review

- Matches what the person agreed to receive.
- Identifies the business; accurate claims; no false urgency.
- No promotional content in tagged messages, utility templates or authentication templates.
- Links go to the business's own domain.
- Message fits channel limits (use `validate_message` from the messaging-rules MCP server).

### 6. Verdict

- **GO:** solid opt-in, allowed message kind per channel, paced plan, opt-out path, monitoring.
- **FIX:** one or more issues with a clear remedy (wrong category, no opt-out, too fast, partial opt-in segment excluded).
- **STOP:** no opt-in, the channel offers no allowed way to broadcast (Instagram, per the rules data), or content breaks the tag/template rules.

## Checklist

- [ ] Opt-in evidence per segment, for this kind of message and this channel.
- [ ] Message kind allowed by the channel (template, marketing message, sponsored, bot reply).
- [ ] Per-channel ceilings respected; send duration computed.
- [ ] Opt-out honored and tested.
- [ ] Monitoring plan: errors, blocks, replies, quality indicators, owner on call.
- [ ] Replies will be answered within the window.
- [ ] Not legal advice: local rules checked by the right person.

## Output template

```
Verdict: GO | FIX | STOP
Audience: <size, source, opt-in quality per segment>
Channel plan: <segment -> channel -> message kind>
Pacing: <math and resulting duration>
Findings: <numbered, each with rule and fix>
Excluded: <people left out and why>
Monitoring and stop conditions: <metrics, thresholds you chose, owner>
Not covered by the data: <items with no published number>
```

## Common mistakes

- Treating "customer" as consent to promotions.
- Importing a list that opted in on one channel and sending on another.
- Sending marketing through a utility template or a message tag.
- Planning an Instagram "broadcast" that the rules data does not support.
- Ignoring that replies to the campaign arrive in a wave and need staff.
- No opt-out, or opt-out processed days later.

## Related

`can-i-message`, `whatsapp-template-writer`, `messaging-kpis`, `local-lead-list` (cold outreach).

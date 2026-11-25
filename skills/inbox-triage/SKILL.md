---
name: inbox-triage
description: "Triage a multi-channel inbox (WhatsApp, Instagram, Messenger, Telegram, X, email, live chat): classify each conversation as urgent, sales, support, spam or other, set a priority and a reply-by time that respects messaging windows and your SLA, and decide who should own it. Use for 'prioritize my inbox', 'what should I answer first', 'triage these conversations', 'set up SLAs for DMs', or 'route messages to the right person'."
metadata:
  version: "0.1.0"
  channels: "whatsapp, instagram, messenger, telegram, x"
---

# Inbox triage

When messages from many channels land in one place, the order you answer them in decides revenue, refunds and reputation. Triage is a repeatable rule set: classify, prioritize, set a deadline, assign. Rubric details: [references/triage-rubric.md](references/triage-rubric.md).

## When to use this skill

- Sorting a batch of conversations (pasted, exported or listed from an inbox tool).
- Designing the permanent triage rules and SLAs for a team.
- Training a classifier or an AI assistant to label conversations.

## Context to collect

1. The conversations, each with channel, customer, last inbound time, last few messages, and any customer record (past orders, value, open tickets).
2. Team: roles, hours, languages, who handles sales, support, billing.
3. Existing SLA targets, if any.
4. What counts as urgent for this business (outage, safety, failed payment, VIP customer, public complaint).

## Workflow

### 1. Classify

| Class | Signals |
| --- | --- |
| Urgent | Safety, medical, legal; payment failed or double charged; service down; order issue due today; threat of chargeback or public complaint; VIP or key account; explicit "urgent" with a real deadline |
| Sales | Price, quote, availability for purchase, booking request, "do you ship to", comparison with a competitor, request for a demo or a call |
| Support | Order status, how-to, delivery, returns, account help, product problem |
| Spam | Unrelated promotions, link-only messages from unknown senders, repeated identical messages, phishing patterns |
| Other | Feedback, partnership, press, job inquiry, wrong number |

A conversation can have a primary class and a secondary one. Urgent overrides the others.

### 2. Score priority

Use a small, explainable score: start at the class base (Urgent high, Sales medium-high, Support medium, Other low, Spam none), then adjust.

- Raise for: purchase intent with a stated timeline, customer value, repeat customer, negative sentiment, an unanswered earlier message, a public channel (comment, mention), a closing messaging window.
- Lower for: a question answered by a standard macro, a customer who said "no rush", an automated notification.

Keep scores to three or four levels (P1 to P4). A long numeric scale invites false precision.

### 3. Set the reply-by time

The deadline is the earlier of the SLA target and the moment replying becomes harder.

- WhatsApp, Instagram, Messenger: free-form replies need an open window (24 hours from the person's last message; up to 7 days after a click-to-message ad on Instagram and Messenger). Compute window end and treat the last hours as a priority bump. After the window, WhatsApp needs a template; Instagram and Messenger need a person with HUMAN_AGENT (up to 7 days) or another allowed kind. Use `can-i-message`.
- Messenger bots must respond to user input within 30 seconds (Get Started excluded), per the platform policy; an automation that cannot should hand off or acknowledge.
- Telegram and X have no window; use only the SLA.
- Business hours: say whether the SLA clock runs in calendar time or business hours, and state the time zone.

SLA targets are yours to choose; the rules data publishes none. A reasonable starting structure, to tune with `messaging-kpis` data: first response for P1 in minutes, P2 within hours, P3 within the same business day, P4 within two business days. Write the numbers you choose into the output; do not present them as industry standards.

### 4. Assign

- Urgent: on-call owner or duty manager, plus a notification outside the inbox.
- Sales: the sales owner of that customer or region; lead gets a stage and next step.
- Support: the queue by topic and language.
- Billing and refunds: finance or a person with authority; the AI assistant must hand off.
- Spam: mark, block where appropriate, never auto-delete without a review sample.
- Include language and channel skills in the routing: do not give a Telegram thread to someone who cannot read it.

### 5. Output the work list

Sort by reply-by time, then priority. Show only what the person needs to act: who, what, by when, suggested first reply or macro.

## Checklist

- [ ] Every conversation has a class, priority, owner and reply-by time.
- [ ] Window end calculated for channels with windows; closing windows flagged.
- [ ] SLA numbers stated as your choice, in business or calendar time with zone.
- [ ] Urgent items surfaced first and notified.
- [ ] Spam sampled before auto-deletion.
- [ ] Handoff conditions respected (see `dm-reply-writer`).
- [ ] Triage rules versioned and reviewed against missed cases weekly.

## Output template

```
| # | Channel | Customer | Class | Priority | Reply by | Window ends | Owner | Why | Suggested action |
```

Followed by:

```
Escalations: <items needing immediate human attention>
Window risks: <conversations about to close or already closed, and what is allowed>
Rules changed or questioned: <cases where the rubric did not fit>
```

## Common mistakes

- Sorting by arrival time only.
- Forgetting that the window clock restarts on the customer's message, not yours.
- Treating all unanswered chats as equal; a closing WhatsApp window with a purchase intent comes first.
- Auto-closing conversations as spam without a human sampling the filter.
- Setting SLAs the team cannot meet and then ignoring the metric.
- Assigning by channel instead of by skill and language.

## Related

`can-i-message`, `support-macros`, `messaging-kpis`, `dm-reply-writer`, `messaging-webhooks` (to store the last inbound time).

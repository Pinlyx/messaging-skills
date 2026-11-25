---
name: messaging-kpis
description: "Define, compute and report customer messaging KPIs: first response time, resolution rate and time, handoff and containment rate, window-miss rate, CSAT and conversation to conversion, with exact formulas, data requirements and a weekly report template. Use for 'which metrics should we track for DMs', 'calculate first response time', 'weekly messaging report', 'how is our AI agent performing', or 'what is a good response time'."
metadata:
  version: "0.1.0"
  channels: "whatsapp, instagram, messenger, telegram, x"
---

# Messaging KPIs

Teams often track "response time" without saying what starts the clock, who counts as a responder, or whether nights count. The numbers then cannot be compared week to week. This skill fixes the definitions first, then the formulas, then the report. Definitions and SQL sketches: [references/kpi-definitions.md](references/kpi-definitions.md).

## When to use this skill

- Setting up measurement for a messaging team or an AI agent.
- Producing a weekly or monthly report.
- Explaining why two reports show different response times.

## Context to collect

1. What data exists: conversation and message tables, timestamps with time zones, sender type (customer, bot, human agent), channel, status, assignee, tags, order or lead links.
2. Business hours and holidays; the time zone for reporting.
3. How conversations are defined (a thread per customer per channel? a ticket that closes?).
4. Who counts as a human response (an agent reply, not an auto-acknowledgement).
5. The decisions the report should support (staffing, bot quality, channel mix, campaigns).

## Workflow

### 1. Fix the vocabulary

- **Conversation:** one customer thread that opens with a customer message and closes after a defined silence or by an agent. State the rule (for example a new conversation after N days of silence) and keep it.
- **First response:** the first message from a human agent, or from the bot if you are measuring bot response; report them separately.
- **Business hours:** decide whether clocks count calendar time or business time. Report both for the headline metric if staffing is limited to hours.

### 2. Core KPIs

| KPI | Definition | Report as |
| --- | --- | --- |
| First response time (FRT) | Time from the customer's first unanswered message to the first human reply | Median and 90th percentile, per channel, in business hours and calendar hours |
| Bot first response | Same, for the first bot reply | Median and 90th percentile |
| Resolution rate | Conversations resolved divided by conversations opened in the period | Percent; define "resolved" (agent closed and customer did not return within a set time) |
| Time to resolution | Open to resolved | Median and 90th percentile |
| Reopen rate | Resolved conversations that got a new customer message within a set time, divided by resolved | Percent |
| Handoff rate | Conversations where an AI agent handed off to a person divided by conversations the AI handled | Percent, by reason |
| Containment rate | Conversations the AI resolved without a human divided by conversations the AI handled | Percent; pair it with CSAT and reopen rate |
| Window-miss rate | Conversations on windowed channels (WhatsApp, Instagram, Messenger) where the first human reply arrived after the 24-hour window closed, divided by conversations | Percent, per channel |
| CSAT | Average rating or share of positive ratings among those who answered | Score with response count |
| Backlog age | Age of oldest open conversation, count older than the SLA | Number and distribution |
| Conversion | Conversations that led to a lead, booking or order divided by conversations, attributed per channel | Percent and value |
| Opt-out rate | Opt-outs divided by campaign messages delivered | Percent, per campaign |
| Template outcomes (WhatsApp) | Delivered, read and replied divided by sent, per template | Percent per template |

Use medians and a high percentile for time metrics. Averages hide long waits. Always show the count behind a percentage; five conversations is not a trend.

### 3. Handle the awkward cases

- Customer messages again before the first reply: the clock keeps the original start.
- Messages outside business hours: calendar time includes the night; business-hours time starts at the next opening.
- Auto-acknowledgements ("we received your message") do not count as a human first response.
- Duplicate customers across channels: decide whether to merge identities for conversion and say so.
- Bots that reply instantly make an all-in FRT look excellent; always split bot and human.

### 4. Weekly report

Keep it to one page. Use the template below; put the decision-relevant numbers first, then the notable conversations and next actions. Compare with the previous week and the four-week median. Say when the data is incomplete.

### 5. Targets

The platforms do not publish response time targets in the rules data, and this repository does not claim any industry benchmark. Set targets from your own baseline: measure for four weeks, then pick a realistic improvement per KPI, document it and review it each quarter. Window-miss rate is the exception: the sensible target is zero, because a missed window removes the free reply.

## Checklist

- [ ] Definitions written down and versioned.
- [ ] Timestamps in one time zone; business hours calendar defined.
- [ ] Bot and human responses measured separately.
- [ ] Medians and percentiles, with counts.
- [ ] Window-miss rate tracked for windowed channels.
- [ ] Containment read together with reopen rate and CSAT.
- [ ] Targets derived from your own baseline.
- [ ] Report lists data gaps.

## Output template

```
Week: <date range, time zone>   Data completeness: <note>
Headline: FRT human median/p90 <..>, resolution rate <..>, window-miss <..>, CSAT <..> (n=<..>)
By channel: <table>
AI agent: handled <n>, handoff rate <..> (top reasons), containment <..>, reopen <..>
Conversion: conversations -> leads/orders <..>, value <..>
Changes vs last week: <what moved and the likely cause>
Risks: <backlog, staffing, quality>
Actions: <owner, due date>
```

## Common mistakes

- Averages instead of medians and percentiles.
- Mixing bot and human first responses.
- Counting auto-acknowledgements as responses.
- High containment with low CSAT celebrated as success.
- Changing the definition mid-quarter and comparing across the change.
- Quoting someone else's benchmark as a target.

## Related

`inbox-triage`, `ai-dm-agent-prompt`, `broadcast-compliance`, `support-macros`.

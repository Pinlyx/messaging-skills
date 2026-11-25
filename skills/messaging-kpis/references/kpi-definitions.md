# KPI definitions and SQL sketches

Table assumptions (rename to fit your schema):

- `conversations(id, channel, customer_id, opened_at, resolved_at, status)`
- `messages(id, conversation_id, sender_type, sent_at, is_auto_ack)` where `sender_type` is `customer`, `bot` or `agent`

All timestamps in UTC; convert to the reporting time zone at the end.

## First human response time

```sql
-- seconds from the first customer message to the first agent message
SELECT c.id,
       c.channel,
       EXTRACT(EPOCH FROM (
         MIN(m.sent_at) FILTER (WHERE m.sender_type = 'agent' AND NOT m.is_auto_ack)
         - MIN(m.sent_at) FILTER (WHERE m.sender_type = 'customer')
       )) AS frt_seconds
FROM conversations c
JOIN messages m ON m.conversation_id = c.id
WHERE c.opened_at >= :from AND c.opened_at < :to
GROUP BY c.id, c.channel;
```

Report `percentile_cont(0.5)` and `percentile_cont(0.9)` over `frt_seconds` per channel. Conversations with no agent reply are counted as unanswered and reported separately, not dropped.

For business-hours FRT, subtract closed hours between start and end using a business calendar table or a function; test it on cases that span a night, a weekend and a holiday.

## Window-miss rate

```sql
-- WhatsApp, Instagram, Messenger: first human reply after the customer's 24 hour window ended
SELECT c.channel,
       COUNT(*) FILTER (WHERE frt_seconds > 24 * 3600) * 1.0 / COUNT(*) AS window_miss_rate
FROM first_response c  -- the query above, wrapped as a CTE named first_response
WHERE c.channel IN ('whatsapp', 'instagram', 'messenger')
GROUP BY c.channel;
```

For Instagram and Messenger conversations opened by a click-to-message ad, the standard window can last up to 7 days; split those out. A reply after the window is not a reply the customer got for free-form text: it needs a template (WhatsApp) or a person using HUMAN_AGENT (Instagram, Messenger).

## Resolution rate

`resolved conversations in period / conversations opened in period`. Define resolved as `status = 'resolved'` and no new customer message within `:reopen_days`. Pick `:reopen_days` once and keep it.

## Reopen rate

`conversations resolved whose next customer message arrived within :reopen_days / conversations resolved`.

## Handoff and containment (AI agent)

- Handoff rate = conversations with a handoff event / conversations where the AI sent at least one message.
- Containment rate = conversations resolved with no human message / conversations where the AI sent at least one message.
- Always show reopen rate and CSAT beside containment: a bot that closes conversations nobody was helped in has high containment and bad outcomes.

## Conversion

`conversations linked to a lead, booking or order within :attribution_days / conversations`, with the link method stated (customer id match, tracked link, manual tag). Attribute to the channel of the first conversation, and say if multiple channels are merged.

## WhatsApp template outcomes

Per template: sent, delivered, read, replied. Rates are over sent for delivery and over delivered for read and reply. Use the status events from the webhooks (see `messaging-webhooks`).

## Sample size rules of thumb

Show `n` beside every percentage. Treat changes on fewer than about 30 conversations as anecdotes. For per-agent comparisons, look at distributions and conversation mix before judging a person.

## What this file does not contain

- Industry benchmarks or target numbers. No platform or rules source publishes them. Use your own baseline.

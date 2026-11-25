---
name: comment-to-dm-funnel
description: "Design a comment keyword to DM funnel for Instagram and Facebook: the post call to action, keyword matching, the public reply, the single allowed private reply, follow-up inside the window, copy templates and measurement. Use for 'comment GUIDE and get the link', 'comment to DM automation', 'send a DM when someone comments', 'private reply rules', or 'how do I measure a comment funnel'."
metadata:
  version: "0.1.0"
  channels: "instagram, messenger"
---

# Comment to DM funnel

A person comments a keyword on a post or reel, the account answers in public, then sends one private message with what the person asked for. It works because the person raised their hand. It breaks when it ignores the private reply rule: **one message, and the conversation continues only if the person answers.** Sourced rules: [references/private-reply-rules.md](references/private-reply-rules.md).

## When to use this skill

- Building or auditing a "comment X to get Y" campaign on Instagram or a Facebook Page.
- A funnel sends the link but nobody continues the chat, or messages fail after the first.
- Planning the measurement of a comment funnel.

## Rules that decide the design

- A private reply may be sent within 7 days of the comment. For Instagram Live comments, only during the broadcast.
- Only one message can be sent to the person who commented. The conversation can continue only when the person responds, and then the normal 24-hour window applies.
- Private replies land in the person's Inbox if they follow the account, otherwise in Requests (Instagram). Non-followers may therefore see it later or never.
- Limits: 750 private replies per hour per Instagram account for posts and reels, 100 per second for Live. A private reply cannot be sent to another Facebook Page.
- Messages follow the usual size limits: under 1,000 characters and 1,000 UTF-8 bytes on Instagram, 2,000 characters on Messenger.
- A comment is not an opt-in to marketing. Send what the person asked for, and only that, until they say more.

## Context to collect

1. What is offered (guide, price list, discount code, booking link, product details)?
2. Where does the post run (Instagram feed, reel, Live, Facebook post) and how long will it stay active?
3. The keyword(s) and how people actually spell them (languages, accents, plurals, emoji).
4. Where the person goes after the DM (page, calendar, shop, human chat)?
5. Who handles replies and in what hours?

## Workflow

### 1. Write the post call to action

- One keyword, short, easy to type on a phone, no accents if the audience mistypes them (`GUIDE`, `PRICE`, `DEMO`).
- State the exact reward: "Comment GUIDE and I will send the checklist." Do not promise things the single message cannot deliver.
- Tell people they may need to follow the account or check their message requests, if that applies.

### 2. Match the comment

- Normalize before matching: lowercase, strip accents and punctuation, trim, handle repeated letters and a leading emoji.
- Accept a short list of synonyms; reject long comments that merely contain the word inside a different sentence if that is not intended.
- Ignore the account's own comments and comments already answered. One private reply per comment, and avoid sending the same person several private replies in a short time.

### 3. Public reply

- Reply under the comment so others see it works, but vary the wording across a small set of 5 to 8 variants. Identical replies at volume look like spam.
- Say where to look: "Sent you a message, check your inbox or requests."

### 4. The private reply (your only message)

It must be useful on its own, because there may be no second message. Pick one of these structures:

- **Deliver:** the link or answer immediately, one line of context, one line inviting a reply ("Reply with your city if you want the local list").
- **Ask one question:** only when you cannot deliver without it, and the question is easy to answer with a tap or one word. Accept that a share of people will not reply.

Template (adapt, keep under the byte limit):

```
Hi {first_name}! Here is the {asset}: {link}
Want me to tailor it? Reply with {one easy question}.
```

Never include promotions unrelated to the request, urgency tricks or several links.

### 5. After the person replies

The person's reply opens the standard 24-hour window. Now normal replies are allowed: answer, qualify with at most two questions, offer the next step, hand off to a human when needed. See `instagram-dm-automation` and `dm-reply-writer`.

### 6. Measure

| Metric | Definition |
| --- | --- |
| Trigger rate | comments with the keyword divided by post reach or views |
| Private reply coverage | private replies sent divided by matching comments |
| Delivery or open signal | what the API returns for the send (errors included) |
| Continuation rate | people who answered the private reply divided by private replies sent |
| Click rate | link clicks (use a tagged link) divided by private replies sent |
| Outcome rate | purchases, bookings or leads divided by private replies sent |
| Handoff rate | conversations that needed a human divided by continued conversations |

Compute each per post and per variant; compare variants of the call to action and the first message. Do not quote benchmark rates you did not measure. Keep failure counts by error type: window passed, rate limit, person blocked, permission missing.

## Checklist

- [ ] Private reply is a single, self-sufficient message.
- [ ] Sent within 7 days (or during the Live broadcast).
- [ ] Rate under 750 per hour per Instagram account for posts and reels.
- [ ] Public replies rotate across variants.
- [ ] Keyword matching tested with typos, accents and non-Latin scripts.
- [ ] Link is tagged so clicks can be counted.
- [ ] A human owner and hours exist for people who continue.
- [ ] Failures logged by cause.

## Output template

```
Offer / keyword(s): <...>
Post CTA text: <...>
Matching rules: <normalization, synonyms, ignores>
Public reply variants: <5 to 8>
Private reply (single message): <text, under byte limit>
If they answer: <next 2 messages and handoff trigger>
Metrics and tracking: <tagged link, table above>
Risks: <rule risks>
```

## Common mistakes

- Sending a three-message sequence after a comment. Only the first message is allowed.
- A private reply that only says "Check your DMs" with nothing in it.
- Not escaping the time limit: a batch job that answers comments a week later.
- Using the comment as consent for newsletters or future promotions.
- Skipping errors: people with private accounts, restricted settings or blocked accounts will fail, so log and move on.

## Related

`instagram-dm-automation`, `can-i-message`, `dm-reply-writer`, `messaging-kpis`.

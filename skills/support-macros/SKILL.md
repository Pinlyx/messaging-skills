---
name: support-macros
description: "Build a multilingual library of ready-made replies (macros) for customer messaging that fits each channel's character limits, uses safe variables, and has clear handoff rules, then validate every macro with validateMessage. Use for 'create canned responses', 'support macro library', 'translate my replies', 'saved replies for WhatsApp and Instagram', 'will this fit the character limit', or 'standardize our answers'."
metadata:
  version: "0.1.0"
  channels: "whatsapp, instagram, messenger, telegram, x"
---

# Support macros

A macro is a reviewed answer to a recurring question. A good library makes replies fast and consistent without sounding robotic, and it never states something that is not true today. Channel limits with sources: [references/macro-format-and-limits.md](references/macro-format-and-limits.md).

## When to use this skill

- Setting up saved replies for a team or as the answer source of an AI agent.
- Adding a language to an existing library.
- Checking that a set of macros fits each channel before they are loaded into an inbox.

## Context to collect

1. The top recurring questions (export the last 30 to 90 days of conversations and cluster by intent).
2. Channels in use, and which macros are needed on which.
3. Languages, with a native reviewer for each.
4. The facts each macro depends on (prices, hours, policies) and who owns them.
5. Voice and style rules: tone, emoji policy, how to address the customer.

## Workflow

### 1. Choose the macros

List intents by frequency and by risk. Start with about 15 to 25: greeting and hours, pricing or quotes, availability, order status, delivery, returns, payment, booking and rescheduling, how-to, complaint acknowledgement, handoff to a person, after-hours message, closing and feedback request, "I will check and come back". Mark the risky ones (refunds, medical, legal, account access) as handoff macros that promise nothing.

### 2. Write each macro in a fixed format

Use the format in the reference file: `id`, `intent`, `language`, per-channel `text`, `variables`, `facts_owner`, `handoff` (yes or no), `last_reviewed`. One macro per intent and language.

Writing rules:

- Answer first, then one next step.
- Name the variables with their source, for example `{first_name}` from the contact record, `{order_id}` from the order system. A macro with a variable that may be empty needs a fallback ("Hi there" instead of "Hi ,").
- Never hard-code facts that change (prices, dates, stock) in the text; put them in variables sourced from a system, or keep the macro generic ("I will confirm the price").
- Short sentences, no jargon, no internal codes.
- No markdown tables or headings on DM channels; plain text with line breaks.
- Do not put promotional content inside macros that will be sent outside a window or under a tag.

### 3. Fit the channels

Check every macro against the limits for the channels it will be sent on. If the macros are served through the `messaging-rules` MCP server, call `validate_message`; in code use `validateMessage(channel, { text })`. By hand, use the table in the reference file. Pay attention to:

- Instagram: under 1,000 characters and 1,000 UTF-8 bytes. For Turkish, Russian, Arabic or Greek text the byte limit is reached near 500 characters; for Chinese, Japanese and Korean near 330.
- Messenger: 2,000 characters. WhatsApp: 4,096. Telegram: 4,096 (captions 1,024).
- Quick replies and buttons: labels of 20 characters on WhatsApp reply buttons, Instagram and Messenger quick replies; check each language, because translations are often longer than English.
- X has no documented maximum text length in the current reference; keep DMs short and say so if the limit matters.

When a translation does not fit, rewrite shorter rather than cutting words off.

### 4. Translate natively

- Write each language from the intent, not by translating English sentence by sentence. A native reviewer approves the final text.
- Keep brand, product and plan names unchanged; localize greetings, politeness level, date and number formats, currency and units.
- Keep placeholders identical across languages and check that grammar around them still works (gender, plural and case endings may change the sentence).
- Record the reviewer and date.

### 5. Govern the library

- Each macro has an owner and a review date; stale facts are the main failure.
- Use a change log; retire macros instead of silently editing them when a policy changes.
- Review usage: macros rarely used are removed, macros edited by hand in most uses need rewriting.
- If an AI agent reads the library, the macro text becomes its source of truth: see `ai-dm-agent-prompt`.

## Checklist

- [ ] Each macro has an intent, owner, language and review date.
- [ ] Variables named with source and fallback.
- [ ] No volatile facts hard-coded.
- [ ] Validated against each channel's limits, including UTF-8 bytes for Instagram.
- [ ] Buttons and quick replies within limits in every language.
- [ ] Native review recorded for each language.
- [ ] Handoff macros promise no outcome.
- [ ] Not promotional where promotions are not allowed.

## Output template

```
id: order_status_en
intent: order status
language: en
variables: first_name (contact), order_id (order system), status (order system), eta (order system, optional)
facts_owner: operations
handoff: no
text.default: Hi {first_name}, order {order_id} is {status}.{eta_sentence} Anything else I can check?
text.x: Order {order_id}: {status}.
validated: whatsapp ok | instagram ok (412 bytes) | messenger ok | telegram ok
last_reviewed: <date> by <name>
```

## Common mistakes

- Macros that quote prices.
- Copying the same long macro to every channel.
- Counting characters instead of bytes for Instagram in non-Latin scripts.
- Machine translation shipped without a native read.
- Pasting a macro unedited into an angry conversation.
- Variables with no fallback producing "Hi ,".

## Related

`dm-reply-writer`, `ai-dm-agent-prompt`, `inbox-triage`, `whatsapp-template-writer`.

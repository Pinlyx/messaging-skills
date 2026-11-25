---
name: whatsapp-template-writer
description: "Write WhatsApp Business message templates that pass Meta review: choose marketing, utility or authentication, write the body, variables and example values, pick buttons, and avoid the usual rejection reasons. Use for 'write a WhatsApp template', 'why was my template rejected', 'is this utility or marketing', 'order update / appointment reminder / OTP template', or 'I need to message a customer after 24 hours on WhatsApp'."
metadata:
  version: "0.1.0"
  channels: "whatsapp"
---

# WhatsApp template writer

A template is the only kind of message a business can send on WhatsApp outside the 24-hour customer service window. Meta reviews every template and assigns it a category. A template that is vague, mislabelled or mixed gets rejected or recategorized, so most of the work is deciding what the message is for before writing a single word.

## When to use this skill

- The person needs a business-initiated WhatsApp message (reminder, order update, re-engagement, code, announcement).
- A free-form reply is no longer possible because the customer service window closed.
- An existing template was rejected, paused or recategorized and the person wants to know why and how to fix it.

If the customer wrote or called in the last 24 hours, you do not need a template: a normal reply is allowed. Check with the `can-i-message` skill first.

## Facts you can rely on

These come from the source-cited rules in `messaging-rules`. Full list with URLs and quotes: [references/whatsapp-rules.md](references/whatsapp-rules.md).

- Template messages are the only message type allowed outside a customer service window, and only to people who opted in.
- Every template is one of three categories: marketing, utility, authentication.
- Templates with mixed content (for example an order update with a promo) or unclear content are categorized as marketing.
- Template names: at most 512 characters, lowercase letters, digits and underscores.
- At most 100 templates can be created per messaging account per hour.
- Outside a window, each new recipient counts toward the portfolio messaging limit (new portfolios start at 250 unique recipients per moving 24 hours; later tiers 2,000, 10,000, 100,000, unlimited).

Numbers that are not in that file (header, body, footer and button text lengths, number of buttons on a template, variable count) have no source in `messaging-rules`. Do not quote them from memory. Tell the person: "No published number in our rules data; the WhatsApp Manager editor shows the live limit and validates it on save."

## Context to collect first

Ask only for what is missing:

1. What event triggers the message (order shipped, appointment tomorrow, cart left, new collection, code requested)?
2. Did the recipient act or ask for it, or is it the business's initiative? This decides the category.
3. How did the person opt in, and where is the evidence stored? No evidence means no template.
4. Which languages? A template is approved per language, so each language is its own submission.
5. What data exists at send time (name, order id, date, tracking link)? Only use variables you can actually fill.
6. Is there a desired action (open a link, call, reply with a button)?

## Workflow

### 1. Choose the category

Use the first question that matches, in this order.

| Question | Category |
| --- | --- |
| Is the only purpose to verify identity, for example a one-time code? | authentication |
| Does it follow up on something this person did or requested (order, booking, payment, ticket) and contain nothing promotional? | utility |
| Anything else: awareness, sales, discount, retargeting, new arrival, survey with promotion, or you are unsure | marketing |

Mixed content is marketing. If the person wants a shipping update plus "check our new collection", split it into two messages: a clean utility template, and a separate marketing template for people who opted in to marketing. Never smuggle a promo line into a utility template to save a send.

### 2. Write the body

- One purpose per template. The first words should tell the reader why they are getting it.
- Name the business or the transaction early so the message is recognizable.
- Short sentences, plain language, the tone of the customer's language. No ALL CAPS, no pressure phrases, no emoji clusters.
- Fixed text must carry the meaning; variables only carry data. A body that is mostly variables reads like a template abuse and is a frequent rejection reason.
- Include an opt-out path in marketing templates when your policy requires it (a quick reply button such as "Stop messages" is the usual way).
- Do not ask for passwords, card numbers, national ids or other sensitive data inside a template.

### 3. Variables and example values

- Variables are written as numbered placeholders such as `{{1}}` and `{{2}}`, in order, with no gaps. Named placeholders also exist; use whichever your sending API expects and keep it consistent.
- Every variable needs a realistic example value at submission time. "test", "xxx" and "sample" are common rejection triggers; use values that look like production data ("Maria", "ORD-48213", "Thursday 14:30").
- At send time a variable value must be plain text for one slot: no line breaks forced into a one-line slot, no values that contain a second promotion or a link you did not declare.
- Count the variables you can really fill. If a field is sometimes empty, make two templates or restructure.

### 4. Buttons

Choose the least number of buttons that serve the one action.

| Need | Button type |
| --- | --- |
| Open the order, booking or product page | URL button (use your own domain; a link shortener hides the destination and is a classic rejection reason) |
| Let the person call | Phone number button |
| Let the person answer without typing, or opt out | Quick reply |
| Authentication code | Copy code / one-tap style button defined for authentication templates |

Button counts and label lengths for templates are not in `messaging-rules`; follow the WhatsApp Manager editor. For interactive (non-template) messages inside an open window, the sourced limits are 3 reply buttons of at most 20 characters each, and list messages with up to 10 rows.

### 5. Name, language, review

- Name: lowercase, digits, underscores, descriptive (`order_shipped_tracking`, `appointment_reminder_24h`). Do not put a date or a campaign id in a name you will reuse.
- Submit one template per language. Do not machine-translate a rejected English template and resubmit blindly; fix the cause first.
- Keep a record of the submitted text, category, languages and the approval date.

### 6. If it is rejected, paused or recategorized

The reason is shown next to the template in WhatsApp Manager. Match it against [references/rejection-checklist.md](references/rejection-checklist.md), fix one thing at a time, and resubmit. If Meta recategorized a utility template to marketing, assume it saw promotional or unclear content: remove it, or accept the marketing category and make sure every recipient opted in to marketing.

## Checklist before submitting

- [ ] A template is actually needed (window is closed or the message is business-initiated).
- [ ] Opt-in exists and is recorded for this kind of message.
- [ ] Category chosen with the table above; no promotional text in utility or authentication.
- [ ] Body has one purpose and enough fixed text around each variable.
- [ ] Every variable has a realistic example value.
- [ ] Buttons match the single desired action; links point to your own domain.
- [ ] Name is lowercase letters, digits and underscores, under 512 characters.
- [ ] Opt-out path present where the message is marketing.
- [ ] One submission per language, each written natively.
- [ ] Draft length checked with `validate_message` from the messaging-rules MCP server, or against the Manager editor.

## Output template

```
Template name: <snake_case_name>
Language: <code>
Category: <marketing | utility | authentication>   Why: <one sentence>
Trigger: <event>   Opt-in basis: <where recorded>

Body:
<text with {{1}} {{2}} placeholders>

Variables and example values:
{{1}} = <what it is> | example: <realistic value>
{{2}} = ...

Buttons: <type and label, or none>
Risks: <rejection risks and what was done about each>
Do not add: <things that would change the category>
```

## Common mistakes

- Treating "a customer who bought once" as opted in to promotions. Opt-in is per type of message.
- A utility template that ends with "and 10% off your next order". That is a marketing template.
- Reusing one template for many purposes by swapping variables. The category is judged on the whole message.
- Example values like "test" or a single letter.
- Link shorteners and links to a domain that does not match the business.
- Sending marketing to a list larger than the portfolio messaging limit in one day, then wondering why sends fail. See the `broadcast-compliance` skill for pacing.
- Assuming approval is permanent. Templates can be paused or recategorized later; monitor status.

## Related

- `can-i-message` to decide whether a template is needed at all.
- `broadcast-compliance` before sending a template to a list.
- `support-macros` for reusable free-form replies inside the window.
- `messaging-rules` (npm) exposes the same rules as an MCP server: `npx -y -p messaging-rules messaging-rules-mcp`.

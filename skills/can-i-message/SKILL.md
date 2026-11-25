---
name: can-i-message
description: "Decide whether a business may send a message to a person right now on WhatsApp, Instagram, Messenger, Telegram or X, and what is allowed if not. Use for 'can I message this customer', 'is the 24 hour window still open', 'can I send a template / HUMAN_AGENT / private reply', 'can my bot start a chat', or before any bot or agent sends a follow-up."
metadata:
  version: "0.1.0"
  channels: "whatsapp, instagram, messenger, telegram, x"
---

# Can I message this person right now?

Every channel answers this differently, and the answer depends on time. This skill turns the question into a short decision tree and a fixed answer format. The numbers come from the source-cited data in `messaging-rules`; see [references/channel-rules.md](references/channel-rules.md) for each rule with its official URL.

## When to use this skill

- Before any bot, agent or person sends a follow-up, reminder, offer or first message.
- When a send failed and the reason may be a window, tag or opt-in rule.
- When reviewing code or a flow that sends messages after a delay.

## Use the MCP server when it is available

If a tool named `check_messaging_window` is connected (npm package `messaging-rules`), call it instead of reasoning by hand. Connect it with:

```
npx -y -p messaging-rules messaging-rules-mcp
```

Inputs: `channel`, `lastInboundAt` (ISO time of the person's last message, call, comment or click, or null), `sender` (`bot` or `human`), `kind` (`free_form`, `template`, `tag`, `private_reply`, `utility_template`, `marketing_message`, `sponsored`), `tag`, `openedBy` (`ad_referral` for click-to-message ads). It returns `allowed`, `reason`, `windowEndsAt`, `conditions` (what it cannot check) and `allowedAlternatives`. `validate_message` checks a draft against length, attachment and button limits. Still read the `conditions`: opt-in, permissions and approvals are never known to the tool.

If the server is not connected, follow the tree below.

## Context to collect

1. Channel.
2. When did the person last message, call, comment, react or tap a click-to-message ad? (Exact time, with time zone. The latest inbound event counts.)
3. Who sends: an automation or a person?
4. What kind of message: a reply, a follow-up, a promotion, a transactional update?
5. Did the conversation open from an ad? Is there opt-in evidence for this kind of message?

## Workflow: decision tree

### WhatsApp

1. Did the person message or call within the last 24 hours (strictly: now is before last inbound plus 24 hours)? Yes: any free-form message is allowed, promotional or not, and templates are allowed too.
2. No: only an approved template, only to a person who opted in. Marketing, utility and authentication are the categories (use `whatsapp-template-writer`).
3. Never contacted and no opt-in evidence: do not message.
4. Outside a window each new recipient counts against the portfolio messaging limit (new portfolios start at 250 unique recipients per moving 24 hours).

### Instagram

1. The person must have messaged first. The one exception is a single private reply to a comment on your post, ads post or reel, within 7 days of the comment (for Live, only during the broadcast). The conversation continues only if the person answers it.
2. Standard window is 24 hours from the person's last message, click-to-message tap, reaction or in-thread action (up to 7 days when it was opened by a Click-to-Direct ad). Inside it, free-form replies, even promotional, are allowed.
3. After the window: only a reply sent by a person with the HUMAN_AGENT tag, within 7 days of the person's last message, for an issue that could not be resolved in time. It is not for bots and not for promotions. It needs the Human Agent permission through App Review and business verification.
4. One-time notifications, sponsored messages and news messaging do not exist on Instagram.

### Messenger

1. Same opening rule: the person starts, or you send one private reply to a comment or post on your Page.
2. 24-hour standard window (up to 7 days after a Click-to-Messenger ad).
3. After the window, the options are: HUMAN_AGENT tagged reply by a person within 7 days; an approved utility template (needs the `page_utility_messaging` permission, no marketing content); a marketing message to someone who accepted a request to receive them; a sponsored message to someone with an existing conversation.
4. The tags CONFIRMED_EVENT_UPDATE, ACCOUNT_UPDATE and POST_PURCHASE_UPDATE were retired on 2026-04-27 and return error code 100. If code still uses them, it is broken.

### Telegram

1. A bot cannot start a conversation. The person must message the bot (for example `/start`) or add it to a group.
2. After that there is no time window. If the person never contacted the bot, do not try. A person who blocks the bot makes sends fail.
3. Only rate limits apply (see `telegram-bot-builder`).

### X

1. No window and no first-message rule: an account can open a one-to-one DM, but delivery depends on the recipient's DM settings and block list.
2. Sending needs user authentication with the DM scopes; app-only auth does not work.
3. Rate limits: 15 sends per 15 minutes and 1,440 per 24 hours per user.

## Output template

```
Verdict: ALLOWED | NOT ALLOWED | ALLOWED ONLY AS <kind>
Channel / last inbound: <channel>, <timestamp with zone>
Window: <open until <timestamp> | closed at <timestamp> | not applicable>
Why: <one sentence naming the rule>
Allowed instead: <template / HUMAN_AGENT by a person / wait for the person to write / nothing>
Conditions I cannot check: <opt-in, permissions, template approval, recipient settings>
Sources: <official URLs from references/channel-rules.md>
```

## Checklist

- [ ] Used the latest inbound event, not the first one.
- [ ] Compared with the exact 24 hours (or 7 days) boundary; closed at exactly the end.
- [ ] Separated bot from human sender for HUMAN_AGENT.
- [ ] Checked whether the message is promotional (not allowed under tags).
- [ ] Listed what remains unverified.

## Common mistakes

- Using HUMAN_AGENT for an automated flow or for a discount.
- Assuming a Telegram bot can message anyone with a username.
- Counting a WhatsApp window from the business's last message instead of the person's.
- Treating Instagram private replies as a way to start a normal conversation. It is one message.
- Still sending Messenger ACCOUNT_UPDATE or POST_PURCHASE_UPDATE tagged messages.
- Forgetting time zones when the last inbound time came from a different system.

## Related

`whatsapp-template-writer`, `instagram-dm-automation`, `broadcast-compliance`, `messaging-webhooks` (to record the last inbound time correctly).

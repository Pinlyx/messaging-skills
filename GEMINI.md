# Messaging skills

This extension gives the agent expertise in business messaging on WhatsApp, Instagram, Messenger, Telegram and X. Each skill is a folder under `skills/<name>/` with a `SKILL.md` (the workflow) and, where platform rules matter, a `references/` folder with the sourced rules and official URLs.

## How to use it

- When a request matches a skill below, read that skill's `SKILL.md` first and follow its workflow, checklist and output template.
- Read the files in the skill's `references/` folder when you need a platform number or the official URL behind it.
- Never state a platform number (window length, character limit, rate limit, size limit) from memory. Use the reference file. If the reference file says there is no published number, say that and point to the official page.
- Asking the person for the missing context listed under "Context to collect" is part of the skill.
- Sending a message to a real customer, publishing, or changing a live account needs the person's explicit approval.

## Skills

| Skill | Use it when |
| --- | --- |
| `whatsapp-template-writer` | Writing or fixing a WhatsApp template; marketing, utility or authentication; rejections |
| `can-i-message` | Deciding whether a message is allowed right now on a channel; windows, tags, opt-in |
| `instagram-dm-automation` | Designing or auditing Instagram DM automation and handoff |
| `comment-to-dm-funnel` | Comment keyword to private reply funnels on Instagram and Facebook |
| `dm-reply-writer` | Drafting a customer reply: tone, language, grounded facts, handoff |
| `ai-dm-agent-prompt` | Writing, auditing and testing the system prompt of an AI DM agent |
| `broadcast-compliance` | Auditing a bulk message or campaign plan |
| `messaging-webhooks` | Meta and Telegram and X webhooks: challenge, signature, retries, idempotency |
| `telegram-bot-builder` | Building and deploying a Telegram bot |
| `telegram-channel-growth` | Analyzing a Telegram channel and planning growth |
| `contact-channel-audit` | Auditing which contact channels a website offers |
| `inbox-triage` | Prioritizing and routing a multi-channel inbox |
| `support-macros` | Building a multilingual canned reply library that fits channel limits |
| `messaging-kpis` | Defining and reporting messaging KPIs |
| `local-lead-list` | Building a local business list and planning compliant outreach |

## Rules data

The rules come from the open `messaging-rules` data (official URLs, short quotes, verification dates). If an MCP client is available, `npx -y -p messaging-rules messaging-rules-mcp` exposes `check_messaging_window`, `validate_message` and `get_channel_rules`.

# Changelog

## 0.1.0 - 2026-11-26

First release.

- 15 skills for customer messaging on WhatsApp, Instagram, Messenger, Telegram and X: `whatsapp-template-writer`, `can-i-message`, `instagram-dm-automation`, `comment-to-dm-funnel`, `dm-reply-writer`, `ai-dm-agent-prompt`, `broadcast-compliance`, `messaging-webhooks`, `telegram-bot-builder`, `telegram-channel-growth`, `contact-channel-audit`, `inbox-triage`, `support-macros`, `messaging-kpis`, `local-lead-list`.
- Every platform number lives in a `references/` file next to the skill, with its official URL. Values come from the source-cited data in `messaging-rules` (verified 2026-11-20).
- Packaging as a plugin marketplace entry, skills.sh (`npx skills add`) and Gemini CLI (extension), plus manual install for other agents.
- `scripts/validate.mjs` and a CI workflow check frontmatter, required sections, links, manifests and content rules.

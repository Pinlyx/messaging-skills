---
name: contact-channel-audit
description: "Audit which ways a website lets customers contact the business (WhatsApp, Telegram, Messenger, Viber, live chat, social profiles, email, phone) using contact-channel-detector, then list gaps and prioritized fixes. Use for 'which contact channels does this site have', 'audit my website contact options', 'does this competitor offer WhatsApp', 'is there live chat on the site', or when a prospect list needs its channel mix."
metadata:
  version: "0.1.0"
  channels: "whatsapp, telegram, messenger, instagram, x, live chat"
---

# Contact channel audit

A customer who cannot reach a business in the channel they already use usually leaves. This skill checks what a site actually offers and what is missing. The measuring tool is [contact-channel-detector](https://github.com/Pinlyx/contact-channel-detector) (Python 3.9+, standard library): one homepage fetch in, one JSON object out, with evidence for every finding. Field reference and false-negative notes: [references/detector-output.md](references/detector-output.md).

## When to use this skill

- Reviewing your own website's contact options.
- Comparing a few competitors' channels.
- Enriching a list of businesses with the channels they offer (used by `local-lead-list`).

## Context to collect

1. The URL(s). Ask for the real homepage and, if relevant, the contact page.
2. The business type and market: where do its customers already chat (WhatsApp, Telegram, Instagram, Messenger, SMS, phone)?
3. Business hours and who could staff each channel.
4. Existing channels the business has but the site does not show (a WhatsApp number printed in the shop, a Telegram group).

## Workflow

### 1. Run the detector

```
pip install git+https://github.com/Pinlyx/contact-channel-detector
contact-channels example.com --pretty
contact-channels -i urls.txt --format csv -o results.csv --respect-robots --timeout 8
```

`--respect-robots` honors robots.txt. A failed fetch returns `ok=false` with a short error (`timeout`, `dns error`, `HTTP 403`, `blocked by robots.txt`): report it, do not guess.

### 2. Read the result

- `channels`: the channels found (`whatsapp`, `telegram`, `messenger`, `viber`, `live_chat`, `multichannel_widget`, `instagram`, `facebook`, `x`, `tiktok`, `youtube`, `linkedin`, `pinterest`, `threads`, `bluesky`, `email`, `phone`).
- `instant_channel`: true when the site offers any of WhatsApp, Telegram, Messenger, Viber, live chat or a multichannel widget. This is the quick yes or no on "can a customer talk to this business right now".
- `findings`: each with `provider`, normalized `value` (digits for WhatsApp numbers, lower-case handles), `evidence` (the matching link or script) and `source` (link, script, plugin, jsonld, cfemail).
- `parked`: placeholder or parked pages are flagged so they do not count as businesses.

### 3. Verify what matters

- Open the evidence link or the page and confirm the number or handle is the business's own and still active (stale numbers on old pages are common).
- A button drawn by JavaScript may leave no link in the HTML: the tool covers common plugins, but a missing channel is "not detected", not proof of absence. When it matters, load the page in a browser.
- Compare the number or handle across the footer, contact page and structured data. Mismatches confuse customers.

### 4. Find the gaps

| Observation | Gap | Suggested action |
| --- | --- | --- |
| `instant_channel` false | Only a form, email or phone | Add the channel the customers already use (often WhatsApp, or Telegram or Messenger by market) |
| WhatsApp detected as a plain link, no business hours or greeting | Unmanaged number | Move to a business account, add a greeting, away message and hours |
| Live chat widget but no after-hours path | Visitors wait without an answer | Offline message that captures a contact and sets expectations |
| Social profiles linked, no DM path described | Customers do not know DMs are answered | Add "message us on Instagram" with the handle and typical response time |
| Phone only | High effort for the customer | Add a messaging option; keep the phone for urgent cases |
| Several different numbers or handles | Inconsistent | Pick one canonical per channel and use it everywhere |
| Email only via address text | Spam harvest risk and low conversion | Use a contact form plus a messaging option |

Rank by (a) channel fit with the market, (b) effort to add, (c) the staff that can answer. Do not recommend a channel the business cannot staff. For rules of the channels you recommend, see `can-i-message`.

### 5. Report

Give the evidence, the gaps in priority order, and one "do this first" action. For many sites, summarize counts (the CLI prints a share table for multi-URL runs).

## Context from the study

The detector grew from a scan of 5,014 Turkish business websites (Pinlyx research, https://pinlyx.com/research/turkey-website-whatsapp-live-chat-2026): WhatsApp on 38.9% of sites, live chat on 2.2%, and no instant channel at all on 59.9%. This is one market and one date: use it as context for a Turkish audit, not as a universal benchmark.

## Checklist

- [ ] URL fetched successfully (or failure reported with the error).
- [ ] Findings verified against the live page for the channels that matter.
- [ ] Absence reported as "not detected", with the JavaScript caveat.
- [ ] Channel recommendations fit the market and what staff can answer.
- [ ] Mismatched numbers and handles listed.

## Output template

```
Site: <final_url>   Checked: <date>   Reachable: <yes/no, error>
Channels detected: <list with provider and value>
Instant channel: <yes/no>
Gaps (priority order): <gap | evidence | action | effort>
Do first: <one action>
Not verified: <JavaScript-drawn widgets, other pages>
```

## Common mistakes

- Treating "not detected" as "does not exist".
- Auditing a parked or redirected page.
- Recommending WhatsApp where customers use another channel, or recommending a channel nobody will staff.
- Collecting emails and phone numbers from a site list without thinking about how they will be used (see `local-lead-list` for the limits).

## Related

`local-lead-list`, `inbox-triage`, `messaging-kpis`.

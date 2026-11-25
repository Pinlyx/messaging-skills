# Triage rubric

This rubric is an editorial default, not a platform rule. Tune it against your own conversation history and the numbers from `messaging-kpis`.

## Class decision order

1. Safety, medical, legal or threat of harm: Urgent, hand to a person immediately.
2. Money problem now (failed payment, double charge, fraud report): Urgent.
3. Service or order failure with a deadline today: Urgent.
4. Public complaint or a negative comment or mention: Urgent or Support at P1/P2 depending on reach.
5. Purchase intent (price, availability, booking, quote): Sales.
6. Help with something already bought or used: Support.
7. Unrelated promotion, link bait, repeated identical text from an unknown sender: Spam.
8. Everything else: Other.

## Priority levels

| Level | Meaning | Typical rule |
| --- | --- | --- |
| P1 | Act now | Urgent class, or a sales lead with a deadline today, or a VIP customer with a problem |
| P2 | Act within hours | Sales leads, angry customers, closing messaging window with intent |
| P3 | Same business day | Normal support and general questions |
| P4 | Next business days | Feedback, partnerships, nice-to-have requests |
| none | No response | Spam after sampling |

## Platform clocks that change the deadline

Source: `messaging-rules` data, last verified 2026-11-20.

| Channel | Clock | Official source |
| --- | --- | --- |
| WhatsApp | 24-hour customer service window from the customer's last message or call; templates only afterwards | https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages |
| Instagram | 24-hour standard window; up to 7 days after a Click-to-Direct ad; HUMAN_AGENT by a person up to 7 days | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages |
| Messenger | Same as Instagram plus utility templates, marketing messages and sponsored messages after the window | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages |
| Messenger bot response | Automated bots must respond to any user input within 30 seconds (Get Started excluded) | https://developers.facebook.com/documentation/business-messaging/messenger-platform/policy |
| Telegram | No window | https://core.telegram.org/bots |
| X | No window; recipient settings decide delivery | https://docs.x.com/x-api/direct-messages/manage/integrate |

## Routing table template

| Class | Topic or language | Owner | Backup | Escalate after |
| --- | --- | --- | --- | --- |
| Urgent | any | duty manager | founder | no reply in the P1 target |
| Sales | by region or product | sales owner | sales lead | unanswered at the P2 target |
| Support | by product or language | support queue | team lead | reopened twice |
| Billing | any | finance | support lead | unresolved after a business day |

Fill the targets with numbers you choose and record them. This repository intentionally ships no default SLA numbers because none are published by the platforms.

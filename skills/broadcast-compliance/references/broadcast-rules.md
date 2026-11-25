# Broadcast rules by channel

Source data: `channels/*.json` of [messaging-rules](https://github.com/Pinlyx/messaging-rules), last verified 2026-11-20. Official pages only.

## WhatsApp

| Rule | Value | Source |
| --- | --- | --- |
| Opt-in | Only users who opted in | https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages |
| Outside the window | Template messages only | https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview |
| Categories | marketing, utility, authentication; mixed or unclear content is marketing | https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/template-categorization |
| Messaging limit | 250 unique recipients per moving 24 hours for new portfolios; tiers 2,000, 10,000, 100,000, unlimited | https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits |
| Throughput | 80 messages per second per number by default (up to 1,000 by automatic upgrade), inbound and outbound together | https://developers.facebook.com/documentation/business-messaging/whatsapp/throughput |

## Instagram

No broadcast mechanism in the rules data. Replies inside a 24-hour window; one private reply to a comment; HUMAN_AGENT by a person within 7 days; no promotions in tagged messages. Sources: https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages and https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/private-replies. Sponsored messages and one-time notifications are not available: https://developers.facebook.com/documentation/business-messaging/messenger-platform/policy.

## Messenger

| Rule | Value | Source |
| --- | --- | --- |
| After the window | HUMAN_AGENT (person, 7 days), utility template, marketing message to an opted-in person, sponsored message | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages |
| Marketing message condition | The person accepted a request to receive marketing messages | same page |
| Sponsored | Paid message to people with an open conversation, subject to advertising policies | https://developers.facebook.com/documentation/business-messaging/messenger-platform/policy |
| Retired tags | CONFIRMED_EVENT_UPDATE, ACCOUNT_UPDATE, POST_PURCHASE_UPDATE: error 100 since 2026-04-27 | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages |
| Tags and promotion | Message tags cannot carry promotional content; misuse can restrict the Page's ability to send | same page |
| High volume | Above 40 messages per second per Page the inbox stops showing and sending new messages until volume drops | https://developers.facebook.com/documentation/business-messaging/messenger-platform/overview/rate-limiting |

## Telegram

| Rule | Value | Source |
| --- | --- | --- |
| Who can be messaged | Users who started the bot or added it to a group | https://core.telegram.org/bots |
| Single chat | Avoid more than about 1 message per second | https://core.telegram.org/bots/faq#my-bot-is-hitting-limits-how-do-i-avoid-this |
| Group | At most 20 messages per minute | same page |
| Bulk notifications | About 30 messages per second | same page |
| Paid broadcasts | Up to 1,000 messages per second when enabled in @BotFather | https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bots-subscribers-at-once |

## X

| Rule | Value | Source |
| --- | --- | --- |
| Delivery | Depends on recipient DM settings and block list | https://docs.x.com/x-api/direct-messages/manage/integrate |
| Send limits | 15 per 15 minutes and 1,440 per 24 hours per user; 1,440 per 24 hours per app | https://docs.x.com/x-api/fundamentals/rate-limits |

## Not in the data (do not invent)

- Frequency caps per person on any channel.
- WhatsApp quality rating thresholds and per-user marketing template limits.
- Instagram marketing messages.
- Messenger One-time Notification status.
- Legal consent requirements, which vary by country. Ask a lawyer.

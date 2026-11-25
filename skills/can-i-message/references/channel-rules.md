# Channel rules used by `can-i-message`

Source data: `channels/*.json` of [messaging-rules](https://github.com/Pinlyx/messaging-rules), last verified 2026-11-20. Official pages only. Platforms change these rules without notice: re-check the linked page for anything that matters.

## WhatsApp

| Rule | Value | Source |
| --- | --- | --- |
| Opt-in | Message only users who opted in | https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages |
| Customer service window | 24 hours, restarted by every user message or call | https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages |
| Outside the window | Pre-approved template messages only | https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview |
| Messaging limit | New portfolio 250 unique recipients per moving 24 hours; later 2,000, 10,000, 100,000, unlimited | https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits |

## Instagram

| Rule | Value | Source |
| --- | --- | --- |
| Who starts | The person | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages |
| Private reply to a comment | One message, within 7 days of the comment (Live: during the broadcast); conversation continues only if the person answers | https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/private-replies |
| Standard window | 24 hours (up to 7 days after a Click-to-Direct ad) | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages |
| After the window | HUMAN_AGENT tagged reply sent by a person, within 7 days of the user's last message | https://developers.facebook.com/documentation/development/features-reference/human-agent |
| HUMAN_AGENT requirements | Human Agent permission through App Review, business verification | https://developers.facebook.com/documentation/development/features-reference/human-agent |
| Tags and promotions | Message tags may not carry promotional content | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages |
| Not available on Instagram | One-time notifications, sponsored messages, news messaging | https://developers.facebook.com/documentation/business-messaging/messenger-platform/policy |

## Messenger

| Rule | Value | Source |
| --- | --- | --- |
| Who starts | The person (message, Get Started, plugin, or comment with one private reply) | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages |
| Standard window | 24 hours (up to 7 days after a Click-to-Messenger ad) | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages |
| After the window | HUMAN_AGENT by a person (7 days); approved utility template; marketing message to an opted-in person; sponsored message | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages |
| Utility messages | Approved utility template, no marketing content, needs the page_utility_messaging permission | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages/utility-messages |
| Retired tags | CONFIRMED_EVENT_UPDATE, ACCOUNT_UPDATE, POST_PURCHASE_UPDATE return error 100 since 2026-04-27 | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages |
| Private replies | One reply to a post or comment on your Page or Group; not to another Page | https://developers.facebook.com/documentation/business-messaging/messenger-platform/discovery/private-replies |

## Telegram

| Rule | Value | Source |
| --- | --- | --- |
| Who starts | A bot cannot start a conversation; the user must message it or add it to a group | https://core.telegram.org/bots |
| Window | None; once the user has started, no expiry | https://core.telegram.org/bots |
| Per chat | Avoid more than about 1 message per second in one chat | https://core.telegram.org/bots/faq#my-bot-is-hitting-limits-how-do-i-avoid-this |
| Per group | No more than 20 messages per minute | https://core.telegram.org/bots/faq#my-bot-is-hitting-limits-how-do-i-avoid-this |
| Bulk | About 30 messages per second overall | https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bots-subscribers-at-once |

## X

| Rule | Value | Source |
| --- | --- | --- |
| Who starts | Business may start, but recipient DM settings and blocks decide delivery | https://docs.x.com/x-api/direct-messages/manage/integrate |
| Authentication | User context required for DM endpoints; app-only is not supported | https://docs.x.com/x-api/direct-messages/manage/integrate |
| Send limits | 15 per 15 minutes and 1,440 per 24 hours per user | https://docs.x.com/x-api/fundamentals/rate-limits |

## Not covered by the data

- Instagram marketing messages and utility messages.
- Messenger One-time Notification (the policy page still mentions it; status unclear).
- WhatsApp per-user marketing caps and quality-rating thresholds.
- X maximum DM text length (the reference names an error but states no number).

For anything on this list, say there is no published number in the rules data and point to the official page.

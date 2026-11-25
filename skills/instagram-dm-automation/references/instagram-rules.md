# Instagram rules used by this skill

Source data: `channels/instagram.json` of [messaging-rules](https://github.com/Pinlyx/messaging-rules), last verified 2026-11-20. Official pages only. Re-check before relying on a value.

## Windows and who may send

| Rule | Value | Official source |
| --- | --- | --- |
| Initiation | The conversation must be initiated by the person; only after the user has messaged the professional account can the app message them | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages and https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api |
| Private reply | One message to a person who commented on your post, ads post, reel or live; within 7 days of the comment (Live: during the broadcast) | https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/private-replies |
| Standard window | 24 hours, opened or restarted by a message, click-to-message tap, reaction, comment or in-thread action | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages |
| Window after a Click-to-Direct ad | Up to 7 days from the person's first message | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages |
| HUMAN_AGENT | A person may reply manually up to 7 days after the user's last message; needs Human Agent permission through App Review and business verification | https://developers.facebook.com/documentation/development/features-reference/human-agent |
| Tags and promotion | Message tags may not be used for promotional content (deals, offers, coupons, discounts) | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages |
| Human escalation | Apps must have an escalation path to a human agent | https://developers.facebook.com/documentation/business-messaging/instagram-messaging/overview |
| Automation disclosure | Where required by law (for example California, Germany), disclose that the person is talking to an automated service | https://developers.facebook.com/documentation/business-messaging/instagram-messaging/overview |
| Not available | One-time notifications, news messaging, sponsored messages | https://developers.facebook.com/documentation/business-messaging/messenger-platform/policy |
| Group messaging | Not supported: one customer per conversation | https://developers.facebook.com/documentation/business-messaging/instagram-messaging/overview |
| Standard Access apps | Can only message people with a role on the app | https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/send-message |
| Requests folder | Conversations inactive for 30 days are not returned by the API; private replies from non-followers land in Requests | https://developers.facebook.com/documentation/business-messaging/instagram-messaging/overview |

## Limits

| Limit | Value | Official source |
| --- | --- | --- |
| Text | Less than 1,000 characters and 1,000 bytes of UTF-8 | https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/send-message |
| Attachments | Up to 10 in one message, images only when sending several | https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/send-message |
| Image | png, jpeg, jpg; 8 MB | same page |
| Audio / video / pdf | 25 MB each (audio aac, m4a, wav, mp4; video mp4, ogg, avi, mov, webm; file pdf) | same page |
| Quick replies | Up to 13, 20 characters each (truncated beyond), plain text, not available on desktop | https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/quick-replies |
| Send API, text | 300 calls per second per professional account | https://developers.facebook.com/documentation/business-messaging/messenger-platform/overview/rate-limiting |
| Send API, audio or video | 10 calls per second | same page |
| Private replies, posts and reels | 750 calls per hour | same page |
| Private replies, Live | 100 calls per second | same page |
| Conversations API | 2 calls per second | same page |
| Volume cap | Above 72,000 sent and received messages the inbox stops showing and sending new messages until volume decreases (no period stated) | same page |

## Open point

The send-a-message guide lists a comment as an action that opens the standard window, while the private replies guide says the conversation continues only after the person answers the private reply. When the only contact is a comment, treat it as a private reply (one message) and check both pages before relying on a comment-opened window.

## Not in the data

Instagram marketing messages and utility messages. Do not assume a template product exists on Instagram.

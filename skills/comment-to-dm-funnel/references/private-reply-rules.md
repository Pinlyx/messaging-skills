# Private reply rules

Source data: `channels/instagram.json` and `channels/messenger.json` of [messaging-rules](https://github.com/Pinlyx/messaging-rules), last verified 2026-11-20.

## Instagram

| Rule | Value | Official source |
| --- | --- | --- |
| Time limit | Within 7 days of the comment; for Instagram Live, only during the broadcast | https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/private-replies |
| Count | "Only one message can be sent to the Instagram user who commented." | same page |
| Continuation | "Only when the Instagram user responds to the private message can you continue the conversation within the 24-hour messaging window." | same page |
| Where it lands | Inbox if the person follows the account, otherwise Requests | same page |
| Rate, posts and reels | 750 calls per hour per professional account | https://developers.facebook.com/documentation/business-messaging/messenger-platform/overview/rate-limiting |
| Rate, Live | 100 calls per second per professional account | same page |
| Text length | Under 1,000 characters and 1,000 UTF-8 bytes | https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/send-message |
| Open point | One guide lists a comment as opening the standard window; the private replies guide says continuation needs the person to answer. Treat the comment as a private reply (one message). | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages |

## Messenger (Facebook Pages)

| Rule | Value | Official source |
| --- | --- | --- |
| What qualifies | A person who published a post on the Page, or commented on a post or comment on a Page or Group | https://developers.facebook.com/documentation/business-messaging/messenger-platform/discovery/private-replies |
| Count and time | One private reply, within 7 days | same page |
| Not allowed | A private reply to another Facebook Page | same page |
| Text length | 2,000 characters | https://developers.facebook.com/documentation/business-messaging/messenger-platform/reference/messenger-platform-send-api |

## What is not in the data

- Any rate limit for Messenger private replies specifically.
- Whether the first private reply may contain buttons or quick replies on each channel (check the current send-API page before relying on it).
- Any benchmark conversion rate. Measure your own.

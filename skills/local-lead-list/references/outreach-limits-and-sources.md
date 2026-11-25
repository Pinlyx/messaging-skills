# Outreach limits and data sources

## Platform rules for first contact

Source data: `channels/*.json` of [messaging-rules](https://github.com/Pinlyx/messaging-rules), last verified 2026-11-20.

| Channel | Can a business start the conversation? | Official source |
| --- | --- | --- |
| WhatsApp | Yes, with an approved template message, and only to users who opted in to receive messages from you | https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages |
| Instagram | No. The person must message first; the exception is one private reply to a comment on your post, ads post or reel, within 7 days | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages and https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/private-replies |
| Messenger | No. The person must message first (or comment, which allows one private reply) | https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages |
| Telegram | No. A bot cannot start a conversation; the user must message it or add it to a group | https://core.telegram.org/bots |
| X | Technically yes, but the recipient's DM settings decide delivery; send limits are 15 per 15 minutes and 1,440 per 24 hours per user | https://docs.x.com/x-api/direct-messages/manage/integrate and https://docs.x.com/x-api/fundamentals/rate-limits |

## What is not in the data

- Legal consent rules for marketing messages and email in any country. They differ by country and by recipient type: ask counsel.
- Platform policy on mass manual messaging from personal accounts.
- Any rule for SMS or phone calls.

## Open data sources

| Source | What it offers | License and terms |
| --- | --- | --- |
| OpenStreetMap | Places with tags (name, category, address, website, sometimes phone) | ODbL: credit "OpenStreetMap contributors" and respect share-alike terms for derived databases. See https://www.openstreetmap.org/copyright |
| Overture Maps places | Places dataset with categories, addresses, websites, sometimes socials and phones | License differs by theme and release: read the release notes at https://overturemaps.org before use |
| Overpass API (query service for OSM) | Query OSM by tag and area | Public instances have a fair-use policy: keep requests small, add delays, or run your own instance or use a regional extract for large jobs |

## Data handling

- Record where each row came from and when.
- Keep only the fields needed for the purpose.
- Delete rows on request and when the purpose ends.
- Do not combine the list with personal social profiles of individuals.
- Store the list where access is limited and logged.
